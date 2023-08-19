const { getItems, replaceItems } = require("feathers-hooks-common");
const logger = require("../logger");
const categorySchema = require("../../src/services/v1/category-schema/category-schema.schema.js");
const logicalResource = require("../../src/services/v1/logical-resource/logical-resource.schema.js");
const physicalResource = require("../../src/services/v1/physical-resource/physical-resource.schema.js");
const resourceCategory = require("../../src/services/v1/resource-category/resource-category.schema.js");
/**
For assigning value to 'href' and '@schemaLocation' of schema
 */
async function shapePayload(context) {
  const { path } = context;
if(path !== 'v1/change-resource-access' && path !== 'v1/update-resource' ){

  //Loading a require module
  const {
    schema: { properties: schema },
  } =
    path === "v1/logical-resource"
      ? logicalResource
      : path === "v1/physical-resource"
      ? physicalResource
      : path === "v1/resource-category"
      ? resourceCategory
      : categorySchema;


  // Get current date time
  var t0 = new Date();

  if (context?.params?.url === undefined) {
    return context;
  }

  try {
    let items = getItems(context);
    const hasHref = !!schema.href;
    const hasSchemaLocation = !!schema["@schemaLocation"];
    const isProduction = process.env.NODE_ENV === "production";

    const shapeItem = async (item) => {

      let { href } = context.params.url;

      if (isProduction) href = `${href}`;

      item.href = hasHref ? `${href}${context.path}/${item._id}` : item.href;
      item["@schemaLocation"] = hasSchemaLocation
        ? `${href}schema/${context.path}`
        : item["@schemaLocation"];

      delete item.__v;

      return item;
    };

    if (Array.isArray(items)) {
      items = await Promise.all(items.map(async (item) => shapeItem(item)));
    } else {
      items = await shapeItem(items);
    }

    replaceItems(context, items);


    return context;
  } catch (error) {
    logger.applog("error", t0, JSON.stringify(error));
    throw error;
  }
}
}

module.exports = {
  shapePayload,
};
