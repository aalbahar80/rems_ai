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
} = require('../controllers/userController');

// All routes require authentication
router.use(authenticateToken);

// Extract firm context for multi-tenant operations
router.use(extractFirmContext);

// Routes accessible by admin and accountant
router.get('/', authorizeRoles('admin', 'accountant'), getAllUsers);
router.post('/', authorizeRoles('admin'), createUser);

// Routes with user ownership validation
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

// Firm assignment routes (admin only)
router.post('/:id/assign-firm', authorizeRoles('admin'), assignUserToFirm);
router.post('/:id/remove-firm', authorizeRoles('admin'), removeUserFromFirm);

module.exports = router;
