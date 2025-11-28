const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

/**
 * Updates booking statuses based on current time
 * - Marks bookings as 'completed' if endTime has passed
 * - Makes parking slots available again after booking ends
 */
const updateExpiredBookings = async () => {
  try {
    const now = new Date();
    
    console.log('🔄 Running booking status updater...');
    
    // Find all confirmed bookings that have passed their end time
    const expiredBookings = await Booking.find({
      status: { $in: ['confirmed', 'pending'] },
      endTime: { $lt: now }
    });

    if (expiredBookings.length === 0) {
      console.log('✅ No expired bookings found');
      return;
    }

    console.log(`📦 Found ${expiredBookings.length} expired bookings to update`);

    // Update each expired booking
    for (const booking of expiredBookings) {
      // Update booking status to completed
      booking.status = 'completed';
      await booking.save();
      
      // Check if there are any future bookings for this slot
      const futureBookings = await Booking.findOne({
        parkingSlot: booking.parkingSlot,
        status: { $in: ['pending', 'confirmed'] },
        startTime: { $lte: now },
        endTime: { $gte: now }
      });

      // If no active future bookings, make the slot available
      if (!futureBookings) {
        await ParkingSlot.findByIdAndUpdate(booking.parkingSlot, { 
          isAvailable: true 
        });
        console.log(`✅ Slot ${booking.parkingSlot} is now available`);
      }
      
      console.log(`✅ Booking ${booking._id} marked as completed`);
    }

    console.log('✅ Booking status update completed');
  } catch (error) {
    console.error('❌ Error updating booking statuses:', error.message);
  }
};

/**
 * Updates upcoming bookings to 'confirmed' if their start time has arrived
 * and payment is completed
 */
const activateUpcomingBookings = async () => {
  try {
    const now = new Date();
    
    // Find pending bookings that should be activated
    const upcomingBookings = await Booking.find({
      status: 'pending',
      paymentStatus: 'completed',
      startTime: { $lte: now },
      endTime: { $gt: now }
    });

    if (upcomingBookings.length === 0) {
      return;
    }

    console.log(`📦 Activating ${upcomingBookings.length} upcoming bookings`);

    for (const booking of upcomingBookings) {
      booking.status = 'confirmed';
      await booking.save();
      console.log(`✅ Booking ${booking._id} activated`);
    }
  } catch (error) {
    console.error('❌ Error activating bookings:', error.message);
  }
};

/**
 * Main function that runs all booking status updates
 */
const runBookingStatusUpdates = async () => {
  await updateExpiredBookings();
  await activateUpcomingBookings();
};

/**
 * Start the automated job that runs every minute
 */
const startBookingStatusJob = () => {
  console.log('🚀 Starting automatic booking status updater...');
  
  // Run immediately on startup
  runBookingStatusUpdates();
  
  // Run every minute (60000ms)
  setInterval(runBookingStatusUpdates, 60000);
};

module.exports = {
  updateExpiredBookings,
  activateUpcomingBookings,
  runBookingStatusUpdates,
  startBookingStatusJob
};
