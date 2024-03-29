// Initializes the `changeResourceAccess` service on path `/change-resource-access`. (Can be re-generated.)
const createService = require('feathers-mongoose');
const createModel = require('../../../models/v1/change-resource-access.model');
const hooks = require('./change-resource-access.hooks');
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
  //app.use('/change-resource-access', createService(options));
  const changeResourceAccess = createService(options);
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.use('/v1/change-resource-access', changeResourceAccess);
  // const service = app.service('change-resource-access');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
