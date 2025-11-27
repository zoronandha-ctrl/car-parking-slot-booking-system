const functions = require('firebase-functions');

module.exports = {
  MONGODB_URI: functions.config().mongodb?.uri || process.env.MONGODB_URI,
  JWT_SECRET: functions.config().jwt?.secret || process.env.JWT_SECRET,
  RAZORPAY_KEY_ID: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'production'
};
