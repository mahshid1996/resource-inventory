const { ObjectId } = require("mongoose").Types;
const { BadRequest } = require("@feathersjs/errors");

const getResourceType = require("../hooks/getResourceType.js");

const logger = require("../logger");
const {
  schema: { properties: logicalSchema },
} = require("../../src/services/v1/logical-resource/logical-resource.schema.js");
const {
  schema: { properties: physicalSchema },
} = require("../../src/services/v1/physical-resource/physical-resource.schema.js");

/**
 * Updating resources based on query
 */
async function updatingResource(context) {
  const t0 = new Date();
  const { app, path, method, data } = context;
  const payloadQuery = data.query;
  let isResourceAccessExist = false;

  if (path === "v1/update-resource" && method === "create") {
    if (!data["@type"]) {
      throw new BadRequest(`Missing '@type' field in the request payload`);
    }

    //when esourceAccess exist
    if (data.update?.resourceAccess === "") {
      isResourceAccessExist = true;
    } else if (data.update?.resourceAccess) {
      //if 'resourceAccess' exists in the update object and its value is not empty string
      throw new BadRequest(
        `For unlocking mechanism,'resourceAccess' in the update object should be empty string.`
      );
    }

    logger.applog("debug", t0, `Initiating the resource update process.`);

    //get resource type and set service name based on resource type
    const resourceType = await getResourceType(context, data["@type"]);
    logger.applog("debug", t0, `resourceType is: ${resourceType}`);
    const [serviceName, schema] =
      resourceType[0] === "LogicalResource"
        ? ["v1/logical-resource", logicalSchema]
        : ["v1/physical-resource", physicalSchema];

    //get service instance and associated MongoDB collection
    const resourceService = app.service(serviceName);
    const collection = resourceService.Model.collection;

    //getting date and objectId fields from schema[logicalResourceSchema|physicalResourceSchema]
    const dateTimeFields = [];
    const objectIdFields = [];
    fetchDateTimeAndObjectIdFields(schema, [], dateTimeFields, objectIdFields);

    //specifying 'query','update' and 'updateOptions for 'updateMany' method
    //updateOptions is includes mongo functions like:"limit","sort","skip"
    const { updateOptions, query } = convertToMongoQuery(
      payloadQuery,
      objectIdFields,
      schema,
      dateTimeFields
    );
    const update = {
      $set: specifyingUpdateQuery(data.update, dateTimeFields, objectIdFields),
    };

    //adding @type" and "resourceAccess" to the query
    query["@type"] = data["@type"];

    /**
     * updateMany(query,update) includes 'query' and 'update' objects
     * in the below we are adding 'resourceAccess to 'query' and 'update' objects
     */
    const resourceAccess = new Date();
    //adding 'resourceAccess' to the 'query' object for supporting lock/unlock mechanism
    addingResourceAccessToQuery(query, isResourceAccessExist);
    //adding 'resourceAccess' to the 'update' object
    if (!isResourceAccessExist) {
      update["$set"]["resourceAccess"] = resourceAccess;
    } else {
      //assign null to value
      update["$set"]["resourceAccess"] = null;
    }

    logger.applog("debug", t0, `query is: ${JSON.stringify(query)}`);
    logger.applog("debug", t0, `update is: ${JSON.stringify(update)}`);
    logger.applog(
      "debug",
      t0,
      `updateOptions is: ${JSON.stringify(updateOptions)}`
    );

    logger.applog("debug", t0, `Starting calling 'updateMany' function`);

    const sort = updateOptions?.sort || {};
    const limit = updateOptions?.limit || 0;
    const skip = updateOptions?.offset || 0;
    logger.applog("debug", t0, `sort is: ${JSON.stringify(sort)}`);
    logger.applog("debug", t0, `limit is: ${JSON.stringify(limit)}`);
    logger.applog("debug", t0, `skip is: ${JSON.stringify(skip)}`);
    try {
      let updateResults;
      let docs = [];
      let documents = [];
      let failureData = [];
      let findQuery = {};
      let updateFilter = {};
      let isMongoFunctionsInRequest = true;
      let totalCount = 0,
        totalAvailableResource = 0,
        successCount = 0,
        failureCount = 0;

      /**
       * When updateOptions [limit, skip, sort] are present in the request payload, we need to apply them to our query
       * Since updateMany does not directly support limit, skip, and sort, we need to call the 'find' method before executing 'updateMany()'
       */
      if (Object.keys(sort).length === 0 && limit === 0 && skip === 0) {
        updateFilter = query;
        isMongoFunctionsInRequest = false;
      } else {
        //getting available data from mongo collection based on updateOptions[limit,skip,sort]
        docs = await collection
          .find(query)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .toArray();
        logger.applog(
          "debug",
          t0,
          `UpdateOptions are available in the request payload and the response of the 'fincd' method is: ${JSON.stringify(
            docs
          )}`
        );
        const documentIds = docs.map((doc) => doc._id);
        updateFilter = { _id: { $in: documentIds } };
      }

      //updating data
      updateResults = await collection.updateMany(updateFilter, update);
      logger.applog(
        "debug",
        t0,
        `Results of updateMany function is: ${JSON.stringify(updateResults)}`
      );

      //updateResults is like this ->"{result":{"n":2,"nModified":2,"ok":1}}
      //n is total count,nModified is the numbet of success resource
      totalCount = updateOptions?.limit || updateResults?.result?.n || 0;
      totalAvailableResource = updateResults?.result?.n || 0;
      successCount = updateResults?.result?.nModified || 0;
      failureCount = updateResults?.result?.n - successCount || 0;
      logger.applog(
        "debug",
        t0,
        `count information is[totalCount:${JSON.stringify(totalCount)},
        totalCount:${JSON.stringify(totalAvailableResource)},
        successCount:${JSON.stringify(successCount)},
        failureCount:${JSON.stringify(failureCount)}]`
      );
      logger.applog("debug", t0, `Finishing calling 'updateMany' function`);

      //getting updated data
      logger.applog(
        "debug",
        t0,
        `Starting calling 'find' function for getting updated resources`
      );
      findQuery = preparingFindQuery(
        data.query,
        data.update,
        objectIdFields,
        schema,
        dateTimeFields
      );
      //adding 'resourceAccess' to the 'findQuery' for getting updated data
      if (!isResourceAccessExist) {
        Object.assign(findQuery, { resourceAccess: resourceAccess });
      } else {
        Object.assign(findQuery, { resourceAccess: { $eq: null } });
      }

      logger.applog("debug", t0, `findQuery is:${JSON.stringify(findQuery)}`);
      const cursor = await collection.find(findQuery).limit(successCount);
      documents = await cursor.toArray();
      logger.applog(
        "debug",
        t0,
        `Results of updated data is: ${JSON.stringify(documents)}`
      );
      logger.applog(
        "debug",
        t0,
        `Finishing calling 'find' function fir getting updated resources`
      );

      /**
       * Fr getting info about failure resources, we need to call 'find' method when [limit, skip, sort] are present in the request payload
       */
      if (failureCount !== 0) {
        const failureCursor = await collection.find(query).limit(failureCount);
        const failureDocs = await failureCursor.toArray();
        failureData = failureDocs.map((document) => {
          return {
            _id: document._id,
            "@baseType": document["@baseType"],
            "@type": document["@type"],
            value: document.value,
            resourceStatus: document.resourceStatus,
            resourceAccess: document?.resourceAccess || null,
            message: "An error occurred while updating the data.",
          };
        });
      }

      //making resp payload
      const responsePayload = preparingResult(
        documents,
        updateResults,
        totalAvailableResource,
        totalCount,
        successCount,
        failureCount,
        docs,
        payloadQuery,
        data.update,
        data,
        isMongoFunctionsInRequest,
        failureData
      );

      context.result = responsePayload;
    } catch (error) {
      throw new BadRequest(
        `Error occurred while updating the resources: ${JSON.stringify(
          error.message
        )}`
      );
    }
  }
  return context;
}
/**
 * By including 'resourceAccess' in the query of updateMany, we prevent concurrency issues,
 * and during the updateMany operation, we also update the 'resourceAccess' field
 */
function addingResourceAccessToQuery(query, isResourceAccessExist) {
  const t0 = new Date();
  logger.applog(
    "debug",
    t0,
    `Starting adding 'resourceAccess' to the query of updateMany operation.`
  );

  const resourceAccessArray = [];
  //!isResourceAccessExist -> 'resourceAccess' not exists in the update object
  if (!isResourceAccessExist) {
    //when '$and" operation exist in our query
    if (query.hasOwnProperty("$and")) {
      if (!query["$and"]["$or"]) {
        resourceAccessArray.push(
          { resourceAccess: { $exists: false } },
          { resourceAccess: { $eq: "" } },
          { resourceAccess: { $eq: null } }
        );
        query["$and"].push({ $or: resourceAccessArray });
      } else {
        query["$and"]["$or"].push(
          { resourceAccess: { $exists: false } },
          { resourceAccess: { $eq: "" } },
          { resourceAccess: { $eq: null } }
        );
      }
    } else {
      //when '$and" operation does not exist in our query
      query["$and"] = [
        {
          $or: [
            { resourceAccess: { $exists: false } },
            { resourceAccess: { $eq: "" } },
            { resourceAccess: { $eq: null } },
          ],
        },
      ];
    }
  } else {
    // isResourceAccessExist -> 'resourceAccess' exists in the update object

    if (query.hasOwnProperty("resourceAccess")) {
      /*when we have single value for 'resourceAccess' like this: "resourceAccess":"2022-06-24T12:13:54.367Z",
       *we need to merge it it with this query { $ne: null, $exists: true } or and $and operator
       */
      if (query.hasOwnProperty("$and")) {
        //if we have $and operator ing the query we merge with this query
        query["$and"].push({ resourceAccess: { $ne: null, $exists: true } });
        query["$and"].push({
          resourceAccess:
            typeof query["resourceAccess"] === "string"
              ? new Date(query["resourceAccess"])
              : query.resourceAccess,
        });
        delete query.resourceAccess;
      } else {
        //if we don't have $and operator in the query,is added to the query
        query["$and"] = [];
        query["$and"].push({ resourceAccess: { $ne: null, $exists: true } });
        query["$and"].push({
          resourceAccess:
            typeof query["resourceAccess"] === "string"
              ? new Date(query["resourceAccess"])
              : query.resourceAccess,
        });
        delete query.resourceAccess;
      }
    } else {
      //value should be exists and it should not be null
      query["resourceAccess"] = { $ne: null, $exists: true };
    }
  }
  logger.applog(
    "debug",
    t0,
    `Finishing adding 'resourceAccess' to the query of updateMany operation.`
  );
}

//making resp payload
function preparingResult(
  documents,
  updateResults,
  totalAvailableResource,
  totalCount,
  successCount,
  failureCount,
  docs,
  payloadQuery,
  update,
  data,
  isMongoFunctionsInRequest,
  failureData
) {
  const t0 = new Date();
  logger.applog("debug", t0, `Starting making response payload.`);
  let failureArray;
  const [status, failureMessage] =
    updateResults?.result?.ok === 0 || failureCount !== 0
      ? ["failure", { message: "An error occurred while updating the data." }]
      : ["success", null];

  const successArray = documents.map((document) => {
    return {
      _id: document._id,
      "@baseType": document["@baseType"],
      "@type": document["@type"],
      value: document.value,
      resourceStatus: document.resourceStatus,
      resourceAccess: document.resourceAccess,
    };
  });

  if (failureCount !== 0) {
    if (isMongoFunctionsInRequest) {
      failureArray = docs
        .filter(
          (document) => !documents.some((doc) => doc._id.equals(document._id))
        )
        .map((document) => {
          return {
            _id: document._id,
            "@baseType": document["@baseType"],
            "@type": document["@type"],
            value: document.value,
            resourceStatus: document.resourceStatus,
            resourceAccess: document?.resourceAccess || null,
            message: failureMessage.message,
          };
        });
    } else {
      failureArray = failureData;
    }
  }

  const result = {
    status: failureCount === 0 && successCount === 0 ? "zero_results" : status,
    totalAvailableResource: totalAvailableResource,
    totalCount: totalCount,
    successCount: successCount,
    failureCount: failureCount,
    resourceDetails: [
      {
        success: successArray,
        failure: failureCount !== 0 ? failureArray : [],
      },
    ],
    query: Object.assign({}, payloadQuery, { "@type": data[`@type`] }),
    update: update,
  };
  logger.applog("debug", t0, `Finishing making response payload.`);
  return result;
}

/**
 * building query for getting updated resource by comparing keys of 'query' and 'update' objects
 */
function findAndReplaceCommonKeys(query, update) {
  const queryKeys = Object.keys(query);
  queryKeys.forEach((key) => {
    if (update.hasOwnProperty(key)) {
      delete query[key];
      query[key] = update[key];
    }
  });
  return query;
}

//preparing query for getting updated resources
function preparingFindQuery(
  query,
  update,
  objectIdFields,
  schema,
  dateTimeFields
) {
  const t0 = new Date();
  logger.applog(
    "debug",
    t0,
    `Starting preparing query for getting updated resource with preparingFindQuery() function.`
  );
  const queryResult = findAndReplaceCommonKeys(query, update);
  const newQuery = JSON.parse(JSON.stringify(queryResult));
  const result = convertToMongoQuery(
    newQuery,
    objectIdFields,
    schema,
    dateTimeFields
  );
  logger.applog(
    "debug",
    t0,
    `Finishing preparing query for getting updated resource with preparingFindQuery() function.`
  );
  return result.query;
}

/**
 * Fetches date-time and object ID fields from a given schema recursively.
 * @param {object} schema - The schema to traverse.
 * @param {string[]} path - The current path in the schema.
 * @param {string[]} dateTimeFields - Array to store the found date-time fields.
 * @param {string[]} objectIdFields - Array to store the found object ID fields.
 * @returns {object} - An object containing the dateTimeFields and objectIdFields arrays.
 */
function fetchDateTimeAndObjectIdFields(
  schema,
  path = [],
  dateTimeFields = [],
  objectIdFields = []
) {
  const t0 = new Date();
  for (const key in schema) {
    const currentPath = [...path, key];
    const currentField = schema[key];
    logger.applog(
      "debug",
      t0,
      `Starting 'fetchDateTimeAndObjectIdFields' function`
    );
    if (currentField && typeof currentField === "object") {
      if (currentField.format === "date-time") {
        let updatedKey = currentPath.join(".");
        updatedKey = updatedKey.replace(/\.items\.properties/g, ""); //remove '.items.properties'
        updatedKey = updatedKey.replace(/\.properties/g, ""); //remove '.properties'
        dateTimeFields.push(updatedKey);
      } else if (
        schema[key]?.type === "array" &&
        schema[key]?.items?.type === "ID"
      ) {
        objectIdFields.push(key);
      } else {
        fetchDateTimeAndObjectIdFields(
          currentField,
          currentPath,
          dateTimeFields,
          objectIdFields
        );
      }
    }
  }
  logger.applog("debug", t0, `dateTimeFields is: ${dateTimeFields}`);
  logger.applog("debug", t0, `objectIdFields is: ${objectIdFields}`);
  logger.applog(
    "debug",
    t0,
    `Finishing 'fetchDateTimeAndObjectIdFields' function`
  );
  return { dateTimeFields, objectIdFields };
}

/**
 * Converts a payload query object into a MongoDB query object.
 * @param {object} payloadQuery - The payload query object.
 * @param {string[]} objectIdFields - Array of fields containing object IDs.
 * @returns {object} - The converted MongoDB query object.
 */
function convertToMongoQuery(
  payloadQuery,
  objectIdFields,
  schema,
  dateTimeFields
) {
  const t0 = new Date();
  let updateOptions = {};
  let query = {};
  let result;
  logger.applog("debug", t0, `Starting 'convertToMongoQuery' function`);
  Object.entries(payloadQuery).map(([prop, value]) => {
    //for bulding query
    if (
      schema.hasOwnProperty(prop) ||
      (prop.includes(".") && schema.hasOwnProperty(prop.split(".")[0]))
    ) {
      //separating the queries from obj
      if (typeof value !== "object") {
        //code to execute if value is a string.boolean,..(except object type),for example "value": "0400000006"
        query[prop] = value;
      } else if (Array.isArray(value) && objectIdFields.includes(prop)) {
        //this condition is for 'preparingFindQuery' function, when value of each key is array
        //for example "place":[ "62a864e17671e60007b9a222"] to "place":{"$in":[ObjectId("62a864e17671e60007b9a223")]}
        query[prop] = { $in: value.map((v) => new ObjectId(v)) };
      } else {
        //code to execute if value is object
        switch (value.operator) {
          case "elemMatch":
            const elemMatchValue = value.value;
            const elemMatchKey = prop.match(/(.*?)\.(.*)/)[1];
            query = buildingElemMatchQuery(
              query,
              value,
              prop,
              dateTimeFields,
              objectIdFields,
              elemMatchValue
            );
            break;
          default:
            query = buildInnerQuery(
              query,
              value,
              prop,
              dateTimeFields,
              objectIdFields,
              false
            );
        }
      }
    } else {
      //to specify MongoDB functions from query obj,like limit.offset,...
      updateOptions[prop] = payloadQuery[prop];
    }
    return "";
  });
  logger.applog("debug", t0, `updateOptions is: ${updateOptions}`);
  logger.applog("debug", t0, `query is: ${query}`);
  logger.applog("debug", t0, `Finishing 'convertToMongoQuery' function`);

  return { updateOptions, query };
}

//building query for '$elemMatch' operation
function buildingElemMatchQuery(
  query,
  value,
  prop,
  dateTimeFields,
  objectIdFields,
  elemMatchValue
) {
  const t0 = new Date();
  logger.applog(
    "debug",
    t0,
    `Starting buildingElemMatchQuery() function for creating '$elemMatch' query.`
  );
  let result = {};
  const [, parentKey, nestedKey] = prop.match(/(.*?)\.(.*)/);
  if (typeof elemMatchValue !== "string") {
    //if we have objest as value
    if (!Array.isArray(elemMatchValue)) {
      elemMatchValue = [elemMatchValue];
    }
    elemMatchValue.map((item) => {
      const operator = item.operator;

      // if(operator === 'or' || operator === 'and'){
      result = result.hasOwnProperty(`$${operator}`)
        ? buildInnerQuery(
            query,
            item,
            prop,
            dateTimeFields,
            objectIdFields,
            true
          ).concat(result[`$${operator}`])
        : buildInnerQuery(
            query,
            item,
            prop,
            dateTimeFields,
            objectIdFields,
            true
          );

      // }
      //modify query for elemmatch
      Object.entries(result).find(([key, value]) => {
        if (key === nestedKey) {
          if (result.hasOwnProperty(parentKey)) {
            query[`${parentKey}`]["$elemMatch"][`${nestedKey}`] = value;
          } else {
            query[`${parentKey}`] = {
              $elemMatch: { [`${key}`]: value },
            };
          }

          delete result[nestedKey];
        }
        return "";
      });
    });
  }
  logger.applog(
    "debug",
    t0,
    `Finishing buildingElemMatchQuery() function for creating '$elemMatch' query.`
  );
  return result;
}

//This function allows us to check and build query based on type of value item which is 'object' or 'string' or 'array'
function buildInnerQuery(
  query,
  value,
  prop,
  dateTimeFields,
  objectIdFields,
  isElemMatch
) {
  const t0 = new Date();
  logger.applog("debug", t0, `Starting buildInnerQuery() function.`);
  let result;
  let key = prop;
  if (prop.includes(".") && isElemMatch) {
    var [, parentKey, nestedKey] = prop.match(/(.*?)\.(.*)/);
    key = nestedKey;
  }
  const { operator, value: items } = value;
  if (typeof value.value === "object") {
    //check if any element in the value array is an object,it means array includs object item
    const containsObjects = value.value.some(
      (element) => typeof element === "object"
    );
    if (containsObjects) {
      //creating innerQuery
      result = items.map((item) => {
        const { operator: itemOperator, value: itemValue } = item;
        let innerQuery = {};
        if (typeof item === "object") {
          if (dateTimeFields.includes(prop) && itemOperator !== "exists") {
            //when we have array for dateTimeFields items
            if (Array.isArray(itemValue)) {
              const convertedArray = itemValue.map(
                (dateString) => new Date(dateString)
              );
              innerQuery[key] = { ["$" + itemOperator]: convertedArray };
            } else {
              innerQuery[key] = {
                ["$" + itemOperator]: new Date(itemValue),
              };
            }
          } else {
            innerQuery[key] = { ["$" + itemOperator]: itemValue };
          }
        }
        return innerQuery;
      });
    } else {
      //code to handle array value
      if (objectIdFields.includes(prop)) {
        query[prop] = { $in: items.map((item) => new ObjectId(item)) };
      } else {
        query[key] = { ["$" + operator]: items };
      }
    }
    if (query["$" + operator]) {
      //if the operator array already exists, concatenate the new result
      query["$" + operator] = query["$" + operator].concat(result);
    } else if (operator !== "in") {
      //otherwise, create a new array with the result
      query["$" + operator] = result;
    }
  } else {
    //handle other value types if needed
    query[key] = {
      ["$" + operator]:
        dateTimeFields.includes(prop) && value.operator !== "exists"
          ? new Date(value.value)
          : value.value,
    };
  }
  logger.applog("debug", t0, `Finishing buildInnerQuery() function.`);
  return query;
}

/**
 * Specifies the update query object for MongoDB based on input, dateTimeFields, and objectIdFields.
 * @param {object} input - The input object containing the update data.
 * @param {string[]} dateTimeFields - Array of fields containing date-time values.
 * @param {string[]} objectIdFields - Array of fields containing object IDs.
 * @returns {object} - The specified update query object for MongoDB.
 */
function specifyingUpdateQuery(input, dateTimeFields, objectIdFields) {
  const t0 = new Date();
  logger.applog("debug", t0, `Starting 'specifyingUpdateQuery' function`);
  const newObj = {};
  Object.entries(input).map(([key, value]) => {
    if (key.includes(".")) {
      const remainingKey = key.split(".").slice(1).join(".");
      if (key.startsWith("cost.")) {
        Object.assign(newObj, { [`cost.${remainingKey}`]: value });
      } else if (dateTimeFields.includes(key)) {
        Object.assign(newObj, {
          [`${[key.split(".")[0]]}.$[].${remainingKey}`]: new Date(value),
        });
      } else {
        Object.assign(newObj, {
          [`${[key.split(".")[0]]}.$[].${remainingKey}`]: value,
        });
      }
    } else {
      if (dateTimeFields.includes(key)) {
        if (value === "") {
          Object.assign(newObj, { [`${key}`]: null });
        } else {
          Object.assign(newObj, { [`${key}`]: new Date(value) });
        }
      } else {
        if (objectIdFields.includes(key)) {
          const objectIdArray = value.map((v) => new ObjectId(v));
          Object.assign(newObj, { [`${key}`]: objectIdArray });
        } else {
          Object.assign(newObj, { [`${key}`]: value });
        }
      }
    }
    return "";
  });
  logger.applog("debug", t0, `newObj is: ${newObj}`);
  logger.applog("debug", t0, `Finishing 'specifyingUpdateQuery' function`);
  return newObj;
}

module.exports = {
  updatingResource,
};
