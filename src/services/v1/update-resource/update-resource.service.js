
// Initializes the `updateResource` service on path `/update-resource`. (Can be re-generated.)
const createService = require('feathers-mongoose');
const createModel = require('../../../models/v1/update-resource.model');
const hooks = require('./update-resource.hooks');
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    Model,
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !<DEFAULT> code: extend
  const updateResource = createService(options)
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.use('/v1/update-resource', updateResource);

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
