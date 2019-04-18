const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('requisitionForm', {
    dateOrdered: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      default: "pending",
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    materials: {
      type: Sequelize.TEXT('LONG'),
      allowNull: false,
    },
    supplier: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
};