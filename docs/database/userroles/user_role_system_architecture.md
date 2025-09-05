# REMS User Role System Architecture

**Document Version**: 1.0  
**Last Updated**: September 5, 2025  
**Author**: REMS Development Team  
**Status**: Active Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Two-Level Role System](#two-level-role-system)
3. [Polymorphic User System](#polymorphic-user-system)
4. [Database Schema Implementation](#database-schema-implementation)
5. [Role Assignment Workflows](#role-assignment-workflows)
6. [Frontend Implementation Guidelines](#frontend-implementation-guidelines)
7. [API Integration Patterns](#api-integration-patterns)
8. [Security Considerations](#security-considerations)
9. [Examples and Use Cases](#examples-and-use-cases)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

The REMS (Real Estate Management System) implements a sophisticated user management architecture
that combines a **Two-Level Role System** with a **Polymorphic User System**. This design provides
flexible, scalable user access control across multiple business entities while maintaining clear
separation of concerns between system-level permissions and firm-specific roles.

### Key Design Principles

- **Separation of Concerns**: System roles vs. firm-specific roles
- **Polymorphic Relationships**: Users can represent different entity types
- **Multi-Tenant Support**: Users can belong to multiple firms with different roles
- **Scalability**: Designed to handle complex organizational structures
- **Security**: Clear permission boundaries and access control

---

## Two-Level Role System

The REMS user role system operates on two distinct levels, each serving different purposes in the
access control hierarchy.

### Level 1: System-Level User Types

**Purpose**: Defines the primary system access and core permissions for a user across the entire
REMS platform.

**Database Field**: `users.user_type`

**Available System Types**:

| User Type            | Code                | Description                          | Primary Function                                          |
| -------------------- | ------------------- | ------------------------------------ | --------------------------------------------------------- |
| System Administrator | `admin`             | Full system access and configuration | Platform administration, system settings, user management |
| Accountant           | `accountant`        | Financial operations and reporting   | Financial transactions, reporting, multi-firm operations  |
| Property Owner       | `owner`             | Property portfolio management        | Property ownership, approval workflows, tenant management |
| Tenant               | `tenant`            | Rental and lease management          | Rent payments, maintenance requests, lease management     |
| Service Vendor       | `vendor`            | Service provision and billing        | Service delivery, invoice management, work orders         |
| Maintenance Staff    | `maintenance_staff` | Field operations and maintenance     | Work order execution, maintenance reporting               |

### Level 2: Firm-Specific Roles

**Purpose**: Defines contextual roles and permissions within specific business firms or
organizations.

**Database Field**: `user_firm_assignments.role_in_firm`

**Available Firm Roles**:

| Firm Role | Code      | Description             | Typical Permissions                               |
| --------- | --------- | ----------------------- | ------------------------------------------------- |
| Member    | `member`  | Basic firm access       | View assigned data, basic operations              |
| Manager   | `manager` | Departmental management | Team oversight, operational decisions, reporting  |
| Admin     | `admin`   | Firm administration     | Firm settings, user assignments, full firm access |
| Viewer    | `viewer`  | Read-only access        | View-only permissions, reporting access           |

### Access Level Modifiers

**Database Field**: `user_firm_assignments.access_level`

Each firm role can be modified with access levels:

| Access Level | Code       | Description                               |
| ------------ | ---------- | ----------------------------------------- |
| Standard     | `standard` | Normal role permissions                   |
| Elevated     | `elevated` | Enhanced permissions within role scope    |
| Full         | `full`     | Maximum permissions for the assigned role |

---

## Polymorphic User System

The polymorphic user system allows a single user account to represent different types of business
entities while maintaining referential integrity and clear data relationships.

### Polymorphic Relationship Structure

**Core Fields**:

- `users.related_entity_type` - Specifies the type of business entity
- `users.related_entity_id` - References the specific entity record

### Entity Type Mappings

| System User Type    | Related Entity Type | Target Table | Business Purpose                                      |
| ------------------- | ------------------- | ------------ | ----------------------------------------------------- |
| `owner`             | `owner`             | `owners`     | Links to property ownership records                   |
| `tenant`            | `tenant`            | `tenants`    | Links to tenancy agreements and rental history        |
| `vendor`            | `vendor`            | `vendors`    | Links to service provider profiles and capabilities   |
| `admin`             | `null`              | `null`       | System users with no specific entity relationship     |
| `accountant`        | `null`              | `null`       | Professional users operating across multiple entities |
| `maintenance_staff` | `null`              | `null`       | Operational users with cross-property access          |

### Entity Relationship Examples

```sql
-- Property Owner User
INSERT INTO users (user_type, related_entity_type, related_entity_id, ...)
VALUES ('owner', 'owner', 123, ...);

-- This links to:
SELECT * FROM owners WHERE owner_id = 123;

-- Tenant User
INSERT INTO users (user_type, related_entity_type, related_entity_id, ...)
VALUES ('tenant', 'tenant', 456, ...);

-- This links to:
SELECT * FROM tenants WHERE tenant_id = 456;

-- System Admin (no entity relationship)
INSERT INTO users (user_type, related_entity_type, related_entity_id, ...)
VALUES ('admin', NULL, NULL, ...);
```

---

## Database Schema Implementation

### Core Tables

#### Users Table

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    user_type VARCHAR NOT NULL DEFAULT 'tenant',
    related_entity_id INTEGER,
    related_entity_type VARCHAR,
    preferred_language VARCHAR DEFAULT 'en',
    timezone VARCHAR DEFAULT 'Asia/Kuwait',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    -- ... additional fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Firm Assignments Table

```sql
CREATE TABLE user_firm_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    firm_id INTEGER NOT NULL REFERENCES firms(firm_id),
    role_in_firm VARCHAR NOT NULL,
    is_primary_firm BOOLEAN DEFAULT false,
    access_level VARCHAR DEFAULT 'standard',
    is_active BOOLEAN DEFAULT true,
    assigned_by INTEGER REFERENCES users(user_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deactivated_at TIMESTAMP,
    deactivated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, firm_id, is_active)
);
```

### Constraints and Indexes

```sql
-- Ensure polymorphic relationships are valid
ALTER TABLE users ADD CONSTRAINT check_entity_relationship
CHECK (
    (related_entity_type IS NULL AND related_entity_id IS NULL) OR
    (related_entity_type IS NOT NULL AND related_entity_id IS NOT NULL)
);

-- Ensure only one primary firm per user
CREATE UNIQUE INDEX idx_user_primary_firm
ON user_firm_assignments (user_id, is_primary_firm)
WHERE is_primary_firm = true AND is_active = true;

-- Performance indexes
CREATE INDEX idx_users_type_entity ON users (user_type, related_entity_type);
CREATE INDEX idx_firm_assignments_user ON user_firm_assignments (user_id, is_active);
CREATE INDEX idx_firm_assignments_firm ON user_firm_assignments (firm_id, is_active);
```

---

## Role Assignment Workflows

### 1. System Administrator Creation

```sql
-- Step 1: Create system admin user
INSERT INTO users (username, email, password_hash, user_type, is_active, email_verified)
VALUES ('admin', 'admin@company.com', '$hashed_password', 'admin', true, true);

-- Step 2: No firm assignment needed (system-wide access)
-- Step 3: System permissions handled by application logic
```

### 2. Accountant with Multi-Firm Access

```sql
-- Step 1: Create accountant user
INSERT INTO users (username, email, password_hash, user_type, preferred_language)
VALUES ('john.accountant', 'john@company.com', '$hashed_password', 'accountant', 'en');

-- Step 2: Assign to primary firm
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES (2, 1, 'manager', 'elevated', true);

-- Step 3: Assign to secondary firms
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES (2, 2, 'admin', 'full', false);
```

### 3. Property Owner Creation

```sql
-- Step 1: Create owner entity
INSERT INTO owners (first_name, last_name, email, phone, firm_id)
VALUES ('Sarah', 'Johnson', 'sarah@example.com', '+1234567890', 1)
RETURNING owner_id;

-- Step 2: Create user account linked to owner entity
INSERT INTO users (username, email, password_hash, user_type, related_entity_type, related_entity_id)
VALUES ('sarah.johnson', 'sarah@example.com', '$hashed_password', 'owner', 'owner', 123);

-- Step 3: Assign to firm
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES (3, 1, 'member', 'standard', true);
```

### 4. Tenant Account Setup

```sql
-- Step 1: Create tenant entity (usually done during lease creation)
INSERT INTO tenants (first_name, last_name, email, phone, unit_id, firm_id)
VALUES ('Mike', 'Davis', 'mike@example.com', '+1987654321', 45, 1)
RETURNING tenant_id;

-- Step 2: Create user account linked to tenant entity
INSERT INTO users (username, email, password_hash, user_type, related_entity_type, related_entity_id)
VALUES ('mike.davis', 'mike@example.com', '$hashed_password', 'tenant', 'tenant', 456);

-- Step 3: Assign to managing firm
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES (4, 1, 'member', 'standard', true);
```

---

## Frontend Implementation Guidelines

### User Creation Form Guidelines

#### DO's

```javascript
// ✅ Correct: Separate user type and firm role selection
const userTypes = [
  { value: 'admin', label: 'System Administrator' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'owner', label: 'Property Owner' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'vendor', label: 'Service Vendor' },
  { value: 'maintenance_staff', label: 'Maintenance Staff' },
];

const firmRoles = [
  { value: 'member', label: 'Member' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Firm Admin' },
  { value: 'viewer', label: 'Viewer' },
];

// Form structure
<select name="user_type">
  {userTypes.map((type) => (
    <option value={type.value}>{type.label}</option>
  ))}
</select>;

{
  /* Separate section for firm assignments */
}
<select name="role_in_firm">
  {firmRoles.map((role) => (
    <option value={role.value}>{role.label}</option>
  ))}
</select>;
```

#### DON'Ts

```javascript
// ❌ Wrong: Mixing system types with firm roles
const confusingRoles = [
  { value: 'admin', label: 'Admin' }, // Ambiguous
  { value: 'senior_admin', label: 'Senior Admin' }, // Invalid
  { value: 'accountant', label: 'Accountant' }, // Wrong context
  { value: 'owner', label: 'Owner' }, // Wrong context
  { value: 'readonly', label: 'Read Only' }, // Invalid
];
```

### Role Display Components

```javascript
// ✅ Component for displaying user roles clearly
const UserRoleDisplay = ({ user }) => {
  return (
    <div className="user-roles">
      {/* System Level */}
      <div className="system-role">
        <Badge variant="primary">{formatUserType(user.user_type)}</Badge>
      </div>

      {/* Firm Level */}
      {user.firm_assignments?.map((assignment) => (
        <div key={assignment.firm_id} className="firm-role">
          <Badge variant="secondary">
            {assignment.firm_name}: {assignment.role_in_firm}
            {assignment.access_level !== 'standard' && ` (${assignment.access_level})`}
          </Badge>
        </div>
      ))}
    </div>
  );
};
```

---

## API Integration Patterns

### User Creation API

```javascript
// POST /api/v1/users
const createUser = async (userData) => {
  const payload = {
    // System level data
    username: userData.username,
    email: userData.email,
    password: userData.password,
    user_type: userData.user_type, // System-level role

    // Entity relationship (for owners, tenants, vendors)
    related_entity_type: userData.related_entity_type,
    related_entity_id: userData.related_entity_id,

    // Optional firm assignments
    firm_assignments: userData.firm_assignments?.map((assignment) => ({
      firm_id: assignment.firm_id,
      role_in_firm: assignment.role_in_firm, // Firm-level role
      access_level: assignment.access_level,
      is_primary_firm: assignment.is_primary_firm,
    })),
  };

  return await apiClient.post('/users', payload);
};
```

### Firm Assignment API

```javascript
// POST /api/v1/users/:id/assign-firm
const assignUserToFirm = async (userId, assignment) => {
  const payload = {
    firm_id: assignment.firm_id,
    role_in_firm: assignment.role_in_firm, // NOT user_type
    access_level: assignment.access_level,
    is_primary_firm: assignment.is_primary_firm,
  };

  return await apiClient.post(`/users/${userId}/assign-firm`, payload);
};
```

### User Query with Relationships

```javascript
// GET /api/v1/users/:id with full relationship data
const getUserWithRelationships = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`, {
    include: ['entity_details', 'firm_assignments'],
  });

  // Response structure:
  // {
  //   user_id: 123,
  //   user_type: 'owner',           // System level
  //   related_entity_type: 'owner',
  //   related_entity_id: 456,
  //   entity_details: {             // Polymorphic relationship data
  //     owner_id: 456,
  //     first_name: 'John',
  //     properties: [...]
  //   },
  //   firm_assignments: [           // Firm-level roles
  //     {
  //       firm_id: 1,
  //       role_in_firm: 'manager',  // Firm level
  //       access_level: 'elevated',
  //       is_primary_firm: true
  //     }
  //   ]
  // }

  return response.data;
};
```

---

## Security Considerations

### Permission Hierarchy

```
System Level (user_type)
├── admin: Full system access
├── accountant: Multi-firm financial operations
├── owner: Property-specific operations + firm context
├── tenant: Rental-specific operations + firm context
├── vendor: Service-specific operations + firm context
└── maintenance_staff: Maintenance operations + firm context

Firm Level (role_in_firm + access_level)
├── admin + full: Complete firm control
├── manager + elevated: Departmental management with enhanced permissions
├── member + standard: Basic firm operations
└── viewer + standard: Read-only firm access
```

### Access Control Logic

```javascript
// Example middleware for permission checking
const checkPermission = (requiredSystemRole, requiredFirmRole = null, firmId = null) => {
  return async (req, res, next) => {
    const user = req.user;

    // Check system-level permission
    if (!hasSystemPermission(user.user_type, requiredSystemRole)) {
      return res.status(403).json({ error: 'Insufficient system permissions' });
    }

    // Check firm-level permission if required
    if (requiredFirmRole && firmId) {
      const firmAssignment = user.firm_assignments?.find(
        (assignment) => assignment.firm_id === firmId && assignment.is_active
      );

      if (!firmAssignment || !hasFirmPermission(firmAssignment.role_in_firm, requiredFirmRole)) {
        return res.status(403).json({ error: 'Insufficient firm permissions' });
      }
    }

    next();
  };
};

// Usage in routes
app.get(
  '/api/v1/firms/:firmId/properties',
  authenticateToken,
  checkPermission(['admin', 'accountant', 'owner'], 'member', req.params.firmId),
  getProperties
);
```

### Data Access Patterns

```javascript
// Multi-tenant data filtering
const getPropertiesForUser = async (userId) => {
  const user = await getUserWithFirmAssignments(userId);

  let query = db.select().from('properties');

  switch (user.user_type) {
    case 'admin':
      // Admin sees all properties
      break;

    case 'accountant':
      // Accountant sees properties from assigned firms
      const firmIds = user.firm_assignments.map((a) => a.firm_id);
      query = query.whereIn('firm_id', firmIds);
      break;

    case 'owner':
      // Owner sees only their properties
      query = query.where('owner_id', user.related_entity_id);
      break;

    case 'tenant':
      // Tenant sees only their rented properties
      query = query
        .join('units', 'units.property_id', 'properties.property_id')
        .join('tenants', 'tenants.unit_id', 'units.unit_id')
        .where('tenants.tenant_id', user.related_entity_id);
      break;
  }

  return await query;
};
```

---

## Examples and Use Cases

### Example 1: Multi-Firm Accountant

**Scenario**: Sarah is an accountant who manages finances for three different real estate firms.

**Setup**:

- **System Role**: `accountant`
- **Entity Relationship**: None (professional user)
- **Firm Assignments**:
  - Firm A: `manager` with `elevated` access (primary)
  - Firm B: `admin` with `full` access
  - Firm C: `viewer` with `standard` access

**Database Records**:

```sql
-- User record
INSERT INTO users (user_id, username, user_type, related_entity_type, related_entity_id)
VALUES (101, 'sarah.accountant', 'accountant', NULL, NULL);

-- Firm assignments
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES
  (101, 1, 'manager', 'elevated', true),   -- Primary firm
  (101, 2, 'admin', 'full', false),        -- Full control
  (101, 3, 'viewer', 'standard', false);   -- Read-only
```

**Access Implications**:

- Can access financial data from all three firms
- Has management permissions in Firm A and B
- Read-only access to Firm C
- Can generate cross-firm reports
- Cannot manage users in Firm C

### Example 2: Property Owner with Management Company

**Scenario**: John owns multiple properties and contracts with ABC Property Management to handle
day-to-day operations.

**Setup**:

- **System Role**: `owner`
- **Entity Relationship**: Links to `owners` table record
- **Firm Assignment**: ABC Property Management as `member` with `standard` access

**Database Records**:

```sql
-- Owner entity
INSERT INTO owners (owner_id, first_name, last_name, email, firm_id)
VALUES (201, 'John', 'Smith', 'john@email.com', 1);

-- User record
INSERT INTO users (user_id, username, user_type, related_entity_type, related_entity_id)
VALUES (102, 'john.smith', 'owner', 'owner', 201);

-- Firm assignment
INSERT INTO user_firm_assignments (user_id, firm_id, role_in_firm, access_level, is_primary_firm)
VALUES (102, 1, 'member', 'standard', true);
```

**Access Implications**:

- Can view and manage his owned properties
- Can approve/reject maintenance requests
- Can access financial reports for his properties
- Can communicate with tenants
- Cannot access other owners' properties

### Example 3: System Administrator

**Scenario**: Mike is the IT administrator for the entire REMS platform.

**Setup**:

- **System Role**: `admin`
- **Entity Relationship**: None
- **Firm Assignments**: None required (system-wide access)

**Database Records**:

```sql
-- User record
INSERT INTO users (user_id, username, user_type, related_entity_type, related_entity_id)
VALUES (103, 'mike.admin', 'admin', NULL, NULL);

-- No firm assignments needed
```

**Access Implications**:

- Full system access across all firms
- Can manage all users and system settings
- Can access all data for support purposes
- Can configure system-wide settings
- Not restricted by firm boundaries

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: User Cannot Access Expected Data

**Symptoms**:

- User gets "403 Forbidden" errors
- Expected data not showing in UI
- API returns empty results

**Diagnosis Steps**:

1. Check user's system role (`user_type`)
2. Verify firm assignments are active
3. Confirm role permissions for requested operation
4. Check if data belongs to user's assigned firms

**SQL Diagnostic Queries**:

```sql
-- Check user's complete role setup
SELECT
    u.user_id,
    u.username,
    u.user_type,
    u.related_entity_type,
    u.related_entity_id,
    ufa.firm_id,
    f.firm_name,
    ufa.role_in_firm,
    ufa.access_level,
    ufa.is_primary_firm,
    ufa.is_active as assignment_active
FROM users u
LEFT JOIN user_firm_assignments ufa ON u.user_id = ufa.user_id
LEFT JOIN firms f ON ufa.firm_id = f.firm_id
WHERE u.user_id = ?;
```

#### Issue 2: Duplicate Role Assignments

**Symptoms**:

- Error when assigning user to firm
- Multiple active assignments for same user-firm combination

**Solution**:

```sql
-- Find duplicate assignments
SELECT user_id, firm_id, COUNT(*)
FROM user_firm_assignments
WHERE is_active = true
GROUP BY user_id, firm_id
HAVING COUNT(*) > 1;

-- Deactivate duplicates (keep most recent)
UPDATE user_firm_assignments
SET is_active = false
WHERE assignment_id NOT IN (
    SELECT MAX(assignment_id)
    FROM user_firm_assignments
    WHERE is_active = true
    GROUP BY user_id, firm_id
);
```

#### Issue 3: Orphaned Entity Relationships

**Symptoms**:

- User has `related_entity_id` but entity doesn't exist
- Frontend errors when loading user details

**Diagnostic Query**:

```sql
-- Find orphaned owner relationships
SELECT u.user_id, u.username, u.related_entity_id
FROM users u
LEFT JOIN owners o ON u.related_entity_id = o.owner_id
WHERE u.related_entity_type = 'owner'
  AND o.owner_id IS NULL;

-- Find orphaned tenant relationships
SELECT u.user_id, u.username, u.related_entity_id
FROM users u
LEFT JOIN tenants t ON u.related_entity_id = t.tenant_id
WHERE u.related_entity_type = 'tenant'
  AND t.tenant_id IS NULL;
```

**Solution**:

```sql
-- Clean up orphaned relationships
UPDATE users
SET related_entity_type = NULL,
    related_entity_id = NULL
WHERE user_id IN (SELECT user_id FROM orphaned_users_query);
```

### Performance Optimization

#### Efficient User Queries

```sql
-- Optimized query for user dashboard data
SELECT
    u.*,
    -- Aggregate firm assignments
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'firm_id', ufa.firm_id,
                'firm_name', f.firm_name,
                'role_in_firm', ufa.role_in_firm,
                'access_level', ufa.access_level,
                'is_primary_firm', ufa.is_primary_firm
            )
        ) FILTER (WHERE ufa.is_active = true),
        '[]'::json
    ) as firm_assignments,
    -- Include entity details for polymorphic relationships
    CASE
        WHEN u.related_entity_type = 'owner' THEN
            (SELECT row_to_json(o) FROM owners o WHERE o.owner_id = u.related_entity_id)
        WHEN u.related_entity_type = 'tenant' THEN
            (SELECT row_to_json(t) FROM tenants t WHERE t.tenant_id = u.related_entity_id)
        WHEN u.related_entity_type = 'vendor' THEN
            (SELECT row_to_json(v) FROM vendors v WHERE v.vendor_id = u.related_entity_id)
        ELSE NULL
    END as entity_details
FROM users u
LEFT JOIN user_firm_assignments ufa ON u.user_id = ufa.user_id AND ufa.is_active = true
LEFT JOIN firms f ON ufa.firm_id = f.firm_id
WHERE u.user_id = ?
GROUP BY u.user_id;
```

---

## Conclusion

The REMS Two-Level Role System with Polymorphic User Architecture provides a robust, scalable
foundation for managing complex multi-tenant real estate operations. By clearly separating
system-level permissions from firm-specific roles and implementing polymorphic entity relationships,
the system maintains flexibility while ensuring data integrity and security.

This architecture enables:

- **Scalable Multi-Tenancy**: Users can belong to multiple firms with different roles
- **Clear Permission Boundaries**: System vs. firm permissions are well-defined
- **Flexible Entity Modeling**: Users can represent different business entity types
- **Maintainable Codebase**: Clear separation of concerns in both backend and frontend

For questions or clarifications on this architecture, refer to the database documentation or contact
the development team.

---

**Document Control**

| Version | Date       | Changes               | Author                |
| ------- | ---------- | --------------------- | --------------------- |
| 1.0     | 2025-09-05 | Initial documentation | REMS Development Team |

**Related Documents**

- [Database Schema Overview](../schema/database_overview.md)
- [User Authentication System](../schema/05_user_authentication.md)
- [Multi-Tenant Architecture](../schema/04_multi_tenant_system.md)
- [API Documentation](../../development/api/api_endpoints.md)
