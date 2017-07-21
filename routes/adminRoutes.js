/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var express = require('express');
var userService = require('./../services/userService');
var router = express.Router();

router.all('/:userid/*', function (req, res, next) {
    var csrfInreq = req.header("csrf_token");
    var csrfInSession = req.session.csrf;
    var authenticatedUser = req.session.user;
    var userid = req.params.userid;
    userService.findById(userid, function (error, pathUser) {
        if (authenticatedUser && pathUser && authenticatedUser._id == pathUser._id && csrfInreq == csrfInSession) {
            if (pathUser.role.toUpperCase() == "ADMIN") {
                next();
            }
        } else {
            req.session.regenerate(function (err) {
                res.status(403).json({msg: 'Forbidden'});
            });
        }
    });
});

router.get('/:userid/users', function (req, res, next) {
    userService.findAll(function (err, users) {
        res.json(users);
    });
});