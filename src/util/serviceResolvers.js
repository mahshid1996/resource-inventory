const _ = require('lodash');
const jsonPath = require('jsonpath');
const commonHooks = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const { ObjectId } = require('mongoose').Types;
const logger = require('../logger');

const { makeCallingParams } = commonHooks;
const { getResultsByKey, getUniqueKeys } = BatchLoader;

const depthLevels = [0, 1, 2, 3, 4,5,6,7];
const services = require('./serviceConfiguration.json');

// Initializing Feathers services for the application
const initializeServices = async app => {
      // Get current time
      var t0 = new Date();
    try {

        const uniqueServices = {};

        await Promise.all(
            _.pull(Object.keys(app.services), 'schema', 'schema/:version').map(async item => {
                uniqueServices[item] = {};
                await Promise.all(
                    depthLevels.map(async level => {
                        uniqueServices[item][level] = await digger(app, item, services, level);
                    })
                );
            })
        );

        await Promise.all(
            Object.keys(services).map(async key => {
                services[key] = await Promise.all(
                    services[key].map(async item => {
                        const { serviceName } = item;
                        const joins = uniqueServices[serviceName];

                        item.resolver = {
                            resolver: createResolver(item, false),
                            lastResolver: createResolver(item, true),
                            joins
                        };

                        return item;
                    })
                );
            })
        );
        logger.applog('info', t0, 'Feathers services initialized');
    } catch (error) {
        logger.applog('error', t0, JSON.stringify(error));
        throw error;
    }
};

function createResolver({ ref, $select, serviceName, isCircular }, isLastLevel = false) {
    return () => async (post, context) => {
         // Get current time
         var t0 = new Date();
        try {
            if (!post) {
                return;
            }

            if (isLastLevel && !$select) {
                return;
            }

            if (!context._loaders[ref]) {
                context._loaders[ref] = createBatchLoader(
                    context,
                    context.app.services[serviceName],
                    { ref, serviceName, $select },
                    false
                );
                context._loaders[`last-${ref}`] = createBatchLoader(
                    context,
                    context.app.services[serviceName],
                    { ref, serviceName, $select },
                    true
                );
            }

            const resolve = async resolvable => {
                // No reference(s) equals no join required.
                if (!resolvable || (_.isArray(resolvable) && resolvable.length === 0)) {
                    return;
                }

                if (
                    !_.find(services[context.path], item => item.ref === ref) &&
                    (context.result.data
                        ? _.some(context.result.data, item => _.isEqual(item[ref], resolvable))
                        : _.isEqual(context.result[ref], resolvable))
                ) {
                    return resolvable;
                }

                if (_.isArray(resolvable)) {
                    // Filter out null values
                    resolvable = resolvable.filter(item => item);
                    resolvable = isLastLevel
                        ? await context._loaders[`last-${ref}`].loadMany(resolvable)
                        : await context._loaders[ref].loadMany(resolvable);
                } else {
                    resolvable = isLastLevel
                        ? await context._loaders[`last-${ref}`].load(resolvable)
                        : await context._loaders[ref].load(resolvable);
                }

                return resolvable;
            };

            const references = jsonPath.nodes(post, `$..${ref}`);

            if (references && references.length > 0) {
                const paths = [];
                await Promise.all(
                    references.map(async reference => {
                        const { path, value = [] } = reference;

                        if (!value || (_.isArray(value) && value.length === 0)) {
                            return;
                        }

                        const innerPath = _.join(path.slice(1), '.');
                 
                        paths.push(innerPath);
                        _.set(post, innerPath, await resolve(value));
                    })
                );

                // Return what was resolved so that further resolves can be made.
                if (paths.length > 0) {
                    if (paths.length > 1) {
                        const splitPaths = paths.map(path => {
                            return _.split(path, '.');
                        });
                        const unique = _.uniq(_.flatten(splitPaths));
                        // Find first unique path
                        const uniquePath = _.find(unique, path => _.isNaN(+path));

                        return post[uniquePath];
                    }
                    return _.get(post, paths[0]);
                }
            }
        } catch (error) {
            logger.applog('error', t0, JSON.stringify(error));
            throw error;
        }
    };
}

function createBatchLoader(context, service, { ref, serviceName, $select }, isLastLevel = false) {
    if (isLastLevel && !$select) {
        return;
    }

    if (!isLastLevel) {
        $select = [];
    }

    var t0 = new Date();
 

    return new BatchLoader(
        async (keys, innerContext) => {
            try {
                const originalKeys = _.cloneDeep(keys);
                // https://feathers-plus.github.io/v1/batch-loader/#get-unique-keys
                keys = keys.filter(key => key);
                if (keys.some(key => _.isPlainObject(key))) {
                    keys = keys.map(key => (key._id ? key._id : key.id));
                }

                const depth = innerContext.params.$depth;

                keys = keys.map(key => {
                    if (ObjectId.isValid(key)) {
                        return key;
                    }
                    logger.applog('info', t0, `invalid id '${key}' for reference '${ref}' in service '${serviceName}'`);
                    return null;
                    
                });

                const query = { _id: { $in: getUniqueKeys(keys) }, $select };

                const result = await service.find(
                    makeCallingParams(innerContext, query, undefined, {
                        $depth: depth,
                        paginate: false,
                        provider: undefined,
                        url: innerContext.params.url
                    })
                );

                // https://feathers-plus.github.io/v1/batch-loader/#get-results-by-key
                let filteredResult = getResultsByKey(keys, result, item => item.id, '');

                filteredResult = await Promise.all(
                    filteredResult.map(async item => {
                        if (!item) return null;

                        let originalItem = _.find(originalKeys, i => {
                            if (!_.isPlainObject(i)) return false;
                            const ID = i.id ? i.id : i._id;
                            const parentID = item.id ? item.id : item._id;

                            return ID && parentID && ID.toString() === parentID.toString();
                        });

                        originalItem = _.omitBy(originalItem, _.isUndefined);

                        // Special cases
                        // Case1
                        originalItem = _.pick(originalItem, [
                            'type',
                            'minCardinality',
                            'maxCardinality'
                        ]);

                        return {
                            ...item,
                            ...originalItem
                        };
                    })
                );

                return filteredResult;
            } catch (error) {
                //innerContext.app.logger.error(error);
                logger.applog('error', t0, JSON.stringify(error));
                throw error;
            }
        },
        {
            context,
        }
    );
}

async function digger(app, serviceName, innerServices, depth, level = 0) {
    var t0 = new Date();
    try {
        const joins = {};
        const maxDepth = depthLevels.length - 1;

        if (!Object.keys(innerServices).includes(serviceName)) {
            return joins;
        }

        if (depth > maxDepth) {
            depth = maxDepth;
        }

        level += 1;

        if (level <= depth) {
            await Promise.all(
                innerServices[serviceName].map(async item => {
                    const { maxDepth: itemMaxDepth } = item;
                    let isLastLevel = level === depth;
                    if (itemMaxDepth) isLastLevel = level === itemMaxDepth;
                    const { ref, serviceName: innerServiceName } = item;

                    joins[ref] = {
                        resolver: createResolver(item, isLastLevel),
                        joins: isLastLevel
                            ? {}
                            : await digger(app, innerServiceName, innerServices, depth, level)
                    };
                })
            );
        }

        return joins;
    } catch (error) {
        logger.applog('error', t0, JSON.stringify(error));
            throw error;
    }
}



module.exports = {
    initializeServices,
    services
};
