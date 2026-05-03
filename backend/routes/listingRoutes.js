const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router
  .route('/')
  .get(getListings)
  .post(protect, admin, upload.array('images', 5), createListing);

router
  .route('/:id')
  .get(getListingById)
  .put(protect, admin, updateListing)
  .delete(protect, admin, deleteListing);

module.exports = router;
