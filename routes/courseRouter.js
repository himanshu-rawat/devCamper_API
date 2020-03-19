const courseController = require('../controllers/courseController');
const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(courseController.getCourses).post(courseController.addCourse);
router
	.route('/:id')
	.get(courseController.getCourse)
	.put(courseController.updateCourse)
	.delete(courseController.deleteCourse);
module.exports = router;
