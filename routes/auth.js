const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require('../database');
var passport = require('passport');

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/f',
    failureFlash: true
}), function (req, res) {
    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        if (!user) {
            res.redirect('/f')
        }
        else {
            console.log(user.userType)
            if (user.userType == 0) {
                res.redirect('/management/dashboard')
            }
            else if (user.userType == 1) {
                res.redirect('/encoder/dashboard')
            }
            else if (user.userType == 2) {
                res.redirect('/warehouse/dashboard')
            }
            else {
                res.redirect('/engineer/dashboard')
            }
        }
    })
});

module.exports = router;