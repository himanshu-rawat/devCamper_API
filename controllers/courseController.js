const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');
const Course = require('../models/CourseModel');
const Bootcamp = require('../models/BootcampModel');

// @desc    Get All Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampID/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampID) {
		// query = Course.findById(req.params.bootcampID);
		const courses = await Course.find({ bootcamp: req.params.bootcampID });
		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
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
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(req.params.bootcampID);
	if (!bootcamp) {
		return next(new errorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new errorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401)
		);
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
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(new errorResponse(`Course not found with id of ${req.params.id}`, 404));
	}

	// Make sure user is course owner
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new errorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 401));
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		message: 'Successfully updated The Course',
		data: course
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
	// Make sure user is course owner
	if (deleteCourse.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new errorResponse(`User ${req.user.id} is not authorized to delete course ${deleteCourse._id}`, 401)
		);
	}
	await deleteCourse.remove();
	res.status(200).json({
		success: true,
		message: 'Successfully Deleted The Course',
		data: null
	});
});
