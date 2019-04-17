const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('project', {
    // ID is auto-generated
    // Name
    projectName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    projectLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    completionDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    engineerInCharge: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    engineerHead: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
};