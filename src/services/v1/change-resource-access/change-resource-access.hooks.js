
// Hooks for service `changeResourceAccess`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
const errors = require('@feathersjs/errors');
const {lockingMechanism} = require('../../../hooks/lockingMechanism.js');
// !code: imports // !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./change-resource-access.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [  context => {
      if (context.path === 'v1/change-resource-access' && context.method !== 'create') {
        throw new errors.MethodNotAllowed(`'${context.method}' method is not allowed for this endpoint.`);
      }
    }],
    find: [],
    get: [],
    create: [lockingMechanism],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [],
    get: [],
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
