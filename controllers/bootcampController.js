const path = require('path');
const geocoder = require('../utils/geocoder');
const BootCamp = require('../models/BootcampModel');
const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');

// @desc    Get All BootCamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
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
	// Add user to req.body

	req.body.user = req.user.id;

	// Check for published bootcamp
	const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });

	// If the user is not an admin, they can only add one bootcamp
	if (publishedBootcamp && req.user.role !== 'admin') {
		return next(new errorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
	}

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
	let bootcamp = await BootCamp.findById(req.params.id);
	if (!bootcamp) {
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new errorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
	}
	bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		message: `Updated bootcamps ${req.params.id}`,
		data: bootcamp
	});
});

// @desc    Delete BootCamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findById(req.params.id);
	if (!bootcamp) {
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new errorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
	}

	bootcamp.remove();
	res.status(200).json({
		success: true,
		message: `Delete bootcamp with ID: ${req.params.id}`,
		data: null
	});
});

// @desc    Get BootCamp within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calculate radius using radians
	// Divide distance by radius of Earth
	// Earth Radius  = 3963 miles / 6378 kilometer
	const radius = distance / 3963;

	const bootcamps = await BootCamp.find({
		location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
	});
	res.status(200).json({
		success: true,
		results: bootcamps.length,
		data: {
			bootcamps: bootcamps
		}
	});
});

// @desc   Upload Photo For BootCamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findById(req.params.id);
	if (!bootcamp) {
		return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new errorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
	}
	if (!req.files) {
		return next(new errorResponse(`Please Upload a File`, 400));
	}
	let file = req.files.file;

	//Make sure the image is photo
	if (!file.mimetype.startsWith('image')) {
		return next(new errorResponse(`Please Upload an image file`, 400));
	}
	// Check File Size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(new errorResponse(`Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
	}

	// Create custom file name
	const extension = file.name.split('.').pop();
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
	// file.name = `photo_${bootcamp._id}.${extension}`;
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new errorResponse(`Problem with file upload`, 500));
		}
		await BootCamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name
		});
	});
});
