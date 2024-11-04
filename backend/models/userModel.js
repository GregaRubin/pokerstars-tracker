var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'imagePath' : String,
	'publicStats': Boolean,
	'hands': Number,
	'sessions': Number,
	'profit': Number,
	'call': Number,
	'raise': Number,
	'fold': Number,
	'bet': Number,
    'threeBet': Number,
	'showdown': Number,
    'wonShowdown': Number,
    'vpip': Number,
    'pfr': Number,
});


userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({username: username})
	.exec(function(err, user){
		if(err){
			return callback(err);
		} else if(!user) {
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		} 
		bcrypt.compare(password, user.password, function(err, result){
			if(result === true){
				return callback(null, user);
			} else{
				return callback(err);
			}
		});
	});
}

var User = mongoose.model('user', userSchema);
module.exports = User;