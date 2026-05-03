const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: 'INR',
  },
  tax: {
    type: Number,
    default: 12,
  },
  serviceFee: {
    type: Number,
    default: 5,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  bookingEnabled: {
    type: Boolean,
    default: true,
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation within 24 hours',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
