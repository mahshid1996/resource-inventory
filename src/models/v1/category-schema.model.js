
// categorySchema-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !<DEFAULT> code: mongoose_schema
const { increaseVersion } = require('../increaseVersion');
const mongooseSchema = require('../../services/v1/category-schema/category-schema.mongoose');
// !end
// !code: mongoose_imports // !end
// !code: mongoose_init // !end

let moduleExports = function (app) {
  let mongooseClient = app.get('mongooseClient');
  // !code: mongoose_func_init // !end

  // !<DEFAULT> code: mongoose_client
  const categorySchema = new mongooseClient.Schema(mongooseSchema, { 
    timestamps: true, 
    versionKey: 'version' //adding the name of increasing field
   });
  // !end
 //for increasing version number
  //start
  categorySchema.pre('updateMany', increaseVersion);
  categorySchema.pre('findOneAndUpdate', increaseVersion);
  //end

  let existingModel = mongooseClient.models['categorySchema']; // needed for client/server tests
  let returns = existingModel || mongooseClient.model('categorySchema', categorySchema);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
