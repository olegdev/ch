/**
 * Модуль авторизации
 */
var mongoose = require("mongoose");
var q = require('q');

var logger = require(SERVICES_PATH + '/logger/logger')(__filename);

var Auth = {

	/**
	 * Вернет uid или false
	 */
	auth: function(login, pass) {
		var deferred = q.defer();

		/***/ logger.info("auth request with ", login, pass);

		mongoose.model('users').findOne({login: login, pass: pass}, function(err, user) {
			if (err) {
				/***/ logger.error('Ошибка бд ' + err);
				deferred.reject(err);
			} else {
				if (user) {
					deferred.resolve(user.get('_id'));
				} else {
					deferred.resolve(false);	
				}
				
			}
		});

		return deferred.promise;
	}
};

module.exports = Auth;