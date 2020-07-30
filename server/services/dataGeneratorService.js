/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mocker = require('mocker-data-generator').default;
const mockDataService = require("./../services/mockDataService");
const schemaService = require("./../services/schemaService");
const dataTypeService = require("./../services/dataTypeService");
const Schema = require('../models/schemaModel');


function buildFields(fields) {
    const dataSchema = {};
    for (let i = 0; i < fields.length; i++) {
        const name = fields[i].name;
        const option = fields[i].option;
        if (option != "") {
            dataSchema[name] = {eval: buildOption(option)};
        } else {
            const type = fields[i].dataType.name;
            dataSchema[name] = {faker: type};
        }
    }
    return dataSchema;
}

function buildOption(option) {
    option = option.replace(/this/ig, "object");
    return option;
}

function generate(schema, cb) {
    const names = [];
    schemaService.findSchemaByUserId(schema.user, function (err, namesDB) {
        for (let i in schema.fields) {
            for (let j in namesDB) {
                if (schema.fields[i].option && schema.fields[i].option.includes("db." + namesDB[j].name)) {
                    names.push(namesDB[j].name);
                    break;
                }
            }
        }
        if (names.length == 0) {
            generateBySchema(schema, function (err, data) {
                err ? cb(err, null) : cb(null, data, [schema]);
            });
        } else {
            // This schema is related to some other schemas, find out other schemas by schema name and user id
            // Generate mock data by a schema array
            schemaService.findByNameAndUserId(names, schema.user, function (err, schemas) {
                schemas.push(schema);
                generateBySchemas(schemas, function (err, data) {
                    err ? cb(err, null) : cb(null, data, schemas);
                });
            });
        }
    });
}

module.exports.generate = generate;

function saveMockdata(schemas, data, cb) {
    // recreate all mock data with schemas
    const mockDatas = [];
    const schemaIds = [];
    for (let i in schemas) {
        mockDatas.push({user: schemas[i].user, dataSchema: schemas[i], data: applyBlank(schemas[i], data)});
        schemaIds.push({dataSchema: schemas[i].id});
    }
    dataTypeService.findAll(function (err, types) {
        let dataTypeNames;
        if (err) {
            //if there is an error, what to do
        } else {
            dataTypeNames = types;
        }
        applyDirtyData(mockDatas, dataTypeNames);

        mockDataService.deleteMultipleBySchemaIds(schemaIds, function (err, msg) {
            mockDataService.createMultiple(mockDatas, function (err, mocks) {
                cb(err, data);
            });
        });
    });
}

module.exports.saveMockdata = saveMockdata;

function applyBlank(schema, data) {
    let rows = data[schema.name];
    for (let i in schema.fields) {
        if (schema.fields[i].blank) {
            const fieldName = schema.fields[i].name;
            const blankRows = schema.fields[i].blank * schema.count * 0.01;
            for (let j = 0; j < blankRows; j++) {
                rows[j][fieldName] = "";
            }
        }
    }
    data[schema.name] = shuffle(rows);
    return data[schema.name];
}

// This function is created by Yishu Xu on 2020/07/28
function applyDirtyData(mockDatas, dataTypeNames) {   
    for (let i in mockDatas) {
        const mockData = mockDatas[i];
        const schema = mockData.dataSchema;
        let data = mockData.data;
        let rows = data;
        const fieldNo = Array.from(Array(schema.fields.length).keys());
        for (let j in fieldNo) {
            if (schema.fields[j].outlier) {
                console.log("schema.name: " + schema.name);
                console.log("schema.fields[j].name: " + schema.fields[j].name);
                console.log("schema.fields[j].outlier: " + schema.fields[j].outlier);
                const fieldName = schema.fields[j].name;
                const dirtyRows = schema.fields[j].outlier * schema.count * 0.01;
                // generate dirty data with the size of dirtyRows
                const dirtyData = generateDirtyData(fieldName, dirtyRows, dataTypeNames);
                // update rows with dirty data
                const dirtyDataArr = Object.values(dirtyData);
                let rowNum = 0;
                for (let k = 0; k < dirtyDataArr.length && rowNum < dirtyRows; k ++) {
                    const replaceDataArr = Object.values(dirtyDataArr[k]);
                    for (let l = 0; l < replaceDataArr.length; l ++) {
                        rows[rowNum][fieldName] = replaceDataArr[l];
                        rowNum ++;
                        if (rowNum >= dirtyRows) {
                            break;
                        }
                    }
                }
            }
            rows = shuffle(rows);
        }
        mockDatas[i].data = rows;
    }
}

// This function is created by Yishu Xu on 2020/07/28
function generateDirtyData(fieldName, dirtyRows, dataTypeNames) {
    let dirtyDataTypeNames = shuffle(dataTypeNames);
    const dirtyDataSchema = new Schema();
    dirtyDataSchema.count = Math.ceil(dirtyRows / 3);
    for (let typeRow = 0; typeRow < 3; typeRow ++) {
        if (dirtyDataTypeNames[typeRow] === fieldName) {
            dirtyDataTypeNames[typeRow] = dirtyDataTypeNames[3];
        }
        dirtyDataSchema.fields.push({name: dirtyDataTypeNames[typeRow].name, dataType: dirtyDataTypeNames[typeRow], option: "", blank:0, outlier:0});
    }
    
    let dirtyData;
    const dataSchema = buildFields(dirtyDataSchema.fields);
    mocker().schema("dirtyDataSchema", dataSchema, dirtyDataSchema.count).build(function(err, data) {
        if (err) {
            
        } else {
            dirtyData = data;
        }
    });
    return dirtyData["dirtyDataSchema"];
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function generateBySchema(schema, cb) {
    const dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, schema.count).build(cb);
}

function generateBySchemas(schemas, cb) {
    const mock = mocker();
    const dataSchemas = schemas.map(schema => buildFields(schema.fields));
    for (let i in schemas) {
        mock.schema(schemas[i].name, dataSchemas[i], schemas[i].count);
    }
    mock.build(cb);
}

// Home page sample schema
function previewBySampleSchema(count, cb) {
    const sampleSchema = {
        id: {
            faker: 'random.number'
        },
        firstName: {
            faker: 'name.firstName'
        },
        lastName: {
            faker: 'name.lastName'
        },
        email: {
            function: function () {
                return this.object.firstName.substring(0, 1) + this.object.lastName + '@' + this.faker.internet.domainName();
            }
        },
        nationality: {
            faker: 'address.country'
        }
    };
    mocker().schema('sample', sampleSchema, count).build((err, data) => {
        if (err) {
            cb(err, null);
        } else {
            cb(err, data['sample']);
        }
    });
}

module.exports.previewBySampleSchema = previewBySampleSchema;

function validateSchema(schema, cb) {
    if (schema.count > 100000) {
        cb("The upper limit of rows is 100,000", null);
    } else {
        // Set the count to 1, it is used to test if the schema if valid
        schema.count = 1;
        schemaService.popuplateDataType(schema, function (err, schema) {
            generate(schema, function (err, result) {
                if (err) {
                    cb("Invalid schema supplied", null)
                } else {
                    cb(null, "Schema is valid");
                }
            });
        });
    }
}

module.exports.validateSchema = validateSchema;
