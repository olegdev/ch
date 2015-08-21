/**
 * Управляет клиентским соединением с сервером
 */
define([
	'socket.io',
	'logger/logger',
], function(sio, Logger) {	

	var socket;
	var logger = new Logger("sockets");	

	var listeners = {};

	return {
		connect: function() {

			var hostUrl = location.protocol + "//" +location.host;

			var socket = sio(hostUrl);

			socket.on('connect', function() {
				/***/ logger.info('Connection established');
			});
			socket.on('disconnect', function() {
				/***/ logger.info('Disconnected');
			});
			socket.on('push', function() {
				/***/ logger.info('Connection push', arguments);
			});
		},
		


	};
});



/**

ShopModule 

function(sockets) {
	
	var Shop = sockets.createChannel("shop");	

	Shop.push("buy", {
		id: 1
	});

	Shop.onServerRemoveItem(function(data) {
		
	});


	channel.on("");
	channel.on("");

	return {
		
	}

}

*/