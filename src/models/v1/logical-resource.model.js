// logicalResource-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !<DEFAULT> code: mongoose_schema
const { increaseResourceVersion } = require('../increaseVersion');
const mongooseSchema = require('../../services/v1/logical-resource/logical-resource.mongoose');
// !end
// !code: mongoose_imports // !end
// !code: mongoose_init // !end

let moduleExports = function (app) {
  let mongooseClient = app.get('mongooseClient');
  // !code: mongoose_func_init // !end

  // ! code: mongoose_client
  const logicalResource = new mongooseClient.Schema(mongooseSchema, {
    timestamps: true,
    // Case Insensitive Indexes
    versionKey: 'resourceVersion' //adding the name of increasing field
  });
  // !end
  //for increasing version number
  //start
  logicalResource.pre('updateMany', increaseResourceVersion);
  logicalResource.pre('findOneAndUpdate', increaseResourceVersion);
  //end

  let existingModel = mongooseClient.models['logicalResource']; // needed for client/server tests
  let returns = existingModel || mongooseClient.model('logicalResource', logicalResource);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
