const _ = require("lodash");

// Coverting string value to boolean value during createing data
async function categorySchemaValidation(context) {
  //Getting requirements variables from 'context'
  const { method, app, path } = context;

  // Get current date time
  const time = new Date();

  if (path === "v1/category-schema") {
    const service = app.service("v1/category-schema");

    switch (method) {
      case "create":
      case "patch":
        //Checking type of data
        if (context?.data?.resourceSchema && context?.data?.resourceSchema?.properties) {
          if (
            context.data.resourceSchema.properties.isBundle !== undefined &&
            typeof context.data.resourceSchema.properties.isBundle === "string"
          ) {
            context.data.resourceSchema.properties.isBundle = JSON.parse(
              `${context.data.resourceSchema.properties.isBundle}`
            );
          }
        }

        break;
    }
  }
}



module.exports = {
  categorySchemaValidation,
};
