const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllBookings,
  getAnalytics,
  getDetailedAnalytics,
  getAppSettings,
  updateAppSettings,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/analytics/detailed', getDetailedAnalytics);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.route('/settings')
  .get(getAppSettings)
  .put(updateAppSettings);

module.exports = router;
