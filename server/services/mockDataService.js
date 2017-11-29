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
    MockData.findOne({dataSchema: schemaId}, {data: {$slice: 100}}).exec(cb);
}

module.exports.findBySchemaId_preview = findBySchemaId_preview;

function findBySchemaId(schemaId, cb) {
    MockData.findOne({dataSchema: schemaId}).populate('dataSchema').exec(cb);
}

module.exports.findBySchemaId = findBySchemaId;

function findDataBySchemaIdAndQuery(schemaId, query, cb) {
    MockData.findOne({dataSchema: schemaId}, 'data').exec((err, mockData) => {
        if (err) {
            cb(err, null);
        } else {
            // filter mock data base on query
            const result = filter(query, mockData.data);
            cb(err, result);
        }
    });
}

module.exports.findDataBySchemaIdAndQuery = findDataBySchemaIdAndQuery;

function findByUserId(userId, cb) {
    MockData.find({user: userId}, cb);
}

module.exports.findByUserId = findByUserId;

function removeDataByQuery(schemaId, query, cb) {
    MockData.findOneAndUpdate({dataSchema: schemaId}, {$pull: {data: query}}, {multi: true}).exec((err, mockData) => {
        if (err) {
            cb(err, null);
        } else {
            // filter mock data base on query
            const result = filter(query, mockData.data);
            cb(err, result);
        }
    });
}

module.exports.removeDataByQuery = removeDataByQuery;

function updateDataByQuery(query, schemaId, updatedRow, cb) {
    findBySchemaId(schemaId, function (err, mockData) {
        const data = updateData(mockData.data, query, updatedRow);
        mockData.update({$set: {data: data}}, function (err, numAffected) {
            if (err) {
                cb(err, null);
            } else {
                // filter mock data base on query
                const result = filter(query, data);
                cb(err, result);
            }
        })
    });
}

module.exports.updateDataByQuery = updateDataByQuery;

function addData(schemaId, row, cb) {
    findBySchemaId(schemaId, function (err, mockData) {
        if (err) {
            cb(err, null)
        } else if (!mockData) {
            cb(null, null);
        } else if (mockData.dataSchema.count <= mockData.data.length) {
            cb("The amount of mock data reaches the count limit of its related schema!", null);
        } else {
            mockData.update({$push: {data: row}}).exec((err, numAffected) => {
                cb(err, row)
            });
        }
    });
}

module.exports.addData = addData;

function filter(query, data) {
    const result = data.filter((data) => {
        for (const p in query) {
            if (data[p] != query[p]) {
                return false
            }
        }
        return true;
    });
    return result;
}

function updateData(data, query, updatedRow) {
    return data.map(row => {
        let flag = true;
        for (let p in query) {
            if (row[p] != query[p]) {
                flag = false;
                continue;
            }
        }
        if (flag) {
            for (let p in updatedRow) {
                row[p] = updatedRow[p];
            }
        }
        return row;
    });
}