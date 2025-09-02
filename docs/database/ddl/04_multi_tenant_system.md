# 🏢 Multi-Tenant System Module - REMS Database

**Module Purpose**: Complete multi-tenant architecture with firm management, intelligent approval
workflows, user assignments, and automatic firm-default ownership for unassigned property shares.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 4 multi-tenant tables  
**Related Views**: 7 management views

---

## 📊 Module Overview

The Multi-Tenant System module provides enterprise-grade multi-tenancy with complete data isolation,
intelligent approval workflows, and a unique **firm-default ownership** feature that automatically
handles unassigned property revenue and expenses. This system enables property management companies
to serve multiple clients while maintaining strict data boundaries and flexible approval processes.

```
MULTI-TENANT SYSTEM ARCHITECTURE
├── 🏢 Firms (Tenant Organizations)
│   ├── Complete business profiles → Legal info, contacts, industry classification
│   ├── Data isolation boundaries → All entities linked to firm_id
│   ├── Branding customization → Logos, business descriptions, websites
│   └── Industry-specific configurations → Real estate, investment, management
│
├── 👥 User-Firm Assignments (Access Control)
│   ├── Multi-firm user access → Users can work across multiple firms
│   ├── Role-based permissions → Admin, accountant, owner, tenant per firm
│   ├── Primary firm designation → Default firm for user operations
│   └── Flexible access levels → Standard, advanced, restricted access
│
├── 💼 Firm-Default Ownership (Automatic Revenue/Expense Attribution)
│   ├── Unassigned property shares → Automatic firm ownership when no individual owners
│   ├── Revenue attribution → Rental income credited to firm when ownership gaps exist
│   ├── Expense allocation → Property costs debited to firm for unassigned portions
│   └── Financial gap prevention → Ensures all financial activity has proper ownership
│
├── ✅ Intelligent Approval Workflows (Smart Decision Routing)
│   ├── Ownership-based routing → Individual owner vs firm admin approval
│   ├── Threshold-based automation → Auto-approve below configured limits
│   ├── Escalation management → 72-hour escalation with admin fallback
│   └── Priority classification → Normal, urgent, emergency processing
│
└── 🔄 Approval Delegations (Authority Management)
    ├── Temporary authority transfer → Owner delegation to staff/family
    ├── Amount-limited delegation → Controlled spending authority
    ├── Property-restricted delegation → Specific property authorization only
    └── Time-bounded delegation → Start/end date controlled authority
```

---

## 🗃️ Table Definitions

### 1. **firms** - Tenant Organization Management

Central table managing tenant organizations with complete business profiles and customization.

```sql
CREATE TABLE rems.firms (
    firm_id              SERIAL PRIMARY KEY,
    firm_name            VARCHAR NOT NULL,
    legal_business_name  VARCHAR,
    registration_number  VARCHAR,
    -- Contact information
    primary_phone        VARCHAR,
    secondary_phone      VARCHAR,
    email                VARCHAR,
    business_address     TEXT,
    -- Organization details
    number_of_employees  INTEGER,
    logo_url             VARCHAR,
    business_description TEXT,
    website_url          VARCHAR,
    industry_type        VARCHAR DEFAULT 'real_estate',
    tax_number           VARCHAR,
    -- Management
    is_active            BOOLEAN DEFAULT true,
    created_by           INTEGER,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (industry_type IN ('real_estate', 'property_management', 'investment', 'development', 'consulting'))
);
```

**Key Features:**

- **Complete Business Profiles**: Legal names, registration numbers, tax information
- **Multi-Industry Support**: Real estate, property management, investment, development
- **Customization Ready**: Logo URLs and business descriptions for branding
- **Contact Flexibility**: Primary and secondary phone numbers with email
- **Audit Trail**: Creation tracking for accountability and compliance

---

### 2. **user_firm_assignments** - Multi-Firm Access Control

Manages user access across multiple firms with role-based permissions and primary firm designation.

```sql
CREATE TABLE rems.user_firm_assignments (
    assignment_id    SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(user_id),
    firm_id          INTEGER NOT NULL REFERENCES firms(firm_id),
    role_in_firm     VARCHAR NOT NULL,
    is_primary_firm  BOOLEAN DEFAULT false,
    access_level     VARCHAR DEFAULT 'standard',
    is_active        BOOLEAN DEFAULT true,
    -- Assignment tracking
    assigned_by      INTEGER,
    assigned_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deactivated_at   TIMESTAMP,
    deactivated_by   INTEGER,
    -- Audit
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (role_in_firm IN ('admin', 'accountant', 'owner', 'tenant', 'staff', 'viewer')),
    CHECK (access_level IN ('restricted', 'standard', 'advanced', 'full')),

    -- Unique active assignment per user-firm combination
    UNIQUE(user_id, firm_id, is_active) WHERE is_active = true
);
```

**Key Features:**

- **Multi-Firm Access**: Single user can work across multiple tenant organizations
- **Role-Based Permissions**: Different roles (admin, accountant, owner) per firm
- **Primary Firm Designation**: Default firm for user operations and context switching
- **Flexible Access Levels**: Granular permission control within roles
- **Assignment Tracking**: Complete audit trail of user access changes
- **Deactivation Management**: Soft deletion with timestamp and responsibility tracking

---

### 3. **approval_decisions** - Intelligent Workflow Management

Advanced approval routing system with ownership-based decision logic and escalation management.

```sql
CREATE TABLE rems.approval_decisions (
    decision_id          SERIAL PRIMARY KEY,
    expense_id           INTEGER NOT NULL,
    firm_id              INTEGER NOT NULL REFERENCES firms(firm_id),
    property_id          INTEGER REFERENCES properties(property_id),
    -- Intelligent routing
    approval_required_by VARCHAR NOT NULL DEFAULT 'admin',
    required_owner_id    INTEGER,
    approval_status      VARCHAR DEFAULT 'pending',
    approval_priority    VARCHAR DEFAULT 'normal',
    approval_deadline    TIMESTAMP,
    -- Decision tracking
    approved_by          INTEGER,
    approved_at          TIMESTAMP,
    rejection_reason     TEXT,
    -- Escalation management
    escalated_to_admin   BOOLEAN DEFAULT false,
    escalated_at         TIMESTAMP,
    -- Audit
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (approval_required_by IN ('owner', 'admin', 'auto_approved')),
    CHECK (approval_status IN ('pending', 'approved', 'rejected', 'escalated')),
    CHECK (approval_priority IN ('normal', 'urgent', 'emergency'))
);
```

**Key Features:**

- **Intelligent Routing**: Automatically determines if owner or admin approval is needed
- **Ownership Analysis**: Routes to specific owners when individual ownership exists
- **Escalation System**: 72-hour escalation to admin when owner doesn't respond
- **Priority Classification**: Normal, urgent, emergency processing with different timelines
- **Complete Audit Trail**: Every approval decision tracked with timestamps and reasoning

---

### 4. **approval_delegations** - Authority Management System

Flexible delegation system allowing owners to transfer approval authority with controlled
limitations.

```sql
CREATE TABLE rems.approval_delegations (
    delegation_id        SERIAL PRIMARY KEY,
    delegator_owner_id   INTEGER NOT NULL,
    delegate_user_id     INTEGER NOT NULL REFERENCES users(user_id),
    firm_id              INTEGER NOT NULL REFERENCES firms(firm_id),
    -- Delegation controls
    max_amount_limit     NUMERIC,
    property_restrictions ARRAY,
    is_active            BOOLEAN DEFAULT true,
    start_date           DATE DEFAULT CURRENT_DATE,
    end_date             DATE,
    -- Management
    created_by           INTEGER,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (end_date IS NULL OR end_date > start_date),
    CHECK (max_amount_limit IS NULL OR max_amount_limit > 0)
);
```

**Key Features:**

- **Flexible Authority Transfer**: Owners can delegate approval authority to staff or family
- **Amount Limitations**: Controlled spending limits on delegated authority
- **Property Restrictions**: Delegation can be limited to specific properties
- **Time-Bounded Control**: Start and end dates for temporary delegations
- **Multi-Level Delegation**: Support for complex organizational structures

---

## 🎯 Firm-Default Ownership System

### **Automatic Financial Attribution**

The system includes a sophisticated **firm-default ownership** mechanism that automatically handles
unassigned property shares:

```sql
-- Property ownership logic in property_ownership_periods table
ownership_type VARCHAR DEFAULT 'individual' CHECK (ownership_type IN ('individual', 'firm_default'))

-- When ownership_type = 'firm_default':
-- - Revenue from unassigned property shares → Automatically credited to firm
-- - Expenses for unassigned property shares → Automatically debited to firm
-- - Financial reporting → Includes firm-owned portions separately
-- - Approval routing → Routes to firm admin instead of individual owners
```

### **How Firm-Default Ownership Works**

1. **Gap Detection**

   ```
   Property Analysis → Calculate Total Individual Ownership → Identify Unassigned Percentage → Create Firm-Default Ownership Record
   ```

2. **Revenue Attribution**

   ```
   Monthly Rent Collection → Calculate Individual Owner Portions → Attribute Remaining Revenue to Firm → Generate Firm Revenue Records
   ```

3. **Expense Allocation**

   ```
   Property Expense Occurs → Calculate Individual Owner Shares → Allocate Remaining Expense to Firm → Route Approval to Firm Admin
   ```

4. **Approval Routing Intelligence**
   ```sql
   -- Approval decision logic
   IF property has individual owners THEN
       Route to individual owner approval
   ELSE IF property has firm_default ownership THEN
       Route to firm admin approval
   END IF
   ```

### **Financial Impact Examples**

```sql
-- Example 1: Partially owned property
Property: 100% ownership
├── Individual Owner A: 60% ownership_type='individual'
├── Individual Owner B: 25% ownership_type='individual'
└── Firm Default: 15% ownership_type='firm_default'

Monthly Rent: 1000 KWD
├── Owner A receives: 600 KWD
├── Owner B receives: 250 KWD
└── Firm receives: 150 KWD (automatically attributed)

-- Example 2: Fully firm-owned property
Property: 100% ownership
└── Firm Default: 100% ownership_type='firm_default'

All revenue/expenses → Automatically attributed to firm
All approvals → Route to firm admin
```

---

## 🔗 Relationship Diagram

```
                           FIRMS (Tenant Organizations)
                               |
                   ┌───────────┼───────────┐
                   |           |           |
           USER_FIRM_ASSIGNMENTS    APPROVAL_DECISIONS
                   |           |           |
                 USERS    APPROVAL_DELEGATIONS    PROPERTIES
                   |           |                      |
                   └───── All Core Entities ──────────┘
                        (Data Isolation Layer)

Relationship Details:
- Firms → Central tenant organization management
- User Assignments → Multi-firm access with role-based permissions
- Approval Decisions → Intelligent routing based on ownership analysis
- Approval Delegations → Flexible authority transfer mechanisms
- All Core Entities → firm_id foreign key for data isolation
```

---

## 📈 Multi-Tenant Business Intelligence Views

The system includes 7 specialized views for multi-tenant management and monitoring:

### **Firm Management Views**

1. **admin_firm_management** - Complete firm overview with statistics and health metrics
2. **firm_statistics** - Firm-level KPIs including properties, users, and revenue
3. **firm_users_overview** - User assignment status and role distribution per firm

### **Approval Workflow Views**

4. **pending_approvals_overview** - Real-time approval queue with priority and deadline tracking
5. **expenses_requiring_approval** - Expense-specific approval queue with cost analysis
6. **maintenance_orders_requiring_approval** - Maintenance approval queue with urgency tracking

### **System Administration Views**

7. **admin_system_overview** - Cross-firm system health and performance metrics

---

## 🔧 Multi-Tenant Workflows Supported

### **Firm Onboarding Workflow**

1. **Organization Setup**

   ```
   Create Firm → Configure Business Profile → Set Industry Type → Upload Branding → Configure Settings
   ```

2. **User Assignment**

   ```
   Create Users → Assign to Firm → Set Roles → Configure Access Levels → Designate Primary Firm
   ```

3. **Data Migration**
   ```
   Import Properties → Create Ownership Records → Set Firm-Default for Unassigned → Configure Approval Rules
   ```

### **Approval Workflow Intelligence**

1. **Expense Approval Routing**

   ```
   Expense Created → Analyze Property Ownership → Route to Individual Owner OR Firm Admin → Track Response → Auto-Escalate if Needed
   ```

2. **Emergency Processing**
   ```
   Emergency Classification → Check Delegation Authority → Fast-Track Approval → Notify Stakeholders → Execute Immediately
   ```

### **Firm-Default Ownership Management**

1. **Automatic Attribution**

   ```
   Property Revenue/Expense → Calculate Individual Owner Shares → Attribute Remainder to Firm → Update Financial Records → Generate Reports
   ```

2. **Ownership Gap Prevention**
   ```
   New Property Registration → Analyze Ownership Assignments → Detect Gaps → Create Firm-Default Records → Prevent Financial Orphans
   ```

---

## 🎯 Advanced Multi-Tenant Features

### **Data Isolation Architecture**

Every core entity includes `firm_id` foreign key ensuring complete data segregation:

```sql
-- Complete data isolation across all modules:
owners.firm_id              → Owner segregation per firm
properties.firm_id          → Property portfolio isolation
tenants.firm_id             → Tenant management per firm
rental_contracts.firm_id    → Contract segregation
invoices.firm_id           → Financial isolation
expenses.firm_id           → Cost tracking per firm
vendors.firm_id            → Vendor management isolation
```

### **Intelligent Approval Routing Logic**

The system automatically determines approval requirements:

```sql
-- Approval routing intelligence
CASE
    WHEN property has individual owners (ownership_type='individual') THEN
        Route to specific owner_id approval
    WHEN property has only firm_default ownership THEN
        Route to firm admin approval
    WHEN expense exceeds delegation limits THEN
        Escalate to higher authority
    WHEN emergency priority THEN
        Fast-track with notification
END CASE
```

### **Cross-Firm User Management**

Users can work across multiple firms with different roles:

```sql
-- Example user with multiple firm assignments:
User: john.doe@email.com
├── Kuwait Properties LLC: role='accountant', access_level='advanced', is_primary=true
├── Gulf Real Estate: role='staff', access_level='standard', is_primary=false
└── Al Salam Holdings: role='viewer', access_level='restricted', is_primary=false
```

### **Delegation Authority Control**

Sophisticated delegation system with multiple control mechanisms:

- **Amount Limits**: Maximum spending authority (e.g., 500 KWD limit)
- **Property Restrictions**: Limited to specific properties (e.g., only Building A)
- **Time Boundaries**: Temporary delegations (e.g., during vacation)
- **Escalation Rules**: Automatic escalation when limits exceeded

---

## ⚡ Integration Points

### **With Core Entities Module**

- Property ownership periods → Firm-default ownership creation and management
- Owner approvals → Intelligent routing based on ownership analysis
- Revenue distribution → Automatic firm attribution for unassigned shares

### **With Financial System Module**

- Invoice routing → Firm-based approval when no individual owners
- Expense attribution → Automatic firm debiting for unassigned property costs
- Revenue distribution → Firm crediting for unassigned property income

### **With Maintenance Workflow Module**

- Maintenance approvals → Ownership-based routing with firm fallback
- Vendor management → Firm-specific vendor relationships and performance
- Cost authorization → Delegation-based approval authority

### **With User Authentication Module**

- Multi-firm context switching → Users working across multiple tenant organizations
- Role-based permissions → Firm-specific access control and authorization
- Portal integration → Firm-branded user interfaces and experiences

---

## 🏁 Summary

The Multi-Tenant System module provides:

- **4 comprehensive tables** supporting enterprise multi-tenancy
- **Complete data isolation** with firm_id-based segregation across all entities
- **Firm-default ownership system** automatically handling unassigned property shares
- **Intelligent approval workflows** with ownership-based routing and escalation
- **Flexible user assignments** supporting multi-firm access with role-based permissions
- **Advanced delegation system** with amount, property, and time-based controls
- **7 analytical views** for comprehensive multi-tenant management and monitoring

**🎯 Key Innovation: Firm-Default Ownership**

The system's most significant feature is the **automatic firm attribution** of revenue and expenses
for unassigned property ownership portions. This prevents financial "orphans" and ensures:

- **Complete Revenue Attribution**: Every dollar of rental income has a clear owner (individual or
  firm)
- **Comprehensive Expense Allocation**: All property costs are properly attributed and approved
- **Seamless Approval Routing**: System automatically routes to individual owners or firm admins
- **Financial Integrity**: No gaps in ownership mean no gaps in financial accountability

This module enables professional property management companies to serve multiple clients with
enterprise-grade data isolation while maintaining sophisticated approval workflows and ensuring
complete financial accountability through the innovative firm-default ownership system.

---

**Next Module**: [User Authentication Module](05_user_authentication.md) - Users, sessions, and
security management
