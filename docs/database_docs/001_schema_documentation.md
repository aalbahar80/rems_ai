# REMS Database Schema Documentation

## Version 1.0 - Production Schema

### Table of Contents

1. [System Overview](#system_overview)
2. [Architecture & Design Principles](#architecture--design-principles)
3. [Core Property & Ownership Module](#core-property--ownership-module)
4. [Tenant & Contract Management Module](#tenant--contract-management-module)
5. [Financial Classification Module](#financial-classification-module)
6. [Vendor & Maintenance Module](#vendor--maintenance-module)
7. [Financial Transactions Module](#financial-transactions-module)
8. [User & Authentication Module](#user--authentication-module)
9. [System Configuration Module](#system-configuration-module)
10. [Audit & Logging Module](#audit--logging-module)
11. [Data Relationships](#data-relationships)
12. [Technical Components](#technical-components)
13. [Developer Guide](#developer-guide)

---
### Database Quick Facts

- **Database Engine**: PostgreSQL 15+
- **Schema Name**: `rems`
- **Total Tables**: 23
- **Total Views**: 15+
- **Trigger Functions**: 12+
- **Storage Estimate**: ~500MB for 1000 properties with full history

### Module Dependencies

```
Users & Auth ──┬──> All Modules (audit/permissions)
               │
Properties ────┼──> Units ──> Rental Contracts ──> Transactions
               │
Owners ────────┼──> Property Ownership ──> Financial
               │
Vendors ───────┴──> Maintenance Orders ──> Expenses
```

---
## System Overview

The Real Estate Management System (REMS) is a comprehensive property management database built on PostgreSQL 15+. The system manages multiple properties, owners, tenants, maintenance workflows, and complete financial tracking through 23 core tables organized into logical business modules.

### Key Capabilities

- **Multi-Property Portfolio Management**: Supports unlimited properties with shared ownership
- **Complete Tenant Lifecycle**: From application through contract expiration
- **Financial Management**: Invoicing, receipts, and transaction tracking
- **Maintenance Workflow**: Request-to-completion with vendor management
- **Multi-Portal Architecture**: Separate interfaces for owners, tenants, vendors, and administrators
- **Audit Compliance**: Complete tracking of all system changes

### Database Requirements

```sql
-- Database: PostgreSQL 15+
-- Schema: rems
-- Encoding: UTF8
-- Collation: en_US.UTF-8
```

---

## Architecture & Design Principles

### Core Design Patterns

#### 1. Polymorphic Entity Handling

The system extensively uses polymorphic relationships where a single table can reference multiple entity types:

```
┌─────────────┐
│   Invoices  │
├─────────────┤
│ entity_type │ ──┬── 'rental_contract'  → rental_contracts
│ entity_id   │   ├── 'maintenance_order' → maintenance_orders  
└─────────────┘   ├── 'property_expense'  → properties
                  └── 'owner_expense'     → owners
```

This pattern appears in:

- **Invoices**: Can bill any entity type
- **Users**: Can represent owners, tenants, or vendors
- **Maintenance Orders**: Can be requested by tenants or owners

#### 2. Temporal Data Management

Ownership and contracts include time-based validity:

- `start_date` and `end_date` fields track periods
- NULL `end_date` indicates current/active status
- Enables historical tracking and future planning

#### 3. Percentage-Based Relationships

Property ownership supports fractional ownership:

- Multiple owners per property with percentage shares
- Total ownership must equal 100%
- Primary contact designation for shared properties

---

## Core Property & Ownership Module

### Module Components

```
-- =====================================================
-- 001 - Owners Table (Normalized REMS Structure)
-- 002 - Properties Table (Normalized REMS Structure)  
-- 003 - Property Ownership Periods (Normalized REMS)
-- 004 - Units Table (Normalized REMS Structure)
-- =====================================================
```

### Entity Relationship

```
┌──────────┐      ┌────────────────────────┐      ┌────────────┐
│  Owners  │◄─────┤ Property_Ownership_    ├─────►│ Properties │
└──────────┘      │      Periods           │      └─────┬──────┘
                  └────────────────────────┘            │
                           │                            │
                  ┌────────▼────────┐          ┌────────▼──────┐
                  │ Ownership %     │          │     Units     │
                  │ Start/End Dates │          └───────────────┘
                  │ Primary Contact │
                  └─────────────────┘
```

### Key Business Rules

#### Ownership Structure

- **Properties can exist without owners** (pre-acquisition stage)
- **Owners can have multiple properties** through ownership periods
- **Shared ownership supported** with percentage tracking
- **Temporal ownership** allows ownership transfers over time

#### Property Hierarchy

- **Properties are independent entities** with unique codes
- **Units cannot exist without a property** (strict parent-child)
- **Unit numbers must be unique within a property**
- **Properties track total units automatically**

### Constraints & Validations

- `chk_preferred_language`: Only 'en', 'ar', or 'both' allowed
- `chk_property_type`: Limited to 'residential', 'commercial', 'mixed_use', 'land', 'other'
- `chk_ownership_percentage`: Must be between 0.01 and 100.00
- `chk_unit_type`: Restricted to defined types (apartment, studio, storage, etc.)

---

## Tenant & Contract Management Module

### Module Components

```
-- =====================================================
-- 005 - Tenants Table (Normalized REMS Structure)
-- 006 - Rental Contracts (Normalized REMS Structure)
-- =====================================================
```

### Contract Lifecycle Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Upcoming │─────►│  Active  │─────►│ Expiring │─────►│ Expired  │
└──────────┘      └─────┬────┘      └──────────┘      └──────────┘
                        │
                        ▼
                  ┌──────────┐
                  │Terminated│
                  └──────────┘
```

### Key Business Rules

#### Tenant Management

- **Tenants exist independently** of contracts
- **Dual-tenant support** for couples/roommates (primary + secondary)
- **Multiple identification types** supported (civil_id, passport, etc.)
- **Unique constraint on national ID** prevents duplicate registrations

#### Contract Rules

- **End date must be after start date** (enforced by constraint)
- **One active contract per unit** at any time
- **Contract status auto-management** through triggers
- **Deposit amounts flexible** (can be multiple months)

### Contract Statuses

- `upcoming`: Future contracts not yet started
- `active`: Currently valid contracts
- `terminated`: Ended before natural expiration
- `expired`: Naturally completed contracts

---

## Financial Classification Module

### Module Components

```
-- =====================================================
-- 007 - Expense Categories & Types (Normalized REMS)
-- =====================================================
```

### Hierarchical Structure

```
┌─────────────────────┐
│ Expense Categories  │
├─────────────────────┤
│ • Capital (CAPX)    │
│ • Operating (OPEX)  │      ┌──────────────────┐
│ • Utilities (UTIL)  │─────►│  Expense Types   │
│ • Maintenance       │      ├──────────────────┤
│ • Professional      │      │ • Specific costs │
│ • Insurance & Tax   │      │ • Cost ranges    │
│ • Marketing         │      │ • Frequency      │
│ • Management        │      │ • Emergency flag │
│ • Financing         │      └──────────────────┘
│ • Emergency         │
└─────────────────────┘
```

### Key Features

- **Two-level hierarchy**: Categories contain multiple types
- **Cost estimation ranges** for budgeting
- **Emergency identification** for urgent expenses
- **Frequency tracking** (monthly, annually, as_needed)
- **Tax deductibility** flags for reporting

---

## Vendor & Maintenance Module

### Module Components

```
-- =====================================================
-- 008 - Vendors Table (Normalized REMS Structure)
-- 009 - Maintenance Orders (Normalized REMS Structure)
-- =====================================================
```

### Maintenance Workflow

```
        Tenant/Owner Request
                │
                ▼
        ┌──────────────┐
        │  Submitted   │
        └──────┬───────┘
               │
        ┌──────▼───────┐     ┌──────────┐
        │ Acknowledged │────►│ Rejected │
        └──────┬───────┘     └──────────┘
               │
        ┌──────▼───────┐
        │   Approved   │
        └──────┬───────┘
               │
        ┌──────▼───────┐     ┌──────────┐
        │  Scheduled   │────►│ On Hold  │
        └──────┬───────┘     └──────────┘
               │
        ┌──────▼───────┐     ┌──────────┐
        │ In Progress  │────►│Cancelled │
        └──────┬───────┘     └──────────┘
               │
        ┌──────▼───────┐
        │  Completed   │
        └──────────────┘
```

### Polymorphic Requestor Pattern

```sql
-- Maintenance orders can be initiated by different entities
requestor_type: 'tenant' → tenant_id must be set
requestor_type: 'owner'  → owner_id must be set
requestor_type: 'admin'  → system-initiated
```

### Vendor Capabilities

- **Performance tracking** through ratings (0-5 stars)
- **Emergency availability** flags for 24/7 service
- **Payment terms** and preferred methods
- **Service area** coverage tracking
- **Specialization** documentation

---

## Financial Transactions Module

### Module Components

```
-- =====================================================
-- 010 - Invoices Table (Pure Polymorphic + Template Ready)
-- 011 - Receipts Table (Enhanced Payment Details)
-- 012 - Rental Transactions (Updated with Invoice/Receipt Links)
-- 013 - Expense Transactions (Updated with Invoice/Receipt Links)
-- =====================================================
```

### Financial Data Flow

```
    ┌─────────────┐
    │   Entity    │ (Contract/Order/Property/Owner)
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Invoice   │ (Polymorphic entity reference)
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Receipt   │ (Payment gateway integration)
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │ Transaction │ (Rental or Expense)
    └─────────────┘
```

### Polymorphic Invoice System

The invoice table uses `entity_type` and `entity_id` to reference different sources:

|entity_type|References|Use Case|
|---|---|---|
|rental_contract|rental_contracts table|Monthly rent billing|
|maintenance_order|maintenance_orders table|Repair costs|
|property_expense|properties table|Building-wide expenses|
|unit_expense|units table|Unit-specific costs|
|owner_expense|owners table|Management fees|
|vendor_payment|vendors table|Vendor services|

### Payment Gateway Integration

```
Receipts Table Support:
├── KNET (Kuwait local)
├── Myfatoorah (International gateway)
├── Bank transfers (NBK, CBK, etc.)
├── Credit cards (Visa, Mastercard)
├── Mobile payments (UPayments)
└── Cash transactions
```

### Key Business Rules

- **Receipts cannot exist without invoices** (strict dependency)
- **Automatic status calculation** based on payment amounts
- **Multi-currency support** with exchange rates
- **Provider fee tracking** for gateway costs
- **Recurring invoice support** with auto-generation

---

## User & Authentication Module

### Module Components

```
-- =====================================================
-- 014 - Users & Authentication Module (REMS Phase 2)
-- =====================================================
```

### User Entity Relationship

```
┌─────────┐     ┌───────────────────┐     ┌─────────┐
│ Owners  │◄────┤                   ├────►│ Tenants │
└─────────┘     │      Users        │     └─────────┘
                │                   │
                │ related_entity_id │     ┌─────────┐
                │ related_entity_   │────►│ Vendors │
                │      type         │     └─────────┘
                └───────────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Sessions │  │ Password │  │  Audit   │
    └──────────┘  │  Resets  │  └──────────┘
                  └──────────┘
```

### Polymorphic User System

Users table links to different entity types:

- `user_type: 'owner'` → `related_entity_type: 'owner'` → owners table
- `user_type: 'tenant'` → `related_entity_type: 'tenant'` → tenants table
- `user_type: 'vendor'` → `related_entity_type: 'vendor'` → vendors table
- `user_type: 'admin'` → No entity relationship (system user)

### Security Features

- **Account lockout** after failed attempts
- **Session tracking** with device fingerprinting
- **Password reset** with token expiration
- **Two-factor authentication** ready
- **JSON-based permissions** for flexible roles

---

## System Configuration Module

### Module Components

```
-- =====================================================
-- 015 - System Configuration Module (REMS Phase 2)
-- =====================================================
```

### Configuration Architecture

```
┌─────────────────┐
│ System Settings │ (Key-value configuration)
├─────────────────┤
│ • General       │
│ • Email         │
│ • Payment       │
│ • Security      │
└─────────────────┘
         │
┌────────▼────────┐     ┌──────────────┐
│   Currencies    │     │    Email     │
│                 │     │  Templates   │
│ • Exchange rates│     │              │
│ • Base currency │     │ • Variables  │
└─────────────────┘     └──────────────┘
         │                      │
         └──────┬───────────────┘
                │
        ┌───────▼────────┐
        │ Notifications  │
        │                │
        │ • User alerts  │
        │ • System events│
        └────────────────┘
```

### Setting Types & Validation

The system validates settings based on their type:

- `string`: General text values
- `number`: Numeric values with range validation
- `boolean`: True/false flags
- `email`: Email format validation
- `url`: URL format validation
- `json`: Valid JSON structure
- `array`: JSON array format
- `password`: Encrypted storage

### Currency Management

- **Single base currency** enforced (trigger-based)
- **Exchange rate tracking** with timestamps
- **10 pre-configured currencies** in seed data
- **Decimal place configuration** per currency

---

## Audit & Logging Module

### Module Components

```
-- =====================================================
-- 016 - Audit & History Module (Fixed Dependencies)
-- =====================================================
```

### Audit Architecture

```
┌──────────────────┐
│ Entity Changes   │
│                  │     ┌─────────────────┐
│ • Table name     │────►│ Entity Audit Log│
│ • Entity ID      │     └─────────────────┘
│ • Old values     │
│ • New values     │     ┌─────────────────┐
│ • Changed by     │────►│ Login History   │
└──────────────────┘     └─────────────────┘
                         
                         ┌─────────────────┐
                    ────►│  System Logs    │
                         └─────────────────┘
```

### Audit Coverage

- **Entity audit**: All INSERT, UPDATE, DELETE operations tracked
- **Login tracking**: Success/failure with device information
- **System events**: Application-level logging with categories
- **Immutable records**: Audit entries cannot be modified

### Log Categories

- `authentication`: Login/logout events
- `authorization`: Permission checks
- `database`: Database operations
- `payment`: Financial transactions
- `email`: Communication logs
- `maintenance`: Work order events
- `security`: Security violations
- `performance`: System metrics
- `integration`: External system calls
- `user_action`: User-initiated events

---

## Data Relationships

### Critical Dependencies

#### Strict Parent-Child Relationships

```
Properties ──┬──► Units (cannot exist without property)
             │
             └──► Property Ownership Periods
             
Invoices ────────► Receipts (cannot exist without invoice)

Rental Contracts ─► Rental Transactions
```

#### Flexible Relationships

```
Owners ←──────────► Properties (via ownership periods)
         (Many-to-Many with percentages)

Tenants ←─────────► Rental Contracts
         (Can exist independently)

Maintenance Orders ←──► Vendors
         (Can be unassigned initially)
```

#### Polymorphic Relationships

```
Users ──┬──► Owners
        ├──► Tenants  
        └──► Vendors
        (One user maps to one entity)

Invoices ──┬──► Rental Contracts
           ├──► Maintenance Orders
           ├──► Properties
           └──► Owners
           (One invoice, multiple entity types)
```

### Business Rule Validations

#### Date Logic Constraints

- Contract `end_date` > `start_date`
- Invoice `due_date` >= `issue_date`
- Ownership period dates must not overlap for same property
- Password reset expiry > creation time

#### Amount Validations

- All monetary amounts must be positive
- Ownership percentages: 0.01 to 100.00
- Exchange rates must be positive
- Vendor ratings: 0 to 5

#### Status Progressions

- Contracts: `upcoming` → `active` → `expired`/`terminated`
- Maintenance: `submitted` → `approved` → `in_progress` → `completed`
- Invoices: `draft` → `sent` → `paid`
- Payments: `pending` → `processing` → `completed`

---

## Technical Components

### Trigger Functions

The system includes multiple trigger functions for automation:

#### Timestamp Management

- `update_*_timestamp()`: Auto-updates `updated_at` fields
- Applied to all major tables for audit trail

#### Business Logic Triggers

- `calculate_rental_uncollected_amount()`: Auto-calculates outstanding amounts
- `ensure_single_base_currency()`: Enforces one base currency
- `validate_user_entity_relationship()`: Validates polymorphic user relationships
- `manage_account_lockout()`: Handles security lockout logic

#### Auto-Generation

- `generate_maintenance_order_number()`: Creates order numbers (MO-YYYY-######)
- `generate_invoice_number()`: Creates invoice numbers (INV-YYYY-MM-#####)
- `generate_receipt_number()`: Creates receipt numbers (RCP-YYYY-MM-#####)

### Key Indexes

Performance indexes are created for:

- Foreign key relationships
- Unique constraints (property codes, email addresses)
- Frequently queried fields (status, dates, amounts)
- Full-text search (vendor service areas)
- JSON fields (using GIN indexes)

### Views for Reporting

The system includes analytical views:

- `units_summary`: Property unit statistics
- `active_contracts_summary`: Current lease overview
- `payment_method_analysis`: Payment gateway performance
- `expense_hierarchy`: Expense category breakdown
- `active_users_summary`: User activity monitoring

---
### Performance Optimization Guidelines

#### Indexed Columns for Fast Queries:

- All foreign keys
- `property_code`, `unit_number`
- `email`, `username` (unique indexes)
- Date fields used in range queries
- Status fields for filtering

#### Query Optimization Tips:

sql

```sql
-- Use the provided views for complex queries
SELECT * FROM active_contracts_summary WHERE property_code = 'Z1';

-- Instead of multiple joins
-- The view already handles the joins efficiently
```

#### Recommended Maintenance:

sql

```sql
-- Weekly: Update statistics
ANALYZE;

-- Monthly: Reindex frequently updated tables
REINDEX TABLE rental_transactions;
REINDEX TABLE maintenance_orders;

-- Quarterly: Full vacuum
VACUUM FULL ANALYZE;
```

---
## Developer Guide

### Getting Started

#### 1. Database Setup

```sql
-- Create database and schema
CREATE DATABASE rems;
\c rems;
CREATE SCHEMA rems;
SET search_path = rems, public;

-- Execute DDL
\i REMS_DDL.sql

-- Load seed data (optional)
\i seed.sql
```

#### 2. Common Query Patterns

##### Get Current Property Ownership

```sql
SELECT * FROM get_current_ownership('Z1', CURRENT_DATE);
```

##### Find Active Contracts for a Property

```sql
SELECT * FROM active_contracts_summary 
WHERE property_code = 'Z1';
```

##### Check Overdue Payments

```sql
SELECT * FROM overdue_rental_transactions 
WHERE risk_category = 'Critical';
```

#### 3. Frequently Used Queries
##### Get Property Income Summary:

sql

```sql
WITH property_income AS (
  SELECT 
    p.property_code,
    p.property_name,
    DATE_TRUNC('month', rt.transaction_date) as month,
    SUM(rt.collected_amount) as collected,
    SUM(rt.uncollected_amount) as outstanding
  FROM properties p
  JOIN units u ON p.property_id = u.property_id
  JOIN rental_contracts rc ON u.unit_id = rc.unit_id
  JOIN rental_transactions rt ON rc.contract_id = rt.contract_id
  WHERE rt.year = 2024
  GROUP BY p.property_code, p.property_name, DATE_TRUNC('month', rt.transaction_date)
)
SELECT * FROM property_income ORDER BY month DESC, property_code;
```

##### Find Tenants with Expiring Contracts:

sql

```sql
SELECT 
  t.full_name,
  t.mobile,
  t.email,
  rc.end_date,
  p.property_code || '-' || u.unit_number as unit,
  rc.monthly_rent
FROM rental_contracts rc
JOIN tenants t ON rc.tenant_id = t.tenant_id
JOIN units u ON rc.unit_id = u.unit_id
JOIN properties p ON u.property_id = p.property_id
WHERE rc.contract_status = 'active'
  AND rc.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
ORDER BY rc.end_date;
```

##### Property Maintenance History:

sql

```sql
SELECT 
  p.property_code,
  COUNT(mo.maintenance_order_id) as total_orders,
  SUM(CASE WHEN mo.priority = 'emergency' THEN 1 ELSE 0 END) as emergency_count,
  AVG(mo.actual_cost) as avg_cost,
  SUM(mo.actual_cost) as total_cost
FROM properties p
LEFT JOIN maintenance_orders mo ON p.property_id = mo.property_id
WHERE mo.requested_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY p.property_code
ORDER BY total_cost DESC;
```


---
### Extension Points

#### Adding New Entity Types

To add new polymorphic entity types:

1. Update check constraints on relevant tables
2. Add new entity_type values to invoices/users tables
3. Update validation triggers if needed

#### Custom Expense Categories

1. Insert into `expense_categories` with unique code
2. Add related `expense_types` with category reference
3. Update display_order for reporting

#### Payment Gateway Integration

1. Add provider to receipt validation constraint
2. Configure provider fees and payment types
3. Update payment_provider check constraint

---

## API Integration Points
#### Database ↔ API Mapping

| Database Operation             | API Endpoint           | Method | Description         |
| ------------------------------ | ---------------------- | ------ | ------------------- |
| SELECT properties              | /api/properties        | GET    | List all properties |
| INSERT rental_contracts        | /api/contracts         | POST   | Create new contract |
| UPDATE maintenance_orders      | /api/maintenance/:id   | PUT    | Update order status |
| SELECT + JOIN active_contracts | /api/dashboard/summary | GET    | Dashboard data      |

#### Stored Procedures for API:
sql

```sql
-- Create API-friendly procedures
CREATE OR REPLACE FUNCTION api_get_property_summary(p_owner_id INTEGER)
RETURNS TABLE (
  property_code VARCHAR,
  total_units INTEGER,
  occupied_units INTEGER,
  monthly_income NUMERIC,
  pending_maintenance INTEGER
) AS $$
BEGIN
  -- Implementation here
END;
$$ LANGUAGE plpgsql;
```

---

## Best Practices

#### Data Integrity

- Always use transactions for multi-table operations
- Rely on database constraints for validation
- Use triggers for complex business rules
- Maintain referential integrity through foreign keys

#### Performance Optimization

- Use provided indexes for queries
- Leverage views for complex reports
- Implement pagination for large datasets
- Use JSON fields judiciously

#### Security Considerations

- Hash passwords using bcrypt
- Validate user permissions in application layer
- Use prepared statements to prevent SQL injection
- Implement row-level security where needed

#### Database Security Best Practices

##### Role-Based Access:

sql

```sql
-- Create roles
CREATE ROLE rems_readonly;
CREATE ROLE rems_tenant;
CREATE ROLE rems_owner;
CREATE ROLE rems_admin;

-- Grant appropriate permissions
GRANT SELECT ON ALL TABLES IN SCHEMA rems TO rems_readonly;
GRANT SELECT, INSERT, UPDATE ON tenants, rental_contracts TO rems_tenant;
GRANT ALL ON ALL TABLES IN SCHEMA rems TO rems_admin;
```

##### Data Encryption:

- Passwords: Using bcrypt (cost factor 10)
- Sensitive fields: Consider pgcrypto extension
- Connections: Require SSL/TLS

##### Audit Requirements:

- All DELETE operations logged
- Financial transactions immutable
- User actions tracked with IP/timestamp

---
## Database Migration Strategy

#### From Existing Systems:

sql

```sql
-- Example: Migrating from spreadsheet-based system
-- 1. Create staging tables
CREATE TABLE staging.old_properties AS ...;

-- 2. Transform and validate
INSERT INTO properties (...)
SELECT ... FROM staging.old_properties
WHERE ... validation conditions ...;

-- 3. Verify integrity
SELECT COUNT(*) FROM properties p
LEFT JOIN staging.old_properties op ON ...
WHERE op.id IS NULL;
```

#### Version Upgrade Path:

- v1.0 → v1.1: Add indexes for performance
- v1.1 → v1.2: Add audit tables
- v1.2 → v2.0: Add multi-currency support

---
## System Capabilities Summary

### Property Management

✓ Multi-property portfolios  
✓ Shared ownership with percentages  
✓ Temporal ownership tracking  
✓ Unit-level management  
✓ Property valuation tracking

### Tenant Management

✓ Individual and corporate tenants  
✓ Dual-tenant contracts  
✓ Contract lifecycle management  
✓ Multiple identification types  
✓ Contact information management

### Financial Management

✓ Polymorphic invoicing system  
✓ Multiple payment gateways  
✓ Multi-currency support  
✓ Recurring invoice automation  
✓ Late fee calculation  
✓ Comprehensive transaction tracking

### Maintenance & Vendors

✓ Dual-requestor support (tenant/owner)  
✓ Vendor performance tracking  
✓ Emergency service availability  
✓ Approval workflows  
✓ Cost estimation vs actual

### System Infrastructure

✓ Role-based access control  
✓ Complete audit trail  
✓ Session management  
✓ Email template system  
✓ In-app notifications  
✓ System configuration management

### Analytics & Reporting

✓ Built-in analytical views  
✓ Performance metrics  
✓ Financial analytics  
✓ Occupancy tracking  
✓ Vendor performance analysis

### Backup Strategy

#### Daily Backup Script:

bash

```bash
#!/bin/bash
# Save as /scripts/backup_rems.sh

DB_NAME="rems"
BACKUP_DIR="/backups/rems"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/rems_backup_$DATE.sql"

# Create backup
pg_dump -U postgres -d $DB_NAME -f $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

#### Recovery Process:

bash

```bash
# Restore from backup
gunzip rems_backup_20240101_120000.sql.gz
psql -U postgres -d rems < rems_backup_20240101_120000.sql
```

---

## Conclusion

The REMS database schema provides a robust, scalable foundation for comprehensive property management operations. With its polymorphic design patterns, temporal data management, and extensive business rule enforcement, the system can handle complex real-world scenarios while maintaining data integrity and performance.

The modular architecture allows for independent development and testing of different functional areas while maintaining cohesive integration through well-defined relationships and constraints. The system is production-ready with built-in security, audit trails, and multi-portal support for different user types.

For the latest updates and seed data examples, refer to:

- **Schema**: REMS_DDL.sql
- **Test Data**: seed.sql (Version 2.1)

---

_Database Schema Version: 1.0_  
_Documentation Date: August 2025_  
_PostgreSQL Version: 15+_