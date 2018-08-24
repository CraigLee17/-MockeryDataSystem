/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const DataType = require('./../models/dataTypeModel');

function create(dataType, cb) {
    new DataType(dataType).save(cb);
}

module.exports.create = create;

function findByName(name, cb) {
    DataType.find({
        name: name
    }, cb);
}

module.exports.findByName = findByName;

function findById(id, cb) {
    DataType.findById(id, cb);
}

module.exports.findById = findById;

function findAll(cb) {
    DataType.find({}).sort({
        name: "ascending"
    }).exec(cb);
}

module.exports.findAll = findAll;

function findTemplate(cb) {
    DataType.find({
        name: {
            $in: ["random.uuid", "name.firstName", "name.lastName", "internet.email", "address.country"]
        }
    }).exec(cb);
}
module.exports.findTemplate = findTemplate;