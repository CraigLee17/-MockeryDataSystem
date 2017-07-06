/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var dataTypeSchema = mongoose.Schema({
    id: String,
    type: String,
    description: String
});

var DataType = mongoose.model('DataType', dataTypeSchema);
module.exports = DataType;