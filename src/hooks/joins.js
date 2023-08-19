const _ = require('lodash');
const commonHooks = require('feathers-hooks-common');
const logger = require('../logger');
const { services } = require('../util/serviceResolvers');
const BatchLoader = require('@feathers-plus/batch-loader');
const { makeCallingParams } = commonHooks;

const { fastJoin, combine } = commonHooks;

module.exports = () => async outerContext => {
    var t0 = new Date();
  if(outerContext.path !== "v1/category-schema"){
   
    const joins = {};
    const expand = outerContext.params.$expand || [];
    let depth = parseInt(outerContext.params.$depth, 8);

    if (!depth) {
        depth = 0;
    }

    if (expand.length > 0 && depth < 1) {
        depth = 1;
    }

    const resolvers = {
        before: async innerContext => {
            try {
                if(innerContext.params['$depth'] > 7){
                    innerContext.params['$depth'] = 7;
                }
               
                const service = services[innerContext.path];

                const select = innerContext.params.$select || [];

                await Promise.all(
                    service.map(async ({ ref, resolver, maxDepth }) => {
        
                        let isLastLevel = expand.length > 0 ? !expand.includes(ref) : depth === 0;
                        if (maxDepth === 1) isLastLevel = true;

                        // Only join selected fields
                        if ((select.includes(ref) || select.length === 0) && resolver) {
                            joins[ref] = {
                                resolver: isLastLevel ? resolver.lastResolver : resolver.resolver,
                                joins: isLastLevel ? {} : resolver.joins[depth]
                            };
                        }
                    })
                );
            } catch (error) {
                logger.applog('error', t0, JSON.stringify(error));
                throw error;
            }
        },
        after: async innerContext => {
          try {

            if(innerContext.method === 'find' &&  innerContext.path === 'v1/logical-resource' && innerContext.params['$depth'] === undefined){
                        innerContext.params['$depth'] = 0;
                    }
                   
                if(innerContext.method === 'find' &&  innerContext.path === 'v1/logical-resource' && innerContext.params['$depth'] !=0){
                 
                    var {app} = innerContext;
                    let data = innerContext.result.data;
                    await Promise.all(data.map(async (input) => {
                        if(input.bundledResources.length !== 0){
                            let bundledResources = input.bundledResources;
                  
                            let bundledResourcesResult = await Promise.all(bundledResources.map(async (resource) => {
                             
                                var serviceNme = (resource['@baseType'] === 'LogicalResource')?'v1/logical-resource':'v1/physical-resource';
                                const service = app.service(serviceNme);
                               
                                var result = await service.get(resource.id, {
                                    url:innerContext.params.url,
                                    provider: undefined,
                                    query: {
                                      $select: []
                                    },
                                    $depth: innerContext.params['$depth']-1
                                  });
                                return result;
                              }));
                             const result =  input.bundledResources =bundledResourcesResult;
                         return result;
                        }
                    }));
                }
           
        } catch (error) {
            logger.applog('error', t0, JSON.stringify(error));
            throw error;
        }
        },
        joins
    };

    return combine(
        fastJoin(resolvers),
        // Return only selected fields
        async context => {
            const select = context.params.$select || [];
            if (select.length > 0) {
                if (context.method === 'get') {
                    const originalResult = _.cloneDeep(context.result);
                    context.result = {};

                    if (!_.isEmpty(originalResult)) {
                        await Promise.all(
                            select.map(async field => {
                                // Id should always be returned
                                context.result._id = originalResult._id;
                                if (originalResult[field]) {
                                    context.result[field] = originalResult[field];
                                }
                            })
                        );
                    }
                }

                if (context.method === 'find') {
                    const originalResult = context.result.data
                        ? _.cloneDeep(context.result.data)
                        : _.cloneDeep(context.result);
                    context.result.data = [];

                    if (originalResult && originalResult.length > 0) {
                        context.result.data = await Promise.all(
                            originalResult.map(async item => {
                                const originalItem = _.cloneDeep(item);
                                item = {};

                                await Promise.all(
                                    select.map(async field => {
                                        // Id should always be returned
                                        item._id = originalItem._id;
                                        if (originalItem[field]) {
                                            item[field] = originalItem[field];
                                        }
                                    })
                                );

                                return item;
                            })
                        );
                    }
                }
            }
        }
    ).call(this, outerContext);
}
};
