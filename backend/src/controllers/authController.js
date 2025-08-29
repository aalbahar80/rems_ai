const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Login endpoint
const login = async (req, res) => {
  try {
    const { credential, password } = req.body;

    // Validate input
    if (!credential || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/username and password are required',
      });
    }

    // Find user by email or username
    const userData = await User.findByCredential(credential);

    if (!userData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!userData.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated',
      });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(
      password,
      userData.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.user_type,
    };

    const token = generateToken(tokenPayload);

    // Create user object without sensitive data
    const user = new User(userData);
    const safeUser = user.toSafeObject();

    // Log successful login
    console.log(
      `✅ User login successful: ${userData.username} (${userData.role})`
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: safeUser,
        token_type: 'Bearer',
        expires_in: '24h',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login',
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile',
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, email } = req.body;

    // Validate input
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided for update',
      });
    }

    // Validate data
    const validationErrors = User.validateUserData(updateData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    // Update user
    const updatedUser = await User.update(userId, updateData);

    console.log(`✅ User profile updated: ${updatedUser.username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password, confirm_password } = req.body;

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        error: 'Current password, new password, and confirmation are required',
      });
    }

    // Check if new passwords match
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation do not match',
      });
    }

    // Validate new password
    const validationErrors = User.validateUserData(
      { password: new_password },
      true
    );
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Password validation failed',
        details: validationErrors,
      });
    }

    // Change password
    await User.changePassword(userId, current_password, new_password);

    console.log(`✅ Password changed for user: ${req.user.username}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);

    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to change password',
    });
  }
};

// Logout endpoint (client-side token invalidation)
const logout = async (req, res) => {
  try {
    // In a stateless JWT implementation, logout is typically handled client-side
    // by removing the token from storage. However, we can log the logout event.

    console.log(`✅ User logout: ${req.user.username} (${req.user.role})`);

    res.json({
      success: true,
      message: 'Logout successful',
      instructions: 'Please remove the token from client storage',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
};

// Register new user (admin only)
const register = async (req, res) => {
  try {
    const { username, email, password, role, full_name, phone } = req.body;

    // Validate input data
    const validationErrors = User.validateUserData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    // Create user
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      full_name,
      phone,
    });

    console.log(
      `✅ New user registered: ${newUser.username} (${newUser.role})`
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'User registration failed',
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, is_active } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (is_active !== undefined) filters.is_active = is_active === 'true';

    const users = await User.getAll(filters);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: users.map((user) => user.toSafeObject()),
        count: users.length,
        filters: filters,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
    });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required',
      });
    }

    const user = await User.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
    });
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  register,
  getAllUsers,
  getUserById,
};
