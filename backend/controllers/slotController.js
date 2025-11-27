const ParkingSlot = require('../models/ParkingSlot');

// Get all parking slots
const getAllSlots = async (req, res) => {
  try {
    const { state, city, locationType, vehicleType, available } = req.query;
    const filter = {};

    if (state) filter.state = state;
    if (city) filter.city = city;
    if (locationType) filter.locationType = locationType;
    if (vehicleType) filter.vehicleType = vehicleType;
    if (available !== undefined) filter.isAvailable = available === 'true';

    const slots = await ParkingSlot.find(filter).sort({ createdAt: -1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single slot
const getSlotById = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create parking slot (Admin only)
const createSlot = async (req, res) => {
  try {
    const { slotNumber, state, city, location, locationType, floor, vehicleType, pricePerHour, features, address } = req.body;

    const slot = new ParkingSlot({
      slotNumber,
      state,
      city,
      location,
      locationType,
      floor,
      vehicleType,
      pricePerHour,
      features,
      address
    });

    await slot.save();
    res.status(201).json({ message: 'Parking slot created', slot });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slot already exists at this location' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update parking slot (Admin only)
const updateSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    res.json({ message: 'Parking slot updated', slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete parking slot (Admin only)
const deleteSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndDelete(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    res.json({ message: 'Parking slot deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot
};
