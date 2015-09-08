/**
 * Модуль магазина
 */
var sockets = require(SERVICES_PATH + '/sockets');

var shopChannel = sockets.createChannel('shop');
shopChannel.on('buy', function(uid, params, callback) {
	console.log(uid);
	console.log(params.item);
	callback("ok");
});

module.exports = {
	//
}