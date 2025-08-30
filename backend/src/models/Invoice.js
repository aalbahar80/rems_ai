const pool = require('../config/database');

class Invoice {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'issue_date',
      order = 'desc',
      status,
      invoice_type,
      entity_type,
      date_from,
      date_to,
      overdue_only = false,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        i.invoice_id,
        i.invoice_number,
        i.invoice_type,
        i.entity_id,
        i.entity_type,
        i.issue_date,
        i.due_date,
        i.total_amount,
        i.currency,
        i.invoice_status,
        i.payment_terms,
        i.is_recurring,
        i.tax_amount,
        i.discount_amount,
        i.late_fee_amount,
        i.description,
        i.sent_date,
        i.created_at,
        i.updated_at,
        COALESCE(SUM(r.amount_received), 0) as paid_amount,
        (i.total_amount - COALESCE(SUM(r.amount_received), 0)) as outstanding_amount,
        CASE 
          WHEN i.due_date < CURRENT_DATE AND i.invoice_status NOT IN ('paid', 'cancelled', 'refunded') 
          THEN true 
          ELSE false 
        END as is_overdue
      FROM rems.invoices i
      LEFT JOIN rems.receipts r ON i.invoice_id = r.invoice_id AND r.payment_status = 'completed'
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (status) {
      conditions.push(`i.invoice_status = $${++paramCount}`);
      params.push(status);
    }

    if (invoice_type) {
      conditions.push(`i.invoice_type = $${++paramCount}`);
      params.push(invoice_type);
    }

    if (entity_type) {
      conditions.push(`i.entity_type = $${++paramCount}`);
      params.push(entity_type);
    }

    if (date_from) {
      conditions.push(`i.issue_date >= $${++paramCount}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`i.issue_date <= $${++paramCount}`);
      params.push(date_to);
    }

    if (overdue_only) {
      conditions.push(
        `i.due_date < CURRENT_DATE AND i.invoice_status NOT IN ('paid', 'cancelled', 'refunded')`
      );
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY i.invoice_id, i.invoice_number, i.invoice_type, i.entity_id, i.entity_type,
               i.issue_date, i.due_date, i.total_amount, i.currency, i.invoice_status,
               i.payment_terms, i.is_recurring, i.tax_amount, i.discount_amount, 
               i.late_fee_amount, i.description, i.sent_date, i.created_at, i.updated_at
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM rems.invoices i`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (status) {
      countConditions.push(`i.invoice_status = $${++countParamCount}`);
      countParams.push(status);
    }

    if (invoice_type) {
      countConditions.push(`i.invoice_type = $${++countParamCount}`);
      countParams.push(invoice_type);
    }

    if (entity_type) {
      countConditions.push(`i.entity_type = $${++countParamCount}`);
      countParams.push(entity_type);
    }

    if (date_from) {
      countConditions.push(`i.issue_date >= $${++countParamCount}`);
      countParams.push(date_from);
    }

    if (date_to) {
      countConditions.push(`i.issue_date <= $${++countParamCount}`);
      countParams.push(date_to);
    }

    if (overdue_only) {
      countConditions.push(
        `i.due_date < CURRENT_DATE AND i.invoice_status NOT IN ('paid', 'cancelled', 'refunded')`
      );
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      invoices: result.rows,
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
        i.*,
        COALESCE(SUM(r.amount_received), 0) as paid_amount,
        (i.total_amount - COALESCE(SUM(r.amount_received), 0)) as outstanding_amount,
        CASE 
          WHEN i.due_date < CURRENT_DATE AND i.invoice_status NOT IN ('paid', 'cancelled', 'refunded') 
          THEN true 
          ELSE false 
        END as is_overdue
      FROM rems.invoices i
      LEFT JOIN rems.receipts r ON i.invoice_id = r.invoice_id AND r.payment_status = 'completed'
      WHERE i.invoice_id = $1
      GROUP BY i.invoice_id
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const invoice = result.rows[0];

    // Get related entity information
    if (invoice.entity_type === 'rental_contract') {
      const entityQuery = `
        SELECT 
          rc.contract_number,
          rc.monthly_rent,
          rc.start_date,
          rc.end_date,
          t.full_name as tenant_name,
          t.email as tenant_email,
          t.mobile as tenant_mobile,
          u.unit_number,
          p.property_code,
          p.property_name
        FROM rems.rental_contracts rc
        JOIN rems.tenants t ON rc.tenant_id = t.tenant_id
        JOIN rems.units u ON rc.unit_id = u.unit_id
        JOIN rems.properties p ON u.property_id = p.property_id
        WHERE rc.contract_id = $1
      `;
      const entityResult = await pool.query(entityQuery, [invoice.entity_id]);
      if (entityResult.rows.length > 0) {
        invoice.entity_details = entityResult.rows[0];
      }
    }

    // Get receipts
    const receiptsQuery = `
      SELECT 
        r.*
      FROM rems.receipts r
      WHERE r.invoice_id = $1
      ORDER BY r.payment_date DESC
    `;
    const receiptsResult = await pool.query(receiptsQuery, [id]);
    invoice.receipts = receiptsResult.rows;

    return invoice;
  }

  static async create(invoiceData) {
    const {
      invoice_type,
      entity_id,
      entity_type,
      issue_date,
      due_date,
      total_amount,
      currency,
      payment_terms,
      is_recurring,
      recurring_frequency,
      tax_amount,
      discount_amount,
      late_fee_amount,
      description,
      terms_conditions,
      notes,
      created_by,
    } = invoiceData;

    const query = `
      INSERT INTO rems.invoices (
        invoice_type, entity_id, entity_type, issue_date, due_date, total_amount,
        currency, payment_terms, is_recurring, recurring_frequency, tax_amount,
        discount_amount, late_fee_amount, description, terms_conditions, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      invoice_type,
      entity_id,
      entity_type,
      issue_date || new Date(),
      due_date,
      total_amount,
      currency || 'KWD',
      payment_terms || 'net_30',
      is_recurring || false,
      recurring_frequency,
      tax_amount || 0,
      discount_amount || 0,
      late_fee_amount || 0,
      description,
      terms_conditions,
      notes,
      created_by,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, invoiceData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'invoice_type',
      'due_date',
      'total_amount',
      'currency',
      'invoice_status',
      'payment_terms',
      'tax_amount',
      'discount_amount',
      'late_fee_amount',
      'description',
      'terms_conditions',
      'notes',
    ];

    for (const field of allowedFields) {
      if (invoiceData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(invoiceData[field]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.invoices 
      SET ${updateFields.join(', ')}
      WHERE invoice_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async markAsSent(id) {
    const query = `
      UPDATE rems.invoices 
      SET invoice_status = 'sent', sent_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
      WHERE invoice_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async cancel(id, reason) {
    const query = `
      UPDATE rems.invoices 
      SET invoice_status = 'cancelled', notes = COALESCE(notes, '') || $2, updated_at = CURRENT_TIMESTAMP
      WHERE invoice_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, `\nCancelled: ${reason}`]);
    return result.rows[0];
  }

  static async getOverdueInvoices(filters = {}) {
    const { page = 1, limit = 20, days_overdue } = filters;

    const offset = (page - 1) * limit;
    let conditions = [
      `i.due_date < CURRENT_DATE AND i.invoice_status NOT IN ('paid', 'cancelled', 'refunded')`,
    ];
    let params = [];
    let paramCount = 0;

    if (days_overdue) {
      conditions.push(
        `i.due_date < (CURRENT_DATE - INTERVAL '${days_overdue} days')`
      );
    }

    const query = `
      SELECT 
        i.*,
        COALESCE(SUM(r.amount_received), 0) as paid_amount,
        (i.total_amount - COALESCE(SUM(r.amount_received), 0)) as outstanding_amount,
        (CURRENT_DATE - i.due_date) as days_overdue
      FROM rems.invoices i
      LEFT JOIN rems.receipts r ON i.invoice_id = r.invoice_id AND r.payment_status = 'completed'
      WHERE ${conditions.join(' AND ')}
      GROUP BY i.invoice_id
      ORDER BY i.due_date ASC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Invoice;
