/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const Schema = require('./../models/schemaModel');

function create(schema, cb) {
    new Schema(schema).save(cb);
}

module.exports.create = create;

function findByUserId(id, cb) {
    Schema.find({user: id}, cb);
}

module.exports.findByUserId = findByUserId;

function findByName(name, cb) {
    Schema.find({name: name}, cb);
}

module.exports.findByName = findByName;

function findByID(id, cb) {
    Schema.findById(id).populate('fields.dataType').exec(cb);
}

module.exports.findByID = findByID;

function update(schema, cb) {
    Schema.update({_id: schema._id}, {$set: schema}, function (err, numAffected) {
        findByID(schema._id, cb);
    });
}

module.exports.update = update;

function remove(id, cb) {
    Schema.remove({_id: id}, cb);
}

module.exports.remove = remove;