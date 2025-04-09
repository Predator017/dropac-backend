const express = require("express");
const rideController = require('../../controllers/driver/rideController');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/assign-ride', authMiddleware, rideController.assignRide);
router.post('/confirm-ride', authMiddleware, rideController.confirmRide);
router.post('/cancel-ride', authMiddleware, rideController.cancelRide);
router.post('/go-offline', authMiddleware, rideController.goOffline);
router.post('/start-ride', authMiddleware, rideController.startRide);
router.post('/complete-ride', authMiddleware, rideController.completeRide);
router.put('/payment-status/:rideId', authMiddleware, rideController.ridePaymentStatus);
router.get('/get-ridestatus', authMiddleware, rideController.getRideStatus);
router.get('/all-transactions/:driverId', authMiddleware, rideController.getAllDriverTransactions);
router.get('/transaction/:driverId/:date', authMiddleware, rideController.getTransactionByDate);
router.post('/rate-user', authMiddleware, rideController.rateUser);


module.exports = router;
