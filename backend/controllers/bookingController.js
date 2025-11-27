const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { parkingSlotId, vehicleNumber, vehicleModel, startTime, endTime } = req.body;

    // Check if slot exists and is available
    const slot = await ParkingSlot.findById(parkingSlotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (!slot.isAvailable) {
      return res.status(400).json({ message: 'Parking slot is not available' });
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      parkingSlot: parkingSlotId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lte: new Date(endTime) },
          endTime: { $gte: new Date(startTime) }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Slot already booked for this time period' });
    }

    // Calculate total hours and price
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalHours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalPrice = totalHours * slot.pricePerHour;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      parkingSlot: parkingSlotId,
      vehicleNumber,
      vehicleModel,
      startTime,
      endTime,
      totalHours,
      totalPrice
    });

    await booking.save();

    // Update slot availability
    slot.isAvailable = false;
    await slot.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('parkingSlot')
      .populate('user', 'name email phone');

    res.status(201).json({ message: 'Booking created successfully', booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings for current user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('parkingSlot')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('parkingSlot')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('parkingSlot')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Make slot available again
    await ParkingSlot.findByIdAndUpdate(booking.parkingSlot, { isAvailable: true });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('parkingSlot').populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If completed, make slot available
    if (status === 'completed') {
      await ParkingSlot.findByIdAndUpdate(booking.parkingSlot._id, { isAvailable: true });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
};
