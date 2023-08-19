
/* eslint quotes: 0 */
// Defines Sequelize model for service `resourceCategory`. (Can be re-generated.)
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
    name: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    code: {
      type: DataTypes.TEXT
    },
    "@schemaLocation": {
      type: DataTypes.TEXT
    },
    "@type": {
      type: DataTypes.TEXT
    },
    "@baseType": {
      type: DataTypes.TEXT
    },
    categorySchema: {
      type: DataTypes.TEXT
    },
    validFor: {
      type: DataTypes.JSONB
    },
    lifecycleStatus: {
      type: Sequelize.ENUM(["Initial","Active","Launched","Retired"])
    },
    realizingResourceType: {
      type: Sequelize.ENUM(["logicalResource","physicalResource","nonSerializedResource"])
    },
    lastUpdate: {
      type: DataTypes.DATE
    },
    isRoot: {
      type: DataTypes.BOOLEAN
    },
    isBundle: {
      type: DataTypes.BOOLEAN
    },
    parentId: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.JSONB
    },
    relatedParty: {
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
