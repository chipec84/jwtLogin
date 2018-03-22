const jwt = require('jwt-simple');
const User = require ('../models/user');
const config = require('../config');

//as a convention the payload has the key name 'sub' for subject
//always use userID from DB as it never changes
function tokenForUser(user){
	const timeStamp = new Date().getTime();
	const expires = 30 * 24 * 60 * 60 * 1000 //ms
	console.log(expires);
	return jwt.encode({ sub: user.id, iat: timeStamp, exp: expires }, config.secret);
}

exports.signin = function(req, res, next) {
	res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password

	if(!email || !password) {
		return res.status(422).send({ error: 'you must provide email and passord'})
	}

	//check if user exist
	User.findOne({ email: email }, function(err,existingUser){
		if(err){ return next(err); }
	//user already exist, return error
		if(existingUser) {
			return res.status(422).send({ error: 'Email already exist'});
		}
	//user does not exist, create and save record
	const user = new User({
		email: email,
		password: password
	});

	user.save(function(err){
		if(err) { return next(err); }
		res.json({ token: tokenForUser(user)}); //send back the token to the user
	});

	});
	//respond user was requested
}