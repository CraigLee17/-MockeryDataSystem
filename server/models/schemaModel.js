/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var schemaSchema = mongoose.Schema({
    name: String,
    user: {
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

schemaSchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        delete result._id;
    }
});

var Schema = mongoose.model('Schema', schemaSchema);
module.exports = Schema;