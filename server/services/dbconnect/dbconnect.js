/**
 * Модуль подключения к базе, оформлен как express middleware
 */
var mongoose = require('mongoose');
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);

var isConnected = false;

var connect = function () {
	mongoose.connect(config.url, {
		server: { socketOptions: { keepAlive: 1 } }
	});
};

mongoose.connection.on('connected', function() {
	/***/ logger.info('Соединение установлено.');
	isConnected = true;	
});

mongoose.connection.on('disconnected', function() {
	/***/ logger.error('Соединение разорвано ');
	isConnected = false;
});

mongoose.connection.on('error', function(err) {
	/***/ logger.error('Ошибка подключения базы данных ' + err);
});

connect();

module.exports = function(req, res, next) {
	if (isConnected) {	
		next();
	} else {
		res.status(500);
		res.send('DB connection error');
	}
}