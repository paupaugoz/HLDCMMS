var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var {User} = require('../database');
var bcrypt = require('bcrypt-nodejs');

passport.use('local',new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  function(sentEmail, sentPassword, cb) {
    User.findOne({where: {email: sentEmail}})
    .then((out) => {
      if (!out) {
        console.log('User not found')
        return cb(null, false, {message: 'Invalid login'});
      } 
      else {
        bcrypt.compare(sentPassword, out.password, function(err, res) {
          if (res) {
            console.log('Successful login')
            return cb(null, out, {message: 'Logged in'});
          }
          console.log('Unsuccessful login')
          return cb(null, false, {message: 'Incorrect email or password.'});
        });
      }
    })
    .catch((error) => cb(error));
  }
));

// serialize session, only store user id in the session information
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// from the user id, figure out who the user is...
passport.deserializeUser(function(userId, done){
  User
    .findByPk(userId)
    .then(function(user){
      done(null, user);
    }).catch(function(err){
      done(err, null);
    });
});