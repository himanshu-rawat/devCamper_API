const bootcampController =require('../controllers/bootcampController');

const expres = require('express');

const router =expres.Router();

// Show All BootCamps and Create New BootCamp
router
    .route('/')
    .get(bootcampController.getBootCamps)
    .post(bootcampController.createBootCamp);

// Show Single BootCamp, Update a BootCamp, Delete a BootCamp
router
    .route('/:id')
    .get(bootcampController.getBootCamp)
    .put(bootcampController.updateBootCamp)
    .delete(bootcampController.deleteBootCamp);

module.exports=router;