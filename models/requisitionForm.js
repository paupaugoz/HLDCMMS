const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('requisitionForm', {
    dateOrdered: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    materials: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    supplier: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
};