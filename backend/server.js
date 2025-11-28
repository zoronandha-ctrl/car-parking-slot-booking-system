const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Car Parking Booking API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🔐 Environment Variables Check:');
  console.log('- RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 12)}... (${process.env.RAZORPAY_KEY_ID.length} chars)` : '❌ NOT SET');
  console.log('- RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? `****** (${process.env.RAZORPAY_KEY_SECRET.length} chars)` : '❌ NOT SET');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
});
