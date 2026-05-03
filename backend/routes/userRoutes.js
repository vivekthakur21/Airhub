const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleWishlist,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/wishlist/:id').post(protect, toggleWishlist);

module.exports = router;
