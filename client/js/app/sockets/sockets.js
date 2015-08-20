/**
 * Управляет клиентским соединением с сервером
 */
define([
	'underscore',	
	'socket.io',	
], function(_, sio) {	

	var socket = sio('localhost:8081');

	return {
		initialize: function(config) {
			
		},
	};
});
