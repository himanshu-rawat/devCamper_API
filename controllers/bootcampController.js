const BootCamp = require('../models/BootcampModel');
const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');
// @desc    Get All BootCamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
	const allBootcamps = await BootCamp.find();
	res.status(200).json({
		success: true,
		message: 'List all bootcamps',
		results: allBootcamps.length,
		data: {
			bootcamp: allBootcamps
		}
	});
});

// @desc    Get a Single BootCamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
	//  req.params.id - to get the value of id
	const bootcamp = await BootCamp.findById(req.params.id);
	if (!bootcamp) {
		// We have to return because we cannot send more than two res.status or res.json().
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		message: `Display a single bootcamps ${req.params.id}`,
		data: {
			bootcamp: bootcamp
		}
	});
});

// @desc    Create a new BootCamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
	const newBootcamp = await BootCamp.create(req.body);
	res.status(201).json({
		success: true,
		message: 'Successfully Created New Bootcamp',
		data: {
			bootcamp: newBootcamp
		}
	});
});

// @desc    Update BootCamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
	//  req.params.id - to get the value of id
	const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	if (!bootcamp) {
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		message: `Updated bootcamps ${req.params.id}`,
		data: {
			bootcamp: bootcamp
		}
	});
});

// @desc    Delete BootCamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		message: `Delete bootcamp with ID: ${req.params.id}`,
		data: null
	});
});
