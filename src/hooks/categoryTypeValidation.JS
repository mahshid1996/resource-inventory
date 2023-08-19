/* eslint-disable no-shadow */
const logger = require("../logger");
const camelCase = require("camelcase");
const { BadRequest } = require("@feathersjs/errors");

/*
Checking categoryType for 'logical-resource' and 'physical-resource'
*/
async function categoryTypeValidation(context) {
  var {
    app,
    path,
    params: { url },
    data,
  } = context;
  // Get current date time
  var t0 = new Date();
  
  if (
    (path === "v1/logical-resource" || path === "v1/physical-resource") &&
    data.category !== undefined && context.params.provider !== 'DRMSwap'
  ) {
    // Convert the API path to camel case format
    const camelCasePath = camelCase(path);
    // It using  regular expression  for removing the  "v" letter and the digits after that with using "\d" and also removeing "/" and replace them with empty string
    // Like this  v1/logicalResource -> logicalResource
    const resourceType = camelCasePath.replace(/v\d\//, "");

    try {
      const service = app.service("v1/resource-category");
      const promises = data.category.map(async element => {
        const result = await service.get(element, {
          url,
          provider: undefined,
          query: { $select: ["realizingResourceType"] },
        });
        if (result?.realizingResourceType !== resourceType) {
          throw new BadRequest(`Please use the ${resourceType} category for this resource`);
        }
      });

      await Promise.all(promises); // Wait for all promises to resolve or reject

      return context; // Return context if all validations pass
    } catch (error) {
      logger.applog("error", t0, JSON.stringify(error));
      throw error;
    }
    
  }
}

module.exports = {
  categoryTypeValidation,
};
