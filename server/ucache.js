/**
 * Кеш юзера (персональный)
 */
var winston = require('winston');

var CacheClass = function() {
	this.cache = {};
}

// Создает только один экземпляр класса
CacheClass.getInstance = function(){
    if (!this.instance){
    	/***/ winston.info('Создаю кеш');
    	this.instance = new CacheClass();
    }
    return this.instance;
}

CacheClass.prototype.set = function(uid, prop, value) {
	if (arguments.length == 2) {
		this.cache[uid] = prop;
	} else {
		this.setProp.apply(this, arguments);
	}
}

CacheClass.prototype.get = function(uid, prop, value) {
	if (arguments.length == 2) {
		return this.cache[uid];
	} else {
		return this.getProp.apply(this, arguments);
	}
}

CacheClass.prototype.setProp = function(uid, prop, value) {
	var data = this.cache[uid];
	if (data) {
		data[prop] = value;
	} else {
		/***/ winston.error('ucache: ошибка записи - кеш не найден');
	}
}

CacheClass.prototype.getProp = function(uid, prop) {
	var data = this.cache[uid];
	if (data) {
		data[prop] = value;
	} else {
		/***/ winston.error('ucache: ошибка чтения - кеш не найден');
	}
}
 
module.exports = CacheClass.getInstance();