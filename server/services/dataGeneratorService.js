/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mocker = require('mocker-data-generator').default;

function buildFields(fields) {
    const dataSchema = {};
    for (let i = 0; i < fields.length; i++) {
        const name = fields[i].name;
        const type = fields[i].dataType.name;
        const option = fields[i].option;
        if (option != "") {
            dataSchema[name] = {function: buildOption(option)};
        } else {
            dataSchema[name] = {faker: type};
        }
    }
    return dataSchema;
}

function buildOption(option) {
    option = option.replace(/this/ig, "this.object");
  //  option = option.replace(/\/this.object/ig, "this");
    return new Function("return " + option);
}

function generateBySchema(schema, count, cb) {
    const dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, count).build().then(data => cb(data[schema.name]), err => cb(err));
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