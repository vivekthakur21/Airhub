const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, getUserBookings);
router.route('/:id').delete(protect, deleteBooking);

module.exports = router;
