## **Complete Portal Documentation Set** (8 Documents)

### **✅ ADMIN PORTAL** - System Configuration & Supervision

1. **Enhanced Admin Portal Specification**
2. **Admin Client Onboarding - Detailed User Journey Map**

### **✅ ACCOUNTANT PORTAL** - Data Entry & Operations Management

3. **Enhanced Accountant Portal Specification**
4. **Accountant Portal - Detailed User Journey Map**

### **✅ OWNER PORTAL** - Investment Oversight & Approval Authority

5. **Enhanced Owner Portal Specification**
6. **Owner Portal - Detailed User Journey Map**

### **✅ TENANT PORTAL** - Service Access & Payment Processing

7. **Enhanced Tenant Portal Specification**
8. **Tenant Portal - Detailed User Journey Map**

## Key Database Changes Required:

Based on your requirements, you'll need these **additional database modifications**:

### **Critical Schema Updates:**

sql

```sql
-- 1. Multi-firm user assignments (replaces single firm_id)
CREATE TABLE user_firm_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INT4 REFERENCES users(user_id),
    firm_id INT4 REFERENCES firms(firm_id),
    role_in_firm VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Firm-default ownership capability
ALTER TABLE property_ownership_periods
ADD COLUMN owned_by_firm BOOLEAN DEFAULT FALSE,
ALTER COLUMN owner_id DROP NOT NULL;

-- 3. Enhanced approval workflow
ALTER TABLE expense_transactions
ADD COLUMN approval_required_by VARCHAR(20) DEFAULT 'auto';
```

## Database Schema Changes Needed

### **1. Firm-Default Ownership (Major Change)**

**Your Logic**: "Whenever a share is not assigned to an owner, it gets assigned to the firm
automatically"

**Database Changes Needed**:

sql

```sql
-- Add firm ownership capability
ALTER TABLE property_ownership_periods
ADD COLUMN owned_by_firm BOOLEAN DEFAULT FALSE;

-- Allow NULL owner_id when owned by firm
ALTER TABLE property_ownership_periods
ALTER COLUMN owner_id DROP NOT NULL;

-- Add check constraint
ALTER TABLE property_ownership_periods
ADD CONSTRAINT chk_owner_or_firm
CHECK ((owner_id IS NOT NULL AND owned_by_firm = FALSE) OR
       (owner_id IS NULL AND owned_by_firm = TRUE));
```

### **2. Multi-Firm User Assignment**

**Your Logic**: "Accountants can work for multiple firms and toggle between them"

**Database Changes Needed**:

sql

```sql
-- New junction table for user-firm relationships
CREATE TABLE user_firm_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INT4 REFERENCES users(user_id),
    firm_id INT4 REFERENCES firms(firm_id),
    role_in_firm VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by INT4 REFERENCES users(user_id),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Remove single firm_id from users table
-- ALTER TABLE users DROP COLUMN firm_id; (if it exists)
```

### **3. Expense Approval Workflow**

**Your Logic**: "If owner exists → owner approves, if no owner → admin approves"

**Database Changes Needed**:

sql

```sql
-- Add approval workflow tracking
ALTER TABLE expense_transactions
ADD COLUMN approval_required_by VARCHAR(20) DEFAULT 'auto',
ADD COLUMN approval_threshold_exceeded BOOLEAN DEFAULT FALSE;

-- Values: 'auto', 'admin', 'owner', 'both'
```

### **4. Bulk Unit Creation**

**Your Logic**: "Create 10 identical 2-bedroom apartments at once"

**Implementation**: No schema changes needed, just enhanced application logic for bulk INSERT
operations.

### **Database Considerations:**

The Owner portal doesn't require major schema changes, but you'll want to optimize for:

sql

```sql
-- Performance indexes for owner queries
CREATE INDEX idx_owner_property_performance ON rental_transactions (contract_id, year, month);
CREATE INDEX idx_owner_expense_approvals ON expense_transactions (property_id, approval_required_by, approved_date);

-- Views for owner financial summaries
CREATE VIEW owner_monthly_summary AS
SELECT property_id, EXTRACT(year FROM expense_date) as year, EXTRACT(month FROM expense_date) as month,
       SUM(amount) as total_expenses, COUNT(*) as expense_count
FROM expense_transactions GROUP BY property_id, year, month;
```

## **Database Requirements Summary:**

The Tenant portal is the lightest on database requirements, but you'll want:

sql

```sql
-- Tenant payment method storage
ALTER TABLE users ADD COLUMN preferred_payment_method VARCHAR(20) DEFAULT 'knet';
ALTER TABLE users ADD COLUMN payment_preferences JSONB DEFAULT '{}';

-- Maintenance request photo storage
ALTER TABLE maintenance_orders ADD COLUMN request_photos TEXT[];
ALTER TABLE maintenance_orders ADD COLUMN completion_photos TEXT[];

-- Tenant rating system
ALTER TABLE maintenance_orders ADD COLUMN tenant_rating NUMERIC(2,1);
ALTER TABLE maintenance_orders ADD COLUMN tenant_feedback TEXT;
```
