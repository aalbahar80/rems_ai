# 🔧 Maintenance Workflow Module - REMS Database

**Module Purpose**: Comprehensive maintenance order management, vendor coordination, expense
classification, and service quality tracking with integrated approval workflows.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 5 workflow tables  
**Related Views**: 15 analytical views

---

## 📊 Module Overview

The Maintenance Workflow module provides end-to-end management of property maintenance operations,
from initial service requests through vendor coordination to completion and quality assessment. It
features a hierarchical expense classification system, intelligent approval routing, and
comprehensive vendor performance tracking.

```
MAINTENANCE WORKFLOW ARCHITECTURE
├── 📋 Maintenance Orders (Service Request Management)
│   ├── Multi-source requests → Tenants, owners, admin staff
│   ├── Priority classification → Low, medium, high, emergency
│   ├── Lifecycle tracking → Submitted → Scheduled → Completed
│   └── Cost estimation and tracking → Budget vs actual analysis
│
├── 🏢 Vendors (Service Provider Management)
│   ├── Vendor profiles → Contact info, specializations, ratings
│   ├── Performance tracking → Job completion rates, ratings
│   ├── Emergency availability → 24/7 service capabilities
│   └── Payment terms → Flexible payment arrangements
│
├── 📊 Expense Classification (Hierarchical Cost Management)
│   ├── Expense Categories → High-level groupings (utilities, maintenance)
│   ├── Expense Types → Specific services (plumbing, electrical, HVAC)
│   ├── Cost estimation → Budget planning and variance tracking
│   └── Tax deductibility → Compliance and reporting support
│
├── ⭐ Quality Assurance (Service Rating System)
│   ├── Multi-dimensional ratings → Response time, quality, professionalism
│   ├── Tenant feedback → Direct service experience assessment
│   ├── Vendor performance → Historical quality tracking
│   └── Recommendation system → Would-recommend scoring
│
└── 🔄 Approval Workflows (Cost Control & Authorization)
    ├── Threshold-based approval → Automatic vs manual authorization
    ├── Owner-based routing → Property ownership approval patterns
    ├── Emergency fast-track → Critical maintenance acceleration
    └── Firm-level policies → Customizable approval rules
```

---

## 🗃️ Table Definitions

### 1. **maintenance_orders** - Service Request Management

Central table for tracking all maintenance requests from submission to completion.

```sql
CREATE TABLE rems.maintenance_orders (
    maintenance_order_id     SERIAL PRIMARY KEY,
    order_number             VARCHAR,
    -- Location targeting
    unit_id                  INTEGER REFERENCES units(unit_id),
    property_id              INTEGER REFERENCES properties(property_id),
    -- Request origination
    tenant_id                INTEGER REFERENCES tenants(tenant_id),
    owner_id                 INTEGER REFERENCES owners(owner_id),
    requestor_type           VARCHAR NOT NULL,
    -- Service coordination
    vendor_id                INTEGER REFERENCES vendors(vendor_id),
    expense_type_id          INTEGER NOT NULL REFERENCES expense_types(type_id),
    -- Request details
    title                    VARCHAR NOT NULL,
    description              TEXT NOT NULL,
    priority                 VARCHAR DEFAULT 'medium',
    status                   VARCHAR DEFAULT 'submitted',
    -- Timeline tracking
    requested_date           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_date        TIMESTAMP,
    scheduled_date           TIMESTAMP,
    started_date             TIMESTAMP,
    completed_date           TIMESTAMP,
    -- Cost tracking
    estimated_cost           NUMERIC,
    actual_cost              NUMERIC,
    estimated_duration_hours INTEGER,
    actual_duration_hours    INTEGER,
    -- Quality assessment
    tenant_rating            NUMERIC CHECK (tenant_rating >= 1 AND tenant_rating <= 5),
    owner_rating             NUMERIC CHECK (owner_rating >= 1 AND owner_rating <= 5),
    -- Documentation
    vendor_notes             TEXT,
    admin_notes              TEXT,
    internal_notes           TEXT,
    photos_before            TEXT,
    photos_after             TEXT,
    -- Approval workflow
    requires_approval        BOOLEAN DEFAULT false,
    approved_by              INTEGER REFERENCES owners(owner_id),
    approved_date            TIMESTAMP,
    -- Audit and multi-tenant
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    firm_id                  INTEGER REFERENCES firms(firm_id),

    -- Business logic constraints
    CHECK (requestor_type IN ('tenant', 'owner', 'admin', 'system')),
    CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    CHECK (status IN ('submitted', 'acknowledged', 'scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    CHECK (completed_date IS NULL OR completed_date >= started_date),
    CHECK (started_date IS NULL OR started_date >= scheduled_date)
);
```

**Key Features:**

- **Multi-Source Requests**: Supports requests from tenants, owners, admin staff, or automated
  systems
- **Flexible Location Targeting**: Can target specific units or entire properties
- **Complete Lifecycle Tracking**: From submission through completion with timestamp recording
- **Cost Management**: Estimated vs actual cost and duration tracking
- **Quality Assessment**: Dual rating system from both tenants and owners
- **Photo Documentation**: Before and after photo storage for accountability
- **Approval Integration**: Seamless integration with approval workflow system

---

### 2. **vendors** - Service Provider Management

Comprehensive vendor database with performance tracking and service capabilities.

```sql
CREATE TABLE rems.vendors (
    vendor_id                SERIAL PRIMARY KEY,
    vendor_name              TEXT NOT NULL,
    vendor_type              VARCHAR DEFAULT 'contractor',
    contact_person           VARCHAR,
    -- Contact information
    phone_primary            VARCHAR,
    phone_secondary          VARCHAR,
    mobile                   VARCHAR,
    email                    VARCHAR,
    address                  TEXT,
    -- Legal and business details
    national_id              VARCHAR,
    commercial_registration  VARCHAR,
    tax_number               VARCHAR,
    specialization           TEXT,
    -- Performance metrics
    rating                   NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_jobs_completed     INTEGER DEFAULT 0,
    -- Payment preferences
    payment_terms            VARCHAR DEFAULT 'net_30',
    preferred_payment_method VARCHAR DEFAULT 'bank_transfer',
    -- Service capabilities
    emergency_available      BOOLEAN DEFAULT false,
    service_areas            TEXT,
    -- Status and notes
    is_active                BOOLEAN DEFAULT true,
    notes                    TEXT,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id                  INTEGER REFERENCES firms(firm_id),

    -- Business logic constraints
    CHECK (vendor_type IN ('contractor', 'supplier', 'service_provider', 'consultant', 'emergency_service')),
    CHECK (payment_terms IN ('immediate', 'net_7', 'net_15', 'net_30', 'net_60', 'net_90')),
    CHECK (preferred_payment_method IN ('cash', 'check', 'bank_transfer', 'card', 'digital_wallet'))
);
```

**Key Features:**

- **Comprehensive Profiles**: Complete contact, legal, and business information
- **Performance Tracking**: Automated rating calculation and job completion metrics
- **Service Classification**: Flexible vendor type categorization with specialization details
- **Emergency Capabilities**: 24/7 service availability tracking for urgent maintenance
- **Payment Flexibility**: Configurable payment terms and method preferences
- **Geographic Coverage**: Service area definition for vendor selection optimization

---

### 3. **expense_categories** - High-Level Cost Classification

Top-level expense categorization for hierarchical cost management.

```sql
CREATE TABLE rems.expense_categories (
    category_id       SERIAL PRIMARY KEY,
    category_name     VARCHAR NOT NULL UNIQUE,
    category_description TEXT,
    category_code     VARCHAR,
    is_tax_deductible BOOLEAN DEFAULT true,
    is_active         BOOLEAN DEFAULT true,
    display_order     INTEGER DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**

- **Hierarchical Structure**: Top-level categories for expense organization
- **Tax Management**: Built-in tax deductibility tracking for compliance
- **Flexible Coding**: Custom category codes for accounting system integration
- **Display Control**: Ordered presentation for user interface consistency

---

### 4. **expense_types** - Specific Service Classifications

Detailed expense type definitions within categories with cost estimation.

```sql
CREATE TABLE rems.expense_types (
    type_id                  SERIAL PRIMARY KEY,
    category_id              INTEGER NOT NULL REFERENCES expense_categories(category_id),
    type_name                VARCHAR NOT NULL,
    type_description         TEXT,
    type_code                VARCHAR,
    -- Cost estimation
    estimated_cost_range_min NUMERIC,
    estimated_cost_range_max NUMERIC,
    frequency                VARCHAR DEFAULT 'as_needed',
    is_emergency             BOOLEAN DEFAULT false,
    -- Management
    is_active                BOOLEAN DEFAULT true,
    display_order            INTEGER DEFAULT 0,
    created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'as_needed')),
    CHECK (estimated_cost_range_min IS NULL OR estimated_cost_range_min >= 0),
    CHECK (estimated_cost_range_max IS NULL OR estimated_cost_range_max >= estimated_cost_range_min),

    -- Unique constraint within category
    UNIQUE(category_id, type_name)
);
```

**Key Features:**

- **Hierarchical Classification**: Belongs to expense categories for organized structure
- **Budget Planning**: Cost range estimation for financial planning and variance analysis
- **Frequency Tracking**: Service frequency patterns for preventive maintenance scheduling
- **Emergency Classification**: Critical service identification for priority routing
- **Flexible Coding**: Integration with accounting and reporting systems

---

### 5. **maintenance_ratings** - Service Quality Assessment

Comprehensive service quality rating system with multi-dimensional feedback.

```sql
CREATE TABLE rems.maintenance_ratings (
    rating_id                SERIAL PRIMARY KEY,
    maintenance_order_id     INTEGER NOT NULL REFERENCES maintenance_orders(maintenance_order_id),
    tenant_id                INTEGER NOT NULL REFERENCES tenants(tenant_id),
    firm_id                  INTEGER NOT NULL REFERENCES firms(firm_id),
    -- Rating dimensions
    overall_rating           INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    response_time_rating     INTEGER CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
    quality_rating           INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    professionalism_rating   INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    communication_rating     INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    -- Recommendation
    would_recommend          BOOLEAN,
    feedback_comments        TEXT,
    completion_confirmed     BOOLEAN DEFAULT false,
    rated_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**

- **Multi-Dimensional Assessment**: Separate ratings for response time, quality, professionalism,
  and communication
- **Recommendation System**: Would-recommend binary indicator for vendor selection
- **Completion Verification**: Tenant confirmation of service completion
- **Detailed Feedback**: Open-text comments for specific improvement feedback
- **Time Tracking**: Rating timestamp for trend analysis and response patterns

---

## 🔗 Relationship Diagram

```
                           FIRMS (Multi-tenant)
                               |
                   ┌───────────┼───────────┐
                   |           |           |
               PROPERTIES  VENDORS    EXPENSE_CATEGORIES
                   |           |           |
                 UNITS         |      EXPENSE_TYPES
                   |           |           |
                   └─── MAINTENANCE_ORDERS ┘
                               |
                        MAINTENANCE_RATINGS

Relationship Details:
- Maintenance Orders → Can target Units or entire Properties
- Maintenance Orders → Assigned to Vendors for service delivery
- Maintenance Orders → Classified by Expense Types (hierarchical)
- Maintenance Ratings → One per completed maintenance order
- Expense Types → Belong to Expense Categories (hierarchical)
- All tables → Multi-tenant firm isolation
```

---

## 📈 Maintenance Business Intelligence Views

The system includes 15 specialized views for comprehensive maintenance analytics:

### **Maintenance Operations Views**

1. **active_maintenance_orders** - Current maintenance request queue
2. **maintenance_orders_by_requestor** - Request source analysis and patterns
3. **maintenance_orders_requiring_approval** - Approval workflow queue management
4. **maintenance_expense_correlation** - Cost analysis and budget tracking

### **Vendor Management Views**

5. **active_vendors_by_type** - Vendor categorization and availability
6. **emergency_vendors** - 24/7 service provider directory
7. **vendor_performance_summary** - Rating aggregation and performance metrics
8. **vendor_expense_analysis** - Vendor cost analysis and payment patterns

### **Expense Analytics Views**

9. **expense_hierarchy** - Category and type relationship visualization
10. **emergency_expense_types** - Critical maintenance service identification
11. **expenses_requiring_approval** - Cost control and authorization queue
12. **expense_transaction_summary** - Financial impact and budget analysis

### **Financial Integration Views**

13. **accountant_expense_analysis** - Accounting integration and reporting
14. **monthly_expense_budget** - Budget planning and variance tracking
15. **monthly_expense_summary** - Monthly cost aggregation and trends

---

## 🔧 Maintenance Workflows Supported

### **Service Request Workflow**

1. **Request Initiation**

   ```
   Requestor Identifies Issue → Create Maintenance Order → Classify Expense Type → Set Priority → Check Approval Requirements
   ```

2. **Vendor Assignment**

   ```
   Analyze Service Requirements → Match Vendor Specialization → Check Availability → Assign Vendor → Schedule Service
   ```

3. **Service Execution**

   ```
   Vendor Acknowledges → Schedule Service → Begin Work → Document Progress → Complete Service → Submit Invoice
   ```

4. **Quality Assessment**
   ```
   Tenant Reviews Service → Rate Multiple Dimensions → Provide Feedback → Confirm Completion → Update Vendor Performance
   ```

### **Emergency Maintenance Workflow**

1. **Emergency Fast-Track**
   ```
   Emergency Classification → Auto-Approve (if threshold allows) → Priority Vendor Selection → Immediate Scheduling → Expedited Processing
   ```

### **Approval Workflow Integration**

1. **Cost-Based Approval Routing**

   ```
   Estimate Cost → Check Approval Threshold → Route to Owner/Admin → Track Approval Status → Authorize Work → Monitor Completion
   ```

2. **Property Ownership-Based Routing**
   ```
   Identify Property → Check Ownership Structure → Route to Individual Owner or Firm Admin → Apply Approval Rules → Execute Authorization
   ```

---

## 🎯 Advanced Maintenance Features

### **Hierarchical Expense Classification**

The system supports two-level expense hierarchy:

```sql
-- Example hierarchy:
CATEGORY: "Building Maintenance"
├── TYPE: "HVAC Repair" (Emergency: true, Est: 200-800 KWD)
├── TYPE: "Plumbing Service" (Emergency: true, Est: 100-500 KWD)
├── TYPE: "Electrical Work" (Emergency: true, Est: 150-600 KWD)
└── TYPE: "General Maintenance" (Emergency: false, Est: 50-200 KWD)

CATEGORY: "Utilities"
├── TYPE: "Electricity Bills" (Frequency: monthly, Est: 100-300 KWD)
├── TYPE: "Water Bills" (Frequency: monthly, Est: 50-150 KWD)
└── TYPE: "Internet/Cable" (Frequency: monthly, Est: 30-80 KWD)
```

### **Multi-Dimensional Quality Assessment**

Maintenance ratings capture comprehensive service quality:

- **Overall Rating**: General satisfaction (1-5 scale)
- **Response Time**: Speed of initial response and scheduling
- **Quality**: Technical competence and work quality
- **Professionalism**: Behavior, appearance, and conduct
- **Communication**: Updates, explanations, and responsiveness
- **Recommendation**: Binary would-recommend indicator

### **Intelligent Vendor Selection**

Vendor assignment considers multiple factors:

- **Specialization Match**: Service requirements vs vendor capabilities
- **Geographic Coverage**: Service areas and property location
- **Availability**: Current workload and emergency capability
- **Performance History**: Historical ratings and completion rates
- **Cost Effectiveness**: Historical cost patterns and payment terms

### **Performance Tracking & Analytics**

The system automatically tracks:

- **Vendor Performance**: Average ratings, completion rates, response times
- **Cost Trends**: Budget vs actual analysis, seasonal patterns
- **Request Patterns**: Peak periods, common issues, requestor behavior
- **Quality Metrics**: Service satisfaction trends and improvement areas

---

## ⚡ Integration Points

### **With Core Entities Module**

- Properties/Units → Maintenance order targeting and location identification
- Tenants → Service request origination and quality feedback
- Owners → Approval workflow routing and cost authorization

### **With Financial System Module**

- Maintenance orders → Automatic expense transaction creation
- Vendor invoices → Invoice generation and payment processing
- Cost tracking → Budget analysis and variance reporting

### **With Multi-Tenant System**

- Firms → Data isolation and vendor management per firm
- Approval workflows → Firm-specific approval rules and thresholds
- Performance analytics → Firm-level reporting and benchmarking

### **With User Authentication Module**

- User roles → Permission-based access to maintenance functions
- Portal integration → Tenant self-service maintenance requests
- Notification system → Status updates and approval notifications

---

## 🏁 Summary

The Maintenance Workflow module provides:

- **5 comprehensive tables** supporting end-to-end maintenance management
- **15 analytical views** for complete operational intelligence
- **Hierarchical expense classification** with tax and compliance support
- **Multi-dimensional quality assessment** for vendor performance optimization
- **Intelligent approval workflows** with threshold and ownership-based routing
- **Emergency service support** with fast-track processing capabilities
- **Complete vendor management** with performance tracking and payment integration

This module supports sophisticated property maintenance operations including emergency response,
quality assurance, cost control, and vendor performance optimization suitable for professional
property management firms managing diverse portfolios.

---

**Next Module**: [Multi-Tenant System Module](04_multi_tenant_system.md) - Firms management, user
assignments, and approval workflows
