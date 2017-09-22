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

router.post("/schema", function (req, res, next) {
    var newSchema = req.body;
    schemaService.create(newSchema, function (err, schema) {
        if (err) {
            res.status(400).json({msg: "Invalid schema supplied"});
            return;
        }
        res.json(schema);
    });
});

router.put("/schema", function (req, res, next) {
    var updatedSchema = req.body;
    schemaService.update(updatedSchema, function (err, schema) {
        if (err) {
            res.status(400).json({msg: "Invalid schema supplied"});
            return;
        }
        res.json(schema);
    });
});

router.delete("/schemas/:schemaid", function (req, res, next) {
    var id = req.params.schemaid;
    schemaService.remove(id, function (err, result) {
        if (err) {
            res.json(err);
            return;
        } else {
            res.json(result);
        }
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
            name: "ipAddressV4",
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
            name: "ipAddressV4"
        }],
        count: 10,
        fileFormat: "json"
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
                                res.json(err);
                            res.json(schema);
                        });
                    }
                });
            }
        });
    });
});

router.post("/user", function (req, res, next) {
    if (!(req.user && req.user.role == 'admin')) {
        req.body = userService.defaultRoleAndStatusForNewUser(req.body);
    }
    passport.authenticate('signup', function (err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json({msg: info});
        }
        return res.json(user);
    })(req, res, next);
});

module.exports = router;