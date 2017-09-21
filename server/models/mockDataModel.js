/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var mongoose = require('mongoose');

var mockDataSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    schema: {
        type: mongoose.Schema.ObjectId,
        ref: 'Schema'
    },
    data: {}
});

var MockData = mongoose.model('MockData', mockDataSchema);
module.exports = MockData;