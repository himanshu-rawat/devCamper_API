const Course = require('../models/CourseModel');
const advancedResults = require('../middlewares/advancedResults');
const courseController = require('../controllers/courseController');
const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middlewares/authMiddleware');

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description'
		}),
		courseController.getCourses
	)
	.post(protect, authorize('publisher', 'admin'), courseController.addCourse);
router
	.route('/:id')
	.get(courseController.getCourse)
	.put(protect, authorize('publisher', 'admin'), courseController.updateCourse)
	.delete(protect, authorize('publisher', 'admin'), courseController.deleteCourse);
module.exports = router;
