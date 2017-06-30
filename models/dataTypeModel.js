/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var dataTypeSchema = mongoose.Schema({
    id: String,
    name: String,
    type: String,
    description: String
});

var DataTypeSchema = mongoose.model('DataTypeSchema', dataTypeSchema);
module.exports = DataTypeSchema;