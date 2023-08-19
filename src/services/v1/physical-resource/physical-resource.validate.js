
/* eslint quotes: 0 */
// Validation definitions for validateSchema hook for service `physicalResource`. (Can be re-generated.)
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
    title: "PhysicalResource",
    description: "PhysicalResource database.",
    required: ["resourceStatus"],
    uniqueItemProperties: [],
    properties: {
      id: {
        type: "string"
      },
      href: {
        type: "string"
      },
      description: {
        type: "string"
      },
      name: {
        type: "string"
      },
      manufactureDate: {
        type: "string",
        format: "date-time"
      },
      serialNumber: {
        type: "string"
      },
      versionNumber: {
        type: "string",
        default : "1.0"
      },
      "@type": {
        type: "string"
      },
      "@baseType": {
        type: "string",
        default: "PhysicalResource"
      },
      "@schemaLocation": {
        type: "string"
      },
      isBundle: {
        type: "boolean",
        default: false
      },
      resourceAccess: {
        type: "string",
        format: "date-time"
      },
      value: {
        type: "string"
      },
      startOperatingDate: {
        type: "string",
        format: "date-time"
      },
      endOperatingDate: {
        type: "string",
        format: "date-time"
      },
      resourceRecycleDate: {
        type: "string",
        format: "date-time"
      },
      isMNP: {
        type: "boolean",
        default: false
      },
      operationalState: {
        type: "string"
      },
      resourceStatus: {
        type: "string",
        enum: [
          "Created",
          "Available",
          "Reserved",
          "Installing",
          "Operating",
          "Retired",
          "Pooled",
          "Blocked"
        ]
      },
      businessType: {
        type: "array",
        items: {
          type: "string"
        }
      },
      category: {
        type: "array",
        items: {
          type: ID
        }
      },
      cost: {
        type: "object",
        properties: {
          taxFreeValue: {
            type: "integer"
          },
          taxedValue: {
            type: "integer"
          },
          unit: {
            type: "string"
          }
        }
      },
      attachment: {
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
        }
      },
      note: {
        type: "array",
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
        }
      },
      place: {
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
        }
      },
      resourceCharacteristic: {
        type: "array",
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
        }
      },
      resourceSpecification: {
        type: "array",
        items: {
          type: ID
        }
      },
      productOffering: {
        type: "array",
        items: {
          type: ID
        }
      },
      resourceRelationship: {
        type: "array",
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
        }
      },
      bundledResources: {
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
