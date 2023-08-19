// Initializes the `categorySchema` service on path `/v1/category-schema`. (Can be re-generated.)
const createService = require('feathers-mongoose');
const createModel = require('../../../models/v1/category-schema.model');
const hooks = require('./category-schema.hooks');
const schema = require('./category-schema.schema');
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    Model,
    paginate,
    whitelist: ['$regex']
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires

  // Initialize our service with any options it requires
  const categorySchema = createService(options);

  // attempt at swagger definition
  categorySchema.docs = {
    idType: 'string',
    tag: 'Category Schema',
    description: 'Service to manage category-schema',
    securities: ['all'],
    definitions: {
      'category-schema_list': {
        $ref: '#/definitions/category-schema'
      },
      'category-schema': schema.schema
    }
  };


  const service = app.use('/v1/category-schema', categorySchema, (req, res, next) => {

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
