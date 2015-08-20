/**
 * Модель игрока
 */
var User = Backbone.Model.extend({

	/**
	* @cfg
	*/
	money: {},

	/**
	* @cfg
	*/
	binding: {},

	/**
	* @cfg
	*/
	name: '',

	initialize: function() {
		console.log('user model init');
	},

});