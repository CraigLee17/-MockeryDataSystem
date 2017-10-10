/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var dataTypeService = require("./dataTypeService.js");
var randomIp = require("random-ip");

var generate = function (schema, cb) {
    var result = [];
    var rowNumber = 1;
    for (var i = 0; i < schema.count; i++) {
        var row = {};
        for (var j = 0; j < schema.fields.length; j++) {
            var type = schema.fields[j].dataType;
            var fieldName = schema.fields[j].name;
            switch (type.name) {
                case "row":
                    row[fieldName] = rowNumber;
                    break;
                case "number":
                    row[fieldName] = number(5);
                    break;
                case "name":
                    row[fieldName] = name();
                    break;
                case "gender":
                    row[fieldName] = gender();
                    break;
                case "country":
                    row[fieldName] = country();
                    break;
                case "email":
                    row[fieldName] = email();
                    break;
                case "boolean":
                    row[fieldName] = boolean();
                    break;
                case "ip_address_v4":
                    row[fieldName] = randomIp('0.0.0.0');
                    break;
            }
        }
        rowNumber++;
        result.push(row);
    }
    cb(result);
};
module.exports.generate = generate;

var number = function (length) {
    return Math.random().toString().slice(2, 2 + length);
};

var names = [
    "Nick", "Jodi", "Phoebe", "Langston", "Hadria", "Clem", "Anette", "Stewart", "Willy", "Umeko", "Aura", "Lowe", "Oralia", "Issie", "Gwenora",
    "Arny", "Grier", "Flossi", "Tyrus", "Keir", "Quint", "Johnathan", "Gertrud", "Kylynn", "Palmer", "Agneta", "Harrison", "Gardiner", "Nataline",
    "Zachery", "Merla", "Hayyim", "Aeriela", "Alvinia", "Fionna", "Wilmar", "Jammie", "Dionis", "Nathan", "Seymour", "Alexi", "Ware", "Corilla",
    "Dionne", "Nikolai", "Loralee", "Elton", "Harland"
];

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