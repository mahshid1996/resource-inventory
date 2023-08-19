
/* eslint quotes: 0 */
// Defines Sequelize model for service `changeResourceAccess`. (Can be re-generated.)
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
    "@type": {
      type: DataTypes.TEXT
    },
    "@baseType": {
      type: DataTypes.TEXT,
      defaultValue: "LogicalResource"
    },
    value: {
      type: DataTypes.TEXT
    },
    resourceAccess: {
      type: DataTypes.DATE
    },
    category: {
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
