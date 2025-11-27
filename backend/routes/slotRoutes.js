const express = require('express');
const router = express.Router();
const {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot
} = require('../controllers/slotController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/slots
// @desc    Get all parking slots
// @access  Public
router.get('/', getAllSlots);

// @route   GET /api/slots/:id
// @desc    Get single parking slot
// @access  Public
router.get('/:id', getSlotById);

// @route   POST /api/slots
// @desc    Create parking slot
// @access  Private/Admin
router.post('/', auth, adminAuth, createSlot);

// @route   PUT /api/slots/:id
// @desc    Update parking slot
// @access  Private/Admin
router.put('/:id', auth, adminAuth, updateSlot);

// @route   DELETE /api/slots/:id
// @desc    Delete parking slot
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteSlot);

module.exports = router;
