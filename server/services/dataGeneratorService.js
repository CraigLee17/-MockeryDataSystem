/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mocker = require('mocker-data-generator').default;

function buildFields(fields) {
    let dataSchema = {};
    for (let i = 0; i < fields.length; i++) {
        let name = fields[i].name;
        let type = fields[i].dataType.name;
        dataSchema[name] = {faker: type};
    }
    return dataSchema;
}

function generateBySchema (schema, cb) {
    const dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, schema.count).build(data => cb(data[schema.name]));
};

module.exports.generateBySchema = generateBySchema;

function generateBySchemas (schemas, cb) {
    const mock = mocker();
    const dataSchemas = schemas.map(schema => buildFields(schema.fields));
    for (let i in schemas) {
        mock.schema(schemas[i].name + i, dataSchemas[i], schemas[i].count);
    }
    mock.build(data => cb(data));
};
module.exports.generateBySchemas = generateBySchemas;