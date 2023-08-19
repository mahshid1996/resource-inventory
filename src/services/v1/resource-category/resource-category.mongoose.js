
/* eslint quotes: 0 */
// Defines Mongoose model for service `resourceCategory`. (Can be re-generated.)
const merge = require('lodash.merge');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    href: String,
    name: String,
    description: String,
    code: String,
    "@schemaLocation": String,
    "@type": String,
    "@baseType": String,
    categorySchema: String,
    validFor: {
      startDateTime:{
        type:Date,
        default: undefined
      } ,
      endDateTime: {
        type:Date,
        default: undefined
      } 
    },
    lifecycleStatus: {
      type: String,
      enum: [
        "Initial",
        "Active",
        "Launched",
        "Retired"
      ], required: true
    },
    realizingResourceType: {
      type: String,
      enum: [
        "logicalResource",
        "physicalResource",
        "nonSerializedResource"
      ]
    },
    lastUpdate: Date,
    isRoot: {
      type: Boolean,
      default : false
    },
    isBundle: {
      type: Boolean,
      default : false
    },
    parentId: String,
    category: [
      mongoose.Schema.Types.ObjectId
    ],
    relatedParty: [
      {
        _id:false,
        id:String,
        href: String,
        role: String,
        name: String
      }
    ]
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
