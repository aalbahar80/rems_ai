const pool = require('../config/database');

class Maintenance {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'requested_date',
      order = 'desc',
      status,
      priority,
      requestor_type,
      property_id,
      vendor_id,
      date_from,
      date_to,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        mo.maintenance_order_id,
        mo.order_number,
        mo.unit_id,
        mo.property_id,
        mo.tenant_id,
        mo.owner_id,
        mo.requestor_type,
        mo.vendor_id,
        mo.expense_type_id,
        mo.title,
        mo.description,
        mo.priority,
        mo.status,
        mo.requested_date,
        mo.acknowledged_date,
        mo.scheduled_date,
        mo.started_date,
        mo.completed_date,
        mo.estimated_cost,
        mo.actual_cost,
        mo.estimated_duration_hours,
        mo.actual_duration_hours,
        mo.requires_approval,
        mo.approved_by,
        mo.approved_date,
        mo.created_at,
        mo.updated_at,
        p.property_code,
        p.property_name,
        u.unit_number,
        t.full_name as tenant_name,
        o.full_name as owner_name,
        v.vendor_name,
        v.phone_primary as vendor_phone,
        et.type_name as expense_type,
        CASE 
          WHEN mo.scheduled_date < CURRENT_TIMESTAMP AND mo.status NOT IN ('completed', 'cancelled')
          THEN true 
          ELSE false 
        END as is_overdue
      FROM rems.maintenance_orders mo
      LEFT JOIN rems.properties p ON mo.property_id = p.property_id
      LEFT JOIN rems.units u ON mo.unit_id = u.unit_id
      LEFT JOIN rems.tenants t ON mo.tenant_id = t.tenant_id
      LEFT JOIN rems.owners o ON mo.owner_id = o.owner_id
      LEFT JOIN rems.vendors v ON mo.vendor_id = v.vendor_id
      LEFT JOIN rems.expense_types et ON mo.expense_type_id = et.type_id
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (status) {
      conditions.push(`mo.status = $${++paramCount}`);
      params.push(status);
    }

    if (priority) {
      conditions.push(`mo.priority = $${++paramCount}`);
      params.push(priority);
    }

    if (requestor_type) {
      conditions.push(`mo.requestor_type = $${++paramCount}`);
      params.push(requestor_type);
    }

    if (property_id) {
      conditions.push(`mo.property_id = $${++paramCount}`);
      params.push(property_id);
    }

    if (vendor_id) {
      conditions.push(`mo.vendor_id = $${++paramCount}`);
      params.push(vendor_id);
    }

    if (date_from) {
      conditions.push(`mo.requested_date >= $${++paramCount}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`mo.requested_date <= $${++paramCount}`);
      params.push(date_to);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM rems.maintenance_orders mo`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (status) {
      countConditions.push(`mo.status = $${++countParamCount}`);
      countParams.push(status);
    }

    if (priority) {
      countConditions.push(`mo.priority = $${++countParamCount}`);
      countParams.push(priority);
    }

    if (requestor_type) {
      countConditions.push(`mo.requestor_type = $${++countParamCount}`);
      countParams.push(requestor_type);
    }

    if (property_id) {
      countConditions.push(`mo.property_id = $${++countParamCount}`);
      countParams.push(property_id);
    }

    if (vendor_id) {
      countConditions.push(`mo.vendor_id = $${++countParamCount}`);
      countParams.push(vendor_id);
    }

    if (date_from) {
      countConditions.push(`mo.requested_date >= $${++countParamCount}`);
      countParams.push(date_from);
    }

    if (date_to) {
      countConditions.push(`mo.requested_date <= $${++countParamCount}`);
      countParams.push(date_to);
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      maintenance_orders: result.rows,
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
        mo.*,
        p.property_code,
        p.property_name,
        p.location as property_location,
        u.unit_number,
        u.unit_type,
        u.floor_number,
        t.full_name as tenant_name,
        t.email as tenant_email,
        t.mobile as tenant_mobile,
        o.full_name as owner_name,
        o.email as owner_email,
        o.mobile as owner_mobile,
        v.vendor_name,
        v.contact_person as vendor_contact,
        v.phone_primary as vendor_phone,
        v.email as vendor_email,
        v.specialization as vendor_specialization,
        et.type_name as expense_type,
        ec.category_name as expense_category,
        CASE 
          WHEN mo.scheduled_date < CURRENT_TIMESTAMP AND mo.status NOT IN ('completed', 'cancelled')
          THEN true 
          ELSE false 
        END as is_overdue
      FROM rems.maintenance_orders mo
      LEFT JOIN rems.properties p ON mo.property_id = p.property_id
      LEFT JOIN rems.units u ON mo.unit_id = u.unit_id
      LEFT JOIN rems.tenants t ON mo.tenant_id = t.tenant_id
      LEFT JOIN rems.owners o ON mo.owner_id = o.owner_id
      LEFT JOIN rems.vendors v ON mo.vendor_id = v.vendor_id
      LEFT JOIN rems.expense_types et ON mo.expense_type_id = et.type_id
      LEFT JOIN rems.expense_categories ec ON et.category_id = ec.category_id
      WHERE mo.maintenance_order_id = $1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const maintenanceOrder = result.rows[0];

    // Get related expenses if any
    const expensesQuery = `
      SELECT 
        et.*,
        r.receipt_number,
        r.amount_received,
        r.payment_date
      FROM rems.expense_transactions et
      LEFT JOIN rems.receipts r ON et.receipt_id = r.receipt_id
      WHERE et.maintenance_order_id = $1
      ORDER BY et.expense_date DESC
    `;

    const expensesResult = await pool.query(expensesQuery, [id]);
    maintenanceOrder.expenses = expensesResult.rows;

    return maintenanceOrder;
  }

  static async create(maintenanceData) {
    const {
      unit_id,
      property_id,
      tenant_id,
      owner_id,
      requestor_type,
      expense_type_id,
      title,
      description,
      priority,
      estimated_cost,
      estimated_duration_hours,
      requires_approval,
    } = maintenanceData;

    const query = `
      INSERT INTO rems.maintenance_orders (
        unit_id, property_id, tenant_id, owner_id, requestor_type,
        expense_type_id, title, description, priority, estimated_cost,
        estimated_duration_hours, requires_approval
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      unit_id,
      property_id,
      tenant_id,
      owner_id,
      requestor_type,
      expense_type_id,
      title,
      description,
      priority || 'medium',
      estimated_cost,
      estimated_duration_hours,
      requires_approval || false,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, maintenanceData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'title',
      'description',
      'priority',
      'status',
      'estimated_cost',
      'actual_cost',
      'estimated_duration_hours',
      'actual_duration_hours',
      'vendor_notes',
      'admin_notes',
      'internal_notes',
      'photos_before',
      'photos_after',
    ];

    for (const field of allowedFields) {
      if (maintenanceData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(maintenanceData[field]);
      }
    }

    // Handle status-specific date updates
    if (maintenanceData.status) {
      const statusDateMap = {
        acknowledged: 'acknowledged_date',
        scheduled: 'scheduled_date',
        in_progress: 'started_date',
        completed: 'completed_date',
      };

      const dateField = statusDateMap[maintenanceData.status];
      if (dateField && !maintenanceData[dateField]) {
        updateFields.push(`${dateField} = CURRENT_TIMESTAMP`);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.maintenance_orders 
      SET ${updateFields.join(', ')}
      WHERE maintenance_order_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async assignToVendor(id, assignmentData) {
    const {
      vendor_id,
      scheduled_date,
      estimated_cost,
      estimated_duration_hours,
      admin_notes,
    } = assignmentData;

    const query = `
      UPDATE rems.maintenance_orders 
      SET 
        vendor_id = $1,
        scheduled_date = $2,
        estimated_cost = COALESCE($3, estimated_cost),
        estimated_duration_hours = COALESCE($4, estimated_duration_hours),
        admin_notes = COALESCE($5, admin_notes),
        status = CASE WHEN status = 'submitted' THEN 'scheduled' ELSE status END,
        acknowledged_date = CASE WHEN acknowledged_date IS NULL THEN CURRENT_TIMESTAMP ELSE acknowledged_date END,
        updated_at = CURRENT_TIMESTAMP
      WHERE maintenance_order_id = $6
      RETURNING *
    `;

    const values = [
      vendor_id,
      scheduled_date,
      estimated_cost,
      estimated_duration_hours,
      admin_notes,
      id,
    ];

    const result = await pool.query(query, values);

    // Update vendor job count
    if (vendor_id) {
      await pool.query(
        'UPDATE rems.vendors SET total_jobs_completed = total_jobs_completed + 1 WHERE vendor_id = $1',
        [vendor_id]
      );
    }

    return result.rows[0];
  }

  static async updateStatus(id, statusData) {
    const { status, notes } = statusData;

    // Validate status transition
    const validTransitions = {
      submitted: ['acknowledged', 'cancelled', 'rejected'],
      acknowledged: ['scheduled', 'approved', 'cancelled', 'rejected'],
      approved: ['scheduled', 'cancelled'],
      scheduled: ['in_progress', 'cancelled', 'on_hold'],
      in_progress: ['completed', 'cancelled', 'on_hold'],
      on_hold: ['scheduled', 'in_progress', 'cancelled'],
      completed: ['cancelled'], // Only allow cancellation of completed orders
      cancelled: [], // Cannot change from cancelled
      rejected: [], // Cannot change from rejected
    };

    // Get current status
    const currentResult = await pool.query(
      'SELECT status FROM rems.maintenance_orders WHERE maintenance_order_id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      throw new Error('Maintenance order not found');
    }

    const currentStatus = currentResult.rows[0].status;

    if (
      !validTransitions[currentStatus] ||
      !validTransitions[currentStatus].includes(status)
    ) {
      throw new Error(
        `Invalid status transition from '${currentStatus}' to '${status}'`
      );
    }

    const updateFields = ['status = $1'];
    const values = [status];
    let paramCount = 1;

    // Add timestamp based on status
    const statusDateMap = {
      acknowledged: 'acknowledged_date',
      scheduled: 'scheduled_date',
      in_progress: 'started_date',
      completed: 'completed_date',
    };

    if (statusDateMap[status]) {
      updateFields.push(`${statusDateMap[status]} = CURRENT_TIMESTAMP`);
    }

    if (notes) {
      updateFields.push(
        `admin_notes = COALESCE(admin_notes, '') || $${++paramCount}`
      );
      values.push(`\n${new Date().toISOString()}: ${notes}`);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.maintenance_orders 
      SET ${updateFields.join(', ')}
      WHERE maintenance_order_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async approve(id, approvalData) {
    const { approved_by, notes } = approvalData;

    const query = `
      UPDATE rems.maintenance_orders 
      SET 
        status = 'approved',
        approved_by = $1,
        approved_date = CURRENT_TIMESTAMP,
        admin_notes = COALESCE(admin_notes, '') || $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE maintenance_order_id = $3 AND status IN ('submitted', 'acknowledged')
      RETURNING *
    `;

    const approvalNote = `\n${new Date().toISOString()}: Approved - ${notes || 'No additional notes'}`;
    const values = [approved_by, approvalNote, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error(
        'Maintenance order not found or cannot be approved in current status'
      );
    }

    return result.rows[0];
  }

  static async getPendingOrders(filters = {}) {
    const { page = 1, limit = 20, priority, property_id } = filters;

    const offset = (page - 1) * limit;
    let conditions = [`mo.status IN ('submitted', 'acknowledged')`];
    let params = [];
    let paramCount = 0;

    if (priority) {
      conditions.push(`mo.priority = $${++paramCount}`);
      params.push(priority);
    }

    if (property_id) {
      conditions.push(`mo.property_id = $${++paramCount}`);
      params.push(property_id);
    }

    const query = `
      SELECT 
        mo.maintenance_order_id,
        mo.order_number,
        mo.title,
        mo.priority,
        mo.status,
        mo.requested_date,
        mo.estimated_cost,
        p.property_code,
        p.property_name,
        u.unit_number,
        t.full_name as tenant_name,
        o.full_name as owner_name,
        et.type_name as expense_type
      FROM rems.maintenance_orders mo
      LEFT JOIN rems.properties p ON mo.property_id = p.property_id
      LEFT JOIN rems.units u ON mo.unit_id = u.unit_id
      LEFT JOIN rems.tenants t ON mo.tenant_id = t.tenant_id
      LEFT JOIN rems.owners o ON mo.owner_id = o.owner_id
      LEFT JOIN rems.expense_types et ON mo.expense_type_id = et.type_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY 
        CASE mo.priority 
          WHEN 'emergency' THEN 1 
          WHEN 'urgent' THEN 2 
          WHEN 'high' THEN 3 
          WHEN 'medium' THEN 4 
          WHEN 'low' THEN 5 
        END,
        mo.requested_date ASC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getOrdersByVendor(vendorId, filters = {}) {
    const { page = 1, limit = 20, status } = filters;

    const offset = (page - 1) * limit;
    let conditions = [`mo.vendor_id = $1`];
    let params = [vendorId];
    let paramCount = 1;

    if (status) {
      conditions.push(`mo.status = $${++paramCount}`);
      params.push(status);
    }

    const query = `
      SELECT 
        mo.*,
        p.property_code,
        p.property_name,
        u.unit_number,
        et.type_name as expense_type
      FROM rems.maintenance_orders mo
      LEFT JOIN rems.properties p ON mo.property_id = p.property_id
      LEFT JOIN rems.units u ON mo.unit_id = u.unit_id
      LEFT JOIN rems.expense_types et ON mo.expense_type_id = et.type_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY mo.scheduled_date ASC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Maintenance;
