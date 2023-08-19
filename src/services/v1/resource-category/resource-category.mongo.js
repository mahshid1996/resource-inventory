
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `resourceCategory`. (Can be re-generated.)
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
      href: {
        bsonType: "string"
      },
      name: {
        bsonType: "string"
      },
      description: {
        bsonType: "string"
      },
      code: {
        bsonType: "string"
      },
      "@schemaLocation": {
        bsonType: "string"
      },
      "@type": {
        bsonType: "string"
      },
      "@baseType": {
        bsonType: "string"
      },
      categorySchema: {
        bsonType: "string"
      },
      validFor: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          startDateTime: {
            format: "date-time",
            bsonType: "string"
          },
          endDateTime: {
            format: "date-time",
            bsonType: "string"
          }
        }
      },
      lifecycleStatus: {
        enum: [
          "Initial",
          "Active",
          "Launched",
          "Retired"
        ],
        bsonType: "string"
      },
      realizingResourceType: {
        enum: [
          "logicalResource",
          "physicalResource",
          "nonSerializedResource"
        ],
        bsonType: "string"
      },
      lastUpdate: {
        format: "date-time",
        bsonType: "string"
      },
      isRoot: {
        bsonType: "boolean",
        default : false
      },
      isBundle: {
        bsonType: "boolean",
        default : false
      },
      parentId: {
        bsonType: "string"
      },
      category: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      },
      relatedParty: {
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            href: {
              type: "string"
            },
            role: {
              type: "string"
            },
            name: {
              type: "string"
            }
          }
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
