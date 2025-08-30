const pool = require('../config/database');

class Receipt {
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'payment_date',
      order = 'desc',
      payment_method,
      payment_provider,
      payment_status,
      date_from,
      date_to,
      invoice_id,
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        r.receipt_id,
        r.receipt_number,
        r.invoice_id,
        r.payment_date,
        r.amount_received,
        r.currency,
        r.payment_method,
        r.payment_provider,
        r.payment_type,
        r.external_transaction_id,
        r.provider_fee_amount,
        r.exchange_rate,
        r.payment_status,
        r.payment_description,
        r.payer_name,
        r.payer_contact,
        r.receipt_type,
        r.created_at,
        r.updated_at,
        i.invoice_number,
        i.invoice_type,
        i.total_amount as invoice_total
      FROM rems.receipts r
      LEFT JOIN rems.invoices i ON r.invoice_id = i.invoice_id
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (payment_method) {
      conditions.push(`r.payment_method = $${++paramCount}`);
      params.push(payment_method);
    }

    if (payment_provider) {
      conditions.push(`r.payment_provider = $${++paramCount}`);
      params.push(payment_provider);
    }

    if (payment_status) {
      conditions.push(`r.payment_status = $${++paramCount}`);
      params.push(payment_status);
    }

    if (date_from) {
      conditions.push(`r.payment_date >= $${++paramCount}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`r.payment_date <= $${++paramCount}`);
      params.push(date_to);
    }

    if (invoice_id) {
      conditions.push(`r.invoice_id = $${++paramCount}`);
      params.push(invoice_id);
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
    let countQuery = `SELECT COUNT(*) as total FROM rems.receipts r`;
    let countConditions = [];
    let countParams = [];
    let countParamCount = 0;

    if (payment_method) {
      countConditions.push(`r.payment_method = $${++countParamCount}`);
      countParams.push(payment_method);
    }

    if (payment_provider) {
      countConditions.push(`r.payment_provider = $${++countParamCount}`);
      countParams.push(payment_provider);
    }

    if (payment_status) {
      countConditions.push(`r.payment_status = $${++countParamCount}`);
      countParams.push(payment_status);
    }

    if (date_from) {
      countConditions.push(`r.payment_date >= $${++countParamCount}`);
      countParams.push(date_from);
    }

    if (date_to) {
      countConditions.push(`r.payment_date <= $${++countParamCount}`);
      countParams.push(date_to);
    }

    if (invoice_id) {
      countConditions.push(`r.invoice_id = $${++countParamCount}`);
      countParams.push(invoice_id);
    }

    if (countConditions.length > 0) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      receipts: result.rows,
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
        r.*,
        i.invoice_number,
        i.invoice_type,
        i.total_amount as invoice_total,
        i.entity_type,
        i.entity_id
      FROM rems.receipts r
      LEFT JOIN rems.invoices i ON r.invoice_id = i.invoice_id
      WHERE r.receipt_id = $1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const receipt = result.rows[0];

    // Get related entity information if invoice exists
    if (receipt.invoice_id && receipt.entity_type === 'rental_contract') {
      const entityQuery = `
        SELECT 
          rc.contract_number,
          t.full_name as tenant_name,
          t.email as tenant_email,
          u.unit_number,
          p.property_code,
          p.property_name
        FROM rems.rental_contracts rc
        JOIN rems.tenants t ON rc.tenant_id = t.tenant_id
        JOIN rems.units u ON rc.unit_id = u.unit_id
        JOIN rems.properties p ON u.property_id = p.property_id
        WHERE rc.contract_id = $1
      `;
      const entityResult = await pool.query(entityQuery, [receipt.entity_id]);
      if (entityResult.rows.length > 0) {
        receipt.entity_details = entityResult.rows[0];
      }
    }

    return receipt;
  }

  static async create(receiptData) {
    const {
      invoice_id,
      payment_date,
      amount_received,
      currency,
      payment_method,
      payment_provider,
      payment_type,
      external_transaction_id,
      provider_fee_amount,
      exchange_rate,
      bank_reference,
      check_number,
      payment_status,
      payment_description,
      payer_name,
      payer_contact,
      received_by,
      location_received,
      receipt_type,
      notes,
    } = receiptData;

    const query = `
      INSERT INTO rems.receipts (
        invoice_id, payment_date, amount_received, currency, payment_method,
        payment_provider, payment_type, external_transaction_id, provider_fee_amount,
        exchange_rate, bank_reference, check_number, payment_status, payment_description,
        payer_name, payer_contact, received_by, location_received, receipt_type, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const values = [
      invoice_id,
      payment_date || new Date(),
      amount_received,
      currency || 'KWD',
      payment_method,
      payment_provider,
      payment_type,
      external_transaction_id,
      provider_fee_amount || 0,
      exchange_rate || 1.0,
      bank_reference,
      check_number,
      payment_status || 'completed',
      payment_description,
      payer_name,
      payer_contact,
      received_by,
      location_received,
      receipt_type || 'payment',
      notes,
    ];

    const result = await pool.query(query, values);

    // Update invoice status if fully paid
    if (invoice_id && result.rows[0].payment_status === 'completed') {
      await this.updateInvoiceStatus(invoice_id);
    }

    return result.rows[0];
  }

  static async update(id, receiptData) {
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      'payment_date',
      'amount_received',
      'currency',
      'payment_method',
      'payment_provider',
      'payment_type',
      'external_transaction_id',
      'provider_fee_amount',
      'exchange_rate',
      'bank_reference',
      'check_number',
      'payment_status',
      'payment_description',
      'payer_name',
      'payer_contact',
      'location_received',
      'receipt_type',
      'notes',
    ];

    for (const field of allowedFields) {
      if (receiptData.hasOwnProperty(field)) {
        updateFields.push(`${field} = $${++paramCount}`);
        values.push(receiptData[field]);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE rems.receipts 
      SET ${updateFields.join(', ')}
      WHERE receipt_id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    // Update invoice status if payment status changed
    if (
      result.rows[0] &&
      result.rows[0].invoice_id &&
      receiptData.hasOwnProperty('payment_status')
    ) {
      await this.updateInvoiceStatus(result.rows[0].invoice_id);
    }

    return result.rows[0];
  }

  static async updateInvoiceStatus(invoiceId) {
    // Calculate total payments for the invoice
    const paymentsQuery = `
      SELECT 
        i.total_amount,
        COALESCE(SUM(r.amount_received), 0) as total_paid
      FROM rems.invoices i
      LEFT JOIN rems.receipts r ON i.invoice_id = r.invoice_id AND r.payment_status = 'completed'
      WHERE i.invoice_id = $1
      GROUP BY i.total_amount
    `;

    const result = await pool.query(paymentsQuery, [invoiceId]);
    if (result.rows.length === 0) return;

    const { total_amount, total_paid } = result.rows[0];
    const totalAmount = parseFloat(total_amount);
    const totalPaid = parseFloat(total_paid);

    let newStatus = 'draft';
    if (totalPaid === 0) {
      newStatus = 'sent';
    } else if (totalPaid >= totalAmount) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partial_paid';
    }

    const updateQuery = `
      UPDATE rems.invoices 
      SET invoice_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE invoice_id = $2
    `;

    await pool.query(updateQuery, [newStatus, invoiceId]);
  }

  static async refund(id, refundData) {
    const { refund_reason, refund_amount } = refundData;

    // Create refund receipt
    const refundReceipt = {
      ...refundData,
      amount_received: -Math.abs(refund_amount || refundData.amount_received),
      receipt_type: 'refund',
      refund_reason,
      payment_status: 'completed',
    };

    const query = `
      INSERT INTO rems.receipts (
        invoice_id, payment_date, amount_received, currency, payment_method,
        payment_provider, receipt_type, refund_reason, notes, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      refundReceipt.invoice_id,
      refundReceipt.payment_date || new Date(),
      refundReceipt.amount_received,
      refundReceipt.currency || 'KWD',
      refundReceipt.payment_method,
      refundReceipt.payment_provider,
      refundReceipt.receipt_type,
      refundReceipt.refund_reason,
      refundReceipt.notes,
      refundReceipt.payment_status,
    ];

    const result = await pool.query(query, values);

    // Update invoice status
    if (refundReceipt.invoice_id) {
      await this.updateInvoiceStatus(refundReceipt.invoice_id);
    }

    return result.rows[0];
  }

  static async getPaymentSummary(filters = {}) {
    const { date_from, date_to, payment_method, currency = 'KWD' } = filters;

    let conditions = [`r.payment_status = 'completed'`, `r.currency = $1`];
    let params = [currency];
    let paramCount = 1;

    if (date_from) {
      conditions.push(`r.payment_date >= $${++paramCount}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`r.payment_date <= $${++paramCount}`);
      params.push(date_to);
    }

    if (payment_method) {
      conditions.push(`r.payment_method = $${++paramCount}`);
      params.push(payment_method);
    }

    const query = `
      SELECT 
        r.payment_method,
        r.payment_provider,
        COUNT(*) as transaction_count,
        SUM(r.amount_received) as total_amount,
        SUM(r.provider_fee_amount) as total_fees,
        AVG(r.amount_received) as average_amount
      FROM rems.receipts r
      WHERE ${conditions.join(' AND ')}
      GROUP BY r.payment_method, r.payment_provider
      ORDER BY total_amount DESC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Receipt;
