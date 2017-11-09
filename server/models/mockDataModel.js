/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mongoose = require('mongoose');

const mockDataSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    dataSchema: {
        type: mongoose.Schema.ObjectId,
        ref: 'Schema'
    },
    data: {}
});

const MockData = mongoose.model('MockData', mockDataSchema);
module.exports = MockData;