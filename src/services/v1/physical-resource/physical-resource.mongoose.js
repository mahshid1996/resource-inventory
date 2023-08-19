
/* eslint quotes: 0 */
// Defines Mongoose model for service `physicalResource`. (Can be re-generated.)
const merge = require('lodash.merge');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    href: String,
    description: String,
    name: String,
    manufactureDate: {
      type:Date,
      default: Date.now
    } ,
    serialNumber: String,
    versionNumber: String,
    "@type": String,
    "@baseType": {
      type: String,
      default : "PhysicalResource"
    },
    "@schemaLocation": String,
    isBundle: {
      type: Boolean,
      default : false
    },
    resourceAccess: Date,
    value: String,
    startOperatingDate: {
      type:Date,
      default: undefined
    } ,
    endOperatingDate: {
      type:Date,
      default: undefined
    } ,
    resourceRecycleDate: Date,
    isMNP: {
      type: Boolean,
      default: false
    },
    operationalState: String,
    resourceStatus: {
      type: String,
      enum: [
        "Created",
        "Available",
        "Reserved",
        "Installing",
        "Operating",
        "Retired",
        "Pooled",
        "Blocked"
      ], required: true
    },
    businessType: [
      String
    ],
    category: [
      mongoose.Schema.Types.ObjectId
    ],
    cost: {
      taxFreeValue: Number,
      taxedValue: Number,
      unit: String
    },
    attachment: [
      {
        _id:false,
        id:String,
        href: String,
        attachmentType: String,
        content: String,
        description: String,
        mimeType: String,
        name: String,
        url: String,
        size: {
          amount: String,
          units: String
        },
        validFor: {
          startDateTime: Date,
          endDateTime: Date
        },
        "@baseType": String,
        "@type": String,
        "@schemaLocation": String,
        "@referredType": String
      }
    ],
    note: [
      {
        _id:false,
        //id:String,
        authorRole: String,
        author: String,
        date: Date,
        text: String
      }
    ],
    place: [
      mongoose.Schema.Types.ObjectId
    ],
    relatedParty: [
      {
        _id:false,
        //id:String,
        name: String,
        role: String,
        "@type": String,
        "@baseType": String
      }
    ],
    resourceCharacteristic: [
      {
        _id:false,
        //id:String,
        code: String,
        name: String,
        publicIdentifier: {
          type: Boolean,
          default: true
        },
        value: String,
        valueType: String
      }
    ],
    resourceSpecification: [
      mongoose.Schema.Types.ObjectId
    ],
    productOffering: [
      mongoose.Schema.Types.ObjectId
    ],
    resourceRelationship: [
      {
        _id:false,
        relationshipType: {
          type: String,
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
          startDateTime: {
            type:Date,
            default: Date.now
          } ,
          endDateTime: {
            type:Date,
            default: Date.now
          } 
        },
        resource: {}
      }
    ],
    bundledResources: [
      {
        _id:false,
        id:String,
        href: String,
        "@type": String,
        "@baseType": String,
        "@schemaLocation": String
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
