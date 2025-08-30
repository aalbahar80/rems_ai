const Tenant = require('../models/Tenant');

class TenantController {
  static async getTenants(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
        sort: req.query.sort || 'full_name',
        order: req.query.order || 'asc',
        nationality: req.query.nationality,
        has_active_contract:
          req.query.has_active_contract !== undefined
            ? req.query.has_active_contract === 'true'
            : undefined,
        search: req.query.search,
      };

      const result = await Tenant.findAll(filters);

      res.json({
        success: true,
        data: result,
        message: 'Tenants retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tenants:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve tenants',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getTenant(req, res) {
    try {
      const { id } = req.params;
      const tenant = await Tenant.findById(id);

      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tenant not found',
            details: `Tenant with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: tenant,
        message: 'Tenant retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tenant:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve tenant',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async createTenant(req, res) {
    try {
      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'full_name'];
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

      const tenant = await Tenant.create(req.body);

      res.status(201).json({
        success: true,
        data: tenant,
        message: 'Tenant created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating tenant:', error);

      // Handle database constraint violations
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.constraint === 'unique_tenant_email') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Email address already exists',
              details: 'A tenant with this email address is already registered',
            },
            timestamp: new Date().toISOString(),
          });
        }
        if (error.constraint === 'unique_tenant_national_id') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'National ID already exists',
              details: 'A tenant with this national ID is already registered',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid tenant data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create tenant',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async updateTenant(req, res) {
    try {
      const { id } = req.params;

      // Check if tenant exists
      const existingTenant = await Tenant.findById(id);
      if (!existingTenant) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tenant not found',
            details: `Tenant with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const updatedTenant = await Tenant.update(id, req.body);

      res.json({
        success: true,
        data: updatedTenant,
        message: 'Tenant updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating tenant:', error);

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

      // Handle database constraint violations
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.constraint === 'unique_tenant_email') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Email address already exists',
              details: 'Another tenant with this email address already exists',
            },
            timestamp: new Date().toISOString(),
          });
        }
        if (error.constraint === 'unique_tenant_national_id') {
          return res.status(409).json({
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'National ID already exists',
              details: 'Another tenant with this national ID already exists',
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (error.code === '23514') {
        // Check constraint violation
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid tenant data',
            details: error.detail,
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update tenant',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async deleteTenant(req, res) {
    try {
      const { id } = req.params;

      // Check if tenant exists
      const existingTenant = await Tenant.findById(id);
      if (!existingTenant) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tenant not found',
            details: `Tenant with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if tenant has active contracts
      const activeContracts = existingTenant.contracts.filter(
        (c) => c.contract_status === 'active'
      );
      if (activeContracts.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'Cannot delete tenant with active contracts',
            details: `Tenant has ${activeContracts.length} active contract(s). Please terminate contracts first.`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      await Tenant.delete(id);

      res.status(204).json({
        success: true,
        message: 'Tenant deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete tenant',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getTenantContracts(req, res) {
    try {
      const { id } = req.params;
      const filters = {
        status: req.query.status,
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
      };

      // Check if tenant exists
      const tenant = await Tenant.findById(id);
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tenant not found',
            details: `Tenant with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const contracts = await Tenant.getContracts(id, filters);

      res.json({
        success: true,
        data: {
          tenant_id: id,
          tenant_name: tenant.full_name,
          contracts: contracts,
        },
        message: 'Tenant contracts retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tenant contracts:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve tenant contracts',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getTenantPayments(req, res) {
    try {
      const { id } = req.params;
      const filters = {
        year: req.query.year ? parseInt(req.query.year) : null,
        month: req.query.month ? parseInt(req.query.month) : null,
        status: req.query.status,
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
      };

      // Check if tenant exists
      const tenant = await Tenant.findById(id);
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tenant not found',
            details: `Tenant with ID ${id} does not exist`,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const payments = await Tenant.getPayments(id, filters);

      res.json({
        success: true,
        data: {
          tenant_id: id,
          tenant_name: tenant.full_name,
          payments: payments,
          filters: filters,
        },
        message: 'Tenant payment history retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tenant payments:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve tenant payments',
          details: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = TenantController;
