

/**
 * Module dependencies.
 * This is a collaboration test. 
 */
// See http://package.json.nodejitsu.com/

var express = require('express'),

	zapp = require('./routes/zapp'),
	user = require('./routes/user'),
	hub = require('./routes/hub'),
	config = require('./routes/config'),
	zzishConfig = require('zzish/config.js'),

	path = require('path'),
	sass = require('node-sass')

var app = express();
var http = require('http');

// App configuration for ALL environments:
app.configure(function(){
	app.set('title', "My App");
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));		// global logging
	app.use(express.bodyParser());		// extracts request variables nicely
	app.use(express.methodOverride());	// Faux HTTP method support (put,delete)
	app.use(express.cookieParser('long random string'));	// -> req.cookies
	app.use(express.session());			// Session support
	app.use(app.router);

	// SASS templating. debug: false, to turn off read/render etc logging
	app.use(sass.middleware({src: __dirname + '/public', debug: true}));

	// Static file server:
	app.use(express.static(path.join(__dirname, 'public')));
});

// Development env (default) config:
app.configure('development', function(){
	console.log(' - - - DEVELOPEMENT ON LOCALHOST ENV - - -');
	config.ajaxUrl = "http://localhost:3000";
	//zzishConfig.baseUrl = 'http://dev.zzish.com/api';
	
	//James ip
	zzishConfig.baseUrl = 'http://10.2.199.18:9080/platform-api/api'
	zzishConfig.callbackUrl = "http://dev.web.zzish.com";

	config.apiUrl = "10.2.198.229";
	config.apiPort = "8080";

	app.set('port', process.env.PORT || 3000);
});

app.get('/test', hub.test);

//Web pages
app.get('/login', hub.loginPage);
app.post('/register', user.registerPage);
app.get('/register', user.registerPage);
app.post('/login', user.login);

app.post('/users/emailcheck', user.checkValidEmail);
app.post('/users/register', user.register)



//learning Hub Routing
app.get('/dashboard', hub.dashboard);
app.get('/dashboard/:id', hub.appDashboard);
app.get('/dashboard/:appId/:activities', hub.activitiesDashboard);
app.get('/:classroom/live', hub.liveDashboard);
app.get('/liveDash', hub.tempLiveDashboard);

app.get('/classroom/create', hub.createClassView);
app.post('/classroom/create', hub.createClass);
app.post('/classroom/addstudentbycode', hub.addStudentByCode)
app.post('/classroom/addnewstudent', hub.addNewStudent)

app.get('/classroom/:id/view', hub.viewClass);
app.get('/classroom/:id/settings', hub.settingsClass);
app.get('/classroom/:id/assignments', hub.assignmentsDisplay);

app.post('/assignments/list', hub.getAssignments);
app.post('/assignments/add', hub.addAssignmentToGroup);

app.get('/classroom/:id/app/add', hub.addApp);

app.post('/apps/add', hub.addAppPost);

//live dashboard
var io = require('socket.io').listen(3456);
io.sockets.on('connection', hub.onConnect);

app.get('/classroom/:id/live', hub.liveDashboard); 
app.post('/game/:classroomId', hub.game);
app.post('/api/classroom/:classroomId', hub.onChange);

//zzishapp Routing
app.get('/zapp/auth/:token', zapp.mobileAuth);

app.get('/zapp/adult/login', zapp.adultLoginPage);
app.get('/zapp/primary/login', zapp.primaryLoginPage);
app.post('/zapp/adult/login', zapp.adultLoginPost);
app.post('/zapp/primary/login', zapp.primaryLoginPost);
app.get('/zapp/primary/login/classroom/:id', zapp.selectStudent);

app.get('/zapp/adult/register', zapp.adultRegPage);
app.get('/zapp/primary/register', zapp.primaryRegPage);
app.post('/zapp/adult/register', zapp.adultRegPost);
app.post('/zapp/primary/register', zapp.primaryRegPost);

app.get('/zapp/fail', zapp.fail);
app.post('/zapp/emailcheck', zapp.checkValidEmail);
app.post('/zapp/parentcheck', zapp.parentCheck);

// app.get('/app/groups/verifytoken/:groupId', user.tokenUpdate);
// app.get('/app/register/verifycode', user.verifycodepage);
// app.post('/app/verify/code', user.verifycode);
// app.post('/app/verify', user.verifyuser);


app.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
