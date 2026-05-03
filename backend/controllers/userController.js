const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        wishlist: updatedUser.wishlist,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Remove listing from wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const listingId = req.params.id;

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isListingInWishlist = user.wishlist.includes(listingId);

    if (isListingInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== listingId
      );
    } else {
      // Add to wishlist
      user.wishlist.push(listingId);
    }

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  toggleWishlist,
};
