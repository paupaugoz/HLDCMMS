const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('templateMaterial', {
    // ID is auto-generated
    // Name
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};