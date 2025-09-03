# 💰 Financial System Module - REMS Database

**Module Purpose**: Comprehensive financial management including invoices, receipts, rental
transactions, and expense tracking with polymorphic design patterns.

**Last Updated**: September 2, 2025  
**Database Schema**: `rems`  
**Tables**: 4 financial tables  
**Related Views**: 23 analytical views

---

## 📊 Module Overview

The Financial System module provides a complete end-to-end financial management solution for real
estate operations. It features a sophisticated polymorphic design that allows invoices and receipts
to work with any entity type, comprehensive transaction tracking, and advanced approval workflows.

```
FINANCIAL SYSTEM ARCHITECTURE
├── 📋 Invoices (Polymorphic Entity Billing)
│   ├── Rental invoices → Tenants
│   ├── Expense invoices → Vendors
│   ├── Recurring billing → Automated generation
│   └── Multi-currency support → International operations
│
├── 🧾 Receipts (Payment Documentation)
│   ├── Payment receipts → Any invoice
│   ├── Standalone receipts → Direct payments
│   ├── Multiple payment methods → Cash, card, bank, digital
│   └── Provider integration → Fees and external tracking
│
├── 🏠 Rental Transactions (Tenant Payment Tracking)
│   ├── Monthly rent tracking → Contract-based
│   ├── Payment status management → Due, partial, completed
│   ├── Late fees and discounts → Flexible pricing
│   └── Multi-tenant isolation → Firm-based segregation
│
└── 💸 Expense Transactions (Property Cost Management)
    ├── Property-based expenses → Maintenance, utilities, etc.
    ├── Approval workflows → Owner/admin approval routing
    ├── Vendor integration → Maintenance order correlation
    └── Tax and discount tracking → Financial reporting ready
```

---

## 🗃️ Table Definitions

### 1. **invoices** - Polymorphic Invoice System

Universal invoicing system supporting any entity type with advanced recurring billing capabilities.

```sql
CREATE TABLE rems.invoices (
    invoice_id           SERIAL PRIMARY KEY,
    invoice_number       VARCHAR,
    template_id          INTEGER,
    -- Polymorphic entity relationship
    invoice_type         VARCHAR NOT NULL,
    entity_id            INTEGER NOT NULL,
    entity_type          VARCHAR NOT NULL,
    -- Invoice details
    issue_date           DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date             DATE NOT NULL,
    total_amount         NUMERIC NOT NULL,
    currency             VARCHAR DEFAULT 'KWD',
    invoice_status       VARCHAR DEFAULT 'draft',
    payment_terms        VARCHAR DEFAULT 'net_30',
    -- Recurring invoice system
    is_recurring         BOOLEAN DEFAULT false,
    recurring_frequency  VARCHAR,
    parent_invoice_id    INTEGER REFERENCES invoices(invoice_id),
    next_generation_date DATE,
    auto_generate        BOOLEAN DEFAULT false,
    -- Financial breakdown
    tax_amount           NUMERIC DEFAULT 0,
    discount_amount      NUMERIC DEFAULT 0,
    late_fee_amount      NUMERIC DEFAULT 0,
    -- Content and tracking
    description          TEXT,
    terms_conditions     TEXT,
    notes                TEXT,
    sent_date            DATE,
    created_by           INTEGER REFERENCES owners(owner_id),
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Multi-tenant support
    firm_id              INTEGER REFERENCES firms(firm_id),

    -- Business logic constraints
    CHECK (total_amount > 0),
    CHECK (due_date >= issue_date),
    CHECK (invoice_status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
    CHECK (entity_type IN ('tenant', 'vendor', 'owner', 'property')),
    CHECK (invoice_type IN ('rental', 'maintenance', 'utility', 'service', 'expense')),
    CHECK (payment_terms IN ('immediate', 'net_7', 'net_15', 'net_30', 'net_60', 'net_90'))
);
```

**Key Features:**

- **Polymorphic Design**: Can invoice any entity (tenants, vendors, owners, properties)
- **Recurring Billing**: Automated invoice generation with configurable frequencies
- **Multi-Currency**: International operation support with exchange rate tracking
- **Financial Breakdown**: Separate tracking of taxes, discounts, and late fees
- **Status Management**: Complete lifecycle tracking from draft to payment
- **Template System**: Consistent invoice formatting and branding

---

### 2. **receipts** - Payment Documentation System

Comprehensive payment receipt system supporting standalone and invoice-linked payments.

```sql
CREATE TABLE rems.receipts (
    receipt_id              SERIAL PRIMARY KEY,
    receipt_number          VARCHAR,
    template_id             INTEGER,
    invoice_id              INTEGER REFERENCES invoices(invoice_id),
    -- Payment details
    payment_date            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount_received         NUMERIC NOT NULL,
    currency                VARCHAR DEFAULT 'KWD',
    payment_method          VARCHAR NOT NULL,
    payment_provider        VARCHAR,
    payment_type            VARCHAR,
    -- External integration
    external_transaction_id VARCHAR,
    provider_fee_amount     NUMERIC DEFAULT 0,
    exchange_rate           NUMERIC DEFAULT 1.000000,
    bank_reference          VARCHAR,
    check_number            VARCHAR,
    -- Payment status and details
    payment_status          VARCHAR DEFAULT 'completed',
    payment_description     TEXT,
    payer_name              VARCHAR,
    payer_contact           VARCHAR,
    received_by             INTEGER REFERENCES owners(owner_id),
    location_received       VARCHAR,
    verification_code       VARCHAR,
    -- Receipt classification
    receipt_type            VARCHAR DEFAULT 'payment',
    refund_reason           TEXT,
    notes                   TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (amount_received > 0),
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'check', 'digital_wallet', 'online')),
    CHECK (receipt_type IN ('payment', 'refund', 'adjustment', 'deposit'))
);
```

**Key Features:**

- **Flexible Payment Recording**: Both invoice-linked and standalone receipts
- **Multiple Payment Methods**: Cash, card, bank transfer, digital wallets, checks
- **External Integration**: Payment provider fee tracking and external transaction IDs
- **Multi-Currency**: Exchange rate tracking for international payments
- **Audit Trail**: Complete payment verification with codes and locations
- **Refund Management**: Built-in refund tracking and reasoning

---

### 3. **rental_transactions** - Tenant Payment Tracking

Monthly rent tracking system with comprehensive payment status management.

```sql
CREATE TABLE rems.rental_transactions (
    rental_transaction_id   SERIAL PRIMARY KEY,
    contract_id             INTEGER NOT NULL REFERENCES rental_contracts(contract_id),
    invoice_id              INTEGER REFERENCES invoices(invoice_id),
    receipt_id              INTEGER REFERENCES receipts(receipt_id),
    -- Time period tracking
    year                    INTEGER NOT NULL,
    month                   INTEGER NOT NULL,
    transaction_date        DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Financial amounts
    actual_rent             NUMERIC NOT NULL,
    collected_amount        NUMERIC DEFAULT 0,
    uncollected_amount      NUMERIC DEFAULT 0,
    late_fee_amount         NUMERIC DEFAULT 0,
    discount_amount         NUMERIC DEFAULT 0,
    -- Payment management
    payment_status          VARCHAR DEFAULT 'pending',
    due_date                DATE,
    payment_method          VARCHAR,
    payment_reference       VARCHAR,
    currency                VARCHAR DEFAULT 'KWD',
    exchange_rate           NUMERIC DEFAULT 1.000000,
    notes                   TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Enhanced tracking (added via migrations)
    tenant_id               INTEGER REFERENCES tenants(tenant_id),
    property_id             INTEGER REFERENCES properties(property_id),
    firm_id                 INTEGER REFERENCES firms(firm_id),

    -- Business logic constraints
    CHECK (month >= 1 AND month <= 12),
    CHECK (actual_rent > 0),
    CHECK (collected_amount >= 0),
    CHECK (collected_amount + uncollected_amount = actual_rent + late_fee_amount - discount_amount),
    CHECK (payment_status IN ('pending', 'partial', 'completed', 'overdue')),

    -- Unique constraint for monthly rent tracking
    UNIQUE(contract_id, year, month)
);
```

**Key Features:**

- **Monthly Rent Tracking**: Systematic month-by-month rental payment management
- **Partial Payment Support**: Tracks collected vs uncollected amounts
- **Late Fee Integration**: Automated late fee calculation and tracking
- **Multi-Tenant Isolation**: Firm-based data segregation
- **Financial Integration**: Links to invoice and receipt systems
- **Audit Compliance**: Complete payment history preservation

---

### 4. **expense_transactions** - Property Expense Management

Comprehensive expense tracking system with approval workflows and vendor integration.

```sql
CREATE TABLE rems.expense_transactions (
    expense_transaction_id      SERIAL PRIMARY KEY,
    property_id                 INTEGER NOT NULL REFERENCES properties(property_id),
    expense_category_id         INTEGER NOT NULL REFERENCES expense_categories(category_id),
    expense_type_id             INTEGER NOT NULL REFERENCES expense_types(type_id),
    vendor_id                   INTEGER REFERENCES vendors(vendor_id),
    maintenance_order_id        INTEGER REFERENCES maintenance_orders(maintenance_order_id),
    invoice_id                  INTEGER REFERENCES invoices(invoice_id),
    receipt_id                  INTEGER REFERENCES receipts(receipt_id),
    -- Expense details
    expense_date                DATE NOT NULL DEFAULT CURRENT_DATE,
    amount                      NUMERIC NOT NULL,
    currency                    VARCHAR DEFAULT 'KWD',
    exchange_rate               NUMERIC DEFAULT 1.000000,
    description                 TEXT NOT NULL,
    -- Approval workflow
    payment_status              VARCHAR DEFAULT 'pending',
    approval_required           BOOLEAN DEFAULT false,
    approved_by                 INTEGER REFERENCES owners(owner_id),
    approved_date               TIMESTAMP,
    approval_threshold_exceeded BOOLEAN DEFAULT false,
    auto_approved               BOOLEAN DEFAULT false,
    approval_requested_at       TIMESTAMP,
    final_approval_at           TIMESTAMP,
    -- Payment tracking
    payment_method              VARCHAR,
    payment_reference           VARCHAR,
    tax_amount                  NUMERIC DEFAULT 0,
    discount_amount             NUMERIC DEFAULT 0,
    notes                       TEXT,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CHECK (amount > 0),
    CHECK (tax_amount >= 0),
    CHECK (discount_amount >= 0),
    CHECK (payment_status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled'))
);
```

**Key Features:**

- **Approval Workflow**: Intelligent routing based on expense amounts and property ownership
- **Vendor Integration**: Direct linkage to maintenance orders and vendor management
- **Category Classification**: Hierarchical expense categorization for reporting
- **Multi-Currency**: Exchange rate tracking for international vendor payments
- **Tax Management**: Separate tax amount tracking for compliance
- **Audit Trail**: Complete approval and payment history

---

## 🔗 Relationship Diagram

```
                           FIRMS (Multi-tenant)
                               |
                   ┌───────────┼───────────┐
                   |           |           |
               PROPERTIES  CONTRACTS   VENDORS
                   |           |           |
                   |           |           |
        ┌─── EXPENSE_TRANSACTIONS ─┐       |
        |          |               |       |
        |          └── INVOICES ←──┼───────┘
        |              ↕
        |          RECEIPTS
        |              ↕
        └─── RENTAL_TRANSACTIONS

Relationship Details:
- Invoices → Polymorphic relationship (any entity type)
- Receipts → Can link to invoices or be standalone
- Rental Transactions → Contract-based monthly tracking
- Expense Transactions → Property-based with vendor integration
- All tables → Multi-tenant firm isolation
```

---

## 📈 Financial Business Intelligence Views

The system includes 23 specialized views for comprehensive financial analytics:

### **Revenue Analytics Views**

1. **monthly_rental_income_summary** - Monthly rental revenue tracking
2. **rental_payment_analysis** - Payment patterns and performance
3. **rental_transaction_summary** - Contract-level payment summaries
4. **tenant_payment_history** - Individual tenant payment records
5. **overdue_rental_transactions** - Outstanding payment tracking

### **Expense Analytics Views**

6. **accountant_expense_analysis** - Expense categorization and trends
7. **monthly_expense_summary** - Monthly expense breakdowns
8. **expense_transaction_summary** - Property-level expense tracking
9. **vendor_expense_analysis** - Vendor payment and performance analysis
10. **expenses_requiring_approval** - Approval workflow queue
11. **monthly_expense_budget** - Budget vs actual expense tracking
12. **maintenance_expense_correlation** - Maintenance cost analysis

### **Invoice & Receipt Management Views**

13. **active_invoices** - Current invoice status overview
14. **invoice_payment_status** - Invoice-to-payment matching
15. **invoice_summary_by_type** - Invoice categorization analysis
16. **recurring_invoices_due** - Automated billing queue
17. **daily_payment_summary** - Daily cash flow tracking

### **Payment Analytics Views**

18. **payment_method_analysis** - Payment method preferences and trends
19. **payment_provider_performance** - Provider fee analysis and performance
20. **financial_analytics_summary** - High-level financial KPIs

### **Dashboard & Reporting Views**

21. **accountant_financial_dashboard** - Accountant portal financial overview
22. **emergency_expense_types** - Critical expense category tracking
23. **expense_hierarchy** - Hierarchical expense categorization

---

## 🔧 Financial Workflows Supported

### **Invoice Management Workflow**

1. **Manual Invoice Creation**

   ```
   Select Entity → Choose Invoice Type → Set Amount & Terms → Generate Invoice → Send to Entity
   ```

2. **Recurring Invoice Automation**

   ```
   Create Master Invoice → Set Frequency → Auto-Generate → Auto-Send → Track Payment Status
   ```

3. **Payment Processing**
   ```
   Receive Payment → Create Receipt → Link to Invoice → Update Status → Generate Confirmation
   ```

### **Rental Revenue Management**

1. **Monthly Rent Processing**

   ```
   Contract Analysis → Generate Rental Transaction → Create Invoice → Track Payment → Handle Late Fees
   ```

2. **Payment Collection**
   ```
   Monitor Due Dates → Send Reminders → Process Payment → Create Receipt → Update Transaction Status
   ```

### **Expense Management Workflow**

1. **Property Expense Processing**

   ```
   Incur Expense → Categorize → Check Approval Threshold → Route for Approval → Process Payment → Create Receipt
   ```

2. **Approval Routing Logic**
   ```
   Property Ownership Analysis → Individual Owner vs Firm Default → Route to Owner or Admin → Track Approval → Final Payment Authorization
   ```

### **Multi-Currency Operations**

1. **International Payment Processing**
   ```
   Record in Original Currency → Apply Exchange Rate → Convert to Base Currency → Track Rate Changes → Generate Reports
   ```

---

## 🎯 Advanced Financial Features

### **Polymorphic Invoice System**

The invoice system uses a polymorphic design allowing any entity to be invoiced:

```sql
-- Examples of polymorphic relationships:
-- Tenant rental invoice
entity_type = 'tenant', entity_id = tenant_id, invoice_type = 'rental'

-- Vendor maintenance invoice
entity_type = 'vendor', entity_id = vendor_id, invoice_type = 'maintenance'

-- Owner expense reimbursement
entity_type = 'owner', entity_id = owner_id, invoice_type = 'expense'
```

### **Approval Workflow Intelligence**

Expense transactions feature intelligent approval routing:

- **Threshold-Based**: Automatic approval below configured amounts
- **Ownership-Based**: Routes to individual owners vs firm administrators
- **Time-Based**: Escalation after 72 hours without approval
- **Emergency**: Fast-track approval for critical maintenance

### **Multi-Tenant Financial Isolation**

All financial data is isolated by firm:

- **Revenue Segregation**: Rental income tracked per firm
- **Expense Allocation**: Property expenses isolated by firm ownership
- **Reporting Boundaries**: Financial reports respect firm boundaries
- **Currency Preferences**: Firm-specific base currency configuration

---

## ⚡ Integration Points

### **With Core Entities Module**

- Properties → Expense transaction targeting
- Rental contracts → Monthly rental transaction generation
- Owners → Approval workflow routing and invoice creation authority

### **With Maintenance Workflow Module**

- Maintenance orders → Automatic expense transaction creation
- Vendors → Invoice generation and payment processing
- Expense categories → Maintenance cost classification

### **With Multi-Tenant System**

- Firms → Financial data isolation and currency preferences
- User permissions → Financial operation authorization levels
- Approval workflows → Firm-specific approval routing rules

### **With Business Intelligence Module**

- All views → Real-time financial analytics and reporting
- Dashboard integration → KPI calculation and trend analysis
- Export capabilities → Financial statement generation

---

## 🏁 Summary

The Financial System module provides:

- **4 comprehensive financial tables** with advanced business logic
- **23 analytical views** for complete financial intelligence
- **Polymorphic invoice system** supporting any entity type
- **Multi-currency operations** with exchange rate tracking
- **Intelligent approval workflows** with threshold and ownership-based routing
- **Complete audit trail** with payment verification and tracking
- **Multi-tenant isolation** ensuring secure financial data segregation

This module supports complex real estate financial operations including international transactions,
automated recurring billing, sophisticated approval workflows, and comprehensive financial reporting
suitable for professional property management firms.

---

**Next Module**: [Maintenance Workflow Module](03_maintenance_workflow.md) - Maintenance orders,
vendor management, and service coordination
