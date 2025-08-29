const express = require('express');
const router = express.Router();

// Import middleware and controllers
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  register,
  getAllUsers,
  getUserById,
} = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/login', login);

// Protected routes (authentication required)
router.use(authenticateToken); // All routes below require authentication

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.post('/logout', logout);

// Admin only routes
router.post('/register', authorizeRoles('admin'), register);
router.get('/users', authorizeRoles('admin'), getAllUsers);
router.get('/users/:id', authorizeRoles('admin'), getUserById);

module.exports = router;
