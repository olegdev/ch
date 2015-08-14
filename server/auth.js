/**
 * Модуль авторизации
 */
var winston = require('winston');
var userModel = require('./models/user');
var q = require('q');

var Auth = {

	/**
	 * Вернет uid или false
	 */
	auth: function(login, pass) {
		var deferred = q.defer();

		winston.info("auth request with ", login, pass);

		userModel.findOne({login: login, pass: pass}, function(err, user) {
			if (err) {
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