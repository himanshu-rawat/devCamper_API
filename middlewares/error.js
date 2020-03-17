const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	// Log To Console  for Dev
	console.log(err); //err
	// Mongoose bad ObjectID
	if (err.name === 'CastError') {
		//err
		const message = `Resource not found with id of ${err.value}`;
		error = new ErrorResponse(message, 404);
	}
	// Mongoose duplicate key
	if (err.code === 11000) {
		const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
		const message = `Duplicate Field Value: ${value}. Enter Another value`;
		error = new ErrorResponse(message, 400);
	}
	// Mongoose Validation Error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		message: error.message || 'Server Error'
	});
};

module.exports = errorHandler;
