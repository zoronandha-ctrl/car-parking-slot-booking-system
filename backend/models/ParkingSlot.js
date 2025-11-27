const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    required: true,
    enum: ['Hotel', 'Hospital', 'Mall', 'Airport', 'Railway Station', 'Office', 'Residential', 'Restaurant', 'Stadium', 'College']
  },
  floor: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'bike', 'truck']
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [String],
  address: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
