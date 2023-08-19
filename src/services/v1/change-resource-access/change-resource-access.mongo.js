
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `changeResourceAccess`. (Can be re-generated.)
const merge = require('lodash.merge');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      "@type": {
        bsonType: "string"
      },
      "@baseType": {
        default: "LogicalResource",
        bsonType: "string"
      },
      value: {
        bsonType: "string"
      },
      resourceAccess: {
        format: "date-time",
        bsonType: "string"
      },
      category: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      }
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
