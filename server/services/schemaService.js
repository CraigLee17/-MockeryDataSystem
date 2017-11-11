/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const Schema = require('./../models/schemaModel');
const mockDataService = require("./../services/mockDataService");
const dataGeneratorService = require("./../services/dataGeneratorService");

function create(schema, cb) {
    new Schema(schema).save(function (err, schema) {
        schema.populate('fields.dataType', cb);
    });
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

function update(id, schema, cb) {
    Schema.update({_id: id}, {$set: schema}, function (err, numAffected) {
        // Remove old mock data
        mockDataService.removeBySchemaId(id, function (err, numAffected) {
            findByID(schema.id, function (err, schema) {
                // Regenerate new mock data base on updated schema
                dataGeneratorService.generateBySchema(schema, function (err, mockData) {
                    cb(err, schema);
                });
            });
        });
    });
}

module.exports.update = update;

function remove(id, cb) {
    // Delete related mock data with schema
    Schema.remove({_id: id}, (err, result) => mockDataService.removeBySchemaId(id, cb));
}

module.exports.remove = remove;