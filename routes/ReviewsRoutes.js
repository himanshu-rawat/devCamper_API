const Review = require('../models/ReviewsModel');
const reviewsController = require('../controllers/ReviewsController');

const express = require('express');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/authMiddleware');

router
	.route('/')
	.get(
		advancedResults(Review, {
			path: 'bootcamp',
			select: 'name description'
		}),
		reviewsController.getReviews
	)
	.post(protect, authorize('user', 'admin'), reviewsController.addReview);

router
	.route('/:id')
	.get(reviewsController.getReview)
	.put(protect, authorize('user', 'admin'), reviewsController.updateReview)
	.delete(protect, authorize('user', 'admin'), reviewsController.deleteReview);

module.exports = router;
