const express = require('express');
const router = express.Router();
const userController = require('../../controllers/customer/userController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', authMiddleware, userController.refreshToken);
router.post('/verify-otp', userController.verifyOTP);

router.post('/calculate-prices', authMiddleware, userController.calculatePrices);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
