const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    // paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    // description: { type: String },
    status: { type: String, enum: ['Initiated', 'Completed', 'Failed'], default: 'Initiated' },
    razorpayOrderId: { type: String },  // Razorpay Order ID
    razorpayPaymentId: { type: String },  // Razorpay Payment ID
    transactionId: { type: String },  // Optionally, you can still store this if needed\
    created_at: { type: String },
  });
  
  module.exports = mongoose.model('Payment', paymentSchema);
  