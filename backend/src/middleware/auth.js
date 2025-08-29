const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const config = require('../config/environment');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'rems-api',
    audience: 'rems-client',
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'rems-api',
      audience: 'rems-client',
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user details from database
    const userQuery = `
      SELECT 
        user_id,
        username,
        email,
        user_type,
        phone,
        is_active,
        created_at,
        updated_at,
        preferred_language,
        timezone
      FROM rems.users 
      WHERE user_id = $1 AND is_active = true
    `;

    const result = await query(userQuery, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found',
      });
    }

    // Attach user to request object
    req.user = result.rows[0];
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required_roles: allowedRoles,
        user_role: req.user.role,
      });
    }

    next();
  };
};

// Optional authentication (for endpoints that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const userQuery = `
        SELECT 
          id, username, email, role, full_name, phone, is_active,
          created_at, updated_at
        FROM rems.users 
        WHERE id = $1 AND is_active = true
      `;

      const result = await query(userQuery, [decoded.userId]);

      if (result.rows.length > 0) {
        req.user = result.rows[0];
        req.tokenPayload = decoded;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we continue even if token is invalid
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  authorizeRoles,
  optionalAuth,
};
