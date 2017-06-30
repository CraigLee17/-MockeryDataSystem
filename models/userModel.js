/**
 * Created by Zhiyuan Li on 2017/6/22.
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    status: Boolean
});

userSchema.set('toJSON', {
    transform: function (doc, result, options) {
        delete result.password;
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;