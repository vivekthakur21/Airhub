const express = require('express');
const router = express.Router();
const {
  addReview,
  getListingReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addReview);
router.route('/:listingId').get(getListingReviews);
router.route('/:id').delete(protect, deleteReview);

module.exports = router;
