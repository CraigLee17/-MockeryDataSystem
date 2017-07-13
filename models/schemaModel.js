/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var schemaSchema = mongoose.Schema({
    id: String,
    name: String,
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    count: Number,
    fields: [{
        name: String,
        dataType: {
            type: mongoose.Schema.ObjectId,
            ref: 'DataType'
        }
    }],
    fileFormat: String
});

var Schema = mongoose.model('Schema', schemaSchema);
module.exports = Schema;