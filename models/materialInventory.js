const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('materialInventory', {
    // ID is auto-generated
    // Name
    quantityBought: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    quantityUsed: {
      type: Sequelize.FLOAT,
      allowNull: false,
      default: 0
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    purchaseDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
};