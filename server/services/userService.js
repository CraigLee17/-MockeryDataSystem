/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
const User = require('./../models/userModel');

function create(newUser, cb) {
    let user = new User(newUser);
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
    if (newUser.password) {
        newUser.password = new User(newUser).generateHash(newUser.password);
    }
    User.findOneAndUpdate({"_id": id}, {$set: newUser}, {new: true}, cb);
}

module.exports.updateUser = updateUser;

function updateUserStatus(id, status, cb) {
    User.update({"_id": id}, {$set: {status: status}}, function (err, numAffected) {
        findById(id, cb);
    });
}

module.exports.updateUserStatus = updateUserStatus;

function updateUserRole(id, role, cb) {
    User.update({"_id": id}, {$set: {role: role}}, function (err, numAffected) {
        findById(id, cb);
    });
}

module.exports.updateUserRole = updateUserRole;

function defaultRoleAndStatusForNewUser(newUser) {
    newUser.role = 'user';
    newUser.status = true;
    return newUser;
}

module.exports.defaultRoleAndStatusForNewUser = defaultRoleAndStatusForNewUser;