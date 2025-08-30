const Maintenance = require('../models/Maintenance');
const Vendor = require('../models/Vendor');

class MaintenanceController {
  static async getMaintenanceOrders(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'requested_date',
        order: req.query.order || 'desc',
        status: req.query.status,
        priority: req.query.priority,
        requestor_type: req.query.requestor_type,
        property_id: req.query.property_id,
        vendor_id: req.query.vendor_id,
        date_from: req.query.date_from,
        date_to: req.query.date_to,
      };

      const result = await Maintenance.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Maintenance orders retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching maintenance orders:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve maintenance orders',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getMaintenanceOrder(req, res) {
    try {
      const { id } = req.params;
      const maintenanceOrder = await Maintenance.findById(id);

      if (!maintenanceOrder) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Maintenance order not found',
            details: `Maintenance order with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: maintenanceOrder,
        message: 'Maintenance order retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching maintenance order:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve maintenance order',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createMaintenanceOrder(req, res) {
    try {
      // Validate required fields
      const requiredFields = [
        'requestor_type',
        'expense_type_id',
        'title',
        'description',
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

      // Validate that either unit_id or property_id is provided
      if (!req.body.unit_id && !req.body.property_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Either unit_id or property_id must be provided',
            details:
              'Maintenance order must be associated with a unit or property',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Validate requestor_type logic
      const { requestor_type, tenant_id, owner_id } = req.body;
      if (requestor_type === 'tenant' && !tenant_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'tenant_id is required when requestor_type is tenant',
            details: 'Tenant maintenance requests must specify the tenant',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (requestor_type === 'owner' && !owner_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'owner_id is required when requestor_type is owner',
            details: 'Owner maintenance requests must specify the owner',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const maintenanceOrder = await Maintenance.create(req.body);

      res.status(201).json({
        success: true,
        data: maintenanceOrder,
        message: 'Maintenance order created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating maintenance order:', error);

      // Handle database constraint violations
      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid maintenance order data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (error.code === '23503') {
        // Foreign key violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Referenced entity does not exist',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create maintenance order',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateMaintenanceOrder(req, res) {
    try {
      const { id } = req.params;

      // Check if maintenance order exists
      const existingOrder = await Maintenance.findById(id);
      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Maintenance order not found',
            details: `Maintenance order with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Prevent updating completed orders
      if (existingOrder.status === 'completed') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot update completed maintenance order',
            details: 'Completed maintenance orders cannot be modified',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedOrder = await Maintenance.update(id, req.body);

      res.json({
        success: true,
        data: updatedOrder,
        message: 'Maintenance order updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating maintenance order:', error);

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
          message: 'Failed to update maintenance order',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async assignToVendor(req, res) {
    try {
      const { id } = req.params;
      const { vendor_id, scheduled_date } = req.body;

      if (!vendor_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'vendor_id is required',
            details: 'Vendor assignment requires vendor_id',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if maintenance order exists
      const existingOrder = await Maintenance.findById(id);
      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Maintenance order not found',
            details: `Maintenance order with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if vendor exists and is active
      const vendor = await Vendor.findById(vendor_id);
      if (!vendor || !vendor.is_active) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Vendor not found or inactive',
            details: `Vendor with ID ${vendor_id} does not exist or is not active`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const assignedOrder = await Maintenance.assignToVendor(id, req.body);

      res.json({
        success: true,
        data: assignedOrder,
        message: 'Maintenance order assigned to vendor successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error assigning maintenance order to vendor:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to assign maintenance order to vendor',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'status is required',
            details: 'Status update requires new status value',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedOrder = await Maintenance.updateStatus(id, req.body);

      res.json({
        success: true,
        data: updatedOrder,
        message: 'Maintenance order status updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating maintenance order status:', error);

      if (error.message.includes('Invalid status transition')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Invalid status transition',
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (error.message === 'Maintenance order not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Maintenance order not found',
            details: `Maintenance order with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update maintenance order status',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async approveOrder(req, res) {
    try {
      const { id } = req.params;
      const { approved_by } = req.body;

      if (!approved_by) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'approved_by is required',
            details: 'Approval requires approver ID',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const approvedOrder = await Maintenance.approve(id, req.body);

      res.json({
        success: true,
        data: approvedOrder,
        message: 'Maintenance order approved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error approving maintenance order:', error);

      if (error.message.includes('not found or cannot be approved')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot approve maintenance order',
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to approve maintenance order',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getPendingOrders(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        priority: req.query.priority,
        property_id: req.query.property_id,
      };

      const pendingOrders = await Maintenance.getPendingOrders(filters);

      res.json({
        success: true,
        data: pendingOrders,
        message: 'Pending maintenance orders retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching pending maintenance orders:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve pending maintenance orders',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Vendor endpoints
  static async getVendors(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'vendor_name',
        order: req.query.order || 'asc',
        vendor_type: req.query.vendor_type,
        emergency_available: req.query.emergency_available === 'true',
        is_active:
          req.query.is_active !== undefined
            ? req.query.is_active === 'true'
            : true,
        search: req.query.search,
        min_rating: req.query.min_rating
          ? parseFloat(req.query.min_rating)
          : null,
      };

      const result = await Vendor.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Vendors retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve vendors',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getVendor(req, res) {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findById(id);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Vendor not found',
            details: `Vendor with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: vendor,
        message: 'Vendor retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vendor:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve vendor',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createVendor(req, res) {
    try {
      // Validate required fields
      const requiredFields = ['vendor_name', 'vendor_type'];
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

      const vendor = await Vendor.create(req.body);

      res.status(201).json({
        success: true,
        data: vendor,
        message: 'Vendor created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating vendor:', error);

      // Handle database constraint violations
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.constraint === 'unique_vendor_email') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Email address already exists',
              details: 'A vendor with this email address is already registered',
            },
            timestamp: new Date().toISOString(),
          });
        }
        if (error.constraint === 'unique_commercial_registration') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Commercial registration already exists',
              details:
                'A vendor with this commercial registration is already registered',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create vendor',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateVendor(req, res) {
    try {
      const { id } = req.params;

      // Check if vendor exists
      const existingVendor = await Vendor.findById(id);
      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Vendor not found',
            details: `Vendor with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedVendor = await Vendor.update(id, req.body);

      res.json({
        success: true,
        data: updatedVendor,
        message: 'Vendor updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating vendor:', error);

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
          message: 'Failed to update vendor',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async deleteVendor(req, res) {
    try {
      const { id } = req.params;

      // Check if vendor exists
      const existingVendor = await Vendor.findById(id);
      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Vendor not found',
            details: `Vendor with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      await Vendor.delete(id);

      res.status(204).json({
        success: true,
        message: 'Vendor deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);

      if (error.message.includes('Cannot delete vendor with')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot delete vendor with active orders',
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete vendor',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getAvailableVendors(req, res) {
    try {
      const filters = {
        emergency_only: req.query.emergency_only === 'true',
        specialization: req.query.specialization,
        service_area: req.query.service_area,
        min_rating: req.query.min_rating ? parseFloat(req.query.min_rating) : 0,
      };

      const availableVendors = await Vendor.findAvailable(filters);

      res.json({
        success: true,
        data: availableVendors,
        message: 'Available vendors retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching available vendors:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve available vendors',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getVendorOrders(req, res) {
    try {
      const { vendorId } = req.params;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        status: req.query.status,
      };

      const orders = await Maintenance.getOrdersByVendor(vendorId, filters);

      res.json({
        success: true,
        data: {
          vendor_id: vendorId,
          orders: orders,
        },
        message: 'Vendor orders retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve vendor orders',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getVendorPerformance(req, res) {
    try {
      const { vendorId } = req.params;
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to,
      };

      const performance = await Vendor.getPerformanceReport(vendorId, filters);

      res.json({
        success: true,
        data: {
          vendor_id: vendorId,
          performance: performance,
        },
        message: 'Vendor performance report retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vendor performance:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve vendor performance',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = MaintenanceController;
