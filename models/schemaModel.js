/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var schemaSchema = mongoose.Schema({
    id: String,
    name: String,
    ownerId: mongoose.Schema.ObjectId,
    count: Number,
    fields: [{
        fieldId: mongoose.Schema.ObjectId
    }],
    fileFormat: String
});

var Schema = mongoose.model('Schema', schemaSchema);
module.exports = Schema;