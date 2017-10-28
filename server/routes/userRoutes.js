/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const express = require("express");
const router = express.Router();
const dataGenerator = require("./../services/dataGeneratorService");
const schemaService = require("./../services/schemaService");
const dataTypeService = require("./../services/dataTypeService");
const userService = require("./../services/userService");
const mongoose = require("mongoose");
const js2xmlparser = require("js2xmlparser");
const json2csv = require("json2csv");
const passport = require('../services/passport.js');


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

router.get("/schemas/:id/download", function (req, res, next) {
    const id = req.params.id;
    schemaService.findByID(id, function (err, schema) {
        dataGenerator.generateBySchema(schema, function (result) {
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
                    for (let i = 0; i < schema.fields.length; i++) {
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
    const id = req.params.schemaid;
    schemaService.findByID(id, function (err, schema) {
        dataGenerator.generateBySchema(schema, function (result) {
            res.json(result);
        });
    });
});

router.get("/users/:id", function (req, res, next) {
    const id = req.params.id;
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

router.get("/init", function (req, res, next) {
    mongoose.connection.db.dropCollection("datatypes", function (err, result) {
        const types = buildTypes();
        for (let i in types) {
            let type = {name: types[i]};
            dataTypeService.create(type, function (type) {})
        }
        res.send("success");
    });
});

/*-------------------------schemas------------------------------------------*/
router.get("/users/:userid/schemas", function (req, res, next) {
    const userid = req.params.userid;
    schemaService.findByUserId(userid, function (err, schemas) {
        if (err) {
            res.send(err);
        } else {
            res.json(schemas);
        }
    });
});

router.get("/schemas/:id", function (req, res, next) {
    const id = req.params.id;
    schemaService.findByID(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

router.post("/schemas", function (req, res, next) {
    let schema = req.body;
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
    const id = req.params.schemaid;
    schemaService.remove(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

module.exports = router;