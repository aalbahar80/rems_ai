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

// Admin-only routes for firm management (specific routes BEFORE parameterized routes)
router.get('/', authorizeRoles('admin'), getAllFirms);
router.get('/statistics', authorizeRoles('admin'), getFirmStatistics);
router.post('/', authorizeRoles('admin'), createFirm);

// Parameterized routes (must come AFTER specific routes)
router.get('/:id', authorizeRoles('admin'), getFirmById);
router.put('/:id', authorizeRoles('admin'), updateFirm);
router.delete('/:id', authorizeRoles('admin'), deleteFirm);

// Routes that need firm context (if any)
router.use(extractFirmContext);

module.exports = router;
