-- =====================================================
-- 004 - Add Tenant Portal Enhancements - STREAMLINED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Add tenant-specific functionality for self-service portal
-- Dependencies: 001_add_firms_support.sql, 002_enhance_ownership_model.sql, 003_improve_approval_workflow.sql
-- Version: 2.0.004
-- =====================================================

SET search_path = rems, public;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '004') THEN
        RAISE NOTICE 'Migration 004 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 004: Add Tenant Portal Enhancements';

    -- Create sequences
    CREATE SEQUENCE IF NOT EXISTS tenant_payment_preferences_id_seq;
    CREATE SEQUENCE IF NOT EXISTS tenant_communications_id_seq;
    CREATE SEQUENCE IF NOT EXISTS maintenance_ratings_id_seq;

    -- =====================================================
    -- TENANT PAYMENT PREFERENCES
    -- =====================================================
    
    RAISE NOTICE 'Creating tenant payment preferences table...';
    
    CREATE TABLE "rems"."tenant_payment_preferences" (
        "preference_id" int4 NOT NULL DEFAULT nextval('tenant_payment_preferences_id_seq'::regclass),
        "tenant_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "preferred_payment_method" varchar(20) DEFAULT 'bank_transfer',
        "auto_pay_enabled" boolean DEFAULT false,
        "payment_reminder_days" int4 DEFAULT 7,
        "email_notifications" boolean DEFAULT true,
        "sms_notifications" boolean DEFAULT false,
        "payment_day_preference" int4 DEFAULT 1,
        "currency_preference" varchar(3) DEFAULT 'KWD',
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("preference_id")
    );

    -- Add constraints
    ALTER TABLE tenant_payment_preferences 
    ADD CONSTRAINT fk_tenant_payment_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;

    ALTER TABLE tenant_payment_preferences 
    ADD CONSTRAINT fk_tenant_payment_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE tenant_payment_preferences 
    ADD CONSTRAINT chk_payment_method 
    CHECK (preferred_payment_method IN ('bank_transfer', 'credit_card', 'debit_card', 'cash', 'knet'));

    ALTER TABLE tenant_payment_preferences 
    ADD CONSTRAINT chk_payment_day 
    CHECK (payment_day_preference BETWEEN 1 AND 28);

    ALTER TABLE tenant_payment_preferences 
    ADD CONSTRAINT chk_reminder_days 
    CHECK (payment_reminder_days BETWEEN 1 AND 30);

    -- Create indexes
    CREATE INDEX idx_tenant_payment_tenant ON tenant_payment_preferences (tenant_id);
    CREATE INDEX idx_tenant_payment_firm ON tenant_payment_preferences (firm_id);
    CREATE INDEX idx_tenant_payment_autopay ON tenant_payment_preferences (auto_pay_enabled);

    RAISE NOTICE 'Tenant payment preferences table created successfully';

    -- =====================================================
    -- TENANT COMMUNICATIONS
    -- =====================================================
    
    RAISE NOTICE 'Creating tenant communications table...';
    
    CREATE TABLE "rems"."tenant_communications" (
        "communication_id" int4 NOT NULL DEFAULT nextval('tenant_communications_id_seq'::regclass),
        "tenant_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "property_id" int4,
        "unit_id" int4,
        "subject" varchar(200) NOT NULL,
        "message_content" text NOT NULL,
        "communication_type" varchar(30) DEFAULT 'general',
        "priority" varchar(10) DEFAULT 'normal',
        "status" varchar(20) DEFAULT 'open',
        "created_by" int4 NOT NULL,
        "assigned_to" int4,
        "response_required" boolean DEFAULT false,
        "response_deadline" timestamp,
        "resolved_at" timestamp,
        "resolved_by" int4,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("communication_id")
    );

    -- Add constraints
    ALTER TABLE tenant_communications 
    ADD CONSTRAINT fk_tenant_comm_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT fk_tenant_comm_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT fk_tenant_comm_property_id 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT fk_tenant_comm_unit_id 
    FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE;

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT chk_comm_type 
    CHECK (communication_type IN ('general', 'maintenance', 'payment', 'lease', 'complaint', 'inquiry', 'emergency'));

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT chk_comm_priority 
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

    ALTER TABLE tenant_communications 
    ADD CONSTRAINT chk_comm_status 
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));

    -- Create indexes
    CREATE INDEX idx_tenant_comm_tenant ON tenant_communications (tenant_id);
    CREATE INDEX idx_tenant_comm_firm ON tenant_communications (firm_id);
    CREATE INDEX idx_tenant_comm_status ON tenant_communications (status);
    CREATE INDEX idx_tenant_comm_type ON tenant_communications (communication_type);
    CREATE INDEX idx_tenant_comm_priority ON tenant_communications (priority);

    RAISE NOTICE 'Tenant communications table created successfully';

    -- =====================================================
    -- MAINTENANCE RATINGS
    -- =====================================================
    
    RAISE NOTICE 'Creating maintenance ratings table...';
    
    CREATE TABLE "rems"."maintenance_ratings" (
        "rating_id" int4 NOT NULL DEFAULT nextval('maintenance_ratings_id_seq'::regclass),
        "maintenance_order_id" int4 NOT NULL,
        "tenant_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "overall_rating" int4 NOT NULL,
        "response_time_rating" int4,
        "quality_rating" int4,
        "professionalism_rating" int4,
        "communication_rating" int4,
        "would_recommend" boolean,
        "feedback_comments" text,
        "completion_confirmed" boolean DEFAULT false,
        "rated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("rating_id")
    );

    -- Add constraints
    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT fk_maintenance_rating_order_id 
    FOREIGN KEY (maintenance_order_id) REFERENCES maintenance_orders(maintenance_order_id) ON DELETE CASCADE;

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT fk_maintenance_rating_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT fk_maintenance_rating_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT chk_overall_rating 
    CHECK (overall_rating BETWEEN 1 AND 5);

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT chk_response_time_rating 
    CHECK (response_time_rating IS NULL OR response_time_rating BETWEEN 1 AND 5);

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT chk_quality_rating 
    CHECK (quality_rating IS NULL OR quality_rating BETWEEN 1 AND 5);

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT chk_professionalism_rating 
    CHECK (professionalism_rating IS NULL OR professionalism_rating BETWEEN 1 AND 5);

    ALTER TABLE maintenance_ratings 
    ADD CONSTRAINT chk_communication_rating 
    CHECK (communication_rating IS NULL OR communication_rating BETWEEN 1 AND 5);

    -- Create indexes
    CREATE INDEX idx_maintenance_rating_order ON maintenance_ratings (maintenance_order_id);
    CREATE INDEX idx_maintenance_rating_tenant ON maintenance_ratings (tenant_id);
    CREATE INDEX idx_maintenance_rating_firm ON maintenance_ratings (firm_id);
    CREATE INDEX idx_maintenance_rating_overall ON maintenance_ratings (overall_rating);

    RAISE NOTICE 'Maintenance ratings table created successfully';

    -- =====================================================
    -- ENHANCE EXISTING TABLES
    -- =====================================================
    
    RAISE NOTICE 'Enhancing existing tables for tenant portal...';

    -- Add tenant portal specific columns to tenants table
    ALTER TABLE tenants 
    ADD COLUMN IF NOT EXISTS portal_access_enabled boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS last_portal_login timestamp,
    ADD COLUMN IF NOT EXISTS preferred_language varchar(2) DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS mobile_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

    -- Add tenant engagement columns to rental_contracts
    ALTER TABLE rental_contracts 
    ADD COLUMN IF NOT EXISTS digital_signature_date timestamp,
    ADD COLUMN IF NOT EXISTS tenant_document_access boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS auto_renewal_preference boolean DEFAULT false;
    
    -- Add property_id column to rental_contracts for easier querying
    ALTER TABLE rental_contracts 
    ADD COLUMN IF NOT EXISTS property_id int4;
    
    -- Add foreign key constraint for property_id
    ALTER TABLE rental_contracts 
    ADD CONSTRAINT fk_rental_contracts_property_id 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;
    
    -- Update property_id from units table for existing records
    UPDATE rental_contracts 
    SET property_id = u.property_id
    FROM units u 
    WHERE rental_contracts.unit_id = u.unit_id 
    AND rental_contracts.property_id IS NULL;
    
    -- Add missing fields to rental_transactions for compatibility
    ALTER TABLE rental_transactions 
    ADD COLUMN IF NOT EXISTS tenant_id int4,
    ADD COLUMN IF NOT EXISTS property_id int4,
    ADD COLUMN IF NOT EXISTS firm_id int4;
    
    -- Add foreign keys for new columns
    ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;
    
    ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_property_id_rt 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;
    
    ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;
    
    -- Update new columns from existing relationships
    UPDATE rental_transactions rt
    SET tenant_id = rc.tenant_id,
        property_id = COALESCE(rc.property_id, u.property_id),
        firm_id = p.firm_id
    FROM rental_contracts rc
    LEFT JOIN units u ON rc.unit_id = u.unit_id
    LEFT JOIN properties p ON COALESCE(rc.property_id, u.property_id) = p.property_id
    WHERE rt.contract_id = rc.contract_id
    AND (rt.tenant_id IS NULL OR rt.property_id IS NULL OR rt.firm_id IS NULL);

    RAISE NOTICE 'Existing tables enhanced successfully';

    -- =====================================================
    -- CREATE TENANT PORTAL VIEWS
    -- =====================================================
    
    RAISE NOTICE 'Creating tenant portal views...';

    -- Tenant dashboard overview
    CREATE OR REPLACE VIEW tenant_dashboard_overview AS
    SELECT 
        t.tenant_id,
        t.full_name,
        t.firm_id,
        f.firm_name,
        -- Active contracts
        COUNT(DISTINCT rc.contract_id) as active_contracts,
        -- Current month rent
        COALESCE(SUM(CASE WHEN rt.transaction_date >= date_trunc('month', CURRENT_DATE) 
                         THEN rt.actual_rent ELSE 0 END), 0) as current_month_rent,
        -- Overdue payments
        COUNT(CASE WHEN i.due_date < CURRENT_DATE AND i.invoice_status = 'sent' THEN 1 END) as overdue_payments,
        -- Open maintenance requests
        COUNT(CASE WHEN mo.status IN ('submitted', 'acknowledged', 'in_progress') THEN 1 END) as open_maintenance_requests,
        -- Unread communications
        COUNT(CASE WHEN tc.status = 'open' THEN 1 END) as unread_communications
    FROM tenants t
    JOIN firms f ON t.firm_id = f.firm_id
    LEFT JOIN rental_contracts rc ON t.tenant_id = rc.tenant_id AND rc.contract_status = 'active'
    LEFT JOIN rental_transactions rt ON t.tenant_id = rt.tenant_id
    LEFT JOIN invoices i ON t.tenant_id = i.entity_id AND i.entity_type = 'tenant'
    LEFT JOIN maintenance_orders mo ON t.tenant_id = mo.tenant_id
    LEFT JOIN tenant_communications tc ON t.tenant_id = tc.tenant_id
    WHERE t.is_active = true
    GROUP BY t.tenant_id, t.full_name, t.firm_id, f.firm_name;

    -- Tenant payment history view
    CREATE OR REPLACE VIEW tenant_payment_history AS
    SELECT 
        t.tenant_id,
        t.full_name as tenant_name,
        rt.rental_transaction_id as transaction_id,
        rt.actual_rent as amount,
        rt.transaction_date,
        'rent' as transaction_type,
        CASE WHEN rt.notes IS NOT NULL THEN rt.notes ELSE 'Monthly rent payment' END as description,
        rt.payment_method,
        rc.property_id,
        p.property_name,
        rc.unit_id,
        u.unit_number
    FROM tenants t
    JOIN rental_transactions rt ON t.tenant_id = rt.tenant_id
    LEFT JOIN rental_contracts rc ON rt.contract_id = rc.contract_id
    LEFT JOIN properties p ON rc.property_id = p.property_id
    LEFT JOIN units u ON rc.unit_id = u.unit_id
    WHERE t.is_active = true
    ORDER BY rt.transaction_date DESC;

    RAISE NOTICE 'Tenant portal views created successfully';

    -- Record migration success
    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '004',
        'Add Tenant Portal Enhancements - Payment preferences, communications, maintenance ratings, and portal views',
        'To rollback: DROP TABLE maintenance_ratings, tenant_communications, tenant_payment_preferences; DROP VIEW tenant_payment_history, tenant_dashboard_overview; ALTER TABLE rental_contracts DROP COLUMN auto_renewal_preference, tenant_document_access, digital_signature_date; ALTER TABLE tenants DROP COLUMN email_verified, mobile_verified, preferred_language, last_portal_login, portal_access_enabled;'
    );

    RAISE NOTICE '✅ Migration 004 completed successfully!';
    RAISE NOTICE 'Tenant portal enhancements implemented';

END $$;