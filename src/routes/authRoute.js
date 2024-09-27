const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

// Login Route
router.post('/login', authController.login);

// Register Route
router.post('/register', authController.register);

// Forgot Password Route
router.post('/forgotPassword', authController.forgotPassword);

// Reset Password Route
router.patch('/resetPassword', authController.resetPassword);

module.exports = router;
