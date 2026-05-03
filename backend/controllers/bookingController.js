const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Check for double booking
    const overlappingBookings = await Booking.find({
      listing: listingId,
      $or: [
        { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } },
      ],
    });

    if (overlappingBookings.length > 0) {
      res.status(400);
      throw new Error('Listing is already booked for these dates');
    }

    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('listing', 'title location price images');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this booking');
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  deleteBooking,
};
