var config = require('../routes/config');

var crypto = require('crypto');
var Zzish = require('zzish/main.js');
var passwordHash = require('password-hash');

var clients = [];
var http = require('http');

exports.test = function(req, res){

	var classid = '53e24c723004c5a2a80b03b3';
	var data = ['eqewrqwe', 'ewrqewrqwerqw', 'qwerqwerq', 'werqewrqewr', 'qwerqwerqew'];

	z.users.dashboardInit(classid, function(err, result) {
		res.send(200);
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

																	Classroom / Group Calls		

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 


exports.createClassView = function(req, res){ 
	res.render('hub/createClass', {ajaxUrl:config.ajaxUrl});
};

exports.createClass = function(req, res){ 

	var userId = req.session.userId;


	var classroom = {
		name : req.body.name,
		year: req.body.year

	}
	
	var joinByCode = false;

	console.log('rescode' + req.body.joinByCode);
	if(req.body.joinByCode == 'true') { 
		classroom.joinByCode = true; 
	}

	console.log(classroom);

	z.users.createGroup(userId, classroom, function(err, result) {
		if(!err){
			console.log(JSON.stringify(result));
			res.redirect('/dashboard')
		} else {
			console.log('ERR - could not create classroom');
		}
	});

};


exports.viewClass = function(req, res){ 
	var id = req.params.id;

	z.users.getGroup(id, function(err, result) {
		if(result._status == 200){
			console.log(result);
			res.render('hub/viewClass', {classroom: result, ajaxUrl:config.ajaxUrl});
		}
	});
};

exports.settingsClass = function(req, res){ 
	var id = req.params.id;

	z.users.getGroup(id, function(err, result) {
		if(result._status == 200){
			res.render('hub/classroomSettings', {classroom: result});
		}
	});
};

exports.addStudentByCode = function(req, res){ 
	var classroomId = req.body.classroomId;
	var code = req.body.code;

	z.users.addMemberToGroupByCode(classroomId, code, function(err, result){
		console.log('status response' + result._status);

		switch(result._status){
			case 200:
				res.send({url : '/classroom/' + classroomId + "/view?message=useradded", res: '200'});
				break;
			case 304:
				res.send({url : '/classroom/' + classroomId + "/view?message=userexists", res: '304'});
				break;
			case 404:
				res.send({url : '/404'});
		}
	})
};

exports.addNewStudent = function(req, res){ 
	console.log('request body' + JSON.stringify(req.body));

	var classroomId = req.body.classroomId;
	var password = Math.floor((Math.random() * 9999) + 1);

	if(req.body.randomPass){
		password = crypto.createHash('md5').update(req.body.password).digest('hex');
	} 

	var username = req.body.name + Math.floor((Math.random() * 9999) + 1);

	data = {
		avatar: 'jaguar',
		password: password,
		firstname: req.body.name,
		email: username,
		child: true
		
	}

	z.users.createNewUserToGroup(classroomId, data, function(err, result){

		console.log('status response' + result);

		switch(result._status){
			case 200:
				res.send({url : '/classroom/' + classroomId + "/view?message=useradded", res: '200'});
				break;
			case 304:
				res.send({url : '/classroom/' + classroomId + "/view?message=userexists", res: '304'});
				break;
			case 404:
				res.send({url : '/404'});
		}
	})
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

																	CLASSROOM ==> APPS		

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 


exports.addApp = function(req, res){ 
	var classId = req.params.id;

	z.users.getAllLiveApps(function(err, result){
		res.render('hub/addApp', {ajaxUrl:config.ajaxUrl, apps: result, classId: classId});
	});

	
};

exports.addAppPost = function(req, res){
	var appId = req.body.appid;
	var classId = req.body.classId;

	//addAppToClassUsers.prototype.addAppToClass = function(id, appId, data, callback) {

	z.users.addAppToClass(classId, appId, function(err, result) {
		if(result._status == 200){
			res.send(200);
		}
		res.send(200);
	});

}

exports.addAssignmentToGroup = function(req, res){
	var classid = req.body.classid;
	var activityid = req.body.activityid;

	console.log(classid + activityid);

	z.users.addActivityToGroup(classid, activityid, function(err, r){
		console.log(r);
		res.send(200);
	});
}


//- - - -

exports.dashboard = function(req, res){ 
	var userId = req.session.userId;
	console.log(userId);

	z.users.get(userId, function(err, r){
		console.log("get User returned", r);

		if(r.groups != null){
			res.render('hub/dashboard', {teacher: r, classrooms : r.groups});
		}
		else {
			res.render('hub/dashboard', {teacher: r, classrooms : []});
		}
	});
};

exports.appDashboard = function(req, res){
	var id = req.params.id;
	console.log(id);

	z.users.getGroup(id, function(err, result) {
		if(result._status == 200){
			console.log(result);
			res.render('hub/displayApps', {classroom: result, ajaxUrl:config.ajaxUrl});
		}
	});
};


exports.activitiesDashboard = function(req, res){ 
	res.render('hub/displayAssignment');
};


exports.liveDashboard = function(req, res){ 
	res.render('hub/liveDashboard');
};

exports.tempLiveDashboard = function(req, res){
	res.render('hub/testingDashboard');
};

//Displays list of assignements and allows you to add them
exports.assignmentsDisplay = function(req, res){
	var classId = req.params.id;

	z.users.getActivityByGroupId(classId, function(err, resultActivities){
		console.log('resultActivities - ' + resultActivities);
		
		z.users.getAllLiveApps(function(err, result){
			console.log('apps' + result);
			res.render('hub/assignment', {ajaxUrl:config.ajaxUrl, apps: result, classroomid: classId, activities: resultActivities});
		});
	});
};

//gets lists of assigments associated with app
exports.getAssignments = function(req, res){ 
	var appid = req.body.appId;

	var data = ['eqewrqwe', 'ewrqewrqwerqw', 'qwerqwerq', 'werqewrqewr', 'qwerqwerqew'];

	z.users.addActivity(appid, data, function(err, result) {

		z.users.getActivityByAppId(appid ,function(err, result){
			res.send(result);
		});
	});
}

//- - - -

exports.loginPage = function(req, res){ 
	res.render('hub/login');
};

exports.registerPage = function(req, res){ 
	res.render('hub/register');
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

																	Game

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

exports.game = function(req, res){
	var classroomId = req.params.classroomId;

	var studentId = req.body.studentId;
	var field = req.body.field;

	console.log(classroomId + studentId + field);

	res.send(classroomId);
}

exports.onConnect = function(socket) {
	//local variables
	var clientData = {};
    
	//when sent a socket request
	socket.on('send', function(data){
		console.log('copycopy');
		socket.emit('send', { message: 'waddup Homie'});
	});

	socket.emit('news', { hello: 'world' });

	//Client connects
	socket.on('my other event', function (data) {
		console.log('received data from socket - ' + JSON.stringify(data));

	    var clientData = {
			socket: socket,
			classroomId: data.classroom
		}

		clients.push(clientData);

		// //register client to API
		// var post_options = {
		// 	host: config.apiUrl,
		// 	port: config.apiPort,
		// 	path: '/platform-api/api/secure/groups/' + data.classroom + '/notify',
		// 	method: 'POST',
		// 	headers: {
		// 	  'Content-Type': 'application/json'
		// 	},
			
		// };

		// var post_req = http.request(post_options, function(res) {

		// 	res.setEncoding('utf8');

		// 	res.on('data', function (chunk) {
		// 		console.log('Response: ' + chunk);
		// 	});
		// });

		// // post the data
		// post_req.write(config.callbackUrl);
		// post_req.end();
   	});

	//when disconnect remove from clients
	socket.on('disconnect', function() {
		//get the indext of the socket
        //var index = clients.indexOf(socket);
        var index;
        var len = clients.length;

        for(var i = 0; i < len; i++) {
		    if (clients[i].socket.id == socket.id) {
		        index = i;
		        break;
		    }
		}

		var classroomId =  clients[index].classroomId

		//removing Client
        if (index != -1) {
        	console.info('Client gone (id=' + socket.id + '). classroomId: ' + classroomId);
			clients.splice(index, 1);
			
        }

  //       //unsubscribe
		// var post_options = {
		// 	host: config.apiUrl,
		// 	port: config.apiPort,
		// 	path: '/platform-api/api/secure/groups/' + classroomId + '/stopNotify',
		// 	method: 'POST',
		// 	headers: {
		// 	  'Content-Type': 'application/json',
		// 	  'Content-Length': 0
		// 	}
		// };

		// var post_req = http.request(post_options, function(res) {

		// 	res.setEncoding('utf8');

		// 	res.on('data', function (chunk) {
		// 		console.log('Response: ' + chunk);
		// 	});
		// });

		// // post the data
		// post_req.write('');
		// post_req.end();
    });


}

exports.onChange = function (req, res){
	//tell console wag1
	console.log('Message from API - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	console.log('body' + JSON.stringify(req.body));

	//GetClassroomId
	var index;
	var len = clients.length;
	var classroomId = req.params.classroomId;

	for(var i = 0; i < len; i++) {
		if (clients[i].classroomId == classroomId) {
				index = i;
				break;
		}
	}

	//generate data body
	var data = {
		classroomId: classroomId,
		studentId: req.body.ownerId,
		

		// average: req.body.average,
		// currentQ: req.body.currentQ,
		// numberRight: req.body.numberRight,
		// numberWrong: req.body.numberWrong
		//html: req.body.html
	}

	console.log('data to send' + JSON.stringify(data));
	
	var socket = clients[index].socket;
	console.log(socket.id);
	socket.emit('send', data);

	res.send(200);
}
   

exports.liveDashboard = function(req, res){
	var classroomId = req.params.id;

	z.users.getGroup(classroomId, function(err, result) {
			res.render('hub/liveDashboard', {classroom: result});
	});
}
