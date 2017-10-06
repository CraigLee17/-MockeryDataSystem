/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var dataTypeSchema = mongoose.Schema({
    name: String,
    description: String
});

dataTypeSchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        delete result._id;
    }
});

var DataType = mongoose.model('DataType', dataTypeSchema);
module.exports = DataType;