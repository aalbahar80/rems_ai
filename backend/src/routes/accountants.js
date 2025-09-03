const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { extractFirmContext } = require('../middleware/multiTenant');

// Import controllers
const {
  getAllAccountants,
  getAccountantById,
  createAccountant,
  updateAccountant,
  toggleAccountantStatus,
  getAccountantStatistics,
} = require('../controllers/accountantController');

// All routes require authentication
router.use(authenticateToken);

// Admin-only routes for accountant management (specific routes BEFORE parameterized routes)
router.get('/', authorizeRoles('admin'), getAllAccountants);
router.get('/statistics', authorizeRoles('admin'), getAccountantStatistics);
router.post('/', authorizeRoles('admin'), createAccountant);

// Parameterized routes (must come AFTER specific routes)
router.get('/:id', authorizeRoles('admin'), getAccountantById);
router.put('/:id', authorizeRoles('admin'), updateAccountant);
router.patch(
  '/:id/toggle-status',
  authorizeRoles('admin'),
  toggleAccountantStatus
);

// Routes that need firm context (if any)
router.use(extractFirmContext);

module.exports = router;
