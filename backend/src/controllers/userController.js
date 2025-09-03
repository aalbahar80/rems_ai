const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

/**
 * Users Controller - Multi-tenant user management
 * Based on comprehensive database documentation with polymorphic relationships
 */

// Get all users with firm context
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const user_type = req.query.user_type || 'all';
    const status = req.query.status || 'all';

    let whereClause = 'WHERE u.user_id IS NOT NULL';
    const queryParams = [];
    let paramIndex = 1;

    // For non-admin users, filter by firm context
    if (req.firmContext && !req.firmContext.can_access_all_firms) {
      whereClause += ` AND fa.firm_id = $${paramIndex}`;
      queryParams.push(req.firmContext.firm_id);
      paramIndex++;
    }

    // Search filter
    if (search) {
      whereClause += ` AND (u.username ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // User type filter
    if (user_type !== 'all') {
      whereClause += ` AND u.user_type = $${paramIndex}`;
      queryParams.push(user_type);
      paramIndex++;
    }

    // Status filter
    if (status !== 'all') {
      whereClause += ` AND u.is_active = $${paramIndex}`;
      queryParams.push(status === 'active');
      paramIndex++;
    }

    // Simplified query without DISTINCT for now
    let simpleWhereClause = 'WHERE 1=1';
    let simpleQueryParams = [];
    let simpleParamIndex = 1;

    // Search filter
    if (search) {
      simpleWhereClause += ` AND (u.username ILIKE $${simpleParamIndex} OR u.email ILIKE $${simpleParamIndex})`;
      simpleQueryParams.push(`%${search}%`);
      simpleParamIndex++;
    }

    // User type filter
    if (user_type !== 'all') {
      simpleWhereClause += ` AND u.user_type = $${simpleParamIndex}`;
      simpleQueryParams.push(user_type);
      simpleParamIndex++;
    }

    // Status filter
    if (status !== 'all') {
      simpleWhereClause += ` AND u.is_active = $${simpleParamIndex}`;
      simpleQueryParams.push(status === 'active');
      simpleParamIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM rems.users u ${simpleWhereClause}`;
    const countResult = await query(countQuery, simpleQueryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get users with pagination - simplified query without JSON issues
    const usersQuery = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.user_type,
        u.related_entity_id,
        u.related_entity_type,
        u.preferred_language,
        u.timezone,
        u.is_active,
        u.email_verified,
        u.two_factor_enabled,
        u.last_login,
        u.phone,
        u.login_attempts,
        u.locked_until,
        u.created_at,
        u.updated_at
      FROM rems.users u
      ${simpleWhereClause}
      ORDER BY u.created_at DESC
      LIMIT $${simpleParamIndex} OFFSET $${simpleParamIndex + 1}
    `;
    simpleQueryParams.push(limit, offset);

    const result = await query(usersQuery, simpleQueryParams);

    res.json({
      success: true,
      data: {
        users: result.rows,
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
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const userQuery = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.user_type,
        u.related_entity_id,
        u.related_entity_type,
        u.preferred_language,
        u.timezone,
        u.is_active,
        u.email_verified,
        u.email_verified_at,
        u.last_login,
        u.phone,
        u.permissions,
        u.settings,
        u.profile_image,
        u.two_factor_enabled,
        u.created_at,
        u.updated_at
      FROM rems.users u
      WHERE u.user_id = $1
    `;

    const result = await query(userQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get firm assignments
    const assignmentsQuery = `
      SELECT 
        fa.assignment_id,
        fa.firm_id,
        f.firm_name,
        fa.role_in_firm,
        fa.access_level,
        fa.is_active,
        fa.assigned_at,
        fa.assigned_by
      FROM rems.user_firm_assignments fa
      JOIN rems.firms f ON fa.firm_id = f.firm_id
      WHERE fa.user_id = $1
      ORDER BY fa.assigned_at DESC
    `;

    const assignmentsResult = await query(assignmentsQuery, [userId]);

    // Get related entity details if applicable
    let relatedEntity = null;
    const user = result.rows[0];

    if (user.related_entity_id && user.related_entity_type) {
      let entityQuery;

      switch (user.related_entity_type) {
        case 'owner':
          entityQuery = `
            SELECT owner_id as id, full_name as name, email, phone
            FROM rems.owners WHERE owner_id = $1
          `;
          break;
        case 'tenant':
          entityQuery = `
            SELECT tenant_id as id, full_name as name, email, phone
            FROM rems.tenants WHERE tenant_id = $1
          `;
          break;
        case 'vendor':
          entityQuery = `
            SELECT vendor_id as id, vendor_name as name, contact_email as email, contact_phone as phone
            FROM rems.vendors WHERE vendor_id = $1
          `;
          break;
      }

      if (entityQuery) {
        const entityResult = await query(entityQuery, [user.related_entity_id]);
        if (entityResult.rows.length > 0) {
          relatedEntity = {
            type: user.related_entity_type,
            ...entityResult.rows[0],
          };
        }
      }
    }

    const userData = {
      ...user,
      firm_assignments: assignmentsResult.rows,
      related_entity: relatedEntity,
    };

    res.json({
      success: true,
      data: userData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      user_type,
      related_entity_id,
      related_entity_type,
      preferred_language = 'en',
      timezone = 'Asia/Kuwait',
      phone,
      permissions = {},
      settings = {},
      firm_assignments = [],
    } = req.body;

    // Validation
    if (!username || !email || !password || !user_type) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, password, and user_type are required',
      });
    }

    // Validate user_type
    const validUserTypes = [
      'admin',
      'accountant',
      'owner',
      'tenant',
      'vendor',
      'maintenance_staff',
    ];
    if (!validUserTypes.includes(user_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user_type',
        valid_types: validUserTypes,
      });
    }

    // Check if username or email already exists
    const existingUser = await query(
      'SELECT user_id FROM rems.users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists',
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const createUserQuery = `
      INSERT INTO rems.users (
        username, email, password_hash, user_type, related_entity_id,
        related_entity_type, preferred_language, timezone, phone,
        permissions, settings
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING user_id, username, email, user_type, created_at
    `;

    const userResult = await query(createUserQuery, [
      username,
      email,
      password_hash,
      user_type,
      related_entity_id,
      related_entity_type,
      preferred_language,
      timezone,
      phone,
      JSON.stringify(permissions),
      JSON.stringify(settings),
    ]);

    const newUser = userResult.rows[0];

    // Create firm assignments if provided
    if (firm_assignments && firm_assignments.length > 0) {
      for (const assignment of firm_assignments) {
        const assignmentQuery = `
          INSERT INTO rems.user_firm_assignments (
            user_id, firm_id, role_in_firm, access_level, assigned_by
          )
          VALUES ($1, $2, $3, $4, $5)
        `;

        await query(assignmentQuery, [
          newUser.user_id,
          assignment.firm_id,
          assignment.role_in_firm || user_type,
          assignment.access_level || 'standard',
          req.user.user_id,
        ]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      username,
      email,
      user_type,
      related_entity_id,
      related_entity_type,
      preferred_language,
      timezone,
      phone,
      permissions,
      settings,
      is_active,
      email_verified,
    } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT * FROM rems.users WHERE user_id = $1',
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramIndex++}`);
      values.push(username);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (user_type !== undefined) {
      updates.push(`user_type = $${paramIndex++}`);
      values.push(user_type);
    }
    if (related_entity_id !== undefined) {
      updates.push(`related_entity_id = $${paramIndex++}`);
      values.push(related_entity_id);
    }
    if (related_entity_type !== undefined) {
      updates.push(`related_entity_type = $${paramIndex++}`);
      values.push(related_entity_type);
    }
    if (preferred_language !== undefined) {
      updates.push(`preferred_language = $${paramIndex++}`);
      values.push(preferred_language);
    }
    if (timezone !== undefined) {
      updates.push(`timezone = $${paramIndex++}`);
      values.push(timezone);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (permissions !== undefined) {
      updates.push(`permissions = $${paramIndex++}`);
      values.push(JSON.stringify(permissions));
    }
    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`);
      values.push(JSON.stringify(settings));
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
      RETURNING user_id, username, email, user_type, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
};

// Assign user to firm
const assignUserToFirm = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firm_id, role_in_firm, access_level = 'standard' } = req.body;

    if (!firm_id || !role_in_firm) {
      return res.status(400).json({
        success: false,
        error: 'firm_id and role_in_firm are required',
      });
    }

    // Check if user exists
    const userExists = await query(
      'SELECT user_id FROM rems.users WHERE user_id = $1',
      [userId]
    );
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if firm exists
    const firmExists = await query(
      'SELECT firm_id FROM rems.firms WHERE firm_id = $1 AND is_active = true',
      [firm_id]
    );
    if (firmExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Firm not found or inactive',
      });
    }

    // Check if assignment already exists
    const existingAssignment = await query(
      'SELECT assignment_id FROM rems.user_firm_assignments WHERE user_id = $1 AND firm_id = $2',
      [userId, firm_id]
    );

    if (existingAssignment.rows.length > 0) {
      // Update existing assignment
      const updateQuery = `
        UPDATE rems.user_firm_assignments
        SET role_in_firm = $1, access_level = $2, is_active = true, assigned_at = CURRENT_TIMESTAMP, assigned_by = $3
        WHERE user_id = $4 AND firm_id = $5
        RETURNING *
      `;

      const result = await query(updateQuery, [
        role_in_firm,
        access_level,
        req.user.user_id,
        userId,
        firm_id,
      ]);

      res.json({
        success: true,
        message: 'User assignment updated successfully',
        data: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    } else {
      // Create new assignment
      const createQuery = `
        INSERT INTO rems.user_firm_assignments (user_id, firm_id, role_in_firm, access_level, assigned_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await query(createQuery, [
        userId,
        firm_id,
        role_in_firm,
        access_level,
        req.user.user_id,
      ]);

      res.status(201).json({
        success: true,
        message: 'User assigned to firm successfully',
        data: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Assign user to firm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign user to firm',
    });
  }
};

// Remove user from firm
const removeUserFromFirm = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firm_id } = req.body;

    if (!firm_id) {
      return res.status(400).json({
        success: false,
        error: 'firm_id is required',
      });
    }

    // Check if assignment exists
    const existingAssignment = await query(
      'SELECT assignment_id FROM rems.user_firm_assignments WHERE user_id = $1 AND firm_id = $2 AND is_active = true',
      [userId, firm_id]
    );

    if (existingAssignment.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Active assignment not found',
      });
    }

    // Deactivate assignment
    const updateQuery = `
      UPDATE rems.user_firm_assignments
      SET is_active = false
      WHERE user_id = $1 AND firm_id = $2
      RETURNING *
    `;

    const result = await query(updateQuery, [userId, firm_id]);

    res.json({
      success: true,
      message: 'User removed from firm successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Remove user from firm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove user from firm',
    });
  }
};

// Get user statistics
const getUserStatistics = async (req, res) => {
  try {
    const statisticsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
        COUNT(CASE WHEN locked_until IS NOT NULL AND locked_until > CURRENT_TIMESTAMP THEN 1 END) as locked_users,
        COUNT(CASE WHEN two_factor_enabled = true THEN 1 END) as two_factor_enabled_users,
        COUNT(CASE WHEN last_login >= CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 1 END) as recently_active_users,
        COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN user_type = 'accountant' THEN 1 END) as accountant_users,
        COUNT(CASE WHEN user_type = 'owner' THEN 1 END) as owner_users,
        COUNT(CASE WHEN user_type = 'tenant' THEN 1 END) as tenant_users,
        COUNT(CASE WHEN user_type = 'vendor' THEN 1 END) as vendor_users,
        COUNT(CASE WHEN user_type = 'maintenance_staff' THEN 1 END) as maintenance_staff_users
      FROM rems.users
    `;

    const result = await query(statisticsQuery);
    const stats = result.rows[0];

    // Format response
    const statistics = {
      total_users: parseInt(stats.total_users),
      active_users: parseInt(stats.active_users),
      inactive_users: parseInt(stats.inactive_users),
      verified_users: parseInt(stats.verified_users),
      locked_users: parseInt(stats.locked_users),
      two_factor_enabled_users: parseInt(stats.two_factor_enabled_users),
      recently_active_users: parseInt(stats.recently_active_users),
      user_type_breakdown: {
        admin: parseInt(stats.admin_users),
        accountant: parseInt(stats.accountant_users),
        owner: parseInt(stats.owner_users),
        tenant: parseInt(stats.tenant_users),
        vendor: parseInt(stats.vendor_users),
        maintenance_staff: parseInt(stats.maintenance_staff_users),
      },
    };

    res.json({
      success: true,
      data: { statistics },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user statistics',
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get current status
    const currentUserQuery = `
      SELECT user_id, username, is_active
      FROM rems.users 
      WHERE user_id = $1
    `;
    const currentUser = await query(currentUserQuery, [userId]);

    if (currentUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const newStatus = !currentUser.rows[0].is_active;

    // Update status
    const updateQuery = `
      UPDATE rems.users 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, username, is_active, updated_at
    `;

    const result = await query(updateQuery, [newStatus, userId]);

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle user status',
    });
  }
};

// Unlock user account
const unlockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Reset login attempts and clear lock
    const updateQuery = `
      UPDATE rems.users 
      SET 
        locked_until = NULL,
        login_attempts = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING user_id, username, locked_until, login_attempts, updated_at
    `;

    const result = await query(updateQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User account unlocked successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlock user account',
    });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const userExists = await query(
      'SELECT user_id, username, email FROM rems.users WHERE user_id = $1',
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new temporary password
    const generatePassword = () => {
      const length = 12;
      const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    const newPassword = generatePassword();
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and reset security flags
    const updateQuery = `
      UPDATE rems.users 
      SET 
        password_hash = $1,
        locked_until = NULL,
        login_attempts = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, username, email, updated_at
    `;

    const result = await query(updateQuery, [password_hash, userId]);

    // Log password reset in audit table
    const auditQuery = `
      INSERT INTO rems.entity_audit_log (
        table_name, entity_id, operation_type, changed_by, 
        change_reason, ip_address, user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await query(auditQuery, [
      'users',
      userId,
      'UPDATE',
      req.user.user_id,
      'Password reset by administrator',
      req.ip || 'unknown',
      req.get('User-Agent') || 'unknown',
    ]);

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        user_id: result.rows[0].user_id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        new_password: newPassword,
        updated_at: result.rows[0].updated_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
};

// Get user sessions
const getUserSessions = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const userExists = await query(
      'SELECT user_id FROM rems.users WHERE user_id = $1',
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get active sessions
    const sessionsQuery = `
      SELECT 
        session_id,
        ip_address,
        user_agent,
        device_info,
        location_info,
        login_time,
        logout_time,
        last_activity,
        expires_at,
        is_active
      FROM rems.user_sessions 
      WHERE user_id = $1 AND is_active = true
      ORDER BY last_activity DESC
    `;

    const result = await query(sessionsQuery, [userId]);

    res.json({
      success: true,
      data: { sessions: result.rows },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user sessions',
    });
  }
};

// Get user login activity
const getUserLoginActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    const days = parseInt(req.query.days) || 30;

    // Check if user exists
    const userExists = await query(
      'SELECT user_id FROM rems.users WHERE user_id = $1',
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get login activity for the specified period
    const activityQuery = `
      SELECT 
        DATE(login_time) as login_date,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN success = true THEN 1 END) as successful_attempts,
        COUNT(CASE WHEN success = false THEN 1 END) as failed_attempts,
        ROUND(
          (COUNT(CASE WHEN success = true THEN 1 END) * 100.0 / COUNT(*)),
          2
        ) as success_rate,
        COUNT(DISTINCT ip_address) as unique_ips,
        MAX(CASE WHEN success = true THEN login_time END) as last_successful_login,
        MAX(CASE WHEN success = false THEN login_time END) as last_failed_login
      FROM rems.login_history 
      WHERE user_id = $1 
        AND login_time >= CURRENT_TIMESTAMP - INTERVAL '%d days'
      GROUP BY DATE(login_time)
      ORDER BY login_date DESC
      LIMIT 50
    `;

    const result = await query(activityQuery.replace('%d', days), [userId]);

    res.json({
      success: true,
      data: { activity: result.rows },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user login activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user login activity',
    });
  }
};

module.exports = {
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
};
