var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	id: String,
    name: String,
    bg: String,
});
var model = mongoose.model('location_protos', schema);

module.exports = model;