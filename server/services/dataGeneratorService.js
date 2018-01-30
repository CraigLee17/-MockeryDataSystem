/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mocker = require('mocker-data-generator').default;
const mockDataService = require("./../services/mockDataService");
const schemaService = require("./../services/schemaService");
const dataTypeService = require("./../services/dataTypeService");

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
    schemaService.findSchemaNamesByUserId(schema.user, function (err, namesDB) {
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
                err ? cb(err, null) : cb(null, applyBlank(schema, data));
            });
        } else {
            // This schema is related to some other schemas
            // Find out other schemas by schema name and user id
            // Generate mock data by a schema array
            schemaService.findByNameAndUserId(names, schema.user, function (err, schemas) {
                schemas.push(schema);
                schemaService.findByIDs(schemas, function (err, schemasDB) {
                    generateBySchemas(schemasDB, function (err, data) {
                        err ? cb(err, null) : cb(null, applyBlank(schema, data));
                    });
                });
            });
        }
    });
}

module.exports.generate = generate;

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
    return data;
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
    /*mock.build(function (err, data) {
        for (let i in schemas) {
            const mockData = {user: schemas[i].user, dataSchema: schemas[i], data: data[schemas[i].name]};
            mockDataService.create(mockData, function (err, mockdata) {});
        }
        cb(err, data);
    });*/
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

/*
function test(newSchema, cb) {
    schemaService.findByID(newSchema, function (err, newSchema) {
        const names = [];
        schemaService.findSchemaNamesByUserId(newSchema.user, function (err, namesDB) {
            for (let i in newSchema.fields) {
                for (let j in namesDB) {
                    if (newSchema.fields[i].option && newSchema.fields[i].option.includes("db." + namesDB[j].name)) {
                        names.push(namesDB[j].name);
                        break;
                    }
                }
            }
            schemaService.findByNameAndUserId(names, newSchema.user, function (err, schemas) {
                schemas.push(newSchema);
                schemaService.findByIDs(schemas, function (err, schemasDB) {
                    generateBySchemas(schemasDB, cb);
                });
            });
        });
    });
}

module.exports.test = test;*/
