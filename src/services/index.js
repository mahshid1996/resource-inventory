
// Configure the Feathers services. (Can be re-generated.)
let categorySchema = require('./v1/category-schema/category-schema.service');
let changeResourceAccess = require('./v1/change-resource-access/change-resource-access.service');
let logicalResource = require('./v1/logical-resource/logical-resource.service');
let physicalResource = require('./v1/physical-resource/physical-resource.service');
let resourceCategory = require('./v1/resource-category/resource-category.service');
let updateResource = require('./v1/update-resource/update-resource.service');

// !code: imports // !end
// !code: init // !end

// eslint-disable-next-line no-unused-vars
let moduleExports = function (app) {
  app.configure(categorySchema);
  app.configure(changeResourceAccess);
  app.configure(logicalResource);
  app.configure(physicalResource);
  app.configure(resourceCategory);
  app.configure(updateResource);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
