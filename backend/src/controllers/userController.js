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
    if (!req.firmContext?.can_access_all_firms) {
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

    // Build base query with firm assignments
    const baseQuery = `
      FROM rems.users u
      LEFT JOIN rems.user_firm_assignments fa ON u.user_id = fa.user_id
      LEFT JOIN rems.firms f ON fa.firm_id = f.firm_id
      ${whereClause}
    `;

    // Get total count
    const countQuery = `SELECT COUNT(DISTINCT u.user_id) as total ${baseQuery}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get users with pagination
    const usersQuery = `
      SELECT DISTINCT
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
        u.last_login,
        u.phone,
        u.created_at,
        u.updated_at,
        ARRAY_AGG(
          CASE WHEN fa.is_active = true THEN
            json_build_object(
              'firm_id', f.firm_id,
              'firm_name', f.firm_name,
              'user_role', fa.user_role,
              'access_level', fa.access_level,
              'assigned_at', fa.assigned_at
            )
          END
        ) FILTER (WHERE fa.is_active = true) as firm_assignments
      ${baseQuery}
      GROUP BY u.user_id, u.username, u.email, u.user_type, u.related_entity_id, 
               u.related_entity_type, u.preferred_language, u.timezone, u.is_active, 
               u.email_verified, u.last_login, u.phone, u.created_at, u.updated_at
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(usersQuery, queryParams);

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
        fa.user_role,
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
            user_id, firm_id, user_role, access_level, assigned_by
          )
          VALUES ($1, $2, $3, $4, $5)
        `;

        await query(assignmentQuery, [
          newUser.user_id,
          assignment.firm_id,
          assignment.user_role || user_type,
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
    const { firm_id, user_role, access_level = 'standard' } = req.body;

    if (!firm_id || !user_role) {
      return res.status(400).json({
        success: false,
        error: 'firm_id and user_role are required',
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
        SET user_role = $1, access_level = $2, is_active = true, assigned_at = CURRENT_TIMESTAMP, assigned_by = $3
        WHERE user_id = $4 AND firm_id = $5
        RETURNING *
      `;

      const result = await query(updateQuery, [
        user_role,
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
        INSERT INTO rems.user_firm_assignments (user_id, firm_id, user_role, access_level, assigned_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await query(createQuery, [
        userId,
        firm_id,
        user_role,
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  assignUserToFirm,
  removeUserFromFirm,
};
