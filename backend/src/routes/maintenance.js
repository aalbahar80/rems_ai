const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const {
  authenticateToken: authenticate,
  authorizeRoles: authorize,
} = require('../middleware/auth');

// Maintenance order routes
// GET /api/v1/maintenance - List all maintenance orders with pagination and filtering
router.get('/', authenticate, MaintenanceController.getMaintenanceOrders);

// GET /api/v1/maintenance/pending - Get pending maintenance orders
router.get('/pending', authenticate, MaintenanceController.getPendingOrders);

// GET /api/v1/maintenance/:id - Get maintenance order details
router.get('/:id', authenticate, MaintenanceController.getMaintenanceOrder);

// POST /api/v1/maintenance - Create new maintenance order
router.post('/', authenticate, MaintenanceController.createMaintenanceOrder);

// PUT /api/v1/maintenance/:id - Update maintenance order (Admin/Owner only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'owner']),
  MaintenanceController.updateMaintenanceOrder
);

// POST /api/v1/maintenance/:id/assign - Assign to vendor (Admin only)
router.post(
  '/:id/assign',
  authenticate,
  authorize(['admin']),
  MaintenanceController.assignToVendor
);

// PUT /api/v1/maintenance/:id/status - Update status (Admin/Vendor only)
router.put(
  '/:id/status',
  authenticate,
  authorize(['admin', 'vendor']),
  MaintenanceController.updateStatus
);

// POST /api/v1/maintenance/:id/approve - Approve order (Admin/Owner only)
router.post(
  '/:id/approve',
  authenticate,
  authorize(['admin', 'owner']),
  MaintenanceController.approveOrder
);

// Vendor routes
// GET /api/v1/maintenance/vendors - List all vendors with pagination and filtering
router.get('/vendors', authenticate, MaintenanceController.getVendors);

// GET /api/v1/maintenance/vendors/available - Get available vendors for assignment
router.get(
  '/vendors/available',
  authenticate,
  MaintenanceController.getAvailableVendors
);

// GET /api/v1/maintenance/vendors/:id - Get vendor details
router.get('/vendors/:id', authenticate, MaintenanceController.getVendor);

// GET /api/v1/maintenance/vendors/:vendorId/orders - Get orders assigned to vendor
router.get(
  '/vendors/:vendorId/orders',
  authenticate,
  MaintenanceController.getVendorOrders
);

// GET /api/v1/maintenance/vendors/:vendorId/performance - Get vendor performance report
router.get(
  '/vendors/:vendorId/performance',
  authenticate,
  authorize(['admin', 'owner']),
  MaintenanceController.getVendorPerformance
);

// POST /api/v1/maintenance/vendors - Create new vendor (Admin only)
router.post(
  '/vendors',
  authenticate,
  authorize(['admin']),
  MaintenanceController.createVendor
);

// PUT /api/v1/maintenance/vendors/:id - Update vendor (Admin only)
router.put(
  '/vendors/:id',
  authenticate,
  authorize(['admin']),
  MaintenanceController.updateVendor
);

// DELETE /api/v1/maintenance/vendors/:id - Soft delete vendor (Admin only)
router.delete(
  '/vendors/:id',
  authenticate,
  authorize(['admin']),
  MaintenanceController.deleteVendor
);

module.exports = router;
