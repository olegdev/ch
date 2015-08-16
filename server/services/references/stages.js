/**
 * Справочник этапов
 *
	id - идентификатор
 	id_location - идентификатор локации
 	name - название
  	params
  		description - описание
  		coords - координаты x,y относительно верхнего левого угла локации
 */

var Reference = {};

/**
 * Поиск этапа по прототипу
 */
Reference.getById = function(id) {
	for(var i = 0; i < this.data.length; i++) {
		if (this.data[i].id == id) {
			return this.data[i];
		}
	}
};

/**
 * Все этапы локации
 */
Reference.getAllByLocationId = function(locationId) {
	var items = [];
	for(var i = 0; i < this.data.length; i++) {
		if (this.data[i].locationId == locationId) {
			items.push(this.data[i]);
		}
	}
	return items;
};

// послдение строчки обрабатываются grunt'ом, не менять!

Reference.data = JSON.parse(require('fs').readFileSync(__filename + 'on', 'utf8'));
module.exports = Reference;