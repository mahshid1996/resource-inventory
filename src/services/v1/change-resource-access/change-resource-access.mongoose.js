
/* eslint quotes: 0 */
// Defines Mongoose model for service `changeResourceAccess`. (Can be re-generated.)
const merge = require('lodash.merge');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    "@type": String,
    "@baseType": {
      type: String,
      default: "LogicalResource"
    },
    value: String,
    resourceAccess: Date,
    category: [
      mongoose.Schema.Types.ObjectId
    ]
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
