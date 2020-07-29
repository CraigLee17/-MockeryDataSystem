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
const js2xmlparser = require("js2xmlparser");
const json2csv = require("json2csv");
const passport = require('../services/passport.js');

router.get("/template", function (req, res) {
    dataTypeService.findTemplate(function(err, datatypes) {
        res.send(datatypes);
    });
});

router.get("/visitor/preview", function (req, res) {
    dataGenerator.previewBySampleSchema(100, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.get("/visitor/file", function (req, res) {
    dataGenerator.previewBySampleSchema(1000, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.set('Content-disposition', 'attachment; filename=sample.json');
            res.json(data);
        }
    });
});

router.get("/types", function (req, res) {
    dataTypeService.findAll(function (err, types) {
        if (err) {
            res.send(err);
        } else {
            res.json(types);
        }
    });
});

router.all('/*', function (req, res, next) {
    const user = req.session.user;
    if (user && user.status) {
        next();
    } else {
        req.session.regenerate(function (err) {
            res.status(403).json({msg: 'Forbidden'});
        });
    }
});

router.post("/users", function (req, res) {
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
    })(req, res);
});

router.get("/users/:id", function (req, res) {
    const id = req.params.id;
    userService.findById(id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});

router.put("/users/:id", function (req, res) {
    const id = req.params.id;
    const updatedUser = req.body;
    userService.findByEmail(updatedUser.email, function (err, user) {
        if (user && user.id != id) {
            res.send("Fail! Looks like someone already take this email.");
        } else {
            userService.updateUser(id, updatedUser, function (err, newUser) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(newUser);
                }
            });
        }
    });
});

router.get("/users/:id/schemas", function (req, res) {
    const userId = req.params.id;
    schemaService.findByUserId(userId, function (err, schemas) {
        if (err) {
            res.send(err);
        } else {
            res.json(schemas);
        }
    });
});

router.get("/schemas/:id/exist", function (req, res) {
    const id = req.params.id;
    mockDataService.checkExistBySchemaId(id, function (err, exist) {
        if (err) {
            res.send(err);
        } else {
            res.send(exist);
        }
    });
});

router.get("/schemas/:id", function (req, res) {
    const id = req.params.id;
    schemaService.findByID(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

router.post("/schemas", function (req, res) {
    const schema = req.body;
    schema.user = req.session.user.id;
    schemaService.create(schema, function (err, schema) {
        if (err) {
            res.send(err);
        } else {
            res.json(schema);
        }
    });
});

router.delete("/schemas/:id", function (req, res) {
    const id = req.params.id;
    schemaService.remove(id, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

router.put("/schemas/:id", function (req, res) {
    const update = req.body;
    const id = req.params.id;
    schemaService.updateSchema(id, update, function (err, schema) {
        if (err) {
            res.send("Schema is invalid");
        } else {
            // remove the mock data with the old schema
            mockDataService.removeBySchemaId(schema.id, function (err, removeInfo) {
                res.json(schema);
            });
        }
    });
});

router.get("/schemas/:id/generate", function (req, res) {
    const id = req.params.id;
    schemaService.findByID(id, function (err, schema) {
        if (err) {
            res.send(err);
        } else if (!schema) {
            res.status(404).send("No schema found!");
        } else {
            dataGenerator.generate(schema, function (err, data, schemas) {
                if (data && data[schema.name]) {
                    dataGenerator.saveMockdata(schemas, data, function (err, data) {
                        err ? res.send("Data generation fails!") : res.json(data[schema.name]);
                    })
                } else {
                    res.send("Data generation fails!");
                }
            });
        }
    });
});

router.get("/schemas/:id/mockdata", function (req, res) {
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

router.delete("/schemas/:id/mockdata", function (req, res) {
    const schemaId = req.params.id;
    const query = req.query;
    mockDataService.removeDataByQuery(schemaId, query, function (err, deletedData) {
        if (err) {
            res.send(err);
        } else if (deletedData.length == 0) {
            res.status(404).send("Not Found!")
        } else {
            res.json(deletedData);
        }
    });
});

router.put("/schemas/:id/mockdata", function (req, res) {
    const schemaId = req.params.id;
    const query = req.query;
    const row = req.body;
    mockDataService.updateDataByQuery(query, schemaId, row, function (err, updatedMockData) {
        if (err) {
            res.send(err);
        } else if (!updatedMockData) {
            res.status(404).send("Not Found!");
        } else {
            res.json(updatedMockData);
        }
    });
});

router.post("/schemas/:id/mockdata", function (req, res) {
    const schemaId = req.params.id;
    const row = req.body;
    mockDataService.addData(schemaId, row, function (err, updatedMockData) {
        if (err) {
            res.send(err);
        } else if (!updatedMockData) {
            res.status(404).send("Schema Id Not Found!");
        } else {
            res.json(updatedMockData);
        }
    });
});

router.get("/schemas/:id/file", function (req, res) {
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
                    try {
                        const file = js2xmlparser.parse("record", mockData.data);
                        res.send(file);
                    } catch (err) {
                        const msg = {
                            error: err
                        };
                        res.send(js2xmlparser.parse("msg", msg));
                    }
                    break;
                case "json":
                    res.set('Content-disposition', 'attachment; filename=' + schema.name + '.json');
                    res.json(mockData.data);
                    break;
                case "csv":
                    const fields = schema.fields.map(field => field.name);
                    const csv = json2csv({
                        data: mockData.data,
                        fields: fields
                    });
                    res.set('Content-disposition', 'attachment; filename=' + schema.name + '.csv');
                    res.set("Content-Type", "text/csv");
                    res.send(csv);
            }
        }
    });
});

router.get("/schemas/:id/preview", function (req, res) {
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