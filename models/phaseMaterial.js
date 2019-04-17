const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('phaseMaterial', {
    // ID is auto-generated
    // Name
    quantity: {
      type: Sequelize.FLOAT,
      allowNull: false,
      default: 0
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      default: 0
    }
  });
};