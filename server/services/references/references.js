//@ignore

/**
 * Справочники
 */
var fs = require('fs');

var Refereces = function() {
	var me = this;
	fs.readdirSync(__dirname).forEach(function (file) {
  		if (file.substr(file.length-3) == 'js' && file != 'references.js'){
  			me[file.substr(0,file.length-3)] = require(__dirname + '/' + file);
  		}
	});
};

// Создает только один экземпляр класса
Refereces.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Refereces();
    }
    return this.instance;
}

module.exports = Refereces.getInstance();