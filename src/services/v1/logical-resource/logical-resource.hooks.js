// Hooks for service `logicalResource`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
// !code: imports
const {
  schema: {
    properties: schema
  }
} = require('./logical-resource.schema');
const queries = require('../../../hooks/queries');
const queryJoins = require('../../../hooks/queryJoins');
const joins = require('../../../hooks/joins');
const {checkPolicy} = require('../../../hooks/checkPermission.js');
const {ChangingFormatArrayOfIDFields} = require('../../../hooks/ChangingFormatOfArrayOfIDFields');
const {shapePayload} = require('../../../hooks/shapePayload');
const {categoryTypeValidation} = require('../../../hooks/categoryTypeValidation.JS');
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const {
  iff
} = commonHooks;

// eslint-disable-next-line no-unused-vars
const {
  create,
  update,
  patch,
  validateCreate,
  validateUpdate,
  validatePatch
} = require('./logical-resource.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [],
    find: [queries(schema)],
    get: [queries(schema)],
    create: [checkPolicy,categoryTypeValidation],
    update: [checkPolicy],
    patch: [checkPolicy,queries(schema),ChangingFormatArrayOfIDFields,categoryTypeValidation],
    remove: [checkPolicy]
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [queryJoins(), joins(),shapePayload],
    get: [queryJoins(), joins(),shapePayload],
    create: [shapePayload],
    update: [shapePayload],
    patch: [shapePayload],
    remove: [shapePayload]
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
