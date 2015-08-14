var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var winston = require('winston');
var fs = require('fs');
var join = require('path').join;
var config = require('./config');

var auth = require('./server/auth');
var getConfig = require('./server/get_config');

//============= Connect to mongodb ============

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db.url, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

//============= Create server ============

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(cookieParser());

//============= Session ============

var sessionMiddleware = session({
    secret: 'MHsession',
    saveUninitialized: true,
	resave: false,
    store: new MongoStore({
		mongooseConnection: mongoose.connection,
		autoReconnect: true,		
		collection: 'sessions',
		stringify: true,
		hash: false,
		ttl:  60 * 60 * 24 * 14, // 14 days
		autoRemove: 'native',
		autoRemoveInterval: 10,
    })
});

app.use(sessionMiddleware);

//============= Static ============

app.use(express.static(__dirname + '/client'));


//============= Template engine ============

var hbs = exphbs.create({
    defaultLayout: 'default',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// ============== ROUTES ================

app.get("/", function(req, res, next) {
	if (!req.session.uid) {
		res.redirect('/login');
	} else {
		getConfig
			.getConfig(req.session.uid)
			.then(function(config) {				
				app.locals.config = JSON.stringify(config);
				res.render('main', {layout: 'main'});
			});
	}
});
app.get("/login", function(req, res, next) {
	if (!req.session.uid) {
		res.render('login');
	} else {
		res.redirect('/');
	}
});
app.post('/login', function(req, res, next) {
	auth
		.auth(req.body.login, req.body.pass)
		.then(function(uid) {			
			if (uid) {
				req.session.uid = uid;
				res.redirect('/');
			} else {
				res.end('Пользователь не найден.');
			}
		}, function(err) {
			res.end('Ошибка авторизации.');
		});
});

var server = app.listen(config.port);

// ============ Socket IO =========

var sio = require("socket.io").listen(server);

sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

sio.sockets.on("connection", function(client) {
	if (client.request.session) {
		winston.info('session win!', client.request.session.uid);
	} else {
		winston.info('no session');
	}
});


// ============= Bootstrap models ==========

fs.readdirSync(join(__dirname, 'server/models')).forEach(function (file) {
  if (~file.indexOf('.js')) require(join(__dirname, 'server/models', file));
});

console.log('Node app started on port ' + config.port);