var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var logger = require('morgan');
var userRoutes = require('./routes/userRoutes');
var adminRoutes = require('./routes/adminRoutes');
var authentication = require('./routes/authentication');
var passport = require('passport');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(logger('dev'));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'A SECRET KEY. SHOULD BE UNIQE TO THE APP. DONT EVER SHOW IT TO ANYONE',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}));

app.use(express.static(path.join(__dirname, 'public/client')));

app.use('/mockdata/api/v1', authentication);
app.use('/mockdata/api/v1', userRoutes);
app.use('/mockdata/api/v1/admin', adminRoutes);

app.use('/*', function (req, res) {
    res.sendFile('index.html', {root: __dirname + "/public/client"});
});

connect().on('error', console.log).on('disconneted', connect);

function connect() {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    return mongoose.connect('mongodb://localhost:27017/mockerydata', options).connection;
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({msg: err.message});
    });
}

// production error handler
// no stacktraces leaked to currentUser
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({msg: err.message});
});

module.exports = app;