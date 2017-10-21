/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mocker = require('mocker-data-generator').default;

var generate = function (schema, cb) {
    var dataSchema = buildFields(schema.fields);
    mocker().schema(schema.name, dataSchema, schema.count).build(function (data) {
        cb(data[schema.name]);
    });
};

function buildFields(fields) {
    var dataSchema = {};
    for (var i = 0; i < fields.length; i++) {
        var name = fields[i].name;
        var type = fields[i].dataType.name;
        dataSchema[name] = {faker: type};
    }
    return dataSchema;
}

module.exports.generate = generate;