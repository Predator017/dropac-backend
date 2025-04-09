const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment/paymentsController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.initiatePayment);
router.post('/verify-payment', authMiddleware, paymentController.verifyPayment);

module.exports = router;
