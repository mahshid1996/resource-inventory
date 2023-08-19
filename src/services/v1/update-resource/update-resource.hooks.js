
// Hooks for service `updateResource`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
const errors = require('@feathersjs/errors');
const {updatingResource} = require('../../../../src/hooks/updatingResource.js');

// !code: imports // !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
//const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
//const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./update-resource.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [ context => {
      if (context.path === 'v1/update-resource' && context.method !== 'create') {
        throw new errors.MethodNotAllowed(`'${context.method}' method is not allowed for this endpoint.`);
      }
    }],
    find: [],
    get: [],
    create: [updatingResource],
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
