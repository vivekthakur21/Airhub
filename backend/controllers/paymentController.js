const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', listingId, checkIn, checkOut } = req.body;

    // Availability Check
    const overlappingBookings = await Booking.find({
      listing: listingId,
      paymentStatus: 'paid', // Only count paid bookings
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });

    if (overlappingBookings.length > 0) {
      res.status(400);
      throw new Error('Listing is already booked for these dates');
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Error creating Razorpay order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Create booking in database after successful payment
      const booking = await Booking.create({
        user: req.user._id,
        listing: bookingData.listingId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: bookingData.totalPrice,
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      res.status(201).json({
        success: true,
        message: 'Payment verified and booking created',
        booking,
      });
    } else {
      res.status(400);
      throw new Error('Invalid payment signature');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
