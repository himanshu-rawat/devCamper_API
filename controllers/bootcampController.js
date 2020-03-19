const geocoder = require('../utils/geocoder');
const BootCamp = require('../models/BootcampModel');
const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');

// @desc    Get All BootCamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
	let query;
	// Copy Req.query
	const reqQuery = { ...req.query };

	//Fields to exclude
	const removeFields = [ 'select', 'sort', 'limit', 'page' ];

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);
	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// Create operators (gt,gte and etc)
	queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);
	console.log('queryStr after adding $ :', queryStr);

	// Finding Resource
	query = BootCamp.find(JSON.parse(queryStr)).populate('courses');

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}
	// Sort Fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// Pagination Fiels
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 25; //25 Per Page
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await BootCamp.countDocuments();
	query = query.skip(startIndex).limit(limit);

	// Executing Query
	const allBootcamps = await query;

	// Pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}

	res.status(200).json({
		success: true,
		message: 'List all bootcamps',
		results: allBootcamps.length,
		pagination: pagination,
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
	const bootcamp = await BootCamp.findById(req.params.id);
	if (!bootcamp) {
		return next(new errorResponse(`BootCamp not found with id of ${req.params.id}`, 404));
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
