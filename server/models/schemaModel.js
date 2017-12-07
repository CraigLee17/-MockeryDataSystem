/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mongoose = require('mongoose');

const schemaSchema = mongoose.Schema({
    name: {
        type:String,
        unique: true
    },
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
        },
        option: String
    }],
    fileFormat: String
});

schemaSchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        delete result._id;
    }
});

const Schema = mongoose.model('Schema', schemaSchema);
module.exports = Schema;