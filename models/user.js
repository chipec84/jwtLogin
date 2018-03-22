const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt-nodejs');

//define model
const userSchema = new Schema({
 email: { type: String, unique: true, lowercase: true },
 password: String
});

//on save encrypt password
//before saving model do this with .pre
userSchema.pre('save', function(next) {
	//get access to userSchema model with this
	const user = this;
	//generate salt
	bcrypt.genSalt(10,function(err, salt){
		if(err) {return next(err);}
		//hash encrypt password with salt
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) {return next(err);}
			//overwrite  plain text with encrypted password
			user.password = hash;
			next();
		});
	});
});

//method to encrypt entered password and compare to db saved password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) { return callback(err); }

		callback(null, isMatch);
	});
}

//create model class
const modelClass = mongoose.model('users', userSchema);

//export model
module.exports = modelClass;