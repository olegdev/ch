/**
 * Справочник локаций
 *
    id - идентификатор
    name - название
    params
		descr - описание
 		bg - картинка фона
 */
var Reference = {};

/**
 * Вернет данные локации по id
 */
Reference.getById = function(id) {
	for(var i = 0; i < this.data.length; i++) {
		if (this.data[i].id == id) {
			return this.data[i];
		}
	}
}

// послдение строчки обрабатываются grunt'ом, не менять!

Reference.data = JSON.parse(require('fs').readFileSync(__filename + 'on', 'utf8'));
module.exports = Reference;