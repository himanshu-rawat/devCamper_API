const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/v1/auth/register
router.route('/register').post(authController.register);
// POST /api/v1/auth/login
router.route('/login').post(authController.login);
//  GET /api/v1/auth/logout
router.route('/logout').get(authMiddleware.protect, authController.logout);
// GET /api/v1/auth/me
router.route('/me').get(authMiddleware.protect, authController.getMe);
// router.get('/me', protect, authController.getMe);

// PUT/api/v1/auth/updatedetails
router.route('/updatedetails').put(authMiddleware.protect, authController.updateDetails);

//POST /api/v1/auth/forgotpassword
router.route('/forgotpassword').post(authController.forgotPassword);

//  PUT /api/v1/auth/updatepassword
router.route('/updatepassword').put(authMiddleware.protect, authController.updatePassword);

//  PUT /api/v1/auth/resetpassword/:resettoken
router.route('/resetpassword/:resettoken').put(authController.resetPassword);

module.exports = router;
