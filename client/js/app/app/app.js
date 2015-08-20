define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'socket.io',
	'viewport',
	'models/user',
], function($, _, Backbone, Mn, sio, Viewport, User) {
	return {
		initialize: function(config) {			
			var app = new Mn.Application();
			app.config = config;
			
			app.user = new User(config.user);

			app.viewport = Viewport;
			app.viewport.render(app.user);

			return app;
		},
	};
});
