const { query } = require('../config/database');

/**
 * Firms Controller - Multi-tenant firm management
 * Based on comprehensive database documentation
 */

// Get all firms (admin only)
const getAllFirms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, active, inactive

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (firm_name ILIKE $${paramIndex} OR contact_email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status !== 'all') {
      whereClause += ` AND is_active = $${paramIndex}`;
      queryParams.push(status === 'active');
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM rems.firms 
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get firms with pagination
    const firmsQuery = `
      SELECT 
        firm_id,
        firm_name,
        description,
        contact_email,
        contact_phone,
        address,
        is_active,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM rems.user_firm_assignments WHERE firm_id = f.firm_id AND is_active = true) as active_users,
        (SELECT COUNT(*) FROM rems.properties WHERE firm_id = f.firm_id) as properties_count
      FROM rems.firms f
      ${whereClause}
      ORDER BY firm_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(firmsQuery, queryParams);

    res.json({
      success: true,
      data: {
        firms: result.rows,
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
    console.error('Get all firms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve firms',
    });
  }
};

// Get firm by ID
const getFirmById = async (req, res) => {
  try {
    const firmId = req.params.id;

    const firmQuery = `
      SELECT 
        f.*,
        (SELECT COUNT(*) FROM rems.user_firm_assignments WHERE firm_id = f.firm_id AND is_active = true) as active_users,
        (SELECT COUNT(*) FROM rems.properties WHERE firm_id = f.firm_id) as properties_count,
        (SELECT COUNT(*) FROM rems.owners WHERE firm_id = f.firm_id) as owners_count,
        (SELECT COUNT(*) FROM rems.tenants WHERE firm_id = f.firm_id) as tenants_count
      FROM rems.firms f
      WHERE firm_id = $1
    `;

    const result = await query(firmQuery, [firmId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Firm not found',
      });
    }

    // Get recent user assignments
    const assignmentsQuery = `
      SELECT 
        fa.assignment_id,
        fa.user_role,
        fa.access_level,
        fa.assigned_at,
        u.username,
        u.email,
        u.user_type
      FROM rems.user_firm_assignments fa
      JOIN rems.users u ON fa.user_id = u.user_id
      WHERE fa.firm_id = $1 AND fa.is_active = true
      ORDER BY fa.assigned_at DESC
      LIMIT 5
    `;

    const assignmentsResult = await query(assignmentsQuery, [firmId]);

    const firmData = {
      ...result.rows[0],
      recent_assignments: assignmentsResult.rows,
    };

    res.json({
      success: true,
      data: firmData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get firm by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve firm',
    });
  }
};

// Create new firm
const createFirm = async (req, res) => {
  try {
    const {
      firm_name,
      description,
      contact_email,
      contact_phone,
      address,
      settings = {},
    } = req.body;

    // Validation
    if (!firm_name || !contact_email) {
      return res.status(400).json({
        success: false,
        error: 'Firm name and contact email are required',
      });
    }

    // Check if firm name already exists
    const existingFirm = await query(
      'SELECT firm_id FROM rems.firms WHERE firm_name = $1',
      [firm_name]
    );

    if (existingFirm.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Firm name already exists',
      });
    }

    // Create firm
    const createQuery = `
      INSERT INTO rems.firms (
        firm_name, description, contact_email, contact_phone, 
        address, settings, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await query(createQuery, [
      firm_name,
      description,
      contact_email,
      contact_phone,
      address,
      JSON.stringify(settings),
      req.user.user_id,
    ]);

    res.status(201).json({
      success: true,
      message: 'Firm created successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Create firm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create firm',
    });
  }
};

// Update firm
const updateFirm = async (req, res) => {
  try {
    const firmId = req.params.id;
    const {
      firm_name,
      description,
      contact_email,
      contact_phone,
      address,
      settings,
      is_active,
    } = req.body;

    // Check if firm exists
    const existingFirm = await query(
      'SELECT * FROM rems.firms WHERE firm_id = $1',
      [firmId]
    );

    if (existingFirm.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Firm not found',
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (firm_name !== undefined) {
      updates.push(`firm_name = $${paramIndex++}`);
      values.push(firm_name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (contact_email !== undefined) {
      updates.push(`contact_email = $${paramIndex++}`);
      values.push(contact_email);
    }
    if (contact_phone !== undefined) {
      updates.push(`contact_phone = $${paramIndex++}`);
      values.push(contact_phone);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramIndex++}`);
      values.push(address);
    }
    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`);
      values.push(JSON.stringify(settings));
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(firmId);

    const updateQuery = `
      UPDATE rems.firms 
      SET ${updates.join(', ')}
      WHERE firm_id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: 'Firm updated successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update firm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update firm',
    });
  }
};

// Delete firm (soft delete)
const deleteFirm = async (req, res) => {
  try {
    const firmId = req.params.id;

    // Check if firm exists
    const existingFirm = await query(
      'SELECT * FROM rems.firms WHERE firm_id = $1',
      [firmId]
    );

    if (existingFirm.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Firm not found',
      });
    }

    // Check for dependencies (users, properties, etc.)
    const dependenciesQuery = `
      SELECT 
        (SELECT COUNT(*) FROM rems.user_firm_assignments WHERE firm_id = $1 AND is_active = true) as active_users,
        (SELECT COUNT(*) FROM rems.properties WHERE firm_id = $1) as properties,
        (SELECT COUNT(*) FROM rems.owners WHERE firm_id = $1) as owners,
        (SELECT COUNT(*) FROM rems.tenants WHERE firm_id = $1) as tenants
    `;

    const dependencies = await query(dependenciesQuery, [firmId]);
    const deps = dependencies.rows[0];

    if (
      deps.active_users > 0 ||
      deps.properties > 0 ||
      deps.owners > 0 ||
      deps.tenants > 0
    ) {
      return res.status(409).json({
        success: false,
        error: 'Cannot delete firm with active dependencies',
        dependencies: deps,
      });
    }

    // Soft delete
    const deleteQuery = `
      UPDATE rems.firms 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE firm_id = $1
      RETURNING *
    `;

    const result = await query(deleteQuery, [firmId]);

    res.json({
      success: true,
      message: 'Firm deactivated successfully',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Delete firm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete firm',
    });
  }
};

// Get firm statistics for dashboard
const getFirmStatistics = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE is_active = true) as active_firms,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_firms,
        COUNT(*) as total_firms,
        (
          SELECT COUNT(*) 
          FROM rems.user_firm_assignments fa
          JOIN rems.firms f ON fa.firm_id = f.firm_id
          WHERE fa.is_active = true AND f.is_active = true
        ) as total_active_assignments,
        (
          SELECT COUNT(DISTINCT fa.user_id) 
          FROM rems.user_firm_assignments fa
          JOIN rems.firms f ON fa.firm_id = f.firm_id
          WHERE fa.is_active = true AND f.is_active = true
        ) as unique_active_users,
        (
          SELECT AVG(property_count)::int
          FROM (
            SELECT COUNT(*) as property_count
            FROM rems.properties p
            JOIN rems.firms f ON p.firm_id = f.firm_id
            WHERE f.is_active = true
            GROUP BY p.firm_id
          ) avg_calc
        ) as avg_properties_per_firm
      FROM rems.firms
    `;

    const result = await query(statsQuery);
    const stats = result.rows[0];

    // Get recent firm activities
    const recentActivityQuery = `
      SELECT 
        f.firm_name,
        f.created_at,
        'firm_created' as activity_type
      FROM rems.firms f
      WHERE f.created_at >= NOW() - INTERVAL '30 days'
      
      UNION ALL
      
      SELECT 
        f.firm_name,
        fa.assigned_at as created_at,
        'user_assigned' as activity_type
      FROM rems.user_firm_assignments fa
      JOIN rems.firms f ON fa.firm_id = f.firm_id
      WHERE fa.assigned_at >= NOW() - INTERVAL '30 days'
      
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const activityResult = await query(recentActivityQuery);

    res.json({
      success: true,
      data: {
        statistics: {
          ...stats,
          avg_properties_per_firm: stats.avg_properties_per_firm || 0,
        },
        recent_activity: activityResult.rows,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get firm statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve firm statistics',
    });
  }
};

module.exports = {
  getAllFirms,
  getFirmById,
  createFirm,
  updateFirm,
  deleteFirm,
  getFirmStatistics,
};
