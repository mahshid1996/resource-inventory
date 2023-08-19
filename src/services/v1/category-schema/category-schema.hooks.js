
// Hooks for service `categorySchema`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
// !code: imports
const {
  schema: { properties: schema }
} = require('./category-schema.schema');
const queries = require('../../../hooks/queries');
const queryJoins = require('../../../hooks/queryJoins');
const {shapePayload} = require('../../../hooks/shapePayload');
const {categorySchemaValidation} = require('../../../../src/hooks/categorySchemaValidation.js');

// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./category-schema.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [],
    find: [queries(schema)],
    get: [queries(schema)],
    create: [categorySchemaValidation],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [queryJoins(),shapePayload,categorySchemaValidation],
    get: [queryJoins(),shapePayload,categorySchemaValidation],
    create: [],
    update: [],
    patch: [],
    remove: []
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
