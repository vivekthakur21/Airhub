const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a listing title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price per night'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the maximum number of guests'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Beachfront', 'Cabins', 'Villas', 'Lofts', 'Countryside', 'Glamping', 'Ryokan'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Listing', listingSchema);
