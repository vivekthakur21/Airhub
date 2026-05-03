const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      listing: listingId,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this listing');
    }

    const review = await Review.create({
      user: req.user._id,
      listing: listingId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate(
      'user',
      'name'
    );

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this review');
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getListingReviews,
  deleteReview,
};
