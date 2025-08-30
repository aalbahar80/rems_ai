const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');

class FinancialController {
  // Invoice endpoints
  static async getInvoices(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'issue_date',
        order: req.query.order || 'desc',
        status: req.query.status,
        invoice_type: req.query.invoice_type,
        entity_type: req.query.entity_type,
        date_from: req.query.date_from,
        date_to: req.query.date_to,
        overdue_only: req.query.overdue_only === 'true',
      };

      const result = await Invoice.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Invoices retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve invoices',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Invoice not found',
            details: `Invoice with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: invoice,
        message: 'Invoice retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve invoice',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createInvoice(req, res) {
    try {
      // Validate required fields
      const requiredFields = [
        'invoice_type',
        'entity_id',
        'entity_type',
        'due_date',
        'total_amount',
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: `Required fields: ${missingFields.join(', ')}`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const invoice = await Invoice.create(req.body);

      res.status(201).json({
        success: true,
        data: invoice,
        message: 'Invoice created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating invoice:', error);

      // Handle database constraint violations
      if (error.code === '23505') {
        // Unique constraint violation
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Invoice number already exists',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid invoice data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invoice',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateInvoice(req, res) {
    try {
      const { id } = req.params;

      // Check if invoice exists
      const existingInvoice = await Invoice.findById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Invoice not found',
            details: `Invoice with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Prevent updating paid invoices
      if (existingInvoice.invoice_status === 'paid') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot update paid invoice',
            details: 'Paid invoices cannot be modified',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedInvoice = await Invoice.update(id, req.body);

      res.json({
        success: true,
        data: updatedInvoice,
        message: 'Invoice updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating invoice:', error);

      if (error.message === 'No valid fields to update') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No valid fields provided for update',
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update invoice',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async sendInvoice(req, res) {
    try {
      const { id } = req.params;

      // Check if invoice exists
      const existingInvoice = await Invoice.findById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Invoice not found',
            details: `Invoice with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (existingInvoice.invoice_status !== 'draft') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Only draft invoices can be sent',
            details: `Invoice status is '${existingInvoice.invoice_status}'`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const sentInvoice = await Invoice.markAsSent(id);

      res.json({
        success: true,
        data: sentInvoice,
        message: 'Invoice sent successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending invoice:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send invoice',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async cancelInvoice(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Check if invoice exists
      const existingInvoice = await Invoice.findById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Invoice not found',
            details: `Invoice with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (existingInvoice.invoice_status === 'paid') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot cancel paid invoice',
            details: 'Paid invoices cannot be cancelled. Use refund instead.',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const cancelledInvoice = await Invoice.cancel(
        id,
        reason || 'No reason provided'
      );

      res.json({
        success: true,
        data: cancelledInvoice,
        message: 'Invoice cancelled successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cancel invoice',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getOverdueInvoices(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        days_overdue: req.query.days_overdue
          ? parseInt(req.query.days_overdue)
          : null,
      };

      const overdueInvoices = await Invoice.getOverdueInvoices(filters);

      res.json({
        success: true,
        data: overdueInvoices,
        message: 'Overdue invoices retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching overdue invoices:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve overdue invoices',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Receipt endpoints
  static async getReceipts(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'payment_date',
        order: req.query.order || 'desc',
        payment_method: req.query.payment_method,
        payment_provider: req.query.payment_provider,
        payment_status: req.query.payment_status,
        date_from: req.query.date_from,
        date_to: req.query.date_to,
        invoice_id: req.query.invoice_id,
      };

      const result = await Receipt.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Receipts retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching receipts:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve receipts',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getReceipt(req, res) {
    try {
      const { id } = req.params;
      const receipt = await Receipt.findById(id);

      if (!receipt) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Receipt not found',
            details: `Receipt with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: receipt,
        message: 'Receipt retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching receipt:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve receipt',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createReceipt(req, res) {
    try {
      // Validate required fields
      const requiredFields = ['amount_received', 'payment_method'];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: `Required fields: ${missingFields.join(', ')}`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const receipt = await Receipt.create(req.body);

      res.status(201).json({
        success: true,
        data: receipt,
        message: 'Receipt created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating receipt:', error);

      // Handle database constraint violations
      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid receipt data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create receipt',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateReceipt(req, res) {
    try {
      const { id } = req.params;

      // Check if receipt exists
      const existingReceipt = await Receipt.findById(id);
      if (!existingReceipt) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Receipt not found',
            details: `Receipt with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedReceipt = await Receipt.update(id, req.body);

      res.json({
        success: true,
        data: updatedReceipt,
        message: 'Receipt updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating receipt:', error);

      if (error.message === 'No valid fields to update') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No valid fields provided for update',
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update receipt',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async refundReceipt(req, res) {
    try {
      const { id } = req.params;
      const { refund_reason, refund_amount } = req.body;

      // Check if receipt exists
      const existingReceipt = await Receipt.findById(id);
      if (!existingReceipt) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Receipt not found',
            details: `Receipt with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (existingReceipt.payment_status !== 'completed') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Only completed receipts can be refunded',
            details: `Receipt status is '${existingReceipt.payment_status}'`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const refundData = {
        ...req.body,
        invoice_id: existingReceipt.invoice_id,
        currency: existingReceipt.currency,
        payment_method: existingReceipt.payment_method,
        payment_provider: existingReceipt.payment_provider,
        refund_amount: refund_amount || existingReceipt.amount_received,
      };

      const refundReceipt = await Receipt.refund(id, refundData);

      res.status(201).json({
        success: true,
        data: refundReceipt,
        message: 'Refund processed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process refund',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getPaymentSummary(req, res) {
    try {
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to,
        payment_method: req.query.payment_method,
        currency: req.query.currency || 'KWD',
      };

      const summary = await Receipt.getPaymentSummary(filters);

      res.json({
        success: true,
        data: summary,
        message: 'Payment summary retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve payment summary',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = FinancialController;
