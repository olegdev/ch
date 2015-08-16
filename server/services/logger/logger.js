/**
 * Создает логгер для модуля
 */
var winston = require('winston');
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var path = require('path');

var createLogger = function(modulePath) {
	var transports = [];	

	if (config['console']) {
		transports.push(new (winston.transports.Console)());
	}

	if (config['file']) {
		transports.push(new (winston.transports.File)({ filename: BASE_PATH + '/log/'+ path.basename(modulePath, '.js') +'.log' }));
	}

	return new (winston.Logger)({
		transports: transports
	});
}

module.exports = createLogger;