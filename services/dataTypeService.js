/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var DataType = require('./../models/dataTypeModel');

function create(dataType, cb) {
    new DataType(dataType).save(cb);
}
module.exports.create = create;

function findByName(name, cb) {
    DataType.find({name: name}, cb);
}
module.exports.findByName = findByName;

function findById(id, cb) {
    DataType.findByID(id, cb);
}
module.exports.findById = findById;