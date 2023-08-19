
// changeResourceAccess-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !<DEFAULT> code: mongoose_schema
const mongooseSchema = require('../../services/v1/change-resource-access/change-resource-access.mongoose');
// !end
// !code: mongoose_imports // !end
// !code: mongoose_init // !end

let moduleExports = function (app) {
  let mongooseClient = app.get('mongooseClient');
  // !code: mongoose_func_init // !end

  // !<DEFAULT> code: mongoose_client
  const changeResourceAccess = new mongooseClient.Schema(mongooseSchema, { timestamps: true });
  // !end

  let existingModel = mongooseClient.models['changeResourceAccess']; // needed for client/server tests
  let returns = existingModel || mongooseClient.model('changeResourceAccess', changeResourceAccess);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
