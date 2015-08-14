/**
 * Формирует конфиг для юзера при инициализации клиента
 */

var winston = require('winston');
var mongoose = require('mongoose');
var q = require('q');
var util = require('./util');
var ucache = require('./ucache');

var loadModel = function(dest, modelName) {
	var model = mongoose.model(modelName);
	var d = q.defer();
	model.find().select('-_id').lean().exec(function (err, docs) {
  		if (err) {
  			d.reject(err);
  		} else {
  			dest[modelName] = docs;
  			d.resolve();
  		}
	});
	return d.promise;
}

var loadUser = function(dest, uid) {
	var model = mongoose.model('users');
	var d = q.defer();
	model.findOne({_id: uid}).select('-_id -login -pass').lean().exec(function (err, doc) {
  		if (err) {
  			d.reject(err);
  		} else {
  			dest.user = doc;
  			d.resolve();
  		}
	});
	return d.promise;
}

module.exports = {
	getConfig: function(uid) {
		var d = q.defer();

		var config = {};

		// справочики

		config.refs = {};
		
		util
			.whenAll([
				loadModel(config.refs, 'location_protos'),
				loadModel(config.refs, 'stage_protos'),
				loadUser(config, uid),
			])
			.then(function() {	
				ucache.set(uid, config.user);
				d.resolve(config);
			})
			.fail(function(err) {
				/***/ winston.error('get_config: Ошибка при формировании конфига', err);
			});

		return d.promise;
	}
}