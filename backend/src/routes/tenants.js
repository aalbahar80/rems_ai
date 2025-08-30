const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');
const {
  authenticateToken: authenticate,
  authorizeRoles: authorize,
} = require('../middleware/auth');

// Tenant management routes

// GET /api/v1/tenants - List all tenants with pagination and filtering
router.get('/', authenticate, TenantController.getTenants);

// GET /api/v1/tenants/:id - Get tenant details with contracts
router.get('/:id', authenticate, TenantController.getTenant);

// GET /api/v1/tenants/:id/contracts - Get tenant contracts
router.get('/:id/contracts', authenticate, TenantController.getTenantContracts);

// GET /api/v1/tenants/:id/payments - Get tenant payment history
router.get('/:id/payments', authenticate, TenantController.getTenantPayments);

// POST /api/v1/tenants - Create new tenant (Admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  TenantController.createTenant
);

// PUT /api/v1/tenants/:id - Update tenant (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  TenantController.updateTenant
);

// DELETE /api/v1/tenants/:id - Soft delete tenant (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  TenantController.deleteTenant
);

module.exports = router;
