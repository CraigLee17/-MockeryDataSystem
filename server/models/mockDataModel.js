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
        ref: 'Schema',
        index: true
    },
    data: {}
});

mockDataSchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        delete result._id;
    }
});


const MockData = mongoose.model('MockData', mockDataSchema);
module.exports = MockData;