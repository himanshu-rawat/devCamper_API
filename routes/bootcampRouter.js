const bootcampController = require('../controllers/bootcampController');

const expres = require('express');

// Include Other Resources Routers
const courseRouter = require('./courseRouter');

const router = expres.Router();

// Re-route into other resource routers
router.use('/:bootcampID/courses', courseRouter);

// Show All BootCamps and Create New BootCamp
router.route('/').get(bootcampController.getBootCamps).post(bootcampController.createBootCamp);

// Show Single BootCamp, Update a BootCamp, Delete a BootCamp
router
	.route('/:id')
	.get(bootcampController.getBootCamp)
	.put(bootcampController.updateBootCamp)
	.delete(bootcampController.deleteBootCamp);

//  GET /api/v1/bootcamps/radius/:zipcode/:distance
router.route('/radius/:zipcode/:distance').get(bootcampController.getBootcampsInRadius);
module.exports = router;
