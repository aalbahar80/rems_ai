-- =====================================================
-- 001 - Add Firms Support (Multi-Tenant Foundation) - FIXED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Add multi-tenant firm support for admin portal management
-- Dependencies: REMS_DDL.sql (base schema must exist)
-- Version: 2.0.001
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

DO $$
BEGIN
    -- Create migrations table if it doesn't exist
    CREATE TABLE IF NOT EXISTS "rems"."schema_migrations" (
        "version" varchar(20) PRIMARY KEY,
        "description" text NOT NULL,
        "applied_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "applied_by" varchar(50) DEFAULT current_user,
        "rollback_instructions" text
    );
    
    -- Check if this migration was already applied
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '001') THEN
        RAISE NOTICE 'Migration 001 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 001: Add Firms Support';

    -- =====================================================
    -- CREATE SEQUENCES
    -- =====================================================
    
    RAISE NOTICE 'Creating sequences...';
    
    -- Create sequences for new tables
    CREATE SEQUENCE IF NOT EXISTS firms_id_seq;
    CREATE SEQUENCE IF NOT EXISTS user_firm_assignments_id_seq;

    -- =====================================================
    -- CREATE FIRMS TABLE (Core Multi-Tenant Entity)
    -- =====================================================

    RAISE NOTICE 'Creating firms table...';

    CREATE TABLE "rems"."firms" (
        "firm_id" int4 NOT NULL DEFAULT nextval('firms_id_seq'::regclass),
        "firm_name" varchar(100) NOT NULL,
        "legal_business_name" varchar(150),
        "registration_number" varchar(50),
        "primary_phone" varchar(20),
        "secondary_phone" varchar(20),
        "email" varchar(100),
        "business_address" text,
        "number_of_employees" int4,
        "logo_url" varchar(255),
        "business_description" text,
        "website_url" varchar(255),
        "industry_type" varchar(50) DEFAULT 'real_estate',
        "tax_number" varchar(50),
        "is_active" boolean DEFAULT true,
        "created_by" int4,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("firm_id")
    );

    -- Add constraints for firms table
    ALTER TABLE firms ADD CONSTRAINT unique_firm_name 
        UNIQUE (firm_name);

    ALTER TABLE firms ADD CONSTRAINT unique_firm_email 
        UNIQUE (email);

    ALTER TABLE firms ADD CONSTRAINT chk_firm_employees 
        CHECK (number_of_employees IS NULL OR number_of_employees > 0);

    ALTER TABLE firms ADD CONSTRAINT chk_industry_type 
        CHECK (industry_type IN ('real_estate', 'property_management', 'investment', 'construction', 'other'));

    -- Create indexes for firms table
    CREATE INDEX idx_firms_name ON rems.firms USING btree (firm_name);
    CREATE INDEX idx_firms_active ON rems.firms USING btree (is_active);
    CREATE INDEX idx_firms_created_by ON rems.firms USING btree (created_by);

    RAISE NOTICE 'Firms table created successfully';

    -- =====================================================
    -- CREATE USER-FIRM ASSIGNMENTS TABLE (Many-to-Many)
    -- =====================================================

    RAISE NOTICE 'Creating user_firm_assignments table...';

    CREATE TABLE "rems"."user_firm_assignments" (
        "assignment_id" int4 NOT NULL DEFAULT nextval('user_firm_assignments_id_seq'::regclass),
        "user_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "role_in_firm" varchar(50) NOT NULL,
        "is_primary_firm" boolean DEFAULT false,
        "access_level" varchar(20) DEFAULT 'standard',
        "is_active" boolean DEFAULT true,
        "assigned_by" int4,
        "assigned_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "deactivated_at" timestamp,
        "deactivated_by" int4,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("assignment_id")
    );

    -- Add constraints for user_firm_assignments
    ALTER TABLE user_firm_assignments 
    ADD CONSTRAINT fk_user_firm_user_id 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

    ALTER TABLE user_firm_assignments 
    ADD CONSTRAINT fk_user_firm_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE user_firm_assignments 
    ADD CONSTRAINT chk_role_in_firm 
    CHECK (role_in_firm IN ('admin', 'senior_admin', 'accountant', 'senior_accountant', 'manager', 'staff', 'readonly'));

    ALTER TABLE user_firm_assignments 
    ADD CONSTRAINT chk_access_level 
    CHECK (access_level IN ('standard', 'elevated', 'full'));

    -- Unique constraint to prevent duplicate user-firm assignments
    ALTER TABLE user_firm_assignments 
    ADD CONSTRAINT unique_user_firm_assignment 
    UNIQUE (user_id, firm_id);

    -- Create indexes
    CREATE INDEX idx_user_firm_user ON user_firm_assignments (user_id);
    CREATE INDEX idx_user_firm_firm ON user_firm_assignments (firm_id);
    CREATE INDEX idx_user_firm_active ON user_firm_assignments (is_active);
    CREATE INDEX idx_user_firm_role ON user_firm_assignments (role_in_firm);

    RAISE NOTICE 'User firm assignments table created successfully';

    -- =====================================================
    -- ADD FIRM_ID TO EXISTING TABLES
    -- =====================================================

    RAISE NOTICE 'Adding firm_id columns to existing tables...';

    -- Add firm_id to properties table
    ALTER TABLE properties 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add firm_id to owners table
    ALTER TABLE owners 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add firm_id to tenants table
    ALTER TABLE tenants 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add firm_id to invoices table
    ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add firm_id to maintenance_orders table
    ALTER TABLE maintenance_orders 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add firm_id to vendors table
    ALTER TABLE vendors 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    RAISE NOTICE 'Firm_id columns added to existing tables';

    -- =====================================================
    -- ADD FOREIGN KEY CONSTRAINTS
    -- =====================================================

    RAISE NOTICE 'Adding foreign key constraints for firm relationships...';

    -- Add foreign key constraints
    ALTER TABLE properties 
    ADD CONSTRAINT fk_properties_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE owners 
    ADD CONSTRAINT fk_owners_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE tenants 
    ADD CONSTRAINT fk_tenants_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_orders_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE vendors 
    ADD CONSTRAINT fk_vendors_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    -- Create indexes for foreign keys
    CREATE INDEX idx_properties_firm ON properties (firm_id);
    CREATE INDEX idx_owners_firm ON owners (firm_id);
    CREATE INDEX idx_tenants_firm ON tenants (firm_id);
    CREATE INDEX idx_invoices_firm ON invoices (firm_id);
    CREATE INDEX idx_maintenance_orders_firm ON maintenance_orders (firm_id);
    CREATE INDEX idx_vendors_firm ON vendors (firm_id);

    RAISE NOTICE 'Foreign key constraints added successfully';

    -- =====================================================
    -- CREATE HELPER FUNCTIONS
    -- =====================================================

    RAISE NOTICE 'Creating helper functions for multi-firm operations...';

    -- Function to get user's firms
    CREATE OR REPLACE FUNCTION get_user_firms(p_user_id int4)
    RETURNS TABLE (
        firm_id int4,
        firm_name varchar(100),
        role_in_firm varchar(50),
        is_primary_firm boolean,
        access_level varchar(20)
    ) AS $func$
    BEGIN
        RETURN QUERY
        SELECT 
            f.firm_id,
            f.firm_name,
            ufa.role_in_firm,
            ufa.is_primary_firm,
            ufa.access_level
        FROM user_firm_assignments ufa
        JOIN firms f ON ufa.firm_id = f.firm_id
        WHERE ufa.user_id = p_user_id 
        AND ufa.is_active = true
        AND f.is_active = true
        ORDER BY ufa.is_primary_firm DESC, f.firm_name;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to check if user has access to firm
    CREATE OR REPLACE FUNCTION user_has_firm_access(p_user_id int4, p_firm_id int4)
    RETURNS boolean AS $func$
    BEGIN
        RETURN EXISTS (
            SELECT 1 
            FROM user_firm_assignments ufa
            JOIN firms f ON ufa.firm_id = f.firm_id
            WHERE ufa.user_id = p_user_id 
            AND ufa.firm_id = p_firm_id
            AND ufa.is_active = true
            AND f.is_active = true
        );
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE 'Helper functions created successfully';

    -- =====================================================
    -- CREATE VIEWS
    -- =====================================================

    RAISE NOTICE 'Creating views for firm management...';

    -- View for firm user overview
    CREATE OR REPLACE VIEW firm_users_overview AS
    SELECT 
        f.firm_id,
        f.firm_name,
        u.user_id,
        u.username,
        u.email,
        ufa.role_in_firm,
        ufa.is_primary_firm,
        ufa.access_level,
        ufa.assigned_at,
        ufa.is_active as assignment_active
    FROM firms f
    JOIN user_firm_assignments ufa ON f.firm_id = ufa.firm_id
    JOIN users u ON ufa.user_id = u.user_id
    WHERE f.is_active = true;

    -- View for firm statistics
    CREATE OR REPLACE VIEW firm_statistics AS
    SELECT 
        f.firm_id,
        f.firm_name,
        COUNT(DISTINCT p.property_id) as total_properties,
        COUNT(DISTINCT o.owner_id) as total_owners,
        COUNT(DISTINCT t.tenant_id) as total_tenants,
        COUNT(DISTINCT ufa.user_id) as total_users
    FROM firms f
    LEFT JOIN properties p ON f.firm_id = p.firm_id
    LEFT JOIN owners o ON f.firm_id = o.firm_id
    LEFT JOIN tenants t ON f.firm_id = t.firm_id
    LEFT JOIN user_firm_assignments ufa ON f.firm_id = ufa.firm_id AND ufa.is_active = true
    WHERE f.is_active = true
    GROUP BY f.firm_id, f.firm_name;

    RAISE NOTICE 'Views created successfully';

    -- =====================================================
    -- INSERT SAMPLE DATA
    -- =====================================================

    RAISE NOTICE 'Inserting sample firm data for testing...';

    -- Insert sample firms
    INSERT INTO firms (firm_name, legal_business_name, email, industry_type, business_description) VALUES
    ('Kuwait Properties LLC', 'Kuwait Properties Limited Liability Company', 'info@kuwaitproperties.com', 'real_estate', 'Leading real estate management company in Kuwait'),
    ('Gulf Real Estate', 'Gulf Real Estate Management Co.', 'contact@gulfre.com', 'property_management', 'Professional property management services'),
    ('Al Salam Holdings', 'Al Salam Real Estate Holdings', 'admin@alsalam.kw', 'investment', 'Real estate investment and development');

    RAISE NOTICE 'Sample data inserted successfully';

    -- =====================================================
    -- RECORD MIGRATION SUCCESS
    -- =====================================================

    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '001',
        'Add Firms Support - Multi-tenant foundation with firms table, user-firm assignments, and firm relationships for existing entities',
        'To rollback: DROP TABLE user_firm_assignments, firms; ALTER TABLE properties DROP COLUMN firm_id; ALTER TABLE owners DROP COLUMN firm_id; ALTER TABLE tenants DROP COLUMN firm_id; ALTER TABLE invoices DROP COLUMN firm_id; ALTER TABLE maintenance_orders DROP COLUMN firm_id; ALTER TABLE vendors DROP COLUMN firm_id; DROP FUNCTION get_user_firms, user_has_firm_access; DROP VIEW firm_users_overview, firm_statistics;'
    );

    RAISE NOTICE '✅ Migration 001 completed successfully!';
    RAISE NOTICE 'Multi-tenant firm support has been added to REMS';
    RAISE NOTICE 'Next: Run migration 002_enhance_ownership_model.sql';

END $$;