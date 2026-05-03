const Listing = require('../models/Listing');
const cloudinary = require('../config/cloudinary');

// @desc    Get all listings (with search & filter)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res, next) => {
  try {
    const { location, category, minPrice, maxPrice, guests, page = 1, limit = 10 } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (guests) {
      query.guests = { $gte: Number(guests) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('host', 'name email');

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name email');

    if (listing) {
      res.json(listing);
    } else {
      res.status(404);
      throw new Error('Listing not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res, next) => {
  try {
    const { title, description, price, location, guests, category } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      guests,
      category,
      host: req.user._id,
      images,
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this listing');
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this listing');
    }

    // Delete images from cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
