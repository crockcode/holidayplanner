const express = require('express');
const { 
  getHolidays, 
  addHoliday, 
  updateHoliday, 
  deleteHoliday,
  subscribeToHoliday,
  cloneHoliday,
  searchFlights
} = require('../controllers/holidayController');
const router = express.Router();
const { protect, admin, checkHolidayOwnership } = require('../middleware/authMiddleware');  // Middleware to protect routes (authentication)
const { validateHoliday } = require('../middleware/validationMiddleware');  // Validation middleware

// Get all holidays for the logged-in user
router.get('/', protect, getHolidays); // The 'protect' middleware will ensure the user is authenticated

// Create a new holiday
router.post('/', protect, validateHoliday, addHoliday);

// Update an existing holiday by its ID
router.put('/:id', protect, validateHoliday, checkHolidayOwnership, updateHoliday);

// Delete a holiday by its ID
router.delete('/:id', protect, checkHolidayOwnership, deleteHoliday);

// Subscribe to a holiday (Observer Pattern)
router.post('/:id/subscribe', protect, subscribeToHoliday);

// Clone a holiday (Prototype Pattern)
router.post('/:id/clone', protect, cloneHoliday);

// Search for flights (Adapter Pattern)
router.get('/flights', protect, searchFlights);

module.exports = router;
