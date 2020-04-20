const bootcampController = require('../controllers/bootcampController');

const BootCamp = require('../models/BootcampModel');
const advancedResults = require('../middlewares/advancedResults');

const expres = require('express');

// Include Other Resources Routers
const courseRouter = require('./courseRouter');
const reviewsRouter = require('./ReviewsRoutes');

const router = expres.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

// Re-route into other resource routers
router.use('/:bootcampID/courses', courseRouter);
router.use('/:bootcampID/reviews', reviewsRouter);

// Show All BootCamps and Create New BootCamp
router
	.route('/')
	.get(advancedResults(BootCamp, 'courses'), bootcampController.getBootCamps)
	.post(protect, authorize('publisher', 'admin'), bootcampController.createBootCamp);

// Show Single BootCamp, Update a BootCamp, Delete a BootCamp
router
	.route('/:id')
	.get(bootcampController.getBootCamp)
	.put(protect, authorize('publisher', 'admin'), bootcampController.updateBootCamp)
	.delete(protect, authorize('publisher', 'admin'), bootcampController.deleteBootCamp);

// Bootcamp Photo Upload
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampController.bootcampPhotoUpload);
//  GET /api/v1/bootcamps/radius/:zipcode/:distance
router.route('/radius/:zipcode/:distance').get(bootcampController.getBootcampsInRadius);
module.exports = router;
