-- =====================================================
-- 006 - Add Business Functions and Automation - STREAMLINED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Add advanced business intelligence, automation, and notification systems
-- Dependencies: 001-005 migrations
-- Version: 2.0.006
-- =====================================================

SET search_path = rems, public;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '006') THEN
        RAISE NOTICE 'Migration 006 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 006: Add Business Functions and Automation';

    -- Create sequences
    CREATE SEQUENCE IF NOT EXISTS business_rules_id_seq;
    CREATE SEQUENCE IF NOT EXISTS automated_tasks_id_seq;
    CREATE SEQUENCE IF NOT EXISTS system_notifications_id_seq;

    -- =====================================================
    -- BUSINESS RULES ENGINE
    -- =====================================================
    
    RAISE NOTICE 'Creating business rules table...';
    
    CREATE TABLE "rems"."business_rules" (
        "rule_id" int4 NOT NULL DEFAULT nextval('business_rules_id_seq'::regclass),
        "firm_id" int4 NOT NULL,
        "rule_name" varchar(100) NOT NULL,
        "rule_type" varchar(30) NOT NULL,
        "rule_category" varchar(30) DEFAULT 'general',
        "trigger_condition" text NOT NULL,
        "action_definition" text NOT NULL,
        "is_active" boolean DEFAULT true,
        "priority" int4 DEFAULT 1,
        "created_by" int4,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "last_executed" timestamp,
        "execution_count" int4 DEFAULT 0,
        PRIMARY KEY ("rule_id")
    );

    -- Add constraints
    ALTER TABLE business_rules 
    ADD CONSTRAINT fk_business_rules_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE business_rules 
    ADD CONSTRAINT chk_rule_type 
    CHECK (rule_type IN ('approval_threshold', 'payment_reminder', 'maintenance_escalation', 'occupancy_alert', 'financial_alert', 'custom'));

    ALTER TABLE business_rules 
    ADD CONSTRAINT chk_rule_category 
    CHECK (rule_category IN ('general', 'financial', 'maintenance', 'tenant', 'owner', 'property'));

    -- Create indexes
    CREATE INDEX idx_business_rules_firm ON business_rules (firm_id);
    CREATE INDEX idx_business_rules_type ON business_rules (rule_type);
    CREATE INDEX idx_business_rules_active ON business_rules (is_active);

    RAISE NOTICE 'Business rules table created successfully';

    -- =====================================================
    -- AUTOMATED TASKS SYSTEM
    -- =====================================================
    
    RAISE NOTICE 'Creating automated tasks table...';
    
    CREATE TABLE "rems"."automated_tasks" (
        "task_id" int4 NOT NULL DEFAULT nextval('automated_tasks_id_seq'::regclass),
        "firm_id" int4 NOT NULL,
        "task_name" varchar(100) NOT NULL,
        "task_type" varchar(30) NOT NULL,
        "schedule_type" varchar(20) DEFAULT 'manual',
        "schedule_frequency" varchar(20),
        "next_execution" timestamp,
        "last_execution" timestamp,
        "task_status" varchar(20) DEFAULT 'active',
        "parameters" text,
        "success_count" int4 DEFAULT 0,
        "error_count" int4 DEFAULT 0,
        "last_error" text,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("task_id")
    );

    -- Add constraints
    ALTER TABLE automated_tasks 
    ADD CONSTRAINT fk_automated_tasks_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE automated_tasks 
    ADD CONSTRAINT chk_task_type 
    CHECK (task_type IN ('invoice_generation', 'payment_reminder', 'rent_collection', 'maintenance_reminder', 'contract_renewal', 'report_generation'));

    ALTER TABLE automated_tasks 
    ADD CONSTRAINT chk_schedule_type 
    CHECK (schedule_type IN ('manual', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'));

    ALTER TABLE automated_tasks 
    ADD CONSTRAINT chk_task_status 
    CHECK (task_status IN ('active', 'paused', 'disabled', 'error'));

    -- Create indexes
    CREATE INDEX idx_automated_tasks_firm ON automated_tasks (firm_id);
    CREATE INDEX idx_automated_tasks_type ON automated_tasks (task_type);
    CREATE INDEX idx_automated_tasks_next_exec ON automated_tasks (next_execution);
    CREATE INDEX idx_automated_tasks_status ON automated_tasks (task_status);

    RAISE NOTICE 'Automated tasks table created successfully';

    -- =====================================================
    -- SYSTEM NOTIFICATIONS
    -- =====================================================
    
    RAISE NOTICE 'Creating system notifications table...';
    
    CREATE TABLE "rems"."system_notifications" (
        "notification_id" int4 NOT NULL DEFAULT nextval('system_notifications_id_seq'::regclass),
        "firm_id" int4 NOT NULL,
        "recipient_user_id" int4,
        "notification_type" varchar(30) NOT NULL,
        "title" varchar(200) NOT NULL,
        "message" text NOT NULL,
        "priority" varchar(10) DEFAULT 'normal',
        "category" varchar(30) DEFAULT 'general',
        "related_entity_type" varchar(30),
        "related_entity_id" int4,
        "is_read" boolean DEFAULT false,
        "read_at" timestamp,
        "action_required" boolean DEFAULT false,
        "action_url" varchar(500),
        "expires_at" timestamp,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("notification_id")
    );

    -- Add constraints
    ALTER TABLE system_notifications 
    ADD CONSTRAINT fk_system_notifications_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE system_notifications 
    ADD CONSTRAINT chk_notification_type 
    CHECK (notification_type IN ('payment_due', 'payment_overdue', 'maintenance_request', 'approval_required', 'contract_expiring', 'system_alert', 'custom'));

    ALTER TABLE system_notifications 
    ADD CONSTRAINT chk_notification_priority 
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

    ALTER TABLE system_notifications 
    ADD CONSTRAINT chk_notification_category 
    CHECK (category IN ('general', 'financial', 'maintenance', 'contract', 'system', 'approval'));

    -- Create indexes
    CREATE INDEX idx_system_notifications_firm ON system_notifications (firm_id);
    CREATE INDEX idx_system_notifications_recipient ON system_notifications (recipient_user_id);
    CREATE INDEX idx_system_notifications_type ON system_notifications (notification_type);
    CREATE INDEX idx_system_notifications_unread ON system_notifications (is_read, created_at);
    CREATE INDEX idx_system_notifications_expires ON system_notifications (expires_at);

    RAISE NOTICE 'System notifications table created successfully';

    -- =====================================================
    -- BUSINESS INTELLIGENCE FUNCTIONS
    -- =====================================================
    
    RAISE NOTICE 'Creating business intelligence functions...';

    -- Function to calculate property ROI
    CREATE OR REPLACE FUNCTION calculate_property_roi(p_property_id int4, p_period_months int4 DEFAULT 12)
    RETURNS decimal(8,4) AS $func$
    DECLARE
        v_total_income decimal(12,2) := 0;
        v_total_expenses decimal(12,2) := 0;
        v_property_value decimal(12,2);
        v_roi decimal(8,4);
    BEGIN
        -- Get rental income
        SELECT COALESCE(SUM(amount), 0) INTO v_total_income
        FROM rental_transactions 
        WHERE property_id = p_property_id
        AND expense_date >= CURRENT_DATE - (p_period_months || ' months')::INTERVAL;
        
        -- Get expenses
        SELECT COALESCE(SUM(amount), 0) INTO v_total_expenses
        FROM expense_transactions 
        WHERE property_id = p_property_id
        AND expense_date >= CURRENT_DATE - (p_period_months || ' months')::INTERVAL;
        
        -- Get property value (using purchase price or market value)
        SELECT COALESCE(purchase_price, market_value, total_units * 100000) INTO v_property_value
        FROM properties 
        WHERE property_id = p_property_id;
        
        -- Calculate ROI as percentage
        IF v_property_value > 0 THEN
            v_roi := ((v_total_income - v_total_expenses) / v_property_value) * 100;
        ELSE
            v_roi := 0;
        END IF;
        
        RETURN v_roi;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to calculate occupancy rate
    CREATE OR REPLACE FUNCTION calculate_occupancy_rate(p_property_id int4, p_firm_id int4 DEFAULT NULL)
    RETURNS decimal(5,2) AS $func$
    DECLARE
        v_total_units int4;
        v_occupied_units int4;
        v_occupancy_rate decimal(5,2);
    BEGIN
        IF p_property_id IS NOT NULL THEN
            -- Calculate for specific property
            SELECT total_units INTO v_total_units
            FROM properties WHERE property_id = p_property_id;
            
            SELECT COUNT(DISTINCT unit_id) INTO v_occupied_units
            FROM rental_contracts 
            WHERE property_id = p_property_id 
            AND contract_status = 'active';
        ELSIF p_firm_id IS NOT NULL THEN
            -- Calculate for entire firm
            SELECT SUM(total_units) INTO v_total_units
            FROM properties WHERE firm_id = p_firm_id;
            
            SELECT COUNT(DISTINCT rc.unit_id) INTO v_occupied_units
            FROM rental_contracts rc
            JOIN properties p ON rc.property_id = p.property_id
            WHERE p.firm_id = p_firm_id 
            AND rc.contract_status = 'active';
        ELSE
            RETURN 0;
        END IF;
        
        -- Calculate occupancy rate
        IF v_total_units > 0 THEN
            v_occupancy_rate := (v_occupied_units::decimal / v_total_units) * 100;
        ELSE
            v_occupancy_rate := 0;
        END IF;
        
        RETURN v_occupancy_rate;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to generate payment alerts
    CREATE OR REPLACE FUNCTION generate_payment_alerts(p_firm_id int4)
    RETURNS int4 AS $func$
    DECLARE
        v_alert_count int4 := 0;
        r RECORD;
    BEGIN
        -- Generate alerts for overdue payments
        FOR r IN 
            SELECT i.invoice_id, i.tenant_id, i.amount_due, i.due_date,
                   t.full_name as tenant_name, p.property_name
            FROM invoices i
            JOIN tenants t ON i.tenant_id = t.tenant_id
            JOIN properties p ON t.tenant_id = (
                SELECT tenant_id FROM rental_contracts 
                WHERE property_id = p.property_id AND contract_status = 'active' LIMIT 1
            )
            WHERE i.firm_id = p_firm_id
            AND i.payment_status = 'pending'
            AND i.due_date < CURRENT_DATE
            AND NOT EXISTS (
                SELECT 1 FROM system_notifications
                WHERE related_entity_type = 'invoice'
                AND related_entity_id = i.invoice_id
                AND notification_type = 'payment_overdue'
                AND created_at >= CURRENT_DATE
            )
        LOOP
            INSERT INTO system_notifications (
                firm_id, notification_type, title, message, priority,
                category, related_entity_type, related_entity_id, action_required
            ) VALUES (
                p_firm_id, 'payment_overdue',
                'Overdue Payment: ' || r.tenant_name,
                'Payment of ' || r.amount_due || ' KWD is overdue by ' || (CURRENT_DATE - r.due_date) || ' days for property ' || r.property_name,
                'high', 'financial', 'invoice', r.invoice_id, true
            );
            v_alert_count := v_alert_count + 1;
        END LOOP;
        
        RETURN v_alert_count;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE 'Business intelligence functions created successfully';

    -- =====================================================
    -- ANALYTICS AND REPORTING VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating analytics and reporting views...';

    -- Comprehensive financial analytics
    CREATE OR REPLACE VIEW financial_analytics_summary AS
    SELECT 
        f.firm_id,
        f.firm_name,
        -- Income metrics
        COALESCE(income_data.monthly_income, 0) as current_month_income,
        COALESCE(income_data.yearly_income, 0) as current_year_income,
        COALESCE(income_data.avg_monthly_income, 0) as avg_monthly_income,
        -- Expense metrics
        COALESCE(expense_data.monthly_expenses, 0) as current_month_expenses,
        COALESCE(expense_data.yearly_expenses, 0) as current_year_expenses,
        COALESCE(expense_data.avg_monthly_expenses, 0) as avg_monthly_expenses,
        -- Profitability
        COALESCE(income_data.monthly_income, 0) - COALESCE(expense_data.monthly_expenses, 0) as monthly_profit,
        COALESCE(income_data.yearly_income, 0) - COALESCE(expense_data.yearly_expenses, 0) as yearly_profit,
        -- Collection efficiency
        COALESCE(collection_data.collection_rate, 0) as collection_rate,
        COALESCE(collection_data.overdue_amount, 0) as total_overdue_amount
    FROM firms f
    LEFT JOIN (
        SELECT 
            rt.firm_id,
            SUM(CASE WHEN transaction_date >= date_trunc('month', CURRENT_DATE) THEN actual_rent ELSE 0 END) as monthly_income,
            SUM(CASE WHEN transaction_date >= date_trunc('year', CURRENT_DATE) THEN actual_rent ELSE 0 END) as yearly_income,
            AVG(monthly_total.monthly_amount) as avg_monthly_income
        FROM rental_transactions rt
        LEFT JOIN (
            SELECT rt_inner.firm_id, date_trunc('month', rt_inner.transaction_date) as month, SUM(rt_inner.actual_rent) as monthly_amount
            FROM rental_transactions rt_inner
            GROUP BY rt_inner.firm_id, date_trunc('month', rt_inner.transaction_date)
        ) monthly_total ON rt.firm_id = monthly_total.firm_id
        GROUP BY rt.firm_id
    ) income_data ON f.firm_id = income_data.firm_id
    LEFT JOIN (
        SELECT 
            p.firm_id,
            SUM(CASE WHEN expense_date >= date_trunc('month', CURRENT_DATE) THEN amount ELSE 0 END) as monthly_expenses,
            SUM(CASE WHEN expense_date >= date_trunc('year', CURRENT_DATE) THEN amount ELSE 0 END) as yearly_expenses,
            AVG(monthly_total.monthly_amount) as avg_monthly_expenses
        FROM expense_transactions et
        JOIN properties p ON et.property_id = p.property_id
        LEFT JOIN (
            SELECT prop.firm_id, date_trunc('month', ex.expense_date) as month, SUM(ex.amount) as monthly_amount
            FROM expense_transactions ex
            JOIN properties prop ON ex.property_id = prop.property_id 
            GROUP BY prop.firm_id, date_trunc('month', ex.expense_date)
        ) monthly_total ON p.firm_id = monthly_total.firm_id
        GROUP BY p.firm_id
    ) expense_data ON f.firm_id = expense_data.firm_id
    LEFT JOIN (
        SELECT 
            firm_id,
            CASE WHEN SUM(total_amount) > 0 THEN 
                (SUM(CASE WHEN invoice_status = 'paid' THEN total_amount ELSE 0 END) / SUM(total_amount)) * 100 
            ELSE 100 END as collection_rate,
            SUM(CASE WHEN invoice_status = 'sent' AND due_date < CURRENT_DATE THEN total_amount ELSE 0 END) as overdue_amount
        FROM invoices
        GROUP BY firm_id
    ) collection_data ON f.firm_id = collection_data.firm_id
    WHERE f.is_active = true;

    -- Property performance analytics
    CREATE OR REPLACE VIEW property_performance_analytics AS
    SELECT 
        p.property_id,
        p.property_name,
        p.firm_id,
        f.firm_name,
        p.total_units,
        -- Occupancy metrics
        calculate_occupancy_rate(p.property_id, NULL) as occupancy_rate,
        COUNT(DISTINCT rc.contract_id) as active_contracts,
        -- Financial performance
        COALESCE(SUM(rt.actual_rent), 0) as total_rental_income,
        COALESCE(SUM(et.amount), 0) as total_expenses,
        COALESCE(SUM(rt.actual_rent) - SUM(et.amount), 0) as net_income,
        calculate_property_roi(p.property_id, 12) as annual_roi,
        -- Maintenance metrics
        COUNT(DISTINCT mo.maintenance_order_id) as maintenance_orders_count,
        COALESCE(AVG(mr.overall_rating), 0) as avg_maintenance_rating,
        -- Tenant satisfaction
        COUNT(DISTINCT tc.communication_id) as communication_count,
        COUNT(CASE WHEN tc.communication_type = 'complaint' THEN 1 END) as complaint_count
    FROM properties p
    JOIN firms f ON p.firm_id = f.firm_id
    LEFT JOIN rental_contracts rc ON p.property_id = rc.property_id AND rc.contract_status = 'active'
    LEFT JOIN rental_transactions rt ON p.property_id = rt.property_id
    LEFT JOIN expense_transactions et ON p.property_id = et.property_id
    LEFT JOIN maintenance_orders mo ON p.property_id = mo.property_id
    LEFT JOIN maintenance_ratings mr ON mo.maintenance_order_id = mr.maintenance_order_id
    LEFT JOIN tenant_communications tc ON p.property_id = tc.property_id
    WHERE f.is_active = true
    GROUP BY p.property_id, p.property_name, p.firm_id, f.firm_name, p.total_units;

    RAISE NOTICE 'Analytics and reporting views created successfully';

    -- =====================================================
    -- INSERT INITIAL BUSINESS RULES
    -- =====================================================
    
    RAISE NOTICE 'Inserting default business rules...';

    -- Insert default business rules for each firm
    INSERT INTO business_rules (firm_id, rule_name, rule_type, rule_category, trigger_condition, action_definition)
    SELECT 
        f.firm_id,
        'High Value Expense Approval',
        'approval_threshold',
        'financial',
        'expense_amount > 1000',
        'require_owner_approval'
    FROM firms f WHERE f.is_active = true;

    INSERT INTO business_rules (firm_id, rule_name, rule_type, rule_category, trigger_condition, action_definition)
    SELECT 
        f.firm_id,
        'Payment Overdue Alert',
        'payment_reminder',
        'financial',
        'payment_overdue_days > 7',
        'send_notification_tenant_and_admin'
    FROM firms f WHERE f.is_active = true;

    RAISE NOTICE 'Default business rules inserted successfully';

    -- Record migration success
    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '006',
        'Add Business Functions and Automation - Business rules engine, automated tasks, notifications, ROI calculations, and analytics views',
        'To rollback: DROP VIEW property_performance_analytics, financial_analytics_summary; DROP FUNCTION generate_payment_alerts, calculate_occupancy_rate, calculate_property_roi; DROP TABLE system_notifications, automated_tasks, business_rules;'
    );

    RAISE NOTICE '✅ Migration 006 completed successfully!';
    RAISE NOTICE 'Business functions and automation systems implemented';

END $$;