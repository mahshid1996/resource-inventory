// TODO: REFACTOR TO ALIGN WITH ESLINT RULES
/* eslint-disable */
const commonHooks = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const logger = require('../logger');

const { getResultsByKey, getUniqueKeys } = BatchLoader;
const { fastJoin, makeCallingParams, combine, iff } = commonHooks;
const _ = require('lodash');
const { services } = require('../util/serviceResolvers');

module.exports = () => async context => {
    var t0 = new Date();
    const joins = {};
    const loaders = {};
    const queries = context.params.$dotQueries;
   
    const originalResult = _.cloneDeep(context.result);

    const resolvers = {
        before: context => {
            try {
                services[context.path].forEach(({ ref, serviceName }) => {
                    const service = context.app.services[serviceName];
                    if (Object.keys(queries).includes(ref)) {
                        loaders[ref] = createBatchLoader(context, service, queries[ref]);
                        joins[ref] = createResolver(ref);
                    }
                });
                context._queryLoaders = loaders;
            } catch (error) {
                logger.applog('error', t0, JSON.stringify(error));
                throw error;
            }
        },
        joins
    };

    // Return value should be refactored into smaller pieces.
    return combine(
        context => {
            // Provider needs to be undefined for internal calls.
            delete context.params.provider;
        },
        iff(() => !_.isEmpty(queries), fastJoin(resolvers)),
        iff(
            context => !_.isEmpty(queries) && context.method === 'find' && context.result.data,
            context => {
                let filteredResult = [];

                // Filter out items which don't match the query
                filteredResult = context.result.data.filter(item => {
                    const matchesQuery = Object.keys(queries).map(ref => {
                        if (_.isArray(item[ref])) {
                            return item[ref].some(item => item);
                        }
                        return !!item[ref];
                    });

                    return !matchesQuery.includes(false);
                });

                // If found matches
                if (filteredResult.length > 0) {
                    let filteredResultWithIds = [];
                    const { $limit = 10, $skip = 0 } = context.params;

                    // queried fields with original ID's
                    filteredResultWithIds = filteredResult.map(
                        item =>
                            originalResult.data.filter(
                                originalItem => originalItem._id.toString() === item._id.toString()
                            )[0]
                    );

                    // Set total
                    context.result.total = filteredResultWithIds.length;

                    // Limit and offset for filtered result
                    filteredResultWithIds = filteredResultWithIds.slice($skip);
                    filteredResultWithIds = filteredResultWithIds.slice(0, $limit);

                    // Original result replaced with filtered data
                    context.result.data = filteredResultWithIds;
                } else {
                    context.result.data = [];
                }
            }
        ),
        iff(
            context => !_.isEmpty(queries) && context.method === 'get',
            context => {
                // Filter out items which don't match the query
                const matchesQuery = Object.keys(queries).map(ref => {
                    if (_.isArray(context.result[ref])) {
                        return context.result[ref].some(item => item);
                    }
                    return !!context.result[ref];
                });

                // if match all queries
                if (!matchesQuery.includes(false)) {
                    // Replace queried fields with original ID's
                    Object.keys(queries).forEach(ref => {
                        context.result[ref] = originalResult[ref];
                    });
                } else {
                    context.result = [];
                }
            }
        )
    ).call(this, context);
};

function createResolver(ref) {
    var t0 = new Date();
    return () => async (post, context) => {
        try {
            // No reference(s) equals no join required.
            if (!post || !post[ref] || (_.isArray(post[ref]) && post[ref].length === 0)) {
                return;
            }

            if (_.isArray(post[ref])) {
                // Filter out null values
                post[ref] = post[ref].filter(item => item);
                post[ref] = await context._queryLoaders[ref].loadMany(post[ref]);
            } else {
                post[ref] = await context._queryLoaders[ref].load(post[ref]);
            }

            return post[ref];
        } catch (error) {
            logger.applog('error', t0, JSON.stringify(error));
        throw error;
        }
    };
}

function createBatchLoader(context, service, queries = []) {
    var t0 = new Date();
    return new BatchLoader(
        async (keys, context) => {
            try {
                const $select = [];
                // https://feathers-plus.github.io/v1/batch-loader/#get-unique-keys
                keys = keys.filter(key => key);
                if (keys.some(key => typeof key === 'object')) {
                    keys = keys.map(key => (key = key._id ? key._id : key.id));
                }

                const query = { _id: { $in: getUniqueKeys(keys) } };

                queries.forEach(item => {
                    query[item.field] = item.value;
                    $select.push(item.field);
                });

                query.$select = $select;

                const result = await service.find(
                    makeCallingParams(context, query, undefined, {
                        paginate: false,
                        url: context.params.url,
                        // Case Insensitive queries
                        // collation: { locale: 'en', strength: 1 }
                    })
                );

                // https://feathers-plus.github.io/v1/batch-loader/#get-results-by-key
                return getResultsByKey(keys, result, ref => ref.id, '');
            } catch (error) {
                logger.applog('error', t0, JSON.stringify(error));
                throw error;
            }
        },
        { context }
    );
}
/* eslint-enable */
