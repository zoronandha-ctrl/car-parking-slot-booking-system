const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Add debug logging
console.log('Environment check:', {
  hasKeyId: !!process.env.RAZORPAY_KEY_ID,
  hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
  keyIdLength: process.env.RAZORPAY_KEY_ID?.length,
  keyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8)
});

// Initialize Razorpay with environment variables
let razorpay = null;

try {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (keyId && keySecret && keyId !== 'your_razorpay_key_id_here') {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay initialized successfully with key:', keyId.substring(0, 12) + '...');
  } else {
    console.log('⚠️ Razorpay keys not found or invalid in environment');
  }
} catch (error) {
  console.error('❌ Razorpay initialization error:', error.message);
}

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    console.log('📝 Payment order request received');
    
    // Check if Razorpay is configured
    if (!razorpay) {
      console.log('❌ Razorpay not initialized');
      return res.status(503).json({ 
        message: 'Payment gateway not configured. Please contact administrator.' 
      });
    }

    const { bookingId } = req.body;
    console.log('📦 Booking ID:', bookingId);

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

    console.log('💰 Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Payment order creation error:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    console.log('🔍 Payment verification request received');
    
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
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Invalid payment signature');
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    console.log('✅ Payment signature verified');

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

    console.log('✅ Booking updated:', bookingId);

    res.json({
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    console.error('❌ Payment verification error:', error);
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
