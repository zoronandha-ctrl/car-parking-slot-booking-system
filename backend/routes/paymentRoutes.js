const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, createPaymentOrder);

// @route   POST /api/payment/verify
// @desc    Verify payment
// @access  Private
router.post('/verify', auth, verifyPayment);

// @route   POST /api/payment/failure
// @desc    Handle payment failure
// @access  Private
router.post('/failure', auth, handlePaymentFailure);

module.exports = router;
