const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('template', {
    // ID is auto-generated
    // Name
    templateName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
};