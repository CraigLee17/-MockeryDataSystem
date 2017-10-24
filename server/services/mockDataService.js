/**
 * Created by Zhiyuan Li on 2017/7/17.
 */
const MockData = require('./../models/mockDataModel');

function create(dataType, cb) {
    new MockData(dataType).save(cb);
}
module.exports.create = create;

function remove(id, cb) {
    MockData.remove({_id: id}, cb);
}
module.exports.remove = remove;

function findById(id, cb) {
    MockData.findById(id, cb);
}
module.exports.findById = findById;

function findByUserId(userId, cb) {
    MockData.find({user: userId}, cb);
}
module.exports.findByUserId = findByUserId;