# 🏗️ Core Entities Module - REMS Database

**Module Purpose**: Foundation entities for property management including owners, properties, units,
tenants, and rental contracts.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 6 core tables  
**Related Views**: 19 analytical views

---

## 📊 Module Overview

The Core Entities module forms the foundation of the REMS (Real Estate Management System) database,
containing the essential business entities that represent the core relationships in property
management:

```
CORE ENTITY RELATIONSHIPS
├── 🏢 Properties (Buildings/Complexes)
│   ├── 🏠 Units (Individual rentable spaces)
│   └── 👤 Property Ownership (Owner relationships with percentages)
│
├── 👥 Owners (Property investors/stakeholders)
│   └── 📊 Ownership Periods (Time-based ownership tracking)
│
├── 🏃 Tenants (Property occupants)
│   └── 📝 Rental Contracts (Lease agreements)
│
└── 🏢 Multi-Tenant Support
    └── All entities linked to Firms for data isolation
```

---

## 🗃️ Table Definitions

### 1. **owners** - Property Investors & Stakeholders

Core table for individuals or entities that own properties in the system.

```sql
CREATE TABLE rems.owners (
    owner_id           SERIAL PRIMARY KEY,
    first_name         TEXT NOT NULL,
    middle_name        TEXT,
    last_name          TEXT NOT NULL,
    full_name          TEXT NOT NULL,
    display_name       TEXT,
    nationality        VARCHAR,
    phone_primary      VARCHAR,
    phone_secondary    VARCHAR,
    email              VARCHAR,
    national_id_type   VARCHAR DEFAULT 'civil_id',
    national_id_number VARCHAR,
    address            TEXT,
    preferred_language VARCHAR DEFAULT 'en',
    is_active          BOOLEAN DEFAULT true,
    notes              TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id            INTEGER REFERENCES firms(firm_id)
);
```

**Key Features:**

- **Multi-language Support**: Full name storage with display preferences
- **Flexible Contact**: Multiple phone numbers and email verification ready
- **National ID Support**: Configurable ID types (civil_id, passport, etc.)
- **Multi-tenant**: Firm-based data isolation
- **Audit Ready**: Created/updated timestamps for change tracking

---

### 2. **properties** - Buildings & Real Estate Assets

Central table for properties (buildings, complexes, individual structures).

```sql
CREATE TABLE rems.properties (
    property_id       SERIAL PRIMARY KEY,
    property_code     VARCHAR NOT NULL UNIQUE,
    property_name     TEXT,
    location          VARCHAR,
    address           TEXT,
    area_sqm          NUMERIC,
    total_units       INTEGER DEFAULT 0,
    property_type     VARCHAR DEFAULT 'residential',
    construction_year INTEGER,
    construction_cost NUMERIC,
    planning_permit   VARCHAR,
    valuation_amount  NUMERIC,
    valuation_date    DATE,
    valuation_method  VARCHAR,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id           INTEGER REFERENCES firms(firm_id)
);
```

**Key Features:**

- **Unique Identification**: Property code for business reference
- **Comprehensive Details**: Location, size, construction, valuation data
- **Flexible Property Types**: Residential, commercial, mixed-use, industrial
- **Financial Tracking**: Construction costs and current valuations
- **Multi-tenant**: Firm-based property management

---

### 3. **units** - Rentable Spaces Within Properties

Individual rentable units within properties (apartments, offices, shops).

```sql
CREATE TABLE rems.units (
    unit_id                  SERIAL PRIMARY KEY,
    property_id              INTEGER NOT NULL REFERENCES properties(property_id),
    unit_number              VARCHAR NOT NULL,
    unit_type                VARCHAR DEFAULT 'apartment',
    number_of_livingrooms    INTEGER DEFAULT 0,
    number_of_bedrooms       INTEGER DEFAULT 0,
    number_of_bathrooms      INTEGER DEFAULT 0,
    number_of_parking_spaces INTEGER DEFAULT 0,
    area_sqm                 NUMERIC,
    base_rent_amount         NUMERIC,
    is_active                BOOLEAN DEFAULT true,
    notes                    TEXT,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Composite unique constraint
    UNIQUE(property_id, unit_number)
);
```

**Key Features:**

- **Hierarchical Relationship**: Units belong to properties
- **Detailed Room Layout**: Living rooms, bedrooms, bathrooms, parking
- **Flexible Unit Types**: Apartment, office, shop, warehouse, etc.
- **Rental Foundation**: Base rent amounts for contract generation
- **Unique Unit Numbers**: Within each property context

---

### 4. **tenants** - Property Occupants & Lessees

Individuals or entities that rent units from properties.

```sql
CREATE TABLE rems.tenants (
    tenant_id            SERIAL PRIMARY KEY,
    first_name           TEXT NOT NULL,
    middle_name          TEXT,
    last_name            TEXT NOT NULL,
    full_name            TEXT NOT NULL,
    nationality          VARCHAR,
    home_phone           VARCHAR,
    work_phone           VARCHAR,
    mobile               VARCHAR,
    email                VARCHAR,
    work_address         TEXT,
    national_id_type     VARCHAR DEFAULT 'civil_id',
    national_id          VARCHAR,
    is_active            BOOLEAN DEFAULT true,
    notes                TEXT,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id              INTEGER REFERENCES firms(firm_id),
    -- Portal enhancements
    portal_access_enabled BOOLEAN DEFAULT true,
    last_portal_login    TIMESTAMP,
    preferred_language   VARCHAR DEFAULT 'en',
    mobile_verified      BOOLEAN DEFAULT false,
    email_verified       BOOLEAN DEFAULT false
);
```

**Key Features:**

- **Comprehensive Contact Info**: Multiple phone numbers, work/home addresses
- **Portal Integration**: Digital access management for tenant self-service
- **Verification System**: Mobile and email verification status
- **Multi-language**: Preferred language for communications
- **Multi-tenant**: Firm-based tenant management

---

### 5. **rental_contracts** - Lease Agreements

Legal contracts between owners and tenants for unit occupancy.

```sql
CREATE TABLE rems.rental_contracts (
    contract_id              SERIAL PRIMARY KEY,
    unit_id                  INTEGER NOT NULL REFERENCES units(unit_id),
    tenant_id                INTEGER NOT NULL REFERENCES tenants(tenant_id),
    second_tenant_id         INTEGER REFERENCES tenants(tenant_id),
    contract_number          VARCHAR,
    start_date               DATE NOT NULL,
    end_date                 DATE NOT NULL,
    monthly_rent             NUMERIC NOT NULL,
    deposit_amount           NUMERIC DEFAULT 0,
    contract_status          VARCHAR DEFAULT 'upcoming',
    notes                    TEXT,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Enhanced contract features
    digital_signature_date   TIMESTAMP,
    tenant_document_access   BOOLEAN DEFAULT true,
    auto_renewal_preference  BOOLEAN DEFAULT false,
    property_id              INTEGER REFERENCES properties(property_id),

    -- Business logic constraints
    CHECK (end_date > start_date),
    CHECK (monthly_rent > 0),
    CHECK (contract_status IN ('upcoming', 'active', 'expired', 'terminated', 'cancelled'))
);
```

**Key Features:**

- **Dual Tenant Support**: Primary and secondary tenant capability
- **Flexible Contract Management**: Multiple status types and auto-renewal
- **Digital Integration**: Digital signatures and document access
- **Financial Foundation**: Monthly rent and deposit tracking
- **Data Integrity**: Business logic constraints for valid contracts

---

### 6. **property_ownership_periods** - Ownership Tracking

Time-based ownership records with percentage allocations and management fees.

```sql
CREATE TABLE rems.property_ownership_periods (
    ownership_id              SERIAL PRIMARY KEY,
    property_id               INTEGER NOT NULL REFERENCES properties(property_id),
    owner_id                  INTEGER REFERENCES owners(owner_id),
    ownership_percentage      NUMERIC NOT NULL DEFAULT 100.00,
    start_date                DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date                  DATE,
    is_primary_contact        BOOLEAN DEFAULT false,
    management_fee_percentage NUMERIC DEFAULT 5.00,
    acquisition_method        VARCHAR,
    notes                     TEXT,
    created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id                   INTEGER REFERENCES firms(firm_id),
    -- Enhanced ownership model
    ownership_type            VARCHAR DEFAULT 'individual',

    -- Business logic constraints
    CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    CHECK (end_date IS NULL OR end_date > start_date),
    CHECK (management_fee_percentage >= 0 AND management_fee_percentage <= 100),
    CHECK (ownership_type IN ('individual', 'firm_default'))
);
```

**Key Features:**

- **Flexible Ownership**: Individual and firm-default ownership types
- **Time-Based Tracking**: Historical ownership with start/end dates
- **Financial Management**: Management fee percentage tracking
- **Primary Contact**: Designated communication contact for properties
- **Data Integrity**: Percentage and date validation constraints

---

## 🔗 Relationship Diagram

```
                                    FIRMS (Multi-tenant)
                                        |
                            ┌───────────┼───────────┐
                            |           |           |
                    ┌── OWNERS ──┐  PROPERTIES  TENANTS ──┐
                    |            |       |                |
                    |            └── ownership_periods    |
                    |                    |                |
                    |                  UNITS              |
                    |                    |                |
                    └──────────── RENTAL_CONTRACTS ───────┘

Relationship Details:
- One Property → Many Units (1:N)
- One Property → Many Ownership Periods (1:N)
- One Owner → Many Ownership Periods (1:N)
- One Unit → Many Rental Contracts (1:N - over time)
- One Tenant → Many Rental Contracts (1:N)
- One Firm → Many Properties, Owners, Tenants (1:N)
```

---

## 📈 Core Business Intelligence Views

The system includes 19 specialized views for analytics and business intelligence:

### **Property Analytics Views**

1. **property_performance_analytics** - Property-level performance metrics
2. **property_ownership_summary** - Current ownership distribution
3. **units_summary** - Unit utilization and occupancy statistics

### **Owner Dashboard Views**

4. **owner_portfolio_dashboard** - Owner-specific portfolio overview
5. **owner_portfolio_summary** - Consolidated owner metrics
6. **owner_property_performance** - Property performance by owner

### **Tenant Management Views**

7. **active_tenants** - Currently active tenant list
8. **tenant_dashboard_overview** - Tenant portal dashboard data
9. **tenant_contract_overview** - Contract status and details
10. **tenant_payment_history** - Payment tracking and history
11. **tenants_by_nationality** - Demographic analysis

### **Contract Management Views**

12. **active_contracts_summary** - Active contract overview
13. **contracts_by_status** - Contract distribution by status

### **System Management Views**

14. **tenant_communications** - Communication tracking
15. **tenant_payment_preferences** - Payment method preferences

---

## 🔧 Business Workflows Supported

### **Property Management Workflow**

1. **Property Registration**

   ```
   Create Property → Add Units → Define Ownership Periods → Set Management Fees
   ```

2. **Owner Onboarding**

   ```
   Register Owner → Assign Properties → Set Ownership Percentages → Configure Contact Preferences
   ```

3. **Tenant Acquisition**
   ```
   Register Tenant → Create Contract → Assign Unit → Set Rent & Deposit → Activate Lease
   ```

### **Multi-Tenant Data Isolation**

All core entities support firm-based data isolation:

- **Properties**: Managed per firm with independent portfolios
- **Owners**: Firm-specific investor management
- **Tenants**: Isolated tenant databases per firm
- **Contracts**: Firm-segregated lease agreements

### **Ownership Management**

- **Individual Ownership**: Direct owner-property relationships
- **Firm-Default Ownership**: Automatic firm ownership when no individual owners
- **Percentage Tracking**: Historical ownership changes over time
- **Management Fees**: Configurable fee structures per ownership period

---

## ⚡ Integration Points

### **With Financial System Module**

- Rental contracts → Invoice generation
- Ownership periods → Revenue distribution
- Management fees → Automatic calculations

### **With Maintenance Module**

- Properties/Units → Maintenance order targeting
- Owners → Approval workflows for expenses
- Tenants → Service request origination

### **With Multi-Tenant System**

- Firm assignments → Data isolation
- User management → Portal access control
- Approval workflows → Ownership-based routing

---

## 🏁 Summary

The Core Entities module provides:

- **6 foundational tables** with comprehensive business logic
- **19 analytical views** for business intelligence
- **Multi-tenant architecture** for data isolation
- **Flexible ownership models** supporting various business structures
- **Portal-ready design** for digital tenant and owner engagement
- **Audit trail foundation** with timestamps and change tracking

This module serves as the foundation for all other REMS modules and supports complex real estate
management scenarios including multi-property portfolios, shared ownership, and comprehensive tenant
lifecycle management.

---

**Next Module**: [Financial System Module](02_financial_system.md) - Invoice, receipt, and
transaction management
