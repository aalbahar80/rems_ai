const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

/**
 * Accountants Controller - Accountant user management for REMS admin portal
 * Based on users table with user_type='accountant'
 */

// Get all accountants (admin only)
const getAllAccountants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, active, inactive

    let whereClause = `WHERE u.user_type = 'accountant'`;
    const queryParams = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (u.username ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.phone ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status !== 'all') {
      whereClause += ` AND u.is_active = $${paramIndex}`;
      queryParams.push(status === 'active');
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM rems.users u
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get accountants with basic info
    const accountantsQuery = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.phone,
        u.is_active,
        u.email_verified,
        u.last_login,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT fa.firm_id) FILTER (WHERE fa.is_active = true) as assigned_firms_count
      FROM rems.users u
      LEFT JOIN rems.user_firm_assignments fa ON u.user_id = fa.user_id
      ${whereClause}
      GROUP BY u.user_id, u.username, u.email, u.phone, u.is_active, 
               u.email_verified, u.last_login, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(accountantsQuery, queryParams);

    res.json({
      success: true,
      data: {
        accountants: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get all accountants error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve accountants',
    });
  }
};

// Get accountant by ID
const getAccountantById = async (req, res) => {
  try {
    const userId = req.params.id;

    const accountantQuery = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.phone,
        u.is_active,
        u.email_verified,
        u.email_verified_at,
        u.last_login,
        u.login_attempts,
        u.locked_until,
        u.permissions,
        u.settings,
        u.profile_image,
        u.two_factor_enabled,
        u.preferred_language,
        u.timezone,
        u.created_at,
        u.updated_at
      FROM rems.users u
      WHERE u.user_id = $1 AND u.user_type = 'accountant'
    `;

    const result = await query(accountantQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Accountant not found',
      });
    }

    // Get firm assignments
    const assignmentsQuery = `
      SELECT 
        fa.assignment_id,
        fa.firm_id,
        f.firm_name,
        f.is_active as firm_is_active,
        fa.role_in_firm,
        fa.access_level,
        fa.is_active,
        fa.assigned_at,
        fa.assigned_by,
        (SELECT u2.username FROM rems.users u2 WHERE u2.user_id = fa.assigned_by) as assigned_by_username
      FROM rems.user_firm_assignments fa
      JOIN rems.firms f ON fa.firm_id = f.firm_id
      WHERE fa.user_id = $1
      ORDER BY fa.assigned_at DESC
    `;

    const assignmentsResult = await query(assignmentsQuery, [userId]);

    const accountantData = {
      ...result.rows[0],
      firm_assignments: assignmentsResult.rows,
    };

    res.json({
      success: true,
      data: accountantData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get accountant by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve accountant',
    });
  }
};

// Create new accountant
const createAccountant = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      preferred_language = 'en',
      timezone = 'Asia/Kuwait',
      firm_assignments = [],
    } = req.body;

    // Validation
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, and password are required',
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Check if email already exists
    const existingUser = await query(
      'SELECT user_id FROM rems.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email address already exists',
      });
    }

    // Generate username from first and last name
    const baseUsername =
      `${first_name.toLowerCase()}.${last_name.toLowerCase()}`.replace(
        /[^a-z0-9.]/g,
        ''
      );
    let username = baseUsername;
    let counter = 1;

    // Ensure username uniqueness
    while (true) {
      const existingUsername = await query(
        'SELECT user_id FROM rems.users WHERE username = $1',
        [username]
      );
      if (existingUsername.rows.length === 0) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create accountant user
    const createUserQuery = `
      INSERT INTO rems.users (
        username, email, password_hash, user_type, 
        preferred_language, timezone, phone, 
        permissions, settings
      )
      VALUES ($1, $2, $3, 'accountant', $4, $5, $6, $7, $8)
      RETURNING user_id, username, email, user_type, created_at
    `;

    const defaultPermissions = {
      properties: { read: true, write: true, delete: false },
      tenants: { read: true, write: true, delete: false },
      financial: { read: true, write: true, delete: false },
      maintenance: { read: true, write: true, delete: false },
    };

    const defaultSettings = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      full_name: `${first_name.trim()} ${last_name.trim()}`,
      notification_preferences: {
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
      },
    };

    const userResult = await query(createUserQuery, [
      username,
      email,
      password_hash,
      preferred_language,
      timezone,
      phone || null,
      JSON.stringify(defaultPermissions),
      JSON.stringify(defaultSettings),
    ]);

    const newUser = userResult.rows[0];

    // Create firm assignments if provided
    if (firm_assignments && firm_assignments.length > 0) {
      for (const assignment of firm_assignments) {
        // Validate firm exists and is active
        const firmExists = await query(
          'SELECT firm_id FROM rems.firms WHERE firm_id = $1 AND is_active = true',
          [assignment.firm_id]
        );

        if (firmExists.rows.length > 0) {
          const assignmentQuery = `
            INSERT INTO rems.user_firm_assignments (
              user_id, firm_id, role_in_firm, access_level, assigned_by
            )
            VALUES ($1, $2, $3, $4, $5)
          `;

          await query(assignmentQuery, [
            newUser.user_id,
            assignment.firm_id,
            assignment.role_in_firm || 'accountant',
            assignment.access_level || 'standard',
            req.user.user_id,
          ]);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Accountant created successfully',
      data: {
        ...newUser,
        username,
        generated_password: password, // Return for admin to share with new accountant
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Create accountant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create accountant',
    });
  }
};

// Update accountant
const updateAccountant = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      first_name,
      last_name,
      email,
      phone,
      preferred_language,
      timezone,
      is_active,
      email_verified,
      permissions,
    } = req.body;

    // Check if accountant exists
    const existingUser = await query(
      "SELECT * FROM rems.users WHERE user_id = $1 AND user_type = 'accountant'",
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Accountant not found',
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (email !== undefined) {
      // Check email uniqueness (excluding current user)
      const existingEmail = await query(
        'SELECT user_id FROM rems.users WHERE email = $1 AND user_id != $2',
        [email, userId]
      );
      if (existingEmail.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Email address already exists',
        });
      }
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (preferred_language !== undefined) {
      updates.push(`preferred_language = $${paramIndex++}`);
      values.push(preferred_language);
    }
    if (timezone !== undefined) {
      updates.push(`timezone = $${paramIndex++}`);
      values.push(timezone);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }
    if (email_verified !== undefined) {
      updates.push(`email_verified = $${paramIndex++}`);
      values.push(email_verified);
      if (email_verified) {
        updates.push(`email_verified_at = CURRENT_TIMESTAMP`);
      }
    }

    // Handle permissions and settings updates
    if (permissions !== undefined) {
      updates.push(`permissions = $${paramIndex++}`);
      values.push(JSON.stringify(permissions));
    }

    // Handle name updates in settings
    if (first_name !== undefined || last_name !== undefined) {
      const currentSettings = existingUser.rows[0].settings || {};
      const updatedSettings = {
        ...currentSettings,
        ...(first_name !== undefined && { first_name: first_name.trim() }),
        ...(last_name !== undefined && { last_name: last_name.trim() }),
      };

      // Update full_name if both names are available
      if (updatedSettings.first_name && updatedSettings.last_name) {
        updatedSettings.full_name = `${updatedSettings.first_name} ${updatedSettings.last_name}`;
      }

      updates.push(`settings = $${paramIndex++}`);
      values.push(JSON.stringify(updatedSettings));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const updateQuery = `
      UPDATE rems.users 
      SET ${updates.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING user_id, username, email, is_active, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: 'Accountant updated successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update accountant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update accountant',
    });
  }
};

// Deactivate/Reactivate accountant
const toggleAccountantStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if accountant exists
    const existingUser = await query(
      "SELECT * FROM rems.users WHERE user_id = $1 AND user_type = 'accountant'",
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Accountant not found',
      });
    }

    const currentStatus = existingUser.rows[0].is_active;
    const newStatus = !currentStatus;

    const updateQuery = `
      UPDATE rems.users 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, username, email, is_active, updated_at
    `;

    const result = await query(updateQuery, [newStatus, userId]);

    res.json({
      success: true,
      message: `Accountant ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Toggle accountant status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update accountant status',
    });
  }
};

// Get accountant statistics for dashboard
const getAccountantStatistics = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE is_active = true) as active_accountants,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_accountants,
        COUNT(*) as total_accountants,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_accountants,
        COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '30 days') as recently_active_accountants,
        (
          SELECT COUNT(DISTINCT fa.firm_id) 
          FROM rems.user_firm_assignments fa
          JOIN rems.users u ON fa.user_id = u.user_id
          WHERE u.user_type = 'accountant' AND fa.is_active = true
        ) as firms_with_accountants,
        (
          SELECT AVG(assignment_count)::int
          FROM (
            SELECT COUNT(*) as assignment_count
            FROM rems.user_firm_assignments fa
            JOIN rems.users u ON fa.user_id = u.user_id
            WHERE u.user_type = 'accountant' AND fa.is_active = true
            GROUP BY fa.user_id
          ) avg_calc
        ) as avg_firms_per_accountant
      FROM rems.users
      WHERE user_type = 'accountant'
    `;

    const result = await query(statsQuery);
    const stats = result.rows[0];

    // Get recent accountant activities
    const recentActivityQuery = `
      SELECT 
        (u.settings->>'full_name') as accountant_name,
        u.created_at,
        'accountant_created' as activity_type
      FROM rems.users u
      WHERE u.user_type = 'accountant' AND u.created_at >= NOW() - INTERVAL '30 days'
      
      UNION ALL
      
      SELECT 
        (u.settings->>'full_name') as accountant_name,
        fa.assigned_at as created_at,
        'firm_assigned' as activity_type
      FROM rems.user_firm_assignments fa
      JOIN rems.users u ON fa.user_id = u.user_id
      WHERE u.user_type = 'accountant' AND fa.assigned_at >= NOW() - INTERVAL '30 days'
      
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const activityResult = await query(recentActivityQuery);

    res.json({
      success: true,
      data: {
        statistics: {
          ...stats,
          avg_firms_per_accountant: stats.avg_firms_per_accountant || 0,
        },
        recent_activity: activityResult.rows,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get accountant statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve accountant statistics',
    });
  }
};

module.exports = {
  getAllAccountants,
  getAccountantById,
  createAccountant,
  updateAccountant,
  toggleAccountantStatus,
  getAccountantStatistics,
};
