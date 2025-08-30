const Property = require('../models/Property');

class PropertyController {
  static async getProperties(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'property_code',
        order: req.query.order || 'asc',
        location: req.query.location,
        property_type: req.query.property_type,
        is_active:
          req.query.is_active !== undefined
            ? req.query.is_active === 'true'
            : true,
        owner_id: req.query.owner_id,
      };

      const result = await Property.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Properties retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve properties',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getProperty(req, res) {
    try {
      const { id } = req.params;
      const property = await Property.findById(id);

      if (!property) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
            details: `Property with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: property,
        message: 'Property retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve property',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createProperty(req, res) {
    try {
      // Validate required fields
      const requiredFields = ['property_code', 'property_name'];
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

      // Check for duplicate property code
      const existingProperty = await Property.findAll({
        property_code: req.body.property_code,
        limit: 1,
      });

      if (existingProperty.properties.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Property code already exists',
            details: `Property with code '${req.body.property_code}' already exists`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const property = await Property.create(req.body);

      res.status(201).json({
        success: true,
        data: property,
        message: 'Property created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating property:', error);

      // Handle database constraint violations
      if (error.code === '23505') {
        // Unique constraint violation
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Property with this code already exists',
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
            message: 'Invalid property data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create property',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateProperty(req, res) {
    try {
      const { id } = req.params;

      // Check if property exists
      const existingProperty = await Property.findById(id);
      if (!existingProperty) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
            details: `Property with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedProperty = await Property.update(id, req.body);

      res.json({
        success: true,
        data: updatedProperty,
        message: 'Property updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating property:', error);

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

      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid property data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update property',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async deleteProperty(req, res) {
    try {
      const { id } = req.params;

      // Check if property exists
      const existingProperty = await Property.findById(id);
      if (!existingProperty) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
            details: `Property with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      await Property.delete(id);

      res.status(204).json({
        success: true,
        message: 'Property deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete property',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async searchProperties(req, res) {
    try {
      const { q: searchTerm } = req.query;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        min_value: req.query.min_value ? parseFloat(req.query.min_value) : null,
        max_value: req.query.max_value ? parseFloat(req.query.max_value) : null,
      };

      const properties = await Property.search(searchTerm, filters);

      res.json({
        success: true,
        data: properties,
        message: 'Property search completed',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error searching properties:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search properties',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getPropertyUnits(req, res) {
    try {
      const { id } = req.params;

      // Check if property exists
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
            details: `Property with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const units = await Property.getUnits(id);

      res.json({
        success: true,
        data: {
          property_id: id,
          property_code: property.property_code,
          property_name: property.property_name,
          units: units,
        },
        message: 'Property units retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching property units:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve property units',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getPropertiesByOwner(req, res) {
    try {
      const { ownerId } = req.params;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'property_code',
        order: req.query.order || 'asc',
      };

      const result = await Property.findByOwnerId(ownerId, filters);

      res.json({
        success: true,
        data: {
          owner_id: ownerId,
          ...result,
        },
        message: 'Owner properties retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve owner properties',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getPropertyOwnership(req, res) {
    try {
      const { id } = req.params;
      const property = await Property.findById(id);

      if (!property) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
            details: `Property with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: {
          property_id: id,
          property_code: property.property_code,
          property_name: property.property_name,
          owners: property.owners,
          total_ownership: property.owners.reduce(
            (sum, owner) => sum + parseFloat(owner.ownership_percentage),
            0
          ),
        },
        message: 'Property ownership retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching property ownership:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve property ownership',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = PropertyController;
