"use strict";
const Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs')


module.exports = function(sequelize, DataTypes) {
  var userSchema = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    userType: {
      type: Sequelize.INTEGER,
    },
    fullName: {
      type: Sequelize.STRING,
    }
  },
  // options
  {
    timestamps: false, // we don't want timestamp for this table
    classMethods: {
      // Class method User.comparePassword() to compare hash vs.
      // provided password
      comparePassword: function(password, hash, callback) {
        // if bcrypt.compare() succeeds it'll call our function with
        // (null, true), if password doesn't match it calls our function
        // with (null, false), if it errors out it calls our function
        // with (err, null)
        bcrypt.compare(password, hash, function(err, isMatch) {
          if(err) {
            return callback(err, null);
          } else {
            callback(null, isMatch);
          }
        });
      }
    }
  });

  return userSchema;
}
