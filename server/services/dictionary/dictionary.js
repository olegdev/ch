/**
 * Словарь
 */
var fs = require('fs');

var Dictionary = function() {
    this.words = JSON.parse(fs.readFileSync(__dirname + '/dictionary.json', 'utf8'));
};

/**
 * Вернет значения ключа (перевод)
 */
Dictionary.prototype.get = function(key) {
    return this.words[key] || key;
};

// Создает только один экземпляр класса
Dictionary.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Dictionary();
    }
    return this.instance;
}

module.exports = Dictionary.getInstance();