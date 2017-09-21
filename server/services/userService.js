/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
var User = require('./../models/userModel');

function create(newUser, cb) {
    var user = new User(newUser);
    user.password = user.generateHash(user.password);
    user.save(cb);
}

module.exports.create = create;

function findAll(cb) {
    User.find({}).sort({status: "descending", role: "descending"}).exec(cb);
}

module.exports.findAll = findAll;

function findById(id, cb) {
    User.findById(id, cb);
}

module.exports.findById = findById;

function findByEmail(email, cb) {
    User.findOne({email: email}, cb);
}

module.exports.findByEmail = findByEmail;

function updateUser(id, newUser, cb) {
    User.update({"_id": id}, newUser, function (err, numAffected) {
        findById(id, cb);
    });
}

module.exports.updateUser = updateUser;