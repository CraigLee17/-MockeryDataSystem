/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var Schema = require('./../models/schemaModel');

function create(schema, cb) {
    new Schema(schema).save(cb);
}
module.exports.create = create;

function findByName(name, cb) {
    Schema.find({name: name}, cb);
}
module.exports.findByName = findByName;

function findByID(id, cb) {
    Schema.findById(id, cb);
};
module.exports.findByID = findByID;