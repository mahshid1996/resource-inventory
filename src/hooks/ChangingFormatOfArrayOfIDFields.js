const _ = require("lodash");
const logger = require("../logger");
const { ObjectId } = require("mongoose").Types;

// Changing format of ArrayOfID fields in patch request
async function ChangingFormatArrayOfIDFields(context) {
  const t0 = new Date();
  try {
    if (context.params.provider === "grpc") {
      if (context?.data) {
        // Checking category data
        if (context?.data?.category) {
          const category = context.data.category;
          context.data.category = category.map(item => {
            // Checking categoryId is valid or not
            if (!ObjectId.isValid(item)) {
              return item.id;
            } else {
              return item;
            }
          });
        }
      }
    }
    return context;
  } catch (error) {
    logger.applog("error", t0, JSON.stringify(error));
    throw error;
  }
}
module.exports = {
  ChangingFormatArrayOfIDFields,
};
