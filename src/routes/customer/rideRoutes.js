const express = require('express');
const router = express.Router();
const rideController = require('../../controllers/customer/rideController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/request-ride', authMiddleware, rideController.createRideRequest);
router.get('/get-ridestatus', authMiddleware, rideController.getRideStatus);
router.post('/cancel-riderequest', authMiddleware, rideController.cancelRideRequest);
router.post('/rate-driver', authMiddleware, rideController.rateDriver);
router.get('/user/:userId', authMiddleware, rideController.getAllRides);


module.exports = router;
