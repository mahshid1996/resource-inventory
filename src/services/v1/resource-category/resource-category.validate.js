
/* eslint quotes: 0 */
// Validation definitions for validateSchema hook for service `resourceCategory`. (Can be re-generated.)
const { validateSchema } = require('feathers-hooks-common');
const merge = require('lodash.merge');
const ajv = require('ajv');
// !code: imports // !end
// !code: init // !end

// !<DEFAULT> code: set_id_type
// eslint-disable-next-line no-unused-vars
const ID = 'string';
// !end

let base = merge({},
  // !<DEFAULT> code: base
  {
    title: "ResourceCategory",
    description: "ResourceCategory database.",
    required: ["lifecycleStatus"],
    uniqueItemProperties: [],
    properties: {
      id: {
        type: "string"
      },
      href: {
        type: "string"
      },
      name: {
        type: "string"
      },
      description: {
        type: "string"
      },
      code: {
        type: "string"
      },
      "@schemaLocation": {
        type: "string"
      },
      "@type": {
        type: "string"
      },
      "@baseType": {
        type: "string"
      },
      categorySchema: {
        type: "string"
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
      lifecycleStatus: {
        type: "string",
        enum: [
          "Initial",
          "Active",
          "Launched",
          "Retired"
        ]
      },
      realizingResourceType: {
        type: "string",
        enum: [
          "logicalResource",
          "physicalResource",
          "nonSerializedResource"
        ]
      },
      lastUpdate: {
        type: "string",
        format: "date-time"
      },
      isRoot: {
        type: "boolean",
        default :false
      },
      isBundle: {
        type: "boolean",
        default :false
      },
      parentId: {
        type: "string"
      },
      category: {
        type: "array",
        items: {
          type: ID
        }
      },
      relatedParty: {
        type: "array",
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
        }
      }
    }
  },
  // !end
  // !code: base_more // !end
);
// !code: base_change // !end

let create = merge({},
  base,
  // !code: create_more // !end
);

let update = merge({},
  base,
  // !code: update_more // !end
);

let patch = merge({},
  base,
  // !code: patch_more // !end
);
delete patch.required;
// !code: all_change // !end

let validateCreate = options => {
  // !<DEFAULT> code: func_create
  return validateSchema(create, ajv, options);
  // !end
};

let validateUpdate = options => {
  // !<DEFAULT> code: func_update
  return validateSchema(update, ajv, options);
  // !end
};

let validatePatch = options => {
  // !<DEFAULT> code: func_patch
  return validateSchema(patch, ajv, options);
  // !end
};

let quickValidate = (method, data, options) => {
  try {
    if (method === 'create') { validateCreate(options)({ type: 'before', method: 'create', data }); }
    if (method === 'update') { validateCreate(options)({ type: 'before', method: 'update', data }); }
    if (method === 'patch') { validateCreate(options)({ type: 'before', method: 'patch', data }); }
  } catch (err) {
    return err;
  }
};
// !code: validate_change // !end

let moduleExports = {
  create,
  update,
  patch,
  validateCreate,
  validateUpdate,
  validatePatch,
  quickValidate,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
