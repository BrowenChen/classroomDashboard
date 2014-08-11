var config = require('../routes/config');

var crypto = require('crypto');
var Zzish = require('zzish/main.js');
var passwordHash = require('password-hash');

var z = new Zzish();
z.init();

exports.registerPage = function(req, res){ 

	var email = req.body.email;
	
	console.log(email);

	if(email == null) email = "";


	res.render('hub/register', {email:email, ajaxUrl:config.ajaxUrl}); 
};

/* * * * * * * Zzish User Auth / Reg/ and Login * * * * * * */

exports.register = function(req, res){
	console.log('Register User - DeveloperAccount');

	var pass = crypto.createHash('md5').update(req.body.password).digest('hex');

	var data = {
		name: req.body.name,

		//should be in UNIX format
		dob: req.body.dob, 

		email: req.body.email,
		password: pass,

		company: req.body.company,
		phone: req.body.phone,

		avatar: 'monkey',

		teacher: true,
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
				
				//TODO WITH AWS
				
				console.log('1' + result.email + '2' + req.params.role + '3' + data.verifyCode + '4' + result.code);

				res.send(true);
			}
		} else {
			res.send(false);
		}	
	});
}

exports.logout = function(req, res){
	req.session.userId = null;
	req.session.logged = false;
	req.session.user = null;

	res.redirect('/login');
}

exports.login = function(req, res){
	//variables used
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

				req.session.verified = true;
				res.redirect('/dashboard');
			
			} else {
				console.log('user exists but still needs to verifyCode');
				res.redirect('/login?status=verify'); 
			} 
		}
		//invalid user name or password
		else {
			console.log('invalid user');
			res.redirect('/login?status=404');
		}
	});
}

exports.auth = function (req, res, next) {
	console.log('- - - CHECKING AUTHORIZATION - - - ')

	var auth = req.session.logged;
	var ver = req.session.verified;

	console.log('ver: ' + ver);

	if(!auth) {
		console.log('i dont think ur suppose to be here - TODO send you back to the relevent login page');
		return res.redirect('/login?status=unauth');
	}
	if(!ver){
		console.log('account not verified yet');
		res.redirect('/login?status=verify');
	}

	next();
}

/* * * * * * * * * * * * * * * Helper Functions * * * * * * * * * * * * * * * */

//checks whether account has been verified
exports.checkActivation =  function(req, res) {
  	var userId = req.session.userId;
  	var role = req.params.role;

  	z.users.get(userId ,function(err, result) {
  		console.log("check activation" + result);

		if(result.developer){	
			req.session.verified = true;
			console.log('hasrole');
			res.redirect('/dashboard');
		} else {
			console.log('rolenotactive');
			res.redirect('/activate');
		}
	});
}

//check whether use is logged on
exports.verifyCode = function(req, res){
	var code = req.params.code;
	var role = req.params.role;

	z.users.getUserByVerifyCode(code, function(err, result){
		console.log(result);

		if(result._status == 200){
			console.log('verification true');
			//set sessions
			req.session.userId = result.id;
			req.session.logged = true;
			req.session.user = result;
			req.session.verified = true;

			res.render('/verify', {title: 'Account Activated', url: '/' + role + 's/dashboard', button: 'continue'});
		} else {
			res.render('/verify', {title: 'Unactivated Account', message: 'Incorrect Code', button: 'Back'});
		}
	});
}

exports.checkValidEmail = function(req, res){
	console.log('check if email exists: ' + req.body.email);

	z.users.checkUserByEmail(req.body.email, function(err, results){
		console.log(JSON.stringify(results));
		// user does not exist
		if(results._status == 200) {res.send(false);}
		else { res.send(true); }  
	});	

}

function makeVerifyCode()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sendActivationEmail(email, role, verifyCode, code){
	var transport = nodemailer.createTransport("Sendmail");

	var message = "Thank you for registering with Zzish, please follow this link to activate your account " + config.ajaxUrl + "/user/verify/" + verifyCode;

	if(code != null) {
		message = message + "\n Your code is: " + code;
	}

	var mailOptions = {
	    from: "admin@zzish.com",
	    to: email,
	    subject: "Zzish Activation",
	    text: message
	}

	transport.sendMail(mailOptions);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */