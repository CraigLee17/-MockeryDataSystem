/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
const express = require('express');
const router = express.Router();
const users = require('./../services/userService.js');
const uuid = require('uuid');
const passport = require('../services/passport.js');

router.get('/logout', function (req, res, next) {
    req.session.regenerate(function (err) {
        req.logout();
        res.json({msg: "Successfully logout."});
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(403).send(info);
        }
        req.logIn(user, function (err) {
            if (err) {
                throw err;
            }
            var csrf_token = uuid.v1();
            req.session.csrf = csrf_token;
            req.session.user = user;
            res.cookie("csrf-token", csrf_token);
            return res.json(user);
        });
    })(req, res, next);
});

router.get('/user', function (req, res, next) {
    const user = req.user;
    const csrfInSession = req.session.csrf;
    const csrfInreq = req.header("csrf-token");
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
        res.status(403).send('Invalid csrf_token supplied');
    }
});

module.exports = router;