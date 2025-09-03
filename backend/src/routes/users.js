const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  extractFirmContext,
  validateFirmOwnership,
} = require('../middleware/multiTenant');

// Import controllers
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  assignUserToFirm,
  removeUserFromFirm,
  getUserStatistics,
  toggleUserStatus,
  unlockUser,
  resetUserPassword,
  getUserSessions,
  getUserLoginActivity,
} = require('../controllers/userController');

// All routes require authentication
router.use(authenticateToken);

// Admin-only routes for user management (specific routes BEFORE parameterized routes)
router.get('/', authorizeRoles('admin', 'accountant'), getAllUsers);
router.get('/statistics', authorizeRoles('admin'), getUserStatistics);
router.post('/', authorizeRoles('admin'), createUser);

// User status management routes (admin only, no firm context needed)
router.patch('/:id/toggle-status', authorizeRoles('admin'), toggleUserStatus);
router.patch('/:id/unlock', authorizeRoles('admin'), unlockUser);
router.patch('/:id/reset-password', authorizeRoles('admin'), resetUserPassword);

// User session and activity routes (admin only, no firm context needed)
router.get('/:id/sessions', authorizeRoles('admin'), getUserSessions);
router.get(
  '/:id/login-activity',
  authorizeRoles('admin'),
  getUserLoginActivity
);

// Firm assignment routes (admin only, no firm context needed)
router.post('/:id/assign-firm', authorizeRoles('admin'), assignUserToFirm);
router.post('/:id/remove-firm', authorizeRoles('admin'), removeUserFromFirm);

// Routes that need firm context (if any)
router.use(extractFirmContext);

// Routes with user ownership validation (require firm context)
router.get(
  '/:id',
  authorizeRoles('admin', 'accountant'),
  validateFirmOwnership('user'),
  getUserById
);
router.put(
  '/:id',
  authorizeRoles('admin'),
  validateFirmOwnership('user'),
  updateUser
);

module.exports = router;
