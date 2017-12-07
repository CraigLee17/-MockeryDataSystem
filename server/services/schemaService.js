/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const Schema = require('./../models/schemaModel');
const mockDataService = require("./../services/mockDataService");
const dataGeneratorService = require("./../services/dataGeneratorService");

function create(schema, cb) {
    const count = schema.count;
    // validate schema first
    dataGeneratorService.validateSchema(schema, function (err, info) {
        if (err) {
            cb(err, null);
        } else {
            schema.count = count;
            new Schema(schema).save(function (err, schemaInDB) {
                if (err) {
                    cb("Fail! Your already have schema named " + schema.name + ".", null);
                } else {
                    schemaInDB.populate('fields.dataType', cb);
                }
            });
        }
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

function updateSchema(id, schema, cb) {
    Schema.findOneAndUpdate({_id: id}, {$set: schema}, function (err, oldSchema) {
        findByID(schema.id, function (err, schema) {
            dataGeneratorService.validateSchema(schema, function (schemaErr, info) {
                if (schemaErr) {
                    // If the update schema is invalid, recover the previous schema
                    Schema.update({_id: id}, oldSchema, function (err, numAffected) {
                        cb(schemaErr, null);
                    });
                } else {
                    cb(err, schema);
                }
            });
        });
    });
}

module.exports.updateSchema = updateSchema;

function remove(id, cb) {
    // Delete related mock data with schema
    Schema.remove({_id: id}, (err, result) => mockDataService.removeBySchemaId(id, cb));
}

module.exports.remove = remove;

function popuplateDataType(schema, cb) {
    new Schema(schema).populate('fields.dataType', cb);
}

module.exports.popuplateDataType = popuplateDataType;