/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var dataTypeService = require("./dataTypeService.js");

var generate = function (schema, cb) {
    var fields = [];
    for (var i = 0; i < schema.fields.length; i++) {
        dataTypeService.findById(schema.fields[i].dataTypeId, function (err, dataType) {
            fields.push(dataType);
            if (fields.length == schema.fields.length) {
                var result = [];
                while (schema.count > 0) {
                    var row = {};
                    for (var index in fields) {
                        var field = fields[index];
                        switch (field.type) {
                            case "number":
                                row[field.type] = number(5);
                                break;
                            case "name":
                                row[field.type] = name();
                                break;
                            case "gender":
                                row[field.type] = gender();
                                break;
                            case "country":
                                row[field.type] = country();
                                break;
                            case "email":
                                row[field.type] = email();
                                break;
                        }
                    }
                    result.push(row);
                    schema.count--;
                }
                cb(result);
            }
        });
    }
};
module.exports.generate = generate;

var number = function (length) {
    return Math.random().toString().slice(2, 2 + length);
};

var names = [
    "Nick", "Jodi", "Phoebe", "Langston", "Hadria", "Clem", "Anette", "Stewart", "Willy", "Umeko", "Aura", "Lowe", "Oralia", "Issie", "Gwenora",
    "Arny", "Grier", "Flossi", "Tyrus", "Keir", "Quint", "Johnathan", "Gertrud", "Kylynn", "Palmer", "Agneta", "Harrison", "Gardiner", "Nataline",
    "Zachery", "Merla", "Hayyim", "Aeriela", "Alvinia", "Fionna", "Wilmar", "Jammie", "Dionis", "Nathan", "Seymour", "Alexi", "Ware", "Corilla",
    "Dionne", "Nikolai", "Loralee", "Elton", "Harland"];

var name = function () {
    var index = Math.floor(Math.random() * names.length);
    return names[index];
};

var gender = function () {
    var index = Math.floor(Math.random() * 2);
    return ["male", "female"][index];
};

var countries = [
    "Poland", "Philippines", "France", "China", "Thailand", "Greece", "Portugal", "Vietnam", "Malta", "Indonesia",
    "Ukraine", "Czech Republic", "Thailand", "Slovenia", "Colombia", "South Africa", "Indonesia", "Vietnam",
    "Indonesia", "Japan", "America", "Canada"];

var country = function () {
    var index = Math.floor(Math.random() * countries.length);
    return countries[index];
};

var domains = ["atos", "uwlax", "sina", "gmail", "walmart", "taobao", "baidu", "netflix", "qq", "stanford"];
var email = function () {
    var firstInital = name()[0];
    var lastName = name();
    var index = Math.floor(Math.random() * domains.length);
    return firstInital + lastName + '@' + domains[index] + '.com';
};

var boolean = function () {
    var index = Math.floor(Math.random() * 2);
    return [true, false][index];
};