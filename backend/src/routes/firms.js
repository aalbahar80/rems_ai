const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { extractFirmContext } = require('../middleware/multiTenant');

// Import controllers
const {
  getAllFirms,
  getFirmById,
  createFirm,
  updateFirm,
  deleteFirm,
  getFirmStatistics,
} = require('../controllers/firmController');

// All routes require authentication
router.use(authenticateToken);

// Admin-only routes for firm management
router.get('/', authorizeRoles('admin'), getAllFirms);
router.get('/statistics', authorizeRoles('admin'), getFirmStatistics);
router.post('/', authorizeRoles('admin'), createFirm);

// Routes that need firm context
router.use(extractFirmContext);

router.get('/:id', authorizeRoles('admin'), getFirmById);
router.put('/:id', authorizeRoles('admin'), updateFirm);
router.delete('/:id', authorizeRoles('admin'), deleteFirm);

module.exports = router;
