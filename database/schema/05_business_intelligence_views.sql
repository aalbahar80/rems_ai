-- =====================================================
-- 005 - Create Portal Views - STREAMLINED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Add portal-specific views for admin, accountant, owner, and tenant dashboards
-- Dependencies: 001-004 migrations
-- Version: 2.0.005
-- =====================================================

SET search_path = rems, public;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '005') THEN
        RAISE NOTICE 'Migration 005 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 005: Create Portal Views';

    -- =====================================================
    -- ADMIN PORTAL VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating admin portal views...';

    -- System overview for admin dashboard
    CREATE OR REPLACE VIEW admin_system_overview AS
    SELECT 
        -- Firm statistics
        (SELECT COUNT(*) FROM firms WHERE is_active = true) as active_firms,
        (SELECT COUNT(*) FROM user_firm_assignments WHERE is_active = true) as total_user_assignments,
        -- Property statistics
        (SELECT COUNT(*) FROM properties) as total_properties,
        (SELECT COUNT(*) FROM units) as total_units,
        (SELECT COUNT(*) FROM properties WHERE firm_id IS NOT NULL) as multi_tenant_properties,
        -- User statistics
        (SELECT COUNT(DISTINCT user_id) FROM user_firm_assignments WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM tenants WHERE is_active = true) as active_tenants,
        (SELECT COUNT(*) FROM owners WHERE is_active = true) as active_owners,
        -- Financial statistics
        (SELECT COALESCE(SUM(actual_rent), 0) FROM rental_transactions WHERE transaction_date >= date_trunc('month', CURRENT_DATE)) as monthly_rental_income,
        (SELECT COALESCE(SUM(amount), 0) FROM expense_transactions WHERE expense_date >= date_trunc('month', CURRENT_DATE)) as monthly_expenses,
        -- Maintenance statistics
        (SELECT COUNT(*) FROM maintenance_orders WHERE status IN ('submitted', 'acknowledged', 'in_progress')) as open_maintenance_orders,
        (SELECT COUNT(*) FROM approval_decisions WHERE approval_status = 'pending') as pending_approvals;

    -- Firm management view
    CREATE OR REPLACE VIEW admin_firm_management AS
    SELECT 
        f.firm_id,
        f.firm_name,
        f.legal_business_name,
        f.email,
        f.industry_type,
        f.is_active,
        f.created_at,
        -- User counts
        COUNT(DISTINCT ufa.user_id) as total_users,
        COUNT(DISTINCT CASE WHEN ufa.role_in_firm = 'admin' THEN ufa.user_id END) as admin_users,
        COUNT(DISTINCT CASE WHEN ufa.role_in_firm = 'accountant' THEN ufa.user_id END) as accountant_users,
        -- Entity counts
        COUNT(DISTINCT p.property_id) as properties_count,
        COUNT(DISTINCT o.owner_id) as owners_count,
        COUNT(DISTINCT t.tenant_id) as tenants_count,
        -- Financial summary
        COALESCE(SUM(rt.actual_rent), 0) as total_rental_income,
        COALESCE(SUM(et.amount), 0) as total_expenses
    FROM firms f
    LEFT JOIN user_firm_assignments ufa ON f.firm_id = ufa.firm_id AND ufa.is_active = true
    LEFT JOIN properties p ON f.firm_id = p.firm_id
    LEFT JOIN owners o ON f.firm_id = o.firm_id AND o.is_active = true
    LEFT JOIN tenants t ON f.firm_id = t.firm_id AND t.is_active = true
    LEFT JOIN rental_transactions rt ON f.firm_id = rt.firm_id
    LEFT JOIN expense_transactions et ON p.property_id = et.property_id
    GROUP BY f.firm_id, f.firm_name, f.legal_business_name, f.email, f.industry_type, f.is_active, f.created_at;

    RAISE NOTICE 'Admin portal views created successfully';

    -- =====================================================
    -- ACCOUNTANT PORTAL VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating accountant portal views...';

    -- Financial dashboard for accountants
    CREATE OR REPLACE VIEW accountant_financial_dashboard AS
    SELECT 
        f.firm_id,
        f.firm_name,
        -- Current month metrics
        COALESCE(SUM(CASE WHEN rt.transaction_date >= date_trunc('month', CURRENT_DATE) 
                         THEN rt.actual_rent ELSE 0 END), 0) as monthly_rent_income,
        COALESCE(SUM(CASE WHEN et.expense_date >= date_trunc('month', CURRENT_DATE) 
                         THEN et.amount ELSE 0 END), 0) as monthly_expenses,
        -- Outstanding items
        COUNT(DISTINCT CASE WHEN i.invoice_status = 'sent' AND i.due_date < CURRENT_DATE THEN i.invoice_id END) as overdue_invoices,
        COALESCE(SUM(CASE WHEN i.invoice_status = 'sent' AND i.due_date < CURRENT_DATE THEN i.total_amount ELSE 0 END), 0) as overdue_amount,
        -- Approval workflow
        COUNT(DISTINCT CASE WHEN ad.approval_status = 'pending' THEN ad.decision_id END) as pending_approvals,
        COUNT(DISTINCT CASE WHEN ad.approval_deadline < CURRENT_TIMESTAMP AND ad.approval_status = 'pending' THEN ad.decision_id END) as overdue_approvals,
        -- Property metrics
        COUNT(DISTINCT p.property_id) as managed_properties,
        COUNT(DISTINCT rc.contract_id) as active_contracts
    FROM firms f
    LEFT JOIN rental_transactions rt ON f.firm_id = rt.firm_id
    LEFT JOIN properties p ON f.firm_id = p.firm_id
    LEFT JOIN expense_transactions et ON p.property_id = et.property_id
    LEFT JOIN invoices i ON f.firm_id = i.firm_id
    LEFT JOIN approval_decisions ad ON f.firm_id = ad.firm_id
    LEFT JOIN rental_contracts rc ON p.property_id = rc.property_id AND rc.contract_status = 'active'
    WHERE f.is_active = true
    GROUP BY f.firm_id, f.firm_name;

    -- Expense analysis view
    CREATE OR REPLACE VIEW accountant_expense_analysis AS
    SELECT 
        p.firm_id,
        f.firm_name,
        ec.category_name,
        p.property_name,
        COUNT(*) as transaction_count,
        SUM(et.amount) as total_amount,
        AVG(et.amount) as average_amount,
        MIN(et.amount) as min_amount,
        MAX(et.amount) as max_amount,
        -- Approval statistics
        COUNT(CASE WHEN et.approval_required = true THEN 1 END) as approval_required_count,
        COUNT(CASE WHEN ad.approval_status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN ad.approval_status = 'pending' THEN 1 END) as pending_approval_count
    FROM expense_transactions et
    JOIN properties p ON et.property_id = p.property_id
    JOIN firms f ON p.firm_id = f.firm_id
    LEFT JOIN expense_categories ec ON et.expense_category_id = ec.category_id
    LEFT JOIN approval_decisions ad ON et.expense_transaction_id = ad.expense_id
    WHERE f.is_active = true
    GROUP BY p.firm_id, f.firm_name, ec.category_name, p.property_name;

    RAISE NOTICE 'Accountant portal views created successfully';

    -- =====================================================
    -- OWNER PORTAL VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating owner portal views...';

    -- Owner portfolio dashboard
    CREATE OR REPLACE VIEW owner_portfolio_dashboard AS
    SELECT 
        o.owner_id,
        o.full_name,
        o.firm_id,
        f.firm_name,
        -- Property ownership
        COUNT(DISTINCT pop.property_id) as owned_properties,
        SUM(pop.ownership_percentage) as total_ownership_percentage,
        AVG(pop.ownership_percentage) as average_ownership_percentage,
        -- Financial performance
        COALESCE(SUM(rt.actual_rent * (pop.ownership_percentage / 100)), 0) as total_rental_income,
        COALESCE(SUM(et.amount * (pop.ownership_percentage / 100)), 0) as total_expenses,
        COALESCE(SUM(rt.actual_rent * (pop.ownership_percentage / 100)) - SUM(et.amount * (pop.ownership_percentage / 100)), 0) as net_income,
        -- Approval workflow
        COUNT(DISTINCT CASE WHEN ad.approval_status = 'pending' AND ad.required_owner_id = o.owner_id THEN ad.decision_id END) as pending_approvals
    FROM owners o
    JOIN firms f ON o.firm_id = f.firm_id
    LEFT JOIN property_ownership_periods pop ON o.owner_id = pop.owner_id AND pop.end_date IS NULL
    LEFT JOIN properties p ON pop.property_id = p.property_id
    LEFT JOIN rental_transactions rt ON p.property_id = rt.property_id
    LEFT JOIN expense_transactions et ON p.property_id = et.property_id
    LEFT JOIN approval_decisions ad ON p.property_id = ad.property_id
    WHERE o.is_active = true
    GROUP BY o.owner_id, o.full_name, o.firm_id, f.firm_name;

    -- Property performance view for owners
    CREATE OR REPLACE VIEW owner_property_performance AS
    SELECT 
        pop.owner_id,
        o.full_name as owner_name,
        p.property_id,
        p.property_name,
        pop.ownership_percentage,
        p.total_units,
        -- Financial metrics (adjusted for ownership percentage)
        COALESCE(SUM(rt.actual_rent) * (pop.ownership_percentage / 100), 0) as rental_income,
        COALESCE(SUM(et.amount) * (pop.ownership_percentage / 100), 0) as expenses,
        COALESCE((SUM(rt.actual_rent) - SUM(et.amount)) * (pop.ownership_percentage / 100), 0) as net_income,
        -- Occupancy
        COUNT(DISTINCT rc.contract_id) as active_contracts,
        ROUND((COUNT(DISTINCT rc.unit_id)::decimal / NULLIF(p.total_units, 0)) * 100, 2) as occupancy_rate,
        -- Maintenance
        COUNT(DISTINCT mo.maintenance_order_id) as maintenance_orders,
        COALESCE(AVG(mr.overall_rating), 0) as average_maintenance_rating
    FROM property_ownership_periods pop
    JOIN owners o ON pop.owner_id = o.owner_id
    JOIN properties p ON pop.property_id = p.property_id
    LEFT JOIN rental_transactions rt ON p.property_id = rt.property_id
    LEFT JOIN expense_transactions et ON p.property_id = et.property_id
    LEFT JOIN rental_contracts rc ON p.property_id = rc.property_id AND rc.contract_status = 'active'
    LEFT JOIN maintenance_orders mo ON p.property_id = mo.property_id
    LEFT JOIN maintenance_ratings mr ON mo.maintenance_order_id = mr.maintenance_order_id
    WHERE pop.end_date IS NULL AND o.is_active = true
    GROUP BY pop.owner_id, o.full_name, p.property_id, p.property_name, pop.ownership_percentage, p.total_units;

    RAISE NOTICE 'Owner portal views created successfully';

    -- =====================================================
    -- ENHANCED TENANT PORTAL VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating enhanced tenant portal views...';

    -- Tenant contract overview
    CREATE OR REPLACE VIEW tenant_contract_overview AS
    SELECT 
        t.tenant_id,
        t.full_name as tenant_name,
        rc.contract_id,
        p.property_name,
        u.unit_number,
        rc.monthly_rent,
        rc.deposit_amount as security_deposit,
        rc.start_date as contract_start_date,
        rc.end_date as contract_end_date,
        rc.contract_status,
        -- Payment status
        COUNT(CASE WHEN i.invoice_status = 'sent' THEN 1 END) as outstanding_invoices,
        COALESCE(SUM(CASE WHEN i.invoice_status = 'sent' THEN i.total_amount ELSE 0 END), 0) as outstanding_amount,
        -- Communication status
        COUNT(CASE WHEN tc.status = 'open' THEN 1 END) as open_communications,
        -- Maintenance status
        COUNT(CASE WHEN mo.status IN ('submitted', 'acknowledged', 'in_progress') THEN 1 END) as active_maintenance_requests
    FROM tenants t
    LEFT JOIN rental_contracts rc ON t.tenant_id = rc.tenant_id
    LEFT JOIN properties p ON rc.property_id = p.property_id
    LEFT JOIN units u ON rc.unit_id = u.unit_id
    LEFT JOIN invoices i ON t.tenant_id = i.entity_id AND i.entity_type = 'tenant'
    LEFT JOIN tenant_communications tc ON t.tenant_id = tc.tenant_id
    LEFT JOIN maintenance_orders mo ON t.tenant_id = mo.tenant_id
    WHERE t.is_active = true
    GROUP BY t.tenant_id, t.full_name, rc.contract_id, p.property_name, u.unit_number, 
             rc.monthly_rent, rc.deposit_amount, rc.start_date, rc.end_date, rc.contract_status;

    RAISE NOTICE 'Enhanced tenant portal views created successfully';

    -- =====================================================
    -- SYSTEM ANALYTICS VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating system analytics views...';

    -- Multi-tenant system metrics
    CREATE OR REPLACE VIEW system_analytics_overview AS
    SELECT 
        CURRENT_DATE as report_date,
        -- Firm metrics
        (SELECT COUNT(*) FROM firms WHERE is_active = true) as active_firms,
        (SELECT AVG(property_count) FROM (SELECT COUNT(property_id) as property_count FROM properties GROUP BY firm_id) avg_calc) as avg_properties_per_firm,
        -- User metrics
        (SELECT COUNT(DISTINCT user_id) FROM user_firm_assignments WHERE is_active = true) as total_active_users,
        (SELECT COUNT(*) FROM user_firm_assignments WHERE is_active = true) as total_user_assignments,
        -- Financial metrics
        (SELECT COALESCE(SUM(actual_rent), 0) FROM rental_transactions WHERE transaction_date >= date_trunc('month', CURRENT_DATE)) as monthly_rental_income,
        (SELECT COALESCE(SUM(amount), 0) FROM expense_transactions WHERE expense_date >= date_trunc('month', CURRENT_DATE)) as monthly_expenses,
        -- Workflow metrics
        (SELECT COUNT(*) FROM approval_decisions WHERE approval_status = 'pending') as pending_approvals,
        (SELECT COUNT(*) FROM approval_decisions WHERE approval_deadline < CURRENT_TIMESTAMP AND approval_status = 'pending') as overdue_approvals,
        -- System health
        (SELECT COUNT(*) FROM maintenance_orders WHERE status IN ('submitted', 'acknowledged', 'in_progress')) as active_maintenance_orders,
        (SELECT COALESCE(AVG(overall_rating), 0) FROM maintenance_ratings WHERE rated_at >= CURRENT_DATE - INTERVAL '30 days') as avg_maintenance_rating_30d;

    RAISE NOTICE 'System analytics views created successfully';

    -- Record migration success
    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '005',
        'Create Portal Views - Admin, accountant, owner, and tenant portal-specific dashboard and analytics views',
        'To rollback: DROP VIEW system_analytics_overview, tenant_contract_overview, owner_property_performance, owner_portfolio_dashboard, accountant_expense_analysis, accountant_financial_dashboard, admin_firm_management, admin_system_overview;'
    );

    RAISE NOTICE '✅ Migration 005 completed successfully!';
    RAISE NOTICE 'Portal-specific views created for all user types';

END $$;