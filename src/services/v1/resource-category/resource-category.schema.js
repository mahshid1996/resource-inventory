
// Define the Feathers schema for service `resourceCategory`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'ResourceCategory',
  description: 'ResourceCategory database.',
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
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    code: {
      type: 'string'
    },
    '@schemaLocation': {
      type: 'string'
    },
    '@type': {
      type: 'string'
    },
    '@baseType': {
      type: 'string'
    },
    categorySchema: {
      type: 'string'
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
    lifecycleStatus: {
      type: 'string',
      enum: ['Initial', 'Active', 'Launched', 'Retired'],
    },
    realizingResourceType: {
      type: 'string',
      enum: ['logicalResource', 'physicalResource','nonSerializedResource'],
    },
    lastUpdate: {
      type: 'string',
      format: 'date-time'
    },
    isRoot: {
      type: 'boolean',
      default: false
    },
    isBundle: {
      type: 'boolean',
      default: false
    },
    parentId: {
      type: 'string',
    },
    category: {
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
          id: {
            type: 'string'
          },
          href: {
            type: 'string'
          },
          role: {
            type: 'string'
          },
          name: {
            type: 'string'
          }
        }
      }
    }
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'ResourceCategory',
    service: {
      sort: {
        _id: 1
      },
    },
    // sql: {
    //   sqlTable: 'ResourceCategory',
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
