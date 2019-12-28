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
var dataTypeService = require("./services/dataTypeService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
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
        maxAge: 1000 * 60 * 60
    }
}));

app.use(express.static(path.join(__dirname, 'public/client')));

app.use('/mockdata/api/v1', authentication);
app.use('/mockdata/api/v1', userRoutes);
app.use('/mockdata/api/v1', adminRoutes);

app.use('/*', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname + "/public/client"
    });
});

connect().on('error', console.log).on('disconneted', connect).on('open', initData);

function initData() {
    mongoose.connection.db.dropCollection("datatypes", function (err, result) {
        const types = buildTypes();
        for (let i in types) {
            let type = {
                name: types[i]
            };
            dataTypeService.create(type, function (type) {})
        }
    });
}

function connect() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.mongo + '/mockerydata' + process.env.query, options).connection;
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
        res.send({
            msg: err.message
        });
    });
}

// production error handler
// no stacktraces leaked to currentUser
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        msg: err.message
    });
});

function buildTypes() {
    return [
        "address.zipCode",
        "address.city",
        "address.cityPrefix",
        "address.streetName",
        "address.streetAddress",
        "address.streetSuffix",
        "address.streetPrefix",
        "address.secondaryAddress",
        "address.county",
        "address.country",
        "address.countryCode",
        "address.state",
        "address.stateAbbr",
        "address.latitude",
        "address.longitude",
        "company.suffixes",
        "company.companyName",
        "company.companySuffix",
        "company.catchPhrase",
        "date.past",
        "date.future",
        "date.between",
        "date.recent",
        "date.month",
        "date.weekday",
        "finance.account",
        "finance.accountName",
        "finance.mask",
        "finance.amount",
        "finance.transactionType",
        "finance.currencyCode",
        "finance.currencyName",
        "finance.currencySymbol",
        "internet.avatar",
        "internet.email",
        "internet.userName",
        "internet.protocol",
        "internet.domainName",
        "internet.url",
        "internet.ip",
        "internet.ipv6",
        "internet.password",
        "name.firstName",
        "name.lastName",
        "name.jobTitle",
        "name.prefix",
        "name.suffix",
        "name.title",
        "name.jobDescriptor",
        "name.jobArea",
        "name.jobType",
        "phone.phoneNumber",
        "phone.phoneNumberFormat",
        "random.number",
        "random.arrayElement",
        "random.objectElement",
        "random.uuid",
        "random.boolean",
        "random.word",
        "random.image",
        "random.locale",
        "random.alphaNumeric",
        "system.fileName",
        "system.mimeType",
        "system.fileType",
        "system.fileExt",
        "system.commonFileName"
    ];
}

module.exports = app;
