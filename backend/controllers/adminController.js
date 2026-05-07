const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const ActivityLog = require('../models/ActivityLog');
const Settings = require('../models/Settings');

// Helper to log admin activity
const logActivity = async (adminId, action, targetType, targetId, details) => {
  try {
    await ActivityLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      details,
    });
  } catch (error) {
    console.error('Logging failed:', error);
  }
};

// @desc    Get dashboard analytics (revenue over time)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
      { $limit: 30 } // Last 30 days
    ]);

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const bookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = bookings.reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({
      totalUsers,
      totalHotels,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await User.findByIdAndDelete(req.params.id);
      await logActivity(req.user._id, 'DELETE_USER', 'user', req.params.id, `Deleted user ${user.email}`);
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('listing', 'title location');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getDetailedAnalytics = async (req, res, next) => {
  try {
    // Monthly data
    const monthlyData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Hotel-wise data
    const hotelData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: "$listing",
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: 'listings',
          localField: '_id',
          foreignField: '_id',
          as: 'hotel'
        }
      },
      { $unwind: "$hotel" },
      {
        $project: {
          name: "$hotel.title",
          bookings: 1,
          revenue: 1
        }
      }
    ]);

    res.json({ monthlyData, hotelData });
  } catch (error) {
    next(error);
  }
};

const getAppSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateAppSettings = async (req, res, next) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...updateData } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findOneAndUpdate({}, updateData, { new: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  deleteUser,
  getAllBookings,
  getAnalytics,
  getDetailedAnalytics,
  getAppSettings,
  updateAppSettings,
};
