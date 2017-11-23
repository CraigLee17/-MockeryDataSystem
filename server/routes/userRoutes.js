/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
const express = require("express");
const router = express.Router();
const dataGenerator = require("./../services/dataGeneratorService");
const schemaService = require("./../services/schemaService");
const dataTypeService = require("./../services/dataTypeService");
const userService = require("./../services/userService");
const mockDataService = require("./../services/mockDataService");
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

router.get("/visitor/preview", function (req, res, next) {
    dataGenerator.previewBySampleSchema(100, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.get("/visitor/file", function (req, res, next) {
    dataGenerator.previewBySampleSchema(1000, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.set('Content-disposition', 'attachment; filename=sample.json');
            res.json(data);
        }
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
            dataTypeService.create(type, function (type) {
            })
        }
        res.send("success");
    });
});

/*-------------------------------------------------schemas-------------------------------------------------*/
router.get("/users/:id/schemas", function (req, res, next) {
    const userId = req.params.id;
    schemaService.findByUserId(userId, function (err, schemas) {
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
    const schema = req.body;
    schema.user = req.session.user.id;
    schemaService.create(schema, function (err, schema) {
        if (err) {
            res.status(400).send("Invalid schema supplied");
        } else {
            dataGenerator.generateBySchema(schema, function (err, result) {
                if (err) {
                    // Remove the invalid schema
                    schemaService.remove(schema.id, function (err, numAffected) {
                        res.send("Schema is invalid!");
                    });
                } else {
                    res.json(schema);
                }
            });
        }
    });
});

router.delete("/schemas/:id", function (req, res, next) {
    const id = req.params.id;
    schemaService.remove(id, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

router.put("/schemas/:id", function (req, res, next) {
    const update = req.body;
    const id = req.params.id;
    schemaService.update(id, update, function (err, schema) {
        if (err) {
            res.send("Schema is invalid");
        } else {
            res.json(schema);
        }
    });
});

router.get("/schemas/:id/mockdata", function (req, res, next) {
    const schemaId = req.params.id;
    const query = req.query;
    mockDataService.findDataBySchemaIdAndQuery(schemaId, query, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.delete("/schemas/:id/mockdata", function (req, res, next) {
    const schemaId = req.params.id;
    const query = req.query;
    mockDataService.removeDataByQuery(schemaId, query, function (err, deletedData) {
        if (err) {
            res.send(err);
        } else if (deletedData.length == 0) {
            res.status(404).send("Data Not Found!")
        } else {
            res.json(deletedData);
        }
    });
});

router.put("/schemas/:id/mockdata", function (req, res, next) {
    const schemaId = req.params.id;
    const query = req.query;
    const row = req.body;
    mockDataService.updateDataByQuery(query, schemaId, row, function (err, updatedMockData) {
        if (err) {
            res.send(err);
        } else {
            res.json(updatedMockData);
        }
    });
});

router.post("/schemas/:id/mockdata", function (req, res, next) {
    const schemaId = req.params.id;
    const row = req.body;
    mockDataService.findDataBySchemaIdAndQuery(schemaId, {}, function (err, data) {
        mockDataService.addData(schemaId, row, function (err, updatedMockData) {
            if (err) {
                res.send(err);
            } else {
                res.json(updatedMockData);
            }
        });
    });
});

router.get("/schemas/:id/file", function (req, res, next) {
    const schemaId = req.params.id;
    mockDataService.findBySchemaId(schemaId, function (err, mockData) {
        if (err) {
            res.send(err);
        } else {
            const schema = mockData.dataSchema;
            switch (schema.fileFormat.toLowerCase()) {
                case "xml":
                    res.set('Content-disposition', 'attachment; filename=' + schema.name + '.xml');
                    res.set("Content-Type", "text/xml");
                    res.send(js2xmlparser.parse("record", mockData.data));
                    break;
                case "json":
                    res.set('Content-disposition', 'attachment; filename=' + schema.name + '.json');
                    res.json(mockData.data);
                    break;
                case "csv":
                    const fields = schema.fields.map(field => field.name);
                    const csv = json2csv({data: mockData.data, fields: fields});
                    res.set('Content-disposition', 'attachment; filename=' + schema.name + '.csv');
                    res.set("Content-Type", "text/csv");
                    res.send(csv);
            }
        }
    });
});

router.get("/schemas/:id/preview", function (req, res, next) {
    const schemaId = req.params.id;
    mockDataService.findBySchemaId_preview(schemaId, function (err, mockData) {
        if (err) {
            res.send(err);
        } else {
            res.json(mockData);
        }
    });
});

module.exports = router;