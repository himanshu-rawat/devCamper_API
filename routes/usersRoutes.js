const express = require('express');

const usersController = require('../controllers/usersControllers');

const User = require('../models/userModel');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');

const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.protect);
router.use(authMiddleware.authorize('admin'));

router.route('/').get(advancedResults(User), usersController.getUsers).post(usersController.createUser);

router.route('/:id').get(usersController.getUser).put(usersController.updateUser).delete(usersController.deleteUser);

module.exports = router;
