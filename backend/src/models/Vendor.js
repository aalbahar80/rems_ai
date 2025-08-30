const pool = require('../config/database');

class Vendor {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'vendor_name',
      order = 'asc',
      vendor_type,
      emergency_available,
      is_active = true,
      search,
      min_rating,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        v.*,
        COUNT(mo.maintenance_order_id) as active_orders
      FROM rems.vendors v
      LEFT JOIN rems.maintenance_orders mo ON v.vendor_id = mo.vendor_id 
        AND mo.status IN ('scheduled', 'in_progress')
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (is_active !== null) {
      conditions.push(`v.is_active = $${++paramCount}`);
      params.push(is_active);
    }

    if (vendor_type) {
      conditions.push(`v.vendor_type = $${++paramCount}`);
      params.push(vendor_type);
    }

    if (emergency_available !== undefined) {
      conditions.push(`v.emergency_available = $${++paramCount}`);
      params.push(emergency_available);
    }

    if (search) {
      conditions.push(`(
        v.vendor_name ILIKE $${++paramCount} OR 
        v.contact_person ILIKE $${++paramCount} OR 
        v.email ILIKE $${++paramCount} OR
        v.specialization ILIKE $${++paramCount}
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (min_rating) {
      conditions.push(`v.rating >= $${++paramCount}`);
      params.push(min_rating);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY v.vendor_id, v.vendor_name, v.vendor_type, v.contact_person,
               v.phone_primary, v.phone_secondary, v.mobile, v.email, v.address,
               v.national_id, v.commercial_registration, v.tax_number, v.specialization,
               v.rating, v.total_jobs_completed, v.payment_terms, v.preferred_payment_method,
               v.emergency_available, v.service_areas, v.is_active, v.notes,
               v.created_at, v.updated_at
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM rems.vendors v`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (is_active !== null) {
      countConditions.push(`v.is_active = $${++countParamCount}`);
      countParams.push(is_active);
    }

    if (vendor_type) {
      countConditions.push(`v.vendor_type = $${++countParamCount}`);
      countParams.push(vendor_type);
    }

    if (emergency_available !== undefined) {
      countConditions.push(`v.emergency_available = $${++countParamCount}`);
      countParams.push(emergency_available);
    }

    if (search) {
      countConditions.push(`(
        v.vendor_name ILIKE $${++countParamCount} OR 
        v.contact_person ILIKE $${++countParamCount} OR 
        v.email ILIKE $${++countParamCount} OR
        v.specialization ILIKE $${++countParamCount}
      )`);
      const searchPattern = `%${search}%`;
      countParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    if (min_rating) {
      countConditions.push(`v.rating >= $${++countParamCount}`);
      countParams.push(min_rating);
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      vendors: result.rows,
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
        v.*,
        COUNT(mo.maintenance_order_id) as total_orders,
        COUNT(CASE WHEN mo.status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN mo.status IN ('scheduled', 'in_progress') THEN 1 END) as active_orders,
        AVG(CASE WHEN mo.status = 'completed' THEN 
          CASE 
            WHEN mo.actual_cost > 0 AND mo.estimated_cost > 0 
            THEN mo.actual_cost / mo.estimated_cost 
            ELSE 1 
          END 
        END) as cost_accuracy,
        AVG(CASE WHEN mo.status = 'completed' THEN 
          COALESCE(mo.tenant_rating, mo.owner_rating) 
        END) as average_rating
      FROM rems.vendors v
      LEFT JOIN rems.maintenance_orders mo ON v.vendor_id = mo.vendor_id
      WHERE v.vendor_id = $1
      GROUP BY v.vendor_id
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const vendor = result.rows[0];

    // Get recent jobs
    const recentJobsQuery = `
      SELECT 
        mo.maintenance_order_id,
        mo.order_number,
        mo.title,
        mo.status,
        mo.scheduled_date,
        mo.completed_date,
        mo.estimated_cost,
        mo.actual_cost,
        p.property_code,
        p.property_name,
        u.unit_number
      FROM rems.maintenance_orders mo
      LEFT JOIN rems.properties p ON mo.property_id = p.property_id
      LEFT JOIN rems.units u ON mo.unit_id = u.unit_id
      WHERE mo.vendor_id = $1
      ORDER BY mo.scheduled_date DESC
      LIMIT 10
    `;

    const recentJobsResult = await pool.query(recentJobsQuery, [id]);
    vendor.recent_jobs = recentJobsResult.rows;

    return vendor;
  }

  static async create(vendorData) {
    const {
      vendor_name,
      vendor_type,
      contact_person,
      phone_primary,
      phone_secondary,
      mobile,
      email,
      address,
      national_id,
      commercial_registration,
      tax_number,
      specialization,
      payment_terms,
      preferred_payment_method,
      emergency_available,
      service_areas,
      notes,
    } = vendorData;

    const query = `
      INSERT INTO rems.vendors (
        vendor_name, vendor_type, contact_person, phone_primary, phone_secondary,
        mobile, email, address, national_id, commercial_registration, tax_number,
        specialization, payment_terms, preferred_payment_method, emergency_available,
        service_areas, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      vendor_name,
      vendor_type || 'contractor',
      contact_person,
      phone_primary,
      phone_secondary,
      mobile,
      email,
      address,
      national_id,
      commercial_registration,
      tax_number,
      specialization,
      payment_terms || 'net_30',
      preferred_payment_method || 'bank_transfer',
      emergency_available || false,
      service_areas,
      notes,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, vendorData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'vendor_name',
      'vendor_type',
      'contact_person',
      'phone_primary',
      'phone_secondary',
      'mobile',
      'email',
      'address',
      'national_id',
      'commercial_registration',
      'tax_number',
      'specialization',
      'rating',
      'payment_terms',
      'preferred_payment_method',
      'emergency_available',
      'service_areas',
      'is_active',
      'notes',
    ];

    for (const field of allowedFields) {
      if (vendorData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(vendorData[field]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.vendors 
      SET ${updateFields.join(', ')}
      WHERE vendor_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    // Soft delete - check for active orders first
    const activeOrdersQuery = `
      SELECT COUNT(*) as active_count 
      FROM rems.maintenance_orders 
      WHERE vendor_id = $1 AND status IN ('scheduled', 'in_progress')
    `;

    const activeResult = await pool.query(activeOrdersQuery, [id]);
    const activeCount = parseInt(activeResult.rows[0].active_count);

    if (activeCount > 0) {
      throw new Error(
        `Cannot delete vendor with ${activeCount} active maintenance order(s)`
      );
    }

    const query = `
      UPDATE rems.vendors 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE vendor_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAvailable(filters = {}) {
    const {
      emergency_only = false,
      specialization,
      service_area,
      min_rating = 0,
    } = filters;

    let conditions = [`v.is_active = true`];
    let params = [];
    let paramCount = 0;

    if (emergency_only) {
      conditions.push(`v.emergency_available = true`);
    }

    if (specialization) {
      conditions.push(`v.specialization ILIKE $${++paramCount}`);
      params.push(`%${specialization}%`);
    }

    if (service_area) {
      conditions.push(`v.service_areas ILIKE $${++paramCount}`);
      params.push(`%${service_area}%`);
    }

    if (min_rating > 0) {
      conditions.push(`v.rating >= $${++paramCount}`);
      params.push(min_rating);
    }

    const query = `
      SELECT 
        v.vendor_id,
        v.vendor_name,
        v.vendor_type,
        v.contact_person,
        v.phone_primary,
        v.mobile,
        v.email,
        v.specialization,
        v.rating,
        v.emergency_available,
        v.service_areas,
        COUNT(CASE WHEN mo.status IN ('scheduled', 'in_progress') THEN 1 END) as active_orders
      FROM rems.vendors v
      LEFT JOIN rems.maintenance_orders mo ON v.vendor_id = mo.vendor_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY v.vendor_id, v.vendor_name, v.vendor_type, v.contact_person,
               v.phone_primary, v.mobile, v.email, v.specialization, v.rating,
               v.emergency_available, v.service_areas
      ORDER BY v.rating DESC, active_orders ASC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateRating(id, newRating) {
    // Calculate new average rating
    const ratingsQuery = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(COALESCE(tenant_rating, owner_rating)) as current_avg
      FROM rems.maintenance_orders
      WHERE vendor_id = $1 AND status = 'completed'
        AND (tenant_rating IS NOT NULL OR owner_rating IS NOT NULL)
    `;

    const ratingsResult = await pool.query(ratingsQuery, [id]);
    const { total_ratings, current_avg } = ratingsResult.rows[0];

    let finalRating;
    if (total_ratings === 0) {
      finalRating = newRating;
    } else {
      // Calculate weighted average (current system rating gets more weight)
      finalRating =
        (parseFloat(current_avg) * total_ratings + newRating) /
        (total_ratings + 1);
    }

    const query = `
      UPDATE rems.vendors 
      SET rating = $1, updated_at = CURRENT_TIMESTAMP
      WHERE vendor_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [
      parseFloat(finalRating.toFixed(1)),
      id,
    ]);
    return result.rows[0];
  }

  static async getPerformanceReport(id, filters = {}) {
    const { date_from, date_to } = filters;

    let conditions = [`mo.vendor_id = $1`, `mo.status = 'completed'`];
    let params = [id];
    let paramCount = 1;

    if (date_from) {
      conditions.push(`mo.completed_date >= $${++paramCount}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`mo.completed_date <= $${++paramCount}`);
      params.push(date_to);
    }

    const query = `
      SELECT 
        COUNT(*) as total_completed,
        AVG(mo.actual_cost) as avg_cost,
        AVG(CASE WHEN mo.estimated_cost > 0 THEN mo.actual_cost / mo.estimated_cost END) as cost_accuracy,
        AVG(mo.actual_duration_hours) as avg_duration,
        AVG(CASE WHEN mo.estimated_duration_hours > 0 THEN mo.actual_duration_hours / mo.estimated_duration_hours END) as time_accuracy,
        AVG(COALESCE(mo.tenant_rating, mo.owner_rating)) as avg_rating,
        COUNT(CASE WHEN mo.scheduled_date < mo.started_date THEN 1 END) as late_starts,
        COUNT(CASE WHEN mo.actual_cost > mo.estimated_cost * 1.1 THEN 1 END) as cost_overruns
      FROM rems.maintenance_orders mo
      WHERE ${conditions.join(' AND ')}
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

module.exports = Vendor;
