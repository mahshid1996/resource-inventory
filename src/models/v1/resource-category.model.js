// resourceCategory-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !<DEFAULT> code: mongoose_schema
const { increaseVersion } = require('../increaseVersion');
const mongooseSchema = require('../../services/v1/resource-category/resource-category.mongoose');
//code:
//added to code generation 
const mongoose = require('mongoose');
const mongooseIncrement = require('mongoose-increment');
const increment = mongooseIncrement(mongoose);
mongoose.set('useCreateIndex', true);
//end

// !end
// !code: mongoose_imports // !end
// !code: mongoose_init // !end

let moduleExports = function (app) {
  let mongooseClient = app.get('mongooseClient');
  // !code: mongoose_func_init // !end

  // ! code: mongoose_client
  const resourceCategory = new mongooseClient.Schema(mongooseSchema, {
    timestamps: true,
    versionKey: 'version' //adding the name of increasing field
  });

  //code generation
  resourceCategory.plugin(increment, {
    type: String,
    modelName: 'resourceCategory',
    fieldName: 'code',
    prefix: 'RC'
});
  // !end
  //for increasing version number
  //start
  resourceCategory.pre('updateMany', increaseVersion);
  resourceCategory.pre('findOneAndUpdate', increaseVersion);
  //end

  let existingModel = mongooseClient.models['resourceCategory']; // needed for client/server tests
  let returns = existingModel || mongooseClient.model('resourceCategory', resourceCategory);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
