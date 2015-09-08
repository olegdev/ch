var logger = require(SERVICES_PATH + '/logger/logger')(__filename);

var Sockets = function() {
	this.clients = {};
	this.channels = {};
	this.errorChannel = this.createChannel('error');
}

Sockets.prototype.listen = function(server) {
	var me = this,
		sio = require("socket.io").listen(server);
	
	sio.sockets.on("connection", function(client) {
		me._onConnect(client);
	});

	return sio;
}

Sockets.prototype.createChannel = function(name) {
	var me = this;
	if (!me.channels[name]) {
		me.channels[name] = {
			listeners: {},
			on: function(message, listener) {
				if (!me.channels[name].listeners[message]) {
					me.channels[name].listeners[message] = [];
				}
				me.channels[name].listeners[message].push(listener);
			},
			push: function(uid, message, data) {
				if (me.clients[uid]) {
					me.clients[uid].emit('push', {channel: name, message: message, data: data});
				}
			}
		}
	}
	return me.channels[name];
}

Sockets.prototype.getChannel = function(name) {	
	return this.channels[name];
}

Sockets.prototype._onConnect = function(client) {
	var me = this;
	if (client.request.session) {

		/***/ logger.info('sockets: client connected', client.request.session.uid);
		if (me.clients[client.request.session.uid]) {

			/***/ logger.info('sockets: disconnect previous connection', client.request.session.uid);
			me.clients[client.request.session.uid].disconnect();			
			setTimeout(function() {
				me._onConnect(client);
			},0);
			return;
		}

		me.clients[client.request.session.uid] = client;

		client.on('push', function(data, callback) {
			me._onPush(client, data, callback);
		});

		client.on('disconnect', function() {
			me._onDisconnect(client);
		});
	} else {
		client.emit('push', {channel: 'error', message: 'error', data: {msg: 'Not authorized request'}});
		client.disconnect();
	}
}

Sockets.prototype._onPush = function(client, data, callback) {
	var me = this;

	callback = callback || function() {};

	/***/ logger.info('sockets: Connection push', data);
	if (me.channels[data.channel]) {
		if (me.channels[data.channel].listeners[data.message]) {
			me.channels[data.channel].listeners[data.message].forEach(function(listener) {
				listener(client.request.session.uid, data.data, callback);
			});
		} else {
			/***/ logger.warn('sockets: Channel listener for message "' + data.message + '" not found');	
			me.errorChannel.push(client.request.session.uid, "error", {msg: "Unknown command"});
		}
	} else {
		/***/ logger.warn('sockets: Channel "' + data.channel + '" not found');
		me.errorChannel.push(client.request.session.uid, "error", {msg: "Channel not found"});
	}
}

Sockets.prototype._onDisconnect = function(client) {
	var me = this;
	
	/***/ logger.info('sockets: Client disconnected ', client.request.session.uid);
	me.clients[client.request.session.uid] = undefined;	
}

// Создает только один экземпляр класса
Sockets.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Sockets();
    }
    return this.instance;
}

module.exports = Sockets.getInstance();

require(SERVICES_PATH + '/shop/shop');