
// Define the Feathers schema for service `physicalResource`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'PhysicalResource',
  description: 'PhysicalResource database.',
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    id: {
      type: 'string'
    },
    href: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    manufactureDate: {
      type: 'string',
      format: 'date-time'
    },
    serialNumber: {
      type: 'string'
    },
    versionNumber: {
      type: 'string',
      default: '1.0'
    },
    '@type': {
      type: 'string'
    },
    '@baseType': {
      type: 'string',
      default: 'PhysicalResource'
    },
    '@schemaLocation': {
      type: 'string'
    },
    isBundle: {
      type: 'boolean',
      default: false
    },
    resourceAccess:{
      type: 'string',
      format: 'date-time'
    },
    value: {
      type: 'string'
    },
    startOperatingDate: {
      type: 'string',
      format: 'date-time'
    },
    endOperatingDate: {
      type: 'string',
      format: 'date-time'
    },
    resourceRecycleDate: {
      type: 'string',
      format: 'date-time'
    },
    isMNP: {
      type: 'boolean',
      default: false
    },
    operationalState: {
      type: 'string'
    },
    resourceStatus: {
      type: 'string',
      enum: ['Created', 'Available', 'Reserved', 'Installing', 'Operating', 'Retired', 'Pooled', 'Blocked'],
    },
    businessType: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    category: {
      type: 'array',
      items: {
        type: 'ID'
      }
    },
    cost: {
      type: 'object',
      properties: {
        taxFreeValue: {
          type: 'integer'
        },
        taxedValue: {
          type: 'integer'
        },
        unit: {
          type: 'string'
        },
      }
    },
    attachment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          href: {
            type: 'string'
          },
          attachmentType: {
            type: 'string'
          },
          content: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          mimeType: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          url: {
            type: 'string'
          },
          size: {
            type: 'object',
            properties: {
              amount: {
                type: 'string'
              },
              units: {
                type: 'string'
              }
            }
          },
          validFor: {
            type: 'object',
            properties: {
              startDateTime: {
                type: 'string',
                format: 'date-time'
              },
              endDateTime: {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          '@baseType': {
            type: 'string'
          },
          '@type': {
            type: 'string'
          },
          '@schemaLocation': {
            type: 'string'
          },
          '@referredType': {
            type: 'string'
          }
        }
      }
    },
    note: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          authorRole: {
            type: 'string'
          },
          author: {
            type: 'string'
          },
          date: {
            type: 'string',
            format: 'date-time'
          },
          text: {
            type: 'string'
          }
        }
      }
    },
    place: {
      type: 'array',
      items: {
        type: 'ID'
      }
    },
    relatedParty: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          role: {
            type: 'string'
          },
          '@type': {
            type: 'string'
          },
          '@baseType': {
            type: 'string'
          }
        }
      }
    },
    resourceCharacteristic: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          publicIdentifier: {
            type: 'boolean',
            default: true
          },
          value: {
            type: 'string'
          }, //
          valueType: {
            type: 'string'
          },
        },
      },
    },
    resourceSpecification: {
      type: 'array',
      items: {
        type: 'ID'
      }
    },
    productOffering: {
      type: 'array',
      items: {
        type: 'ID'
      }
    },
    resourceRelationship: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          relationshipType: {
            type: 'string',
            enum: ['reliesOn', 'bundle', 'dependency', 'starterPack','capacity','pool']
          },
          validFor: {
            type: 'object',
            properties: {
              startDateTime: {
                type: 'string',
                format: 'date-time'
              },
              endDateTime: {
                type: 'string',
                format: 'date-time'
              },
            },
          },
          resource: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              }
            },
          },
        }
      }
    },
    bundledResources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          href: {
            type: 'string'
          },
          '@type': {
            type: 'string'
          },
          '@baseType': {
            type: 'string'
          },
          '@schemaLocation': {
            type: 'string'
          }
        }
      }
    },
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'PhysicalResource',
    service: {
      sort: {
        _id: 1
      },
    },
    // sql: {
    //   sqlTable: 'PhysicalResource',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !<DEFAULT> code: graphql_add
      // __author__: { type: '__User__!', args: false, relation: { ourTable: '__authorId__', otherTable: '_id' } },
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
