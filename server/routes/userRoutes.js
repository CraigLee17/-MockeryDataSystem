/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var express = require("express");
var router = express.Router();
var dataGenerator = require("./../services/dataGeneratorService");
var schemaService = require("./../services/schemaService");
var dataTypeService = require("./../services/dataTypeService");
var userService = require("./../services/userService");
var mongoose = require("mongoose");
var js2xmlparser = require("js2xmlparser");
var json2csv = require("json2csv");
var passport = require('../services/passport.js');

router.get("/generate", function (req, res, next) {
    schemaService.findByName("mySchema", function (err, schemas) {
        var schema = schemas[0];
        dataGenerator.generate(schema, function (result) {
            switch (schema.fileFormat.toLowerCase()) {
                case "xml":
                    res.set("Content-Type", "text/xml");
                    res.send(js2xmlparser.parse("record", result));
                    break;
                case "json":
                    res.json(result);
                    break;
                case "csv":
                    var fields = [];
                    for (var i = 0; i < schema.fields.length; i++) {
                        fields.push(schema.fields[i].name);
                    }
                    var csv = json2csv({data: result, fields: fields});
                    res.set("Content-Type", "text/csv");
                    res.send(csv);
            }
        });
    });
});

router.get("/schemas/:schemaid/preview", function (req, res, next) {
    var id = req.params.schemaid;
    schemaService.findByID(id, function (err, schema) {
        dataGenerator.generate(schema, function (result) {
            res.json(result);
        });
    });
});

router.get("/initial", function (req, res, next) {
    var dataTypes = [
        {
            name: "row",
            description: "This is row number"
        }, {
            name: "number",
            description: "This is number"
        }, {
            name: "email",
            description: "This is email"
        }, {
            name: "gender",
            description: "This is gender"
        }, {
            name: "country",
            description: "This is country"
        }, {
            name: "name",
            description: "This is name"
        }, {
            name: "boolean",
            description: "This is boolean"
        }, {
            name: "ip_address_v4",
            description: "This is IP Address v4"
        }
    ];
    var schema = {
        name: "mySchema",
        fields: [{
            name: "row"
        }, {
            name: "number"
        }, {
            name: "email"
        }, {
            name: "gender"
        }, {
            name: "country"
        }, {
            name: "name"
        }, {
            name: "boolean"
        }, {
            name: "ip_address_v4"
        }],
        count: 10,
        fileFormat: "json",
        user: '59b20d9177a8e919c496ed59'
    };
    var count = 0;
    mongoose.connection.db.dropCollection("datatypes", function (err, result) {
        mongoose.connection.db.dropCollection("schemas", function (err, result) {
            for (var i in dataTypes) {
                dataTypeService.create(dataTypes[i], function (err, dataType) {
                    for (var i in schema.fields) {
                        if (schema.fields[i].name == dataType.name) {
                            schema.fields[i]["dataType"] = dataType._id;
                            break;
                        }
                    }

                    if (dataTypes.length - 1 == count++) {
                        schemaService.create(schema, function (err, schema) {
                            if (err)
                                res.send(err);
                            res.json(schema);
                        });
                    }
                });
            }
        });
    });
});

router.get("/users/:id", function (req, res, next) {
    var id = req.params.id;
    userService.findById(id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

router.post("/users", function (req, res, next) {
    if (!(req.user && req.user.role == 'admin')) {
        req.body = userService.defaultRoleAndStatusForNewUser(req.body);
    }
    passport.authenticate('signup', function (err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).send(info);
        }
        return res.json(user);
    })(req, res, next);
});

router.get("/types", function (req, res, next) {
    dataTypeService.findAll(function (err, types) {
        if (err) {
            res.send(err);
        } else {
            res.json(types);
        }
    });
});


/*-------------------------schemas------------------------------------------*/
router.get("/users/:userid/schemas", function (req, res, next) {
    var userid = req.params.userid;
    schemaService.findByUserId(userid, function (err, schemas) {
        if (err) {
            res.send(err);
        } else {
            res.json(schemas);
        }
    });
});

router.get("/schemas/:id", function (req, res, next) {
    var id = req.params.id;
    schemaService.findByID(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

router.post("/schemas", function (req, res, next) {
    var schema = req.body;
    schema.user = req.session.user.id;
    schemaService.create(schema, function (err, schema) {
        if (err) {
            res.status(400).send("Invalid schema supplied");
        } else {
            res.json(schema);
        }
    });
});

router.delete("/schemas/:schemaid", function (req, res, next) {
    var id = req.params.schemaid;
    schemaService.remove(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

router.get("/init", function (req, res, next) {
    mongoose.connection.db.dropCollection("datatypes", function (err, result) {
        var types = buildTypes();
        for (var i in types) {
            var type = {name: types[i]};
            dataTypeService.create(type, function (type) {
            })
        }
        res.send("success");
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
        "date.soon",
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
        "internet.avater",
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
        "random.hexaDecimal",
        "system.fileName",
        "system.mimeType",
        "system.fileType",
        "system.fileExt",
        "system.directoryPath",
        "system.filePath",
        "system.commonFileName"
    ];
}

module.exports = router;