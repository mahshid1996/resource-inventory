// Application hooks that run for every service. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
// !<DEFAULT> code: imports
const log = require('./hooks/log');
const {sendEvent} = require('./hooks/sendEvent');
const {noteHistory}  = require('../src/hooks/noteHistory.js');
const { BadRequest } = require('@feathersjs/errors');

// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const {
  iff
} = commonHooks;
// !end
// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [function (context) {
      //Checking resourceAccess in the patch and update methods
      const { method, data, path } = context;
      if ((path === "v1/logical-resource" || path === "v1/physical-resource")) {
        if (method === 'patch' && data?.resourceAccess) {
          throw new BadRequest('Resource access should not be included for patch method');
        } else if (method === 'update' && data?.resourceAccess) {
          delete data.resourceAccess;
        }
      }
      // Generating transactionID for adding to the application logs
      return context;
    },log()],
    find: [],
    get: [],
    create: [],
    update: [],
    //commonHooks.disableMultiItemChange()
    patch: [noteHistory],
    remove: []
    // !end
  },

  after: {
    // !code: after
    all: [log()],
    find: [
        ,
      function (context) {
        context.params.total = context.result.data ? context.result.total : undefined;
        context.result = context.result.data ? context.result.data : context.result;
      }
    ],
    get: [],
    create: [ sendEvent],
    update: [sendEvent],
    //,sendEvent
    patch: [sendEvent],
    remove: [sendEvent]
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [ log()],
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
