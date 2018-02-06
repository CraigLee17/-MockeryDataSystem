/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const express = require('express');
const userService = require('./../services/userService');
const router = express.Router();

router.all('/*', function (req, res, next) {
    const user = req.session.user;
    if (user && user.status && user.role.toUpperCase() == "ADMIN") {
        next();
    } else {
        req.session.regenerate(function (err) {
            res.status(403).json({msg: 'Forbidden'});
        });
    }
});

router.get('/users', function (req, res, next) {
    userService.findAll(function (err, users) {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

router.put('/users/:id/status', function (req, res, next) {
    const id = req.params.id;
    const status = req.body.status;
    userService.updateUserStatus(id, status, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

router.put('/users/:id/role', function (req, res, next) {
    const id = req.params.id;
    const role = req.body.role;
    userService.updateUserRole(id, role, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});
module.exports = router;