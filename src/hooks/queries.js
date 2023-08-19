const _ = require("lodash");
const moment = require("moment");
const { ObjectId } = require("mongoose").Types;
const { services } = require("../util/serviceResolvers");


// Get query params that use dot notation for fields which should be resolved
module.exports = (schema) => (context) => {

  if (context.method === "get" && typeof context.id === "object") {
    context.id = context.id._id;
  }

  const dotQueries = {};
  // For each query parameter
  Object.entries(context.params.query).forEach(([key, value]) => {
    // If uses dot notation
    if (/\./.test(key)) {
      let values;
      let comparison;
      let isComparison;

      if (_.isObject(value)) {
        const objectKey = Object.keys(value)[0];
        values = value[objectKey];
        if (_.isString(values)) values = [values];
        isComparison = ["$gt", "$gte", "$lt", "$lte"].includes(objectKey);
        if (isComparison) comparison = objectKey.replace("$", "");
      } else {
        values = value.split(",");
        comparison = key.slice(key.lastIndexOf(".") + 1);
        isComparison = ["gt", "gte", "lt", "lte", "regex"].includes(comparison);
      }

      const modifiedKey = isComparison
        ? key.replace(`.${comparison}`, "")
        : key;
      const firstField = modifiedKey.split(".", 1)[0];
      const secondField = modifiedKey.replace(`${firstField}.`, "");
      const references = services[context.path].map((service) => service.ref);

      // If value is valid ISODate convert to date
      if (_.isArray(values)) {
        values = values.map((item) => {
          if (moment(item, moment.ISO_8601, true).isValid()) {
            item = new Date(item);
          }
          return item;
        });

        if (
          schema[firstField] &&
          secondField &&
          references.includes(firstField)
        ) {
          dotQueries[firstField] = dotQueries[firstField]
            ? dotQueries[firstField]
            : [];

          dotQueries[firstField].push({
            field: secondField,
            value: isComparison
              ? {
                  [`$${comparison}`]: values[0],
                }
              : {
                  $in: values,
                },
          });

          // Remove dot query from original context
          delete context.params.query[key];
        } else if (isComparison) {
          if (!context.params.query[modifiedKey]) {
            context.params.query[modifiedKey] = {};
          }

          Object.assign(context.params.query[modifiedKey], {
            [`$${comparison}`]: values[0],
          });
          if (key !== modifiedKey) delete context.params.query[key];
        }
      }
    }
    if (!context.params.query[key]) {
      return;
    }

    // Supporting multiple values for non object items,like name=value1,value2,...
    if (!_.isObject(value) && value.includes(",")) {
      var names = value;
      var nameArr = names.split(",");
      context.params.query[key] = { $in: nameArr };
    }

    switch (key) {
      case "_id": // id
        if (context.internal || value.$in) {
          break;
        }
        if (_.isArray(value)) {
          context.params.query[key] = value.filter((id) =>
            ObjectId.isValid(id)
          );
          break;
        } else if (!ObjectId.isValid(value)) {
          delete context.params.query[key];
          break;
        }
        break;
      case "limit": // $limit
        context.params.$limit = value;
        context.params.query.$limit = value;
        delete context.params.query[key];
        break;
      case "offset": // $skip
        context.params.$skip = value;
        context.params.query.$skip = value;
        delete context.params.query[key];
        break;
      case "fields": // $select
        context.params.$select = value.split(",");
        delete context.params.query[key];
        break;
      case "sort":
        context.params.query.$sort = sortValue(value);
        delete context.params.query[key];
        break;
      case "type":
        context.params.query[`@${key}`] = value;
        delete context.params.query[key];
        break;
      case "baseType":
        context.params[`@${key}`] = value;
        context.params.query[`@${key}`] = value;
        delete context.params.query[key];
        break;
      case "$limit":
      case "$skip":
      case "$select":
      case "$in":
      case "$nin":
      case "$ne":
      case "$or":
        break;
      case "depth":
        context.params[`$${key}`] = value;
        delete context.params.query[key];
        break;
      case "resourceCharacteristic.code":
        getCharData(context, value);
        delete context.params.query[key];
        break;
      default:
        if (typeof value === "string" ) {
          if (value.includes(",")) {
            context.params.query[key] = {
              $in: value.split(","),
            };
          } else {
            context.params.query[key] = {
              $eq: value,
            };
          }
        }

        break;
    }
  });

  // Removing limit for filtering
  if (!_.isEmpty(dotQueries)) {
    delete context.params.query.$skip;
    context.params.paginate = false;
    context.params.query.$limit = null;
  }

  // Add fields which need to be queried to context
  context.params.$dotQueries = dotQueries;

  return context;
};

function sortValue(value) {
  const sort = {};
  const parts = value.split(",");
  parts.forEach((part) => {
    let order = 1;
    if (part.charAt(0) === "-") {
      order = -1;
      part = part.replace("-", "");
    }
    sort[part] = order;
  });
  return sort;
}


// Temporarily added function to get range of resource characteristics
// like -> resourceCharacteristic.code=MSISDN|3652039
function getCharData(context, value) {
  if (typeof value === "string") {
    var range = value.toString();
    var data = range.split("|");
    context.params.query["resourceCharacteristic"] = {
      $elemMatch: {
        value: {
          $in: [data[1]],
        },
        code: data[0],
      },
    };
  }
}



