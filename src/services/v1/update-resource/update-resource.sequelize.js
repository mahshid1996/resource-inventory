
/* eslint quotes: 0 */
// Defines Sequelize model for service `updateResource`. (Can be re-generated.)
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
    query: {
      type: DataTypes.JSONB
    },
    update: {
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
