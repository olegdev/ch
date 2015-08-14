/**
 * Модель пользователя
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({	
    login: String,
    pass: String,
    name: String,
    binding: Object,
    money: Object,
});
var model = mongoose.model('users', schema);

module.exports = model;