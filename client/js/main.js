// Настройки requirejs

require.config({
	baseUrl: 'js/app',
	paths: {				
		'jquery': '../vendor/jquery/dist/jquery',
		'underscore': '../vendor/underscore/underscore',
		'backbone': '../vendor/backbone/backbone',
		'backbone.babysitter': '../vendor/lib/backbone.babysitter',
		'backbone.wreqr': '../vendor/lib/backbone.wreqr',
		'marionette': '../vendor/marionette/lib/backbone.marionette',
		'text': '../vendor/text/text',
		'socket.io': '../vendor/socket.io-client/socket.io',
	}
});

/**
 * Инициализация приложения
 */

var CH = {};

require(['jquery', 'app',], function($, App){  	
	$(function() {
		CH = App.initialize(config); // config - глобальный конфиг от сервера
	});
});