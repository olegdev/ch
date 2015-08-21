/**
 * Формирует конфиг для юзера при инициализации клиента
 */

var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var mongoose = require('mongoose');
var q = require('q');
var _ = require('underscore');
var util = require(BASE_PATH + '/server/util');

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
	/**
	 * Формирование юзерского конфига для клиента
	 * @return Deferred callback
	 */
	getConfig: function(uid) {
		var d = q.defer();

		var result = _.extend({}, config);
		
		util
			.whenAll([				
				loadUser(result, uid),
			])
			.then(function() {
				d.resolve(result);
			})
			.fail(function(err) {
				/***/ logger.error('Ошибка при формировании конфига' + err);
			});

		return d.promise;
	}
}