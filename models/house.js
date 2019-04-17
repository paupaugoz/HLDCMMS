const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('house', {
    template:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    completionDate: {
      type: Sequelize.DATE,
      allowNull: false,
    }
  });
};