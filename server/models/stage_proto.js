var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	id: String,
    name: String,
    description: String,
    location_proto: String,
    coords: {
    	x: Number,
    	y: Number,
    },
    //cards: Array
});
var model = mongoose.model('stage_protos', schema);

module.exports = model;