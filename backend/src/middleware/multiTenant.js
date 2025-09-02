const { query } = require('../config/database');

/**
 * Multi-Tenant Middleware for REMS System
 * Provides firm-based data isolation as documented in database architecture
 */

// Extract firm context from user and validate access
const extractFirmContext = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required for multi-tenant operations',
      });
    }

    // Admin users can access all firms
    if (req.user.user_type === 'admin') {
      // For admin users, firm_id can be provided via header or query param
      const firmId = req.headers['x-firm-id'] || req.query.firm_id;

      if (firmId) {
        // Validate firm exists
        const firmQuery =
          'SELECT firm_id, firm_name, is_active FROM rems.firms WHERE firm_id = $1';
        const firmResult = await query(firmQuery, [firmId]);

        if (firmResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Firm not found',
          });
        }

        if (!firmResult.rows[0].is_active) {
          return res.status(403).json({
            success: false,
            error: 'Firm is inactive',
          });
        }

        req.firmContext = {
          firm_id: parseInt(firmId),
          firm_name: firmResult.rows[0].firm_name,
          user_role: 'admin',
          can_access_all_firms: true,
        };
      } else {
        req.firmContext = {
          firm_id: null,
          user_role: 'admin',
          can_access_all_firms: true,
        };
      }
    } else {
      // Non-admin users: get firm assignments
      const assignmentQuery = `
        SELECT 
          fa.firm_id,
          f.firm_name,
          fa.user_role,
          fa.is_active,
          fa.access_level,
          f.is_active as firm_active
        FROM rems.user_firm_assignments fa
        JOIN rems.firms f ON fa.firm_id = f.firm_id
        WHERE fa.user_id = $1 AND fa.is_active = true AND f.is_active = true
      `;

      const assignmentResult = await query(assignmentQuery, [req.user.user_id]);

      if (assignmentResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'User has no active firm assignments',
        });
      }

      // If specific firm requested, validate access
      const requestedFirmId = req.headers['x-firm-id'] || req.query.firm_id;

      if (requestedFirmId) {
        const hasAccess = assignmentResult.rows.find(
          (assignment) => assignment.firm_id === parseInt(requestedFirmId)
        );

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'User does not have access to requested firm',
          });
        }

        req.firmContext = {
          firm_id: parseInt(requestedFirmId),
          firm_name: hasAccess.firm_name,
          user_role: hasAccess.user_role,
          access_level: hasAccess.access_level,
          can_access_all_firms: false,
          user_assignments: assignmentResult.rows,
        };
      } else {
        // No specific firm requested - use first active assignment
        const primaryAssignment = assignmentResult.rows[0];

        req.firmContext = {
          firm_id: primaryAssignment.firm_id,
          firm_name: primaryAssignment.firm_name,
          user_role: primaryAssignment.user_role,
          access_level: primaryAssignment.access_level,
          can_access_all_firms: false,
          user_assignments: assignmentResult.rows,
        };
      }
    }

    next();
  } catch (error) {
    console.error('Multi-tenant context extraction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to extract firm context',
    });
  }
};

// Require firm context (firm_id must be set)
const requireFirmContext = (req, res, next) => {
  if (!req.firmContext || !req.firmContext.firm_id) {
    return res.status(400).json({
      success: false,
      error: 'Firm context is required for this operation',
      message:
        'Please provide firm_id via x-firm-id header or firm_id query parameter',
    });
  }

  next();
};

// Add firm isolation to SQL queries
const addFirmIsolation = (baseQuery, firmId) => {
  // Add firm_id filter to WHERE clause
  if (baseQuery.toLowerCase().includes('where')) {
    return baseQuery.replace(/where/i, `WHERE firm_id = ${firmId} AND`);
  } else {
    // Add WHERE clause with firm_id
    return baseQuery.replace(
      /(from\s+\w+\.\w+)/i,
      '$1 WHERE firm_id = ' + firmId
    );
  }
};

// Generate firm-scoped query helper
const firmScopedQuery = async (req, baseQuery, params = []) => {
  if (!req.firmContext) {
    throw new Error('Firm context not available');
  }

  // Admin users with no firm context can query across all firms
  if (req.firmContext.can_access_all_firms && !req.firmContext.firm_id) {
    return await query(baseQuery, params);
  }

  // Add firm isolation to the query
  const scopedQuery = addFirmIsolation(baseQuery, req.firmContext.firm_id);
  return await query(scopedQuery, params);
};

// Check if user has specific permission for current firm
const checkFirmPermission = (requiredRole) => {
  return (req, res, next) => {
    if (!req.firmContext) {
      return res.status(400).json({
        success: false,
        error: 'Firm context required',
      });
    }

    // Admin users have all permissions
    if (req.firmContext.can_access_all_firms) {
      return next();
    }

    // Check role hierarchy: admin > accountant > owner > tenant > vendor > maintenance_staff
    const roleHierarchy = {
      admin: 6,
      accountant: 5,
      owner: 4,
      tenant: 3,
      vendor: 2,
      maintenance_staff: 1,
    };

    const userRoleLevel = roleHierarchy[req.firmContext.user_role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient firm permissions',
        required_role: requiredRole,
        user_role: req.firmContext.user_role,
      });
    }

    next();
  };
};

// Validate firm ownership for entities
const validateFirmOwnership = (entityType) => {
  return async (req, res, next) => {
    try {
      if (!req.firmContext || !req.firmContext.firm_id) {
        return res.status(400).json({
          success: false,
          error: 'Firm context required',
        });
      }

      const entityId = req.params.id;
      if (!entityId) {
        return res.status(400).json({
          success: false,
          error: 'Entity ID required',
        });
      }

      // Admin users can access all entities
      if (req.firmContext.can_access_all_firms) {
        return next();
      }

      // Check entity ownership by firm
      let ownershipQuery;

      switch (entityType) {
        case 'property':
          ownershipQuery =
            'SELECT firm_id FROM rems.properties WHERE property_id = $1';
          break;
        case 'tenant':
          ownershipQuery =
            'SELECT firm_id FROM rems.tenants WHERE tenant_id = $1';
          break;
        case 'owner':
          ownershipQuery =
            'SELECT firm_id FROM rems.owners WHERE owner_id = $1';
          break;
        case 'user':
          ownershipQuery = `
            SELECT DISTINCT fa.firm_id 
            FROM rems.user_firm_assignments fa 
            WHERE fa.user_id = $1
          `;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid entity type for ownership validation',
          });
      }

      const result = await query(ownershipQuery, [entityId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `${entityType} not found`,
        });
      }

      // For users, check if any assignment matches current firm
      if (entityType === 'user') {
        const hasAccess = result.rows.some(
          (row) => row.firm_id === req.firmContext.firm_id
        );
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'User does not belong to current firm context',
          });
        }
      } else {
        // For other entities, check direct firm ownership
        if (result.rows[0].firm_id !== req.firmContext.firm_id) {
          return res.status(403).json({
            success: false,
            error: `${entityType} does not belong to current firm`,
          });
        }
      }

      next();
    } catch (error) {
      console.error('Firm ownership validation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate firm ownership',
      });
    }
  };
};

module.exports = {
  extractFirmContext,
  requireFirmContext,
  addFirmIsolation,
  firmScopedQuery,
  checkFirmPermission,
  validateFirmOwnership,
};
