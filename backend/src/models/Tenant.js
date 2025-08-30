const pool = require('../config/database');

class Tenant {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'full_name',
      order = 'asc',
      nationality,
      has_active_contract,
      search,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT DISTINCT
        t.tenant_id,
        t.first_name,
        t.middle_name,
        t.last_name,
        t.full_name,
        t.nationality,
        t.home_phone,
        t.work_phone,
        t.mobile,
        t.email,
        t.work_address,
        t.national_id_type,
        t.national_id,
        t.is_active,
        t.created_at,
        t.updated_at,
        COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) as active_contracts,
        COUNT(rc.contract_id) as total_contracts
      FROM rems.tenants t
      LEFT JOIN rems.rental_contracts rc ON t.tenant_id = rc.tenant_id OR t.tenant_id = rc.second_tenant_id
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (nationality) {
      conditions.push(`t.nationality = $${++paramCount}`);
      params.push(nationality);
    }

    if (search) {
      conditions.push(`(
        t.full_name ILIKE $${++paramCount} OR 
        t.email ILIKE $${++paramCount} OR 
        t.mobile ILIKE $${++paramCount} OR
        t.national_id ILIKE $${++paramCount}
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY t.tenant_id, t.first_name, t.middle_name, t.last_name, t.full_name, 
               t.nationality, t.home_phone, t.work_phone, t.mobile, t.email, 
               t.work_address, t.national_id_type, t.national_id, t.is_active, 
               t.created_at, t.updated_at
    `;

    if (has_active_contract !== undefined) {
      if (has_active_contract) {
        query += ` HAVING COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) > 0`;
      } else {
        query += ` HAVING COUNT(CASE WHEN rc.contract_status = 'active' THEN 1 END) = 0`;
      }
    }

    query += `
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(DISTINCT t.tenant_id) as total FROM rems.tenants t`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (nationality) {
      countConditions.push(`t.nationality = $${++countParamCount}`);
      countParams.push(nationality);
    }

    if (search) {
      countConditions.push(`(
        t.full_name ILIKE $${++countParamCount} OR 
        t.email ILIKE $${++countParamCount} OR 
        t.mobile ILIKE $${++countParamCount} OR
        t.national_id ILIKE $${++countParamCount}
      )`);
      const searchPattern = `%${search}%`;
      countParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      tenants: result.rows,
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
      SELECT t.*
      FROM rems.tenants t
      WHERE t.tenant_id = $1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const tenant = result.rows[0];

    // Get contracts for this tenant
    const contractsQuery = `
      SELECT 
        rc.*,
        u.unit_number,
        u.unit_type,
        p.property_code,
        p.property_name,
        p.location,
        t2.full_name as second_tenant_name
      FROM rems.rental_contracts rc
      JOIN rems.units u ON rc.unit_id = u.unit_id
      JOIN rems.properties p ON u.property_id = p.property_id
      LEFT JOIN rems.tenants t2 ON rc.second_tenant_id = t2.tenant_id
      WHERE rc.tenant_id = $1 OR rc.second_tenant_id = $1
      ORDER BY rc.start_date DESC
    `;

    const contractsResult = await pool.query(contractsQuery, [id]);
    tenant.contracts = contractsResult.rows;

    return tenant;
  }

  static async create(tenantData) {
    const {
      first_name,
      middle_name,
      last_name,
      full_name,
      nationality,
      home_phone,
      work_phone,
      mobile,
      email,
      work_address,
      national_id_type,
      national_id,
      notes,
    } = tenantData;

    const query = `
      INSERT INTO rems.tenants (
        first_name, middle_name, last_name, full_name, nationality,
        home_phone, work_phone, mobile, email, work_address,
        national_id_type, national_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      first_name,
      middle_name,
      last_name,
      full_name,
      nationality,
      home_phone,
      work_phone,
      mobile,
      email,
      work_address,
      national_id_type || 'civil_id',
      national_id,
      notes,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, tenantData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'first_name',
      'middle_name',
      'last_name',
      'full_name',
      'nationality',
      'home_phone',
      'work_phone',
      'mobile',
      'email',
      'work_address',
      'national_id_type',
      'national_id',
      'is_active',
      'notes',
    ];

    for (const field of allowedFields) {
      if (tenantData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(tenantData[field]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.tenants 
      SET ${updateFields.join(', ')}
      WHERE tenant_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    // Soft delete
    const query = `
      UPDATE rems.tenants 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getContracts(tenantId, filters = {}) {
    const { status, page = 1, limit = 20 } = filters;

    const offset = (page - 1) * limit;
    let conditions = [`(rc.tenant_id = $1 OR rc.second_tenant_id = $1)`];
    let params = [tenantId];
    let paramCount = 1;

    if (status) {
      conditions.push(`rc.contract_status = $${++paramCount}`);
      params.push(status);
    }

    const query = `
      SELECT 
        rc.*,
        u.unit_number,
        u.unit_type,
        u.floor_number,
        u.area_sqm as unit_area,
        p.property_code,
        p.property_name,
        p.location,
        p.address,
        t2.full_name as second_tenant_name,
        t2.mobile as second_tenant_mobile
      FROM rems.rental_contracts rc
      JOIN rems.units u ON rc.unit_id = u.unit_id
      JOIN rems.properties p ON u.property_id = p.property_id
      LEFT JOIN rems.tenants t2 ON rc.second_tenant_id = t2.tenant_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY rc.start_date DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getPayments(tenantId, filters = {}) {
    const { year, month, status, page = 1, limit = 20 } = filters;

    const offset = (page - 1) * limit;
    let conditions = [`(rc.tenant_id = $1 OR rc.second_tenant_id = $1)`];
    let params = [tenantId];
    let paramCount = 1;

    if (year) {
      conditions.push(`rt.year = $${++paramCount}`);
      params.push(year);
    }

    if (month) {
      conditions.push(`rt.month = $${++paramCount}`);
      params.push(month);
    }

    if (status) {
      conditions.push(`rt.payment_status = $${++paramCount}`);
      params.push(status);
    }

    const query = `
      SELECT 
        rt.*,
        rc.contract_number,
        rc.monthly_rent as contract_rent,
        u.unit_number,
        p.property_code,
        p.property_name
      FROM rems.rental_transactions rt
      JOIN rems.rental_contracts rc ON rt.contract_id = rc.contract_id
      JOIN rems.units u ON rc.unit_id = u.unit_id
      JOIN rems.properties p ON u.property_id = p.property_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY rt.year DESC, rt.month DESC, rt.transaction_date DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Tenant;
