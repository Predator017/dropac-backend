const express = require('express');
const router = express.Router();
const driverController = require('../../controllers/driver/driverController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.post('/register', driverController.register);
router.post('/login', driverController.login);
router.post('/send-otp', driverController.sendOtp);
router.post('/verify-otp', driverController.verifyOtp);
router.post('/refresh-token',authMiddleware, driverController.refreshToken);
router.get('/profile/:driverId', authMiddleware, driverController.getDriverProfile);
router.post('/update-driver', authMiddleware, driverController.updateDriver);
router.post('/clear-dues/:driverId',authMiddleware, driverController.clearDues);
router.get('/cleared-dues/:driverId',authMiddleware, driverController.clearedDues);


module.exports = router;