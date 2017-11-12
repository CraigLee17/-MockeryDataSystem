/**
 * Created by Zhiyuan Li on 2017/7/17.
 */
const MockData = require('./../models/mockDataModel');

function create(mockData, cb) {
    new MockData(mockData).save(cb);
}

module.exports.create = create;

function remove(id, cb) {
    MockData.remove({id: id}, cb);
}

module.exports.remove = remove;

function removeBySchemaId(id, cb) {
    MockData.remove({dataSchema: id}, cb);
}

module.exports.removeBySchemaId = removeBySchemaId;

function findById(id, cb) {
    MockData.findById(id, cb);
}

module.exports.findById = findById;

function findBySchemaId_preview(schemaId, cb) {
    MockData.findOne({dataSchema: schemaId}, {data: {$slice: 10}}).exec(cb);
}

module.exports.findBySchemaId_preview = findBySchemaId_preview;

function findBySchemaId(schemaId, cb) {
    MockData.findOne({dataSchema: schemaId}).populate('dataSchema').exec(cb);
}

module.exports.findBySchemaId = findBySchemaId;

function findDataBySchemaId(schemaId, cb) {
    MockData.findOne({dataSchema: schemaId}, 'data').exec(cb);
}

module.exports.findDataBySchemaId = findDataBySchemaId;

function findByUserId(userId, cb) {
    MockData.find({user: userId}, cb);
}

module.exports.findByUserId = findByUserId;