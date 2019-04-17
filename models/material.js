const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('material', {
    // ID is auto-generated
    // Name
    materialName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priceHistory: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
};