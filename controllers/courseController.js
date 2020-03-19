const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');
const Course = require('../models/CourseModel');
const Bootcamp = require('../models/BootcampModel');

// @desc    Get All Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampID/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampID) {
		// query = Course.findById(req.params.bootcampID);
		query = Course.find({ bootcamp: req.params.bootcampID });
	} else {
		query = Course.find().populate({
			path: 'bootcamp',
			select: 'name description'
		});
	}
	const courses = await query;
	res.status(200).json({
		success: true,
		message: 'List all Courses/ List Course by BootCamp ID',
		results: courses.length,
		data: {
			courses
		}
	});
});

// @desc    Get A Single Courses
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description'
	});
	if (!course) {
		return next(new errorResponse(`Course not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		success: true,
		message: 'List A Single Course by ID',
		data: {
			course: course
		}
	});
});

// @desc    Add a  Courses
// @route   POST /api/v1/bootcamps/:bootcampID/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampID;
	const bootcamp = await Bootcamp.findById(req.params.bootcampID);
	if (!bootcamp) {
		return next(new errorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
	}
	const course = await Course.create(req.body);
	res.status(201).json({
		success: true,
		message: 'Successfully Created The Course',
		data: {
			course: course
		}
	});
});

// @desc    Update a  Course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let updateCourse = await Course.findById(req.params.id);

	if (!updateCourse) {
		return next(new errorResponse(`Course not found with id of ${req.params.id}`, 404));
	}
	updateCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		message: 'Successfully updated The Course',
		data: {
			course: updateCourse
		}
	});
});

// @desc    Delete a  Course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	// Getting Data from the req.
	const deleteCourse = await Course.findById(req.params.id);

	if (!deleteCourse) {
		return next(new errorResponse(`Course not found with id of ${req.params.id}`, 404));
	}
	await deleteCourse.remove();
	res.status(200).json({
		success: true,
		message: 'Successfully Deleted The Course',
		data: null
	});
});
