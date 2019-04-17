const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('phase', {
    // ID is auto-generated
    // Name
    phaseName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phaseDesc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};