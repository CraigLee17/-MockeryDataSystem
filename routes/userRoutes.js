/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var express = require("express");
var router = express.Router();
var dataGenerator = require("./../services/dataGeneratorService");
var schemaService = require("./../services/schemaService");
var dataTypeService = require("./../services/dataTypeService");
var mongoose = require('mongoose');

router.get("/generate", function (req, res, next) {
    //var schema = req.body.schema;
    schemaService.findByName("mySchema", function (err, schemas) {
        dataGenerator.generate(schemas[0], function (result) {
            res.json(result);
        });
    });
});

router.post("/schema", function (req, res, next) {
    var newSchema = req.body;
    schemaService.create(newSchema, function (err, schema) {
        if (err) {
            res.json(err);
            return;
        }
        res.json(schema);
    });
});

router.get("/initial", function (req, res, next) {
    var dataTypes = [{
        type: "number",
        description: "This is number"
    }, {
        type: "email",
        description: "This is email"
    }, {
        type: "gender",
        description: "This is gender"
    }, {
        type: "country",
        description: "This is country"
    }, {
        type: "name",
        description: "This is name"
    }];
    var schema = {
        name: "mySchema",
        fields: [{
            name: "id",
        }, {
            name: "email",
        }, {
            name: "gender",
        }, {
            name: "country",
        }, {
            name: "name",
        }],
        count: 100,
        fileFormat: "JSON"
    };
    var count = 0;
    mongoose.connection.db.dropCollection('datatypes', function (err, result) {
        mongoose.connection.db.dropCollection('schemas', function (err, result) {
            for (var i in dataTypes) {
                dataTypeService.create(dataTypes[i], function (err, dataType) {
                    schema.fields[count]["dataTypeId"] = dataType._id;
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

module.exports = router;