const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Import controllers
const {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getAllCurrencies,
  updateCurrency,
} = require('../controllers/settingsController');

// All routes require authentication
router.use(authenticateToken);

// System settings routes
router.get('/', getAllSettings); // Public settings accessible to all, private only to admin
router.get('/:key', getSettingByKey); // Public settings accessible to all, private only to admin
router.put('/:key', authorizeRoles('admin'), updateSetting); // Admin only
router.delete('/:key', authorizeRoles('admin'), deleteSetting); // Admin only

// Currency management routes
router.get('/currencies/all', getAllCurrencies); // All authenticated users can view
router.put('/currencies/:id', authorizeRoles('admin'), updateCurrency); // Admin only

module.exports = router;
