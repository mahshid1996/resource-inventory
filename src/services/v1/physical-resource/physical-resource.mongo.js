
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `physicalResource`. (Can be re-generated.)
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
      description: {
        bsonType: "string"
      },
      name: {
        bsonType: "string"
      },
      manufactureDate: {
        format: "date-time",
        bsonType: "string"
      },
      serialNumber: {
        bsonType: "string"
      },
      versionNumber: {
        bsonType: "string"
      },
      "@type": {
        bsonType: "string"
      },
      "@baseType": {
        bsonType: "string",
        default :"PhysicalResouce"
      },
      "@schemaLocation": {
        bsonType: "string"
      },
      isBundle: {
        bsonType: "boolean",
        default: false
      },
      resourceAccess: {
        format: "date-time",
        bsonType: "string"
      },
      value: {
        bsonType: "string"
      },
      startOperatingDate: {
        format: "date-time",
        bsonType: "string"
      },
      endOperatingDate: {
        format: "date-time",
        bsonType: "string"
      },
      resourceRecycleDate: {
        format: "date-time",
        bsonType: "string"
      },
      isMNP: {
        default: false,
        bsonType: "boolean"
      },
      operationalState: {
        bsonType: "string"
      },
      resourceStatus: {
        enum: [
          "Created",
          "Available",
          "Reserved",
          "Installing",
          "Operating",
          "Retired",
          "Pooled",
          "Blocked"
        ],
        bsonType: "string"
      },
      businessType: {
        items: {
          type: "string"
        },
        bsonType: "array"
      },
      category: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      },
      cost: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          taxFreeValue: {
            bsonType: "int"
          },
          taxedValue: {
            bsonType: "int"
          },
          unit: {
            bsonType: "string"
          }
        }
      },
      attachment: {
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            href: {
              type: "string"
            },
            attachmentType: {
              type: "string"
            },
            content: {
              type: "string"
            },
            description: {
              type: "string"
            },
            mimeType: {
              type: "string"
            },
            name: {
              type: "string"
            },
            url: {
              type: "string"
            },
            size: {
              type: "object",
              properties: {
                amount: {
                  type: "string"
                },
                units: {
                  type: "string"
                }
              }
            },
            validFor: {
              type: "object",
              properties: {
                startDateTime: {
                  type: "string",
                  format: "date-time"
                },
                endDateTime: {
                  type: "string",
                  format: "date-time"
                }
              }
            },
            "@baseType": {
              type: "string"
            },
            "@type": {
              type: "string"
            },
            "@schemaLocation": {
              type: "string"
            },
            "@referredType": {
              type: "string"
            }
          }
        },
        bsonType: "array"
      },
      note: {
        items: {
          type: "object",
          properties: {
            authorRole: {
              type: "string"
            },
            author: {
              type: "string"
            },
            date: {
              type: "string",
              format: "date-time"
            },
            text: {
              type: "string"
            }
          }
        },
        bsonType: "array"
      },
      place: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      },
      relatedParty: {
        items: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            role: {
              type: "string"
            },
            "@type": {
              type: "string"
            },
            "@baseType": {
              type: "string"
            }
          }
        },
        bsonType: "array"
      },
      resourceCharacteristic: {
        items: {
          type: "object",
          properties: {
            code: {
              type: "string"
            },
            name: {
              type: "string"
            },
            publicIdentifier: {
              type: "boolean",
              default: true
            },
            value: {
              type: "string"
            },
            valueType: {
              type: "string"
            }
          }
        },
        bsonType: "array"
      },
      resourceSpecification: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      },
      productOffering: {
        items: {
          type: "ID"
        },
        bsonType: "array"
      },
      resourceRelationship: {
        items: {
          type: "object",
          properties: {
            relationshipType: {
              type: "string",
              enum: [
                "reliesOn",
                "bundle",
                "dependency",
                "starterPack",
                "capacity",
                "pool"
              ]
            },
            validFor: {
              type: "object",
              properties: {
                startDateTime: {
                  type: "string",
                  format: "date-time"
                },
                endDateTime: {
                  type: "string",
                  format: "date-time"
                }
              }
            },
            resource: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                }
              }
            }
          }
        },
        bsonType: "array"
      },
      bundledResources: {
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            href: {
              type: "string"
            },
            "@type": {
              type: "string"
            },
            "@baseType": {
              type: "string"
            },
            "@schemaLocation": {
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
