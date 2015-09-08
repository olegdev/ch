define([		
	'marionette',
	'logger/logger',
	'sockets/sockets',
], function(Mn, Logger, sockets) {

	var logger = new Logger("app");

	return {
		initialize: function(config) {
			var app = new Mn.Application();
			app.config = config;

			if (app.config.enableInfoLog) {
				Logger.enableInfoLog();
			}

			sockets.connect();

			var errorChannel = sockets.createChannel('error');
			errorChannel.on('error', function(data) {
				alert(data.msg);
			});

			return app;
		},
	};
});
