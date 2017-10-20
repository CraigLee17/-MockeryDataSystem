/**
 * Created by Zhiyuan Li on 2017/6/27.
 */
var dataTypeService = require("./dataTypeService.js");
var randomIp = require("random-ip");
var RandomSSN = require('ssn').RandomSSN;
var randomLastName = require('random-lastName');
var randomFirstName = require('random-firstName');

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
                case "first_name":
                    row[fieldName] = firstName();
                    break;
                case "last_name":
                    row[fieldName] = randomLastName();
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
                case "US_states":
                    row[fieldName] = state();
                    break;
                case "ssn":
                    row[fieldName] = ssn();
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
    var firstInitial = randomFirstName().charAt(0);
    var lastName = randomLastName();
    var index = Math.floor(Math.random() * domains.length);
    return firstInitial + lastName + '@' + domains[index] + '.com';
};

var boolean = function () {
    var index = Math.floor(Math.random() * 2);
    return [true, false][index];
};

var states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

var state = function () {
    var index = Math.floor(Math.random() * states.length);
    return states[index];
};

var ssn = function () {
    return new RandomSSN().value().toFormattedString();
};