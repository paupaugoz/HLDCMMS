const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('purchaseOrder', {
    status: {
      type: Sequelize.STRING,
      defaultValue: "Pending",
      allowNull: false,
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
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    supplier: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    orderedBy:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateOrdered: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
};