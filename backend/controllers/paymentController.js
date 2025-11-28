const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Get Razorpay config from Firebase or env
const getRazorpayConfig = () => {
  try {
    const firebaseConfig = require('../config/firebase-env');
    return {
      key_id: firebaseConfig.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: firebaseConfig.RAZORPAY_KEY_SECRET || 'dummy_secret'
    };
  } catch (e) {
    return {
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
    };
  }
};

// Initialize Razorpay only if keys are provided
let razorpay = null;
const config = getRazorpayConfig();
if (config.key_id && config.key_id !== 'dummy_key') {
  razorpay = new Razorpay(config);
}

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment gateway not configured. Please contact administrator.' 
      });
    }

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if already paid
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const options = {
      amount: booking.totalPrice * 100, // amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        userId: req.user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayConfig().key_id
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment gateway not configured. Please contact administrator.' 
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', getRazorpayConfig().key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        status: 'confirmed'
      },
      { new: true }
    ).populate('parkingSlot');

    res.json({
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
  try {
    const { bookingId, error } = req.body;

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'failed'
    });

    res.json({ message: 'Payment failure recorded' });
  } catch (error) {
    console.error('Payment failure handling error:', error);
    res.status(500).json({ message: 'Failed to handle payment failure' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure
};
