/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mocker = require('mocker-data-generator').default;
const mockDataService = require("./../services/mockDataService");
const schemaService = require("./../services/schemaService");

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

function removeOldAndStoreNewMockData(schema, data, cb) {
    const mockData = {
        user: schema.user,
        dataSchema: schema.id,
        data: data[schema.name]
    };
    // store mock data to DB
    mockDataService.removeBySchemaId(schema.id, function (err, numAffected) {
        console.log(err + " " + numAffected);
        mockDataService.create(mockData, function (err, mockData) {
            cb(err, mockData.data);
        });
    });
}

function generateBySchema(schema, cb) {
    const dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, schema.count).build((err, data) => {
        if (err) {
            cb(err, null);
        } else {
            // If this schema already have mock data, then remove it
            removeOldAndStoreNewMockData(schema, data, cb);
        }
    });
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