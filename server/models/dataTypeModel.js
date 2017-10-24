/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const mongoose = require('mongoose');

const dataTypeSchema = mongoose.Schema({
    name: String,
    description: String
});

const DataType = mongoose.model('DataType', dataTypeSchema);
module.exports = DataType;