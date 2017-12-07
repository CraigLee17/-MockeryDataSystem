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
            dataSchema[name] = {function: buildOption(option)};
        } else {
            const type = fields[i].dataType.name;
            dataSchema[name] = {faker: type};
        }
    }
    return dataSchema;
}

function buildOption(option) {
    option = option.replace(/faker/ig, "this.faker");
    option = option.replace(/chance/ig, "this.chance");
    option = option.replace(/casual/ig, "this.casual");
    option = option.replace(/this(?!\.(?:faker|chance|casual))/ig, "this.object");
    return new Function("return " + option);
}

function generateBySchema(schema, cb) {
    const dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, schema.count).build(cb);
};

module.exports.generateBySchema = generateBySchema;

function generateBySchemas(schemas, cb) {
    const mock = mocker();
    const dataSchemas = schemas.map(schema => buildFields(schema.fields));
    for (let i in schemas) {
        mock.schema(schemas[i].name + i, dataSchemas[i], schemas[i].count);
    }
    mock.build(data => cb(data));
};
module.exports.generateBySchemas = generateBySchemas;

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
            generateBySchema(schema, function (err, result) {
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

function test(cb) {
    var user = {
        firstName: {
            faker: 'name.firstName'
        },
        lastName: {
            faker: 'name.lastName'
        },
        country: {
            faker: 'address.country'
        },
        createdAt: {
            faker: 'date.past'
        },
        username: {
            function: function () {
                return this.object.lastName.substring(0, 5) + this.object.firstName.substring(0, 3) + Math.floor(Math.random() * 10)
            }
        }
    };
    var group = {
        description: {
            faker: 'lorem.paragraph'
        },
        users: {
            hasOne: 'user',
            get: 'firstName'
        }
    };
    mocker().schema('user', user, 2).schema('group', group, 10).build(cb);
}

module.exports.test = test;