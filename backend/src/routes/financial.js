const express = require('express');
const router = express.Router();
const FinancialController = require('../controllers/financialController');
const {
  authenticateToken: authenticate,
  authorizeRoles: authorize,
} = require('../middleware/auth');

// Invoice routes
// GET /api/v1/financial/invoices - List all invoices with pagination and filtering
router.get('/invoices', authenticate, FinancialController.getInvoices);

// GET /api/v1/financial/invoices/overdue - Get overdue invoices
router.get(
  '/invoices/overdue',
  authenticate,
  FinancialController.getOverdueInvoices
);

// GET /api/v1/financial/invoices/:id - Get invoice details
router.get('/invoices/:id', authenticate, FinancialController.getInvoice);

// POST /api/v1/financial/invoices - Create new invoice (Admin/Owner only)
router.post(
  '/invoices',
  authenticate,
  authorize(['admin', 'owner']),
  FinancialController.createInvoice
);

// PUT /api/v1/financial/invoices/:id - Update invoice (Admin/Owner only)
router.put(
  '/invoices/:id',
  authenticate,
  authorize(['admin', 'owner']),
  FinancialController.updateInvoice
);

// POST /api/v1/financial/invoices/:id/send - Send invoice (Admin/Owner only)
router.post(
  '/invoices/:id/send',
  authenticate,
  authorize(['admin', 'owner']),
  FinancialController.sendInvoice
);

// POST /api/v1/financial/invoices/:id/cancel - Cancel invoice (Admin only)
router.post(
  '/invoices/:id/cancel',
  authenticate,
  authorize(['admin']),
  FinancialController.cancelInvoice
);

// Receipt routes
// GET /api/v1/financial/receipts - List all receipts with pagination and filtering
router.get('/receipts', authenticate, FinancialController.getReceipts);

// GET /api/v1/financial/receipts/summary - Get payment summary
router.get(
  '/receipts/summary',
  authenticate,
  FinancialController.getPaymentSummary
);

// GET /api/v1/financial/receipts/:id - Get receipt details
router.get('/receipts/:id', authenticate, FinancialController.getReceipt);

// POST /api/v1/financial/receipts - Create new receipt (Admin/Owner only)
router.post(
  '/receipts',
  authenticate,
  authorize(['admin', 'owner']),
  FinancialController.createReceipt
);

// PUT /api/v1/financial/receipts/:id - Update receipt (Admin/Owner only)
router.put(
  '/receipts/:id',
  authenticate,
  authorize(['admin', 'owner']),
  FinancialController.updateReceipt
);

// POST /api/v1/financial/receipts/:id/refund - Process refund (Admin only)
router.post(
  '/receipts/:id/refund',
  authenticate,
  authorize(['admin']),
  FinancialController.refundReceipt
);

module.exports = router;
