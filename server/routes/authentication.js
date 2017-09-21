/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
var express = require('express');
var router = express.Router();
var users = require('./../services/userService.js');
var uuid = require('uuid');
var passport = require('./../passport.js');

router.get('/logout', function (req, res, next) {
    req.logout();
    res.json({msg: "Successfully logout."});
});

router.post('/login', function (req, res, next) {
    console.log(req.body);
    passport.authenticate('login', function (err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(403).json({msg: info});
        }
        req.logIn(user, function (err) {
            if (err) {
                throw err;
            }
            var csrf_token = uuid.v1();
            req.session.csrf = csrf_token;
            res.setHeader("csrf_token", csrf_token);
            return res.json(user);
        });
    })(req, res, next);
});

router.get('/user', function (req, res, next) {
    var user = req.user;
    var csrfInSession = req.session.csrf;
    var csrfInreq = req.header("csrf_token");
    if (user && csrfInSession == csrfInreq) {
        users.findById(user._id, function (err, userInDB) {
            if (err) {
                throw err;
            }
            req.logIn(userInDB, function (err) {
                if (err) {
                    throw err;
                }
                return res.json(user);
            });
        });
    } else {
        res.status(403).json({msg: 'Invalid csrf_token supplied'});
    }
});

module.exports = router;