const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const {
  authenticateToken: authenticate,
  authorizeRoles: authorize,
} = require('../middleware/auth');

// Property management routes

// GET /api/v1/properties - List all properties with pagination and filtering
router.get('/', authenticate, PropertyController.getProperties);

// GET /api/v1/properties/search - Search properties
router.get('/search', authenticate, PropertyController.searchProperties);

// GET /api/v1/properties/owner/:ownerId - Get properties by owner
router.get(
  '/owner/:ownerId',
  authenticate,
  PropertyController.getPropertiesByOwner
);

// GET /api/v1/properties/:id - Get property details with ownership info
router.get('/:id', authenticate, PropertyController.getProperty);

// GET /api/v1/properties/:id/units - Get property units
router.get('/:id/units', authenticate, PropertyController.getPropertyUnits);

// GET /api/v1/properties/:id/owners - Get property ownership details
router.get(
  '/:id/owners',
  authenticate,
  PropertyController.getPropertyOwnership
);

// POST /api/v1/properties - Create new property (Admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  PropertyController.createProperty
);

// PUT /api/v1/properties/:id - Update property (Admin/Owner only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'owner']),
  PropertyController.updateProperty
);

// DELETE /api/v1/properties/:id - Soft delete property (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  PropertyController.deleteProperty
);

module.exports = router;
