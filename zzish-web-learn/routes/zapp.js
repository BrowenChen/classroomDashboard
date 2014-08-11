var config = require('./config');
var Zzish = require('zzish/main.js');
var crypto = require('crypto');

z = new Zzish();
z.init();


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *														
													Registration
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

exports.adultRegPage = function(req, res){
	//Dummy Config File
	var appConfig = {
		target: 'primary',
		font: '',
		color: '',
		logo: ['url1', 'url2', 'url3']
	};
	res.render('zapp/adultReg', {appconfig: appConfig, ajaxUrl:config.ajaxUrl});
};

exports.adultRegPost = function(req, res){
	console.log('Register User - zapp');

	var pass = crypto.createHash('md5').update(req.body.password).digest('hex');

	var data = {
		name: req.body.name,
		email: req.body.email,
		password: pass,

		avatar: 'monkey',
		childCode: req.body.childCode,

		student: true,
		verified: true
	};

	data.verifyCode = makeVerifyCode();

	//Log users data
	console.log(data);

	z.users.create(data, function(err, result) {
		console.log(result);

		if(!err){
			if(result._status == 200){
				//set sesions
				req.session.userId = result.id;
				req.session.logged = true;

				console.log("created user -> " + JSON.stringify(result));
				
				//TODO WITH AWS SEND EMAIL
				//TODO IF HAS CHILD CODE ADD
				
				console.log('1' + result.email + '2' + req.params.role + '3' + data.verifyCode + '4' + result.code);

				res.redirect('/zapp/adult/register/success')
			}
		} else {
			res.redirect('/zapp/fail')
		}	
	});
};

exports.primaryRegPage = function(req, res){
	//Dummy Config File
	var appConfig = {
		target: 'primary',
		font: '',
		color: '',
		logo: ['url1', 'url2', 'url3']
	};
	res.render('zapp/primaryReg', {appconfig: appConfig, ajaxUrl:config.ajaxUrl});
};

exports.primaryRegPost = function(req, res){
   	console.log('Register User Primary - zapp');
	var classroomId = req.body.classroomId;

	var datachild = {
		name: req.body.name,
		passwordText: req.body.password,
		avatar: 'monkey',

		student: true,
		verified: true
	};

	data.verifyCode = makeVerifyCode();

	//Log users data
	console.log(data);

	var pass = crypto.createHash('md5').update(req.body.parentEmail).digest('hex');

	z.users.auth(req.body.parentEmail, function(err, results){
		if(results._status == 200){
			//add child to class
			z.users.createChild(results.id, datachild, function(err, res){
				//child added and created
				console.log('child added to ' + results.name);
				res.redirect('/zapp/primary/register/success');
			});
		}
	});	
};




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *														
													LOGIN	
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

exports.adultLoginPage = function(req, res){
	//Dummy Config File
	var appConfig = {
		target: 'primary',
		font: '',
		color: '',
		logo: ['url1', 'url2', 'url3']
	};
	res.render('zapp/adultLogin', {appconfig: appConfig, ajaxUrl:config.ajaxUrl});
};

exports.adultLoginPost = function(req, res){
	console.log('adult Login');

	//Do login
	var email = req.body.email;
	var password = crypto.createHash('md5').update(req.body.password).digest('hex');

	z.users.auth(email, password, false, false ,function(result) {
		console.log('status' + result._status);
		status = result._status.toString();

		//user exists and correct pass + username
		if(status == '200'){
			//user exists and pass is right
			req.session.userId = result.id;
			req.session.logged = true;
			req.session.user = result;

			console.log('console' + result.verified);
			if(result.verified) { 
				res.redirect('/zapp/adult/login/success');
			} else {
				console.log('user exists but still needs to verifyCode');
				res.redirect('/zapp/adult/login?status=verify'); 
			} 
		}
		//invalid user name or password
		else {
			console.log('invalid user');
			res.redirect('/zapp/adult/login?status=404');
		}
	});
}

exports.primaryLoginPage = function(req, res){
	//Dummy Config File
	var appConfig = {
		target: 'primary',
		font: '',
		color: '',
		logo: ['url1', 'url2', 'url3']
	};
	res.render('zapp/primaryLogin', {appconfig: appConfig, ajaxUrl:config.ajaxUrl});
};

exports.primaryLoginPost = function(req, res){
	console.log('primary Login');

	//Do login
	var email = req.body.email;
	var password = crypto.createHash('md5').update(req.body.password).digest('hex');

	z.users.auth(email, password, false, false ,function(result) {
		console.log('status' + result._status);
		status = result._status.toString();

		//user exists and correct pass + username
		if(status == '200'){
			//user exists and pass is right
			req.session.userId = result.id;
			req.session.logged = true;
			req.session.user = result;


			console.log('console' + result.verified);
			if(result.verified) { 
				//Check if teacher and has classrooms/groups
				if(result.groups.length > 0){
					//Present option of log in as self or classroom
					console.log('has classrooms')
					res.render('zapp/selectClass', {classrooms: result.groups});
				} else {
					res.redirect('/zapp/primary/login/success');
				}
			} else {
				//user Exists but not Verified
				console.log('user exists but still needs to verifyCode');

				//TODO SEND EMAIL AGAIN
				res.redirect('/zapp/primary/login?status=verify'); 
			} 
		}
		//invalid user name or password
		else {
			console.log('invalid user');
			res.redirect('/zapp/primary/login?status=404');
		}
	});
}

exports.selectStudent = function(req, res) {
	var classId = req.params.id;

	z.users.getGroup(classId, function(err, result){
		console.log(result);
		res.render('zapp/selectStudent', {members: result.members})
	});
}

exports.selectClassByPin = function(req, res) {
	var pin = req.body.classpin;

	z.users.getGroupByPin(pin, function(err, result){
		console.log(result);
		res.render('zapp/selectStudent', {members: result.members})
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *														
													AUTHENTICATION	
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

exports.fail = function(req, res){
	res.send('404');
}

exports.mobileAuth = function(req, res){		
	var token = req.params.token;
	console.log('token: ' + token);
	req.session.appToken = token;

	//API token check

	if(token != '123' ){
		z.users.tokenAuth(token ,function(result) {
			if(result._status == 200){
				res.render('zapp/adult/register');
				//TODO
				//if primary res.render('zapp/primaryLogin');
			} else {
				res.redirect('zpp/fail');
			}
		});
	}

	res.render('/zapp/adult/register');
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *														
													Helper Functions	
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

exports.parentCheck = function(req, res){
	
	console.log('check if parents exists: ' + req.body.parentEmail);

	// z.users.checkUserByEmail(req.body.email, function(err, results){
	// 	console.log(JSON.stringify(results));
	// 	// user does not exist
	// 	if(results._status == 404) {res.send(true);}
	// 	else { res.send(false); }  
	// });	

	res.send(true);
}

exports.checkValidEmail = function(req, res){
	console.log('check if email exists: ' + req.body.email);

	// z.users.checkUserByEmail(req.body.email, function(err, results){
	// 	console.log(JSON.stringify(results));
	// 	// user does not exist
	// 	if(results._status == 404) {res.send(true);}
	// 	else { res.send(false); }  
	// });	

	res.send(false);
}

function makeVerifyCode()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}