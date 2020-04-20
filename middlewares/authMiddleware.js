const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		// Set token  from Bearer token in header
		token = req.headers.authorization.split(' ')[1];
	}
	// else if (req.cookies.token) {
	// 	// Set token from Cookie
	// 	token = req.cookies.token;
	// }

	// Make sure token exists
	if (!token) {
		return next(new errorResponse('Not Authorized to access this route', 401));
	}

	try {
		// Verify Token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);

		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(new errorResponse('Not Authorized to access this route', 401));
	}
});

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new errorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
		}
		next();
	};
};
