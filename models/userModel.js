const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please add a name' ]
	},
	email: {
		type: String,
		required: [ true, 'Please add an email' ],
		unique: true,
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
	},
	role: {
		type: String,
		enum: [ 'user', 'publisher' ],
		default: 'user'
	},
	password: {
		type: String,
		required: [ true, 'Please add a password' ],
		minlength: [ 6, 'Password should be atleast 6 characters long' ],
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Saving Email always in lowercase
UserSchema.pre('save', async function(next) {
	
	this.email = this.email.toLowerCase();
	next();
});

// Encrypt password using bcrpyt
UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrpyt.genSalt(10);
	this.password = await bcrpyt.hash(this.password, salt);
	next();
});

//  https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
	return await bcrpyt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
	//Generate Token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
