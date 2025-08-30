# REMS International Seed Data Documentation

## Version 2.1 - Production Ready

### Table of Contents

1. [Overview](#overview)
2. [Data Architecture](#Data-Architecture)
3. [Entity Descriptions](#entity-descriptions)
4. [Test Scenarios](#test-scenarios)
5. [Usage Guide](#usage-guide)
6. [Data Relationships](#data-relationships)
7. [Testing Capabilities](#testing-capabilities)

---

## Overview

The REMS (Real Estate Management System) international seed data provides a comprehensive test
dataset designed for system validation, demonstration, and development purposes. This dataset
simulates a realistic property management portfolio with international stakeholders, diverse
property types, and complete business workflows.

### Key Features

- **International diversity**: Owners, tenants, and vendors from 10+ nationalities
- **Complete workflows**: End-to-end business processes from property ownership to payment
  processing
- **Realistic scenarios**: Active contracts, maintenance requests, payment histories, and financial
  transactions
- **Multi-language support**: English and Arabic language preferences
- **Role-based access**: Complete user authentication and authorization structure

### Database Requirements

- PostgreSQL 15+
- Schema: `rems`
- Prerequisites: REMS_DDL.sql must be executed first

---

## Data Architecture

### Statistical Summary

| Entity                 | Count | Description                                      |
| ---------------------- | ----- | ------------------------------------------------ |
| **Owners**             | 6     | International property investors and partners    |
| **Properties**         | 15    | Residential, commercial, and mixed-use buildings |
| **Units**              | 26    | Apartments, studios, commercial spaces, storage  |
| **Tenants**            | 15    | Individual and corporate tenants                 |
| **Rental Contracts**   | 15    | Active, upcoming, terminated, and expired        |
| **Vendors**            | 13    | Service providers and contractors                |
| **Maintenance Orders** | 8     | Various priority levels and statuses             |
| **Invoices**           | 10    | Recurring and one-time billing                   |
| **Receipts**           | 8     | Multiple payment methods and gateways            |
| **Users**              | 10    | System users with different roles                |
| **Expense Categories** | 10    | Comprehensive expense classification             |
| **Expense Types**      | 19    | Detailed expense subcategories                   |

---

## Entity Descriptions

### 1. Property Owners

The seed data includes six property owners representing different investment strategies:

#### **Alexander James Richardson** (British)

- **Portfolio**: 8 properties (Z1-Z10 series)
- **Investment Type**: Large-scale residential investor
- **Properties**: Richardson Tower One/Two, Richardson Plaza, Gardens, Heights, Court, Residence,
  Studios
- **Strategy**: Premium residential rentals in Salmiya

#### **Sofia Marie Martinez** (Spanish)

- **Portfolio**: 4 properties (S1-S4 series) + 50% of AHS1
- **Investment Type**: Family real estate business
- **Properties**: Martinez Tower, Plaza, Residences, Apartments
- **Strategy**: Mixed residential portfolio across multiple locations

#### **Ahmad Hassan Al-Rashid** (Kuwaiti)

- **Portfolio**: 50% of AHS1
- **Investment Type**: Joint venture partner
- **Strategy**: Shared ownership model

#### **Chen Wei Zhang** (Chinese)

- **Portfolio**: AL property
- **Investment Type**: Mixed-use development
- **Properties**: Zhang International Building (residential + commercial)
- **Strategy**: Tech entrepreneur diversifying into real estate

#### **David Thompson & Francois Dubois** (American/French)

- **Portfolio**: AF property (50% each)
- **Investment Type**: International partnership
- **Strategy**: Premium single-family homes

### 2. Properties

#### Property Distribution by Type:

- **Residential**: 13 properties (87%)
- **Mixed-Use**: 1 property (7%)
- **Commercial Units**: Within mixed-use building

#### Geographic Distribution:

- **Salmiya**: 11 properties (73%)
- **Hawalli**: 1 property (7%)
- **Fahaheel**: 1 property (7%)
- **Qortuba**: 1 property (7%)

#### Valuation Data:

Three properties have documented valuations using income approach (7% cap rate):

- Z1: 1,571,785.71 KWD
- Z2: 881,714.29 KWD
- Z3: 938,142.86 KWD

### 3. Tenant Demographics

#### Tenant Categories:

**Professional Tenants (40%)**

- Government employees
- Banking professionals
- Oil industry engineers
- Healthcare workers

**International Expatriates (33%)**

- Teachers (American School of Kuwait)
- Medical professionals (Egyptian, Indian)
- IT professionals (American, Filipino)

**Families (20%)**

- Diplomatic families (Canadian Embassy, UN)
- Dual-income households

**Corporate Tenants (20%)**

- Global Trading Company LLC
- Tech Innovations Kuwait WLL
- Legal Associates & Partners

#### Nationality Distribution:

- Kuwaiti: 4 tenants
- North American: 3 tenants
- European: 3 tenants
- Middle Eastern: 2 tenants
- Asian: 3 tenants

### 4. Rental Contracts

#### Contract Status Distribution:

- **Active**: 10 contracts (67%)
- **Upcoming**: 2 contracts (13%)
- **Terminated**: 1 contract (7%)
- **Expired**: 2 contracts (13%)

#### Rental Price Range:

- **Studios**: 220-280 KWD/month
- **1-Bedroom**: 290-350 KWD/month
- **2-Bedroom**: 380-480 KWD/month
- **3-Bedroom**: 520-600 KWD/month
- **4-Bedroom House**: 800 KWD/month
- **Commercial Space**: 1,200 KWD/month
- **Storage**: 50-80 KWD/month
- **Parking**: 40 KWD/month

### 5. Vendor Network

#### Vendor Categories:

**Contractors (38%)**

- General construction
- HVAC specialists
- Plumbing experts
- Electrical contractors

**Service Providers (23%)**

- Cleaning services
- Security services
- Facility management

**Suppliers (15%)**

- Building materials
- Furniture and fixtures

**Professional Services (15%)**

- Engineering consultants
- Accounting (Big 4)
- Legal services

**Utilities (8%)**

- Government utility provider (MEW)

#### Emergency Service Availability:

- 24/7 Emergency: 7 vendors (54%)
- Regular hours only: 6 vendors (46%)

### 6. Maintenance Workflow

#### Maintenance Orders by Priority:

- **Emergency**: 2 orders (25%)
- **High**: 2 orders (25%)
- **Medium**: 2 orders (25%)
- **Low**: 2 orders (25%)

#### Requestor Distribution:

- **Tenant-initiated**: 4 orders (50%)
- **Owner-initiated**: 4 orders (50%)

#### Common Maintenance Issues:

1. Plumbing repairs (leaks, floods)
2. HVAC failures (AC units)
3. Electrical upgrades
4. Property renovations
5. Routine cleaning
6. Exterior maintenance

---

## Test Scenarios

### 1. Payment Processing Scenarios

The seed data includes comprehensive payment gateway integration examples:

#### Payment Methods Tested:

- **KNET** (Kuwait local network): 2.75 KWD average fee
- **Credit Cards** (Visa/Mastercard): 3% processing fee
- **Bank Transfers**: No fees
- **Cash Payments**: Manual processing
- **Mobile Payments** (UPayments): 3% fee
- **Failed Transactions**: For error handling

#### Payment Providers:

- Myfatoorah (international gateway)
- KNET (local gateway)
- NBK, CBK (local banks)
- UPayments (mobile platform)

### 2. Financial Workflows

#### Invoice Types:

- **Recurring Monthly**: Rent, utilities
- **One-time**: Maintenance, repairs
- **Refunds**: Security deposits
- **Late Fees**: 10% penalty implementation

#### Collection Rate Scenarios:

- Fully paid: 60% of transactions
- Partial payments: 20% of transactions
- Overdue: 15% of transactions
- Pending: 5% of transactions

### 3. User Access Scenarios

#### User Roles Implemented:

**Admin Users**

- Full system access
- User creation privileges
- System configuration

**Property Owners**

- Property management
- Financial viewing
- Maintenance approval

**Tenants**

- Maintenance requests
- Rent history
- Payment processing

**Vendors**

- Work order management
- Invoice submission
- Status updates

**Accounting Staff**

- Financial reporting
- Expense approval
- Audit access

**Maintenance Staff**

- Vendor assignment
- Small expense approval
- Order management

### 4. Audit Trail Examples

The seed data includes comprehensive audit logging:

- Entity change tracking
- User login history
- Failed login attempts
- System error logs
- Payment processing logs
- Maintenance workflow tracking

---

## Usage Guide

### Installation Steps

1. **Create Database and Schema**

```sql
CREATE DATABASE rems;
\c rems;
CREATE SCHEMA rems;
SET search_path = rems, public;
```

2. **Execute DDL Script**

```bash
psql -U postgres -d rems -f REMS_DDL.sql
```

3. **Load Seed Data**

```bash
psql -U postgres -d rems -f seed.sql
```

4. **Verify Installation**

```sql
-- Check data load statistics
SELECT 'Owners' as entity, COUNT(*) as count FROM rems.owners
UNION ALL
SELECT 'Properties', COUNT(*) FROM rems.properties
UNION ALL
SELECT 'Units', COUNT(*) FROM rems.units
UNION ALL
SELECT 'Tenants', COUNT(*) FROM rems.tenants
UNION ALL
SELECT 'Contracts', COUNT(*) FROM rems.rental_contracts
UNION ALL
SELECT 'Vendors', COUNT(*) FROM rems.vendors;
```

### Default Credentials

All user accounts use the same default password for testing:

- **Password**: `password`
- **Hash**: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

#### Sample User Accounts:

- **Admin**: admin@rems.local
- **Accountant**: accounting@rems.local
- **Owner**: alexander@richardson-properties.com
- **Tenant**: mohammed.rasheed@tenant.local
- **Vendor**: info@richardson-contracting.com

---

## Data Relationships

### Primary Relationships

```
Owners ──┬──> Property_Ownership_Periods <──┬── Properties
         │                                   │
         └──> Users                          └──> Units
                                                   │
Tenants ──> Users                                 │
   │                                              │
   └──────> Rental_Contracts <───────────────────┘
                    │
                    ├──> Invoices ──> Receipts
                    │
                    └──> Rental_Transactions

Vendors ──> Maintenance_Orders <── Expense_Transactions
         │                              │
         └──> Users                     └──> Expense_Categories
                                             └──> Expense_Types
```

### Key Foreign Key Relationships

1. **Property Ownership**
   - Properties → Owners (via ownership_periods)
   - Supports multiple owners per property
   - Temporal ownership tracking

2. **Rental Management**
   - Units → Properties
   - Contracts → Units + Tenants
   - Supports dual tenants (couples)

3. **Financial Tracking**
   - Invoices → Multiple entity types (polymorphic)
   - Receipts → Invoices
   - Transactions → Contracts/Invoices/Receipts

4. **Maintenance Workflow**
   - Orders → Units/Properties
   - Orders → Tenants/Owners (requestors)
   - Orders → Vendors (assigned)

5. **User Authentication**
   - Users → Owners/Tenants/Vendors (polymorphic)
   - Sessions → Users
   - Notifications → Users

---

## Testing Capabilities

### Functional Testing Areas

#### 1. Property Management

- Multi-owner properties
- Ownership percentage calculations
- Property valuation tracking
- Unit availability management

#### 2. Tenant Management

- Individual vs. corporate tenants
- Family/couple contracts
- International tenant handling
- Multiple contact methods

#### 3. Financial Management

- Rent collection workflows
- Late payment processing
- Partial payment handling
- Multiple currency support (KWD primary)
- Payment gateway integration

#### 4. Maintenance Management

- Emergency vs. routine requests
- Vendor assignment
- Cost estimation vs. actual
- Approval workflows
- Rating system

#### 5. Reporting Capabilities

- Income analysis by property
- Expense tracking by category
- Occupancy rates
- Vendor performance
- Payment collection rates

### Performance Testing

The seed data is suitable for:

- Query optimization testing
- Index performance validation
- Join operation efficiency
- Aggregation performance
- Transaction processing speed

### Security Testing

Pre-configured scenarios for:

- Role-based access control
- Failed login attempt handling
- Session management
- Audit trail verification
- Data encryption validation

---

## Best Practices for Developers

### 1. Extending the Seed Data

When adding new test data:

- Use subqueries for foreign keys: `(SELECT id FROM table WHERE condition)`
- Maintain referential integrity
- Follow naming conventions
- Document test scenarios

### 2. Data Cleanup

To reset the database:

```sql
-- Drop and recreate schema
DROP SCHEMA rems CASCADE;
CREATE SCHEMA rems;
SET search_path = rems, public;
-- Re-run DDL and seed scripts
```

### 3. Custom Test Scenarios

The seed data can be extended for specific testing needs:

- Add more properties in specific locations
- Create additional contract scenarios
- Implement complex payment patterns
- Test specific maintenance workflows

### 4. Troubleshooting

Common issues and solutions:

- **Foreign key violations**: Check entity creation order
- **Constraint violations**: Verify enum values match DDL
- **Duplicate key errors**: Ensure unique values for constrained fields
- **Date logic errors**: Verify date ranges are valid

---

## Conclusion

The REMS international seed data provides a robust foundation for testing and demonstrating the Real
Estate Management System. With its diverse international dataset, comprehensive business scenarios,
and complete workflow coverage, developers can effectively validate system functionality, test edge
cases, and demonstrate capabilities to stakeholders.

The data represents realistic property management operations in Kuwait while maintaining
international diversity, making it suitable for both local and global deployment scenarios.

For questions or contributions, please refer to the project repository or contact the development
team.

---

_Last Updated: August 2025_  
_Version: 2.1_  
_Status: Production Ready_
