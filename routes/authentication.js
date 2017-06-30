/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
var express = require('express');
var router = express.Router();
var users = require('./../services/userService.js');
var uuid = require('uuid');
var bcrypt = require('bcrypt-nodejs');

function checkPassword(password1, password2) {
    return bcrypt.compareSync(password2, password1);
}

function accountValidate(username, password) {
    var emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var passwordValidator = /\d/;
    if (!emailValidator.test(username) || !passwordValidator.test(password) || password.length < 8) {
        return false;
    }
    return true;
}

router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) { // create a new session id
        res.json({msg: 'successful logout'});
    });
});

router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (!accountValidate(username, password)) {
        res.json({msg: 'Invalid username/password supplied'});
        return;
    }
    req.session.regenerate(function (err) {
        users.findByEmail(username, function (err, user) {
            if (user && checkPassword(user.password, password)) {
                if (!user.enabled) {
                    res.json({msg: 'Your account is disabled!'});
                    return;
                }
                var csrf_token = uuid.v1();
                req.session.csrf = csrf_token;
                res.setHeader("csrf_token", csrf_token);
                req.session.user = user;
                res.json(user);
            } else {
                res.json({msg: 'Invalid username/password supplied'});
            }
        });
    });
});

router.get('/user', function (req, res, next) {
    var user = req.session.user;
    var csrfInSession = req.session.csrf;
    var csrfInreq = req.header("Csrf-token");
    if (user && csrfInSession == csrfInreq) {
        users.findById(user._id, function (err, userInDB) {
            req.session.user = userInDB;
            res.json(userInDB);
        });
    } else {
        res.status(403).send('Forbidden');
    }
});

module.exports = router;