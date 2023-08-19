// Initializes the `logicalResource` service on path `/inventory-management/resource-inventory-manager/v1/logical-resource`. (Can be re-generated.)
const createService = require('feathers-mongoose');
const createModel = require('../../../models/v1/logical-resource.model');
const hooks = require('./logical-resource.hooks');
const schema = require('./logical-resource.schema');
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    Model,
    paginate,
    whitelist: ['$regex','$elemMatch']
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !code: extend

  // Get our initialized service so that we can register hooks
  const logicalResource = createService(options);

  // attempt at swagger definition
  logicalResource.docs = {
    idType: 'string',
    tag: 'Logical Resource',
    securities: ['all'],
    description: 'Service to manage logical-resource',
    definitions: {
      'logical-resource_list': {
        $ref: '#/definitions/logical-resource'
      },
      'logical-resource': schema.schema
    },
    operations:{
      find: {
          description: 'Retrieves a list of all logical resources.',
          parameters: [
              {
                  name: 'depth',
                  description:
                      `The depth query parameter is used to expand inline referenced entities up to the level specified.` +
                      `\n\n` +
                      `If depth = 0, then all referenced entities are returned as RootEntity objects which contain only ID(s)` +
                      `\n` +
                      `(may also contain href and @schemaLocation).` +
                      `\n\n` +
                      `Depth range is 0 to 7` +
                      `\n\n` +
                      `If depth = 1, then the first level of related target entities is expanded.` +
                      `\n` +
                      `References are replaced with the actual loaded entities with the corresponding level of details.` +
                      `\n\n` +
                      `If depth = N it expands reference objects of related entities recursively.` +
                      `\n\n` +
                      `Maximum depth level is 7. Any given depth level which exceeds the maximum is set as 7.` +
                      `\n\n` +
                      `If depth is not specified, then the default value will depend on the expand parameter.` +
                      `\n` +
                      `If expand parameter is set, then depth is 1. If not set, then 0.` +
                      `\n\n` +
                      `Example: /resource-inventory?depth=4`,
                  in: 'query',
                  type: 'number',
                  default: 0
              },
              {
                  name: 'expand',
                  description:
                      `The expand query parameter is used to narrow down (filter) expanding of the referenced entities.` +
                      `\n\n` +
                      `If expand is not specified, then by default all the fields are expanded.` +
                      `\n\n` +
                      `If the expand parameter is specified, only that field is expanded according to depth parameter.` +
                      `\n\n` +
                      `Example: /resource-inventory?expand=name_of_field`,
                  in: 'query',
                  type: 'string'
              },
              {
                  name: 'limit',
                  description:
                      `The limit query parameter will return the number of results you specify` +
                      `\n\n` +
                      `Example: /resource-inventory?limit=10`,
                  in: 'query',
                  type: 'number'
              },
              {
                  name: 'offset',
                  description:
                      `The offset query parameter will skip the specified number of results` +
                      `\n\n` +
                      `Example: /resource-inventory?limit=10&offset=10`,
                  in: 'query',
                  type: 'number'
              },
              {
                  name: 'fields',
                  description:
                      `Allows to pick which fields to include in the result.` +
                      `\n\n` +
                      `Example: /resource-inventory?fields=name,description`,
                  in: 'query',
                  type: 'string'
              },
              {
                  name: 'sort',
                  description:
                      `Sort result based on given field(s).` +
                      `\n\n` +
                      `Default sort direction is ascending. Use '-' modifier in front of the sort field name to change direction to descending.` +
                      `\n\n` +
                      `Example: /resource-inventory?sort=name,-createdAt`,
                  in: 'query',
                  type: 'string'
              }
          ]
      },
      get: {
          description: 'Retrieves a single logical resource with the given id.',
          parameters: [
              {
                  name: '_id',
                  description: 'ID of the logical-resource to return',
                  in: 'path',
                  type: 'string',
                  required: true
              },
              {
                  name: 'depth',
                  description:
                      `The depth query parameter is used to expand inline referenced entities up to the level specified.` +
                      `\n\n` +
                      `If depth = 0, then all referenced entities are returned as RootEntity objects which contain only ID(s)` +
                      `\n` +
                      `(may also contain href and @schemaLocation).` +
                      `\n\n` +
                      `Depth range is 0 to 7` +
                      `\n\n` +
                      `If depth = 1, then the first level of related target entities is expanded.` +
                      `\n` +
                      `References are replaced with the actual loaded entities with the corresponding level of details.` +
                      `\n\n` +
                      `If depth = N it expands reference objects of related entities recursively.` +
                      `\n\n` +
                      `Maximum depth level is 7. Any given depth level which exceeds the maximum is set as 7.` +
                      `\n\n` +
                      `If depth is not specified, then the default value will depend on the expand parameter.` +
                      `\n` +
                      `If expand parameter is set, then depth is 1. If not set, then 0.` +
                      `\n\n` +
                      `Example: /resource-inventory/{id}?depth=4`,
                  in: 'query',
                  type: 'number',
                  default: 0
              },
              {
                  name: 'expand',
                  description:
                      `The expand query parameter is used to narrow down (filter) expanding of the referenced entities.` +
                      `\n\n` +
                      `If expand is not specified, then by default all the fields are expanded.` +
                      `\n\n` +
                      `If the expand parameter is specified, only that field is expanded according to depth parameter.` +
                      `\n\n` +
                      `Example: /resource-inventory/{id}?expand=name_of_field`,
                  in: 'query',
                  type: 'string'
              },
              {
                  name: 'fields',
                  description:
                      `Allows to pick which fields to include in the result.` +
                      `\n\n` +
                      `Example: /resource-inventory/{id}?fields=name,description`,
                  in: 'query',
                  type: 'string'
              }
          ]
      }
  }
  };

  const service = app.use('/v1/logical-resource', logicalResource, (req, res, next) => {

    if (res.hook.method === 'find' && res.hook.params.headers.paginate !== 'false') {
      res.setHeader('X-Total-Count', res.hook.params.total);
    }
    next();
  });

  // Expose swagger definition
  service.hooks(hooks);

  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
