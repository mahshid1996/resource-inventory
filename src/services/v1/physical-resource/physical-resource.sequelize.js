
/* eslint quotes: 0 */
// Defines Sequelize model for service `physicalResource`. (Can be re-generated.)
const merge = require('lodash.merge');
const Sequelize = require('sequelize');
// eslint-disable-next-line no-unused-vars
const DataTypes = Sequelize.DataTypes;
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: sequelize_model
  {
    id: {
      type: DataTypes.TEXT,
      autoIncrement: true,
      primaryKey: true
    },
    href: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    name: {
      type: DataTypes.TEXT
    },
    manufactureDate: {
      type: DataTypes.DATE
    },
    serialNumber: {
      type: DataTypes.TEXT
    },
    versionNumber: {
      type: DataTypes.TEXT
    },
    "@type": {
      type: DataTypes.TEXT
    },
    "@baseType": {
      type: DataTypes.TEXT
    },
    "@schemaLocation": {
      type: DataTypes.TEXT
    },
    isBundle: {
      type: DataTypes.BOOLEAN
    },
    resourceAccess: {
      type: DataTypes.DATE
    },
    value: {
      type: DataTypes.TEXT
    },
    startOperatingDate: {
      type: DataTypes.DATE
    },
    endOperatingDate: {
      type: DataTypes.DATE
    },
    resourceRecycleDate: {
      type: DataTypes.DATE
    },
    isMNP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    operationalState: {
      type: DataTypes.TEXT
    },
    resourceStatus: {
      type: Sequelize.ENUM(["Created","Available","Reserved","Installing","Operating","Retired","Pooled","Blocked"])
    },
    businessType: {
      type: DataTypes.JSONB
    },
    category: {
      type: DataTypes.JSONB
    },
    cost: {
      type: DataTypes.JSONB
    },
    attachment: {
      type: DataTypes.JSONB
    },
    note: {
      type: DataTypes.JSONB
    },
    place: {
      type: DataTypes.JSONB
    },
    relatedParty: {
      type: DataTypes.JSONB
    },
    resourceCharacteristic: {
      type: DataTypes.JSONB
    },
    resourceSpecification: {
      type: DataTypes.JSONB
    },
    productOffering: {
      type: DataTypes.JSONB
    },
    resourceRelationship: {
      type: DataTypes.JSONB
    },
    bundledResources: {
      type: DataTypes.JSONB
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
