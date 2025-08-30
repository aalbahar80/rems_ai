const pool = require('../config/database');

class Property {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'property_code',
      order = 'asc',
      location,
      property_type,
      is_active = true,
      owner_id,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT DISTINCT
        p.property_id,
        p.property_code,
        p.property_name,
        p.location,
        p.address,
        p.area_sqm,
        p.total_units,
        p.property_type,
        p.construction_year,
        p.valuation_amount,
        p.valuation_date,
        p.is_active,
        p.created_at,
        p.updated_at,
        COUNT(u.unit_id) as actual_units,
        COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) as occupied_units
      FROM rems.properties p
      LEFT JOIN rems.units u ON p.property_id = u.property_id
      LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id AND rc.contract_status = 'active'
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (is_active !== null) {
      conditions.push(`p.is_active = $${++paramCount}`);
      params.push(is_active);
    }

    if (location) {
      conditions.push(`p.location ILIKE $${++paramCount}`);
      params.push(`%${location}%`);
    }

    if (property_type) {
      conditions.push(`p.property_type = $${++paramCount}`);
      params.push(property_type);
    }

    if (owner_id) {
      query += ` LEFT JOIN rems.property_ownership_periods pop ON p.property_id = pop.property_id`;
      conditions.push(
        `pop.owner_id = $${++paramCount} AND (pop.end_date IS NULL OR pop.end_date > CURRENT_DATE)`
      );
      params.push(owner_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY p.property_id, p.property_code, p.property_name, p.location, 
               p.address, p.area_sqm, p.total_units, p.property_type, 
               p.construction_year, p.valuation_amount, p.valuation_date, 
               p.is_active, p.created_at, p.updated_at
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(DISTINCT p.property_id) as total FROM rems.properties p`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (is_active !== null) {
      countConditions.push(`p.is_active = $${++countParamCount}`);
      countParams.push(is_active);
    }

    if (location) {
      countConditions.push(`p.location ILIKE $${++countParamCount}`);
      countParams.push(`%${location}%`);
    }

    if (property_type) {
      countConditions.push(`p.property_type = $${++countParamCount}`);
      countParams.push(property_type);
    }

    if (owner_id) {
      countQuery += ` LEFT JOIN rems.property_ownership_periods pop ON p.property_id = pop.property_id`;
      countConditions.push(
        `pop.owner_id = $${++countParamCount} AND (pop.end_date IS NULL OR pop.end_date > CURRENT_DATE)`
      );
      countParams.push(owner_id);
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      properties: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id) {
    const query = `
      SELECT 
        p.*,
        COUNT(u.unit_id) as actual_units,
        COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) as occupied_units,
        COALESCE(SUM(rc.monthly_rent), 0) as total_monthly_rent
      FROM rems.properties p
      LEFT JOIN rems.units u ON p.property_id = u.property_id
      LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id AND rc.contract_status = 'active'
      WHERE p.property_id = $1
      GROUP BY p.property_id
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const property = result.rows[0];

    // Get ownership information
    const ownershipQuery = `
      SELECT 
        pop.ownership_id,
        pop.ownership_percentage,
        pop.start_date,
        pop.end_date,
        pop.is_primary_contact,
        pop.management_fee_percentage,
        pop.acquisition_method,
        o.owner_id,
        o.first_name,
        o.last_name,
        o.full_name,
        o.email,
        o.phone_primary
      FROM rems.property_ownership_periods pop
      JOIN rems.owners o ON pop.owner_id = o.owner_id
      WHERE pop.property_id = $1 AND (pop.end_date IS NULL OR pop.end_date > CURRENT_DATE)
      ORDER BY pop.ownership_percentage DESC
    `;

    const ownershipResult = await pool.query(ownershipQuery, [id]);
    property.owners = ownershipResult.rows;

    return property;
  }

  static async findByOwnerId(ownerId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'property_code',
      order = 'asc',
    } = filters;

    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        p.*,
        pop.ownership_percentage,
        pop.is_primary_contact,
        pop.management_fee_percentage,
        COUNT(u.unit_id) as actual_units,
        COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) as occupied_units,
        COALESCE(SUM(rc.monthly_rent * pop.ownership_percentage / 100), 0) as owner_monthly_income
      FROM rems.properties p
      JOIN rems.property_ownership_periods pop ON p.property_id = pop.property_id
      LEFT JOIN rems.units u ON p.property_id = u.property_id
      LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id AND rc.contract_status = 'active'
      WHERE pop.owner_id = $1 
        AND (pop.end_date IS NULL OR pop.end_date > CURRENT_DATE)
        AND p.is_active = true
      GROUP BY p.property_id, pop.ownership_percentage, pop.is_primary_contact, pop.management_fee_percentage
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [ownerId, limit, offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM rems.properties p
      JOIN rems.property_ownership_periods pop ON p.property_id = pop.property_id
      WHERE pop.owner_id = $1 
        AND (pop.end_date IS NULL OR pop.end_date > CURRENT_DATE)
        AND p.is_active = true
    `;

    const countResult = await pool.query(countQuery, [ownerId]);
    const total = parseInt(countResult.rows[0].total);

    return {
      properties: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async create(propertyData) {
    const {
      property_code,
      property_name,
      location,
      address,
      area_sqm,
      total_units,
      property_type,
      construction_year,
      construction_cost,
      planning_permit,
      valuation_amount,
      valuation_date,
      valuation_method,
      notes,
    } = propertyData;

    const query = `
      INSERT INTO rems.properties (
        property_code, property_name, location, address, area_sqm,
        total_units, property_type, construction_year, construction_cost,
        planning_permit, valuation_amount, valuation_date, valuation_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      property_code,
      property_name,
      location,
      address,
      area_sqm,
      total_units || 0,
      property_type || 'residential',
      construction_year,
      construction_cost,
      planning_permit,
      valuation_amount,
      valuation_date,
      valuation_method,
      notes,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, propertyData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'property_name',
      'location',
      'address',
      'area_sqm',
      'total_units',
      'property_type',
      'construction_year',
      'construction_cost',
      'planning_permit',
      'valuation_amount',
      'valuation_date',
      'valuation_method',
      'is_active',
      'notes',
    ];

    for (const field of allowedFields) {
      if (propertyData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(propertyData[field]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.properties 
      SET ${updateFields.join(', ')}
      WHERE property_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    // Soft delete
    const query = `
      UPDATE rems.properties 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE property_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm, filters = {}) {
    const { page = 1, limit = 20, min_value, max_value } = filters;

    const offset = (page - 1) * limit;
    let conditions = [`p.is_active = true`];
    let params = [];
    let paramCount = 0;

    if (searchTerm) {
      conditions.push(`(
        p.property_code ILIKE $${++paramCount} OR 
        p.property_name ILIKE $${++paramCount} OR 
        p.location ILIKE $${++paramCount}
      )`);
      const searchPattern = `%${searchTerm}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (min_value) {
      conditions.push(`p.valuation_amount >= $${++paramCount}`);
      params.push(min_value);
    }

    if (max_value) {
      conditions.push(`p.valuation_amount <= $${++paramCount}`);
      params.push(max_value);
    }

    const query = `
      SELECT 
        p.*,
        COUNT(u.unit_id) as actual_units,
        COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) as occupied_units
      FROM rems.properties p
      LEFT JOIN rems.units u ON p.property_id = u.property_id
      LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id AND rc.contract_status = 'active'
      WHERE ${conditions.join(' AND ')}
      GROUP BY p.property_id
      ORDER BY p.property_code
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getUnits(propertyId) {
    const query = `
      SELECT 
        u.*,
        rc.contract_id,
        rc.contract_status,
        rc.monthly_rent,
        rc.start_date as lease_start,
        rc.end_date as lease_end,
        t.full_name as tenant_name,
        t.mobile as tenant_mobile
      FROM rems.units u
      LEFT JOIN rems.rental_contracts rc ON u.unit_id = rc.unit_id AND rc.contract_status = 'active'
      LEFT JOIN rems.tenants t ON rc.tenant_id = t.tenant_id
      WHERE u.property_id = $1
      ORDER BY u.unit_number
    `;

    const result = await pool.query(query, [propertyId]);
    return result.rows;
  }
}

module.exports = Property;
