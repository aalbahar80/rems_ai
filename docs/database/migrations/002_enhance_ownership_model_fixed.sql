-- =====================================================
-- 002 - Enhance Ownership Model (Firm-Default Ownership) - FIXED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Support firm-default ownership and flexible ownership assignment
-- Dependencies: 001_add_firms_support.sql (firms table must exist)
-- Version: 2.0.002
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '002') THEN
        RAISE NOTICE 'Migration 002 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 002: Enhance Ownership Model';

    -- =====================================================
    -- MODIFY PROPERTY OWNERSHIP PERIODS TABLE
    -- =====================================================

    RAISE NOTICE 'Enhancing property ownership periods table...';

    -- Add firm_id to track ownership within firm context
    ALTER TABLE property_ownership_periods 
    ADD COLUMN IF NOT EXISTS firm_id int4;

    -- Add foreign key constraint
    ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT fk_ownership_periods_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    -- Make owner_id nullable to support firm-default ownership
    ALTER TABLE property_ownership_periods 
    ALTER COLUMN owner_id DROP NOT NULL;

    -- Add check constraint to ensure either owner_id exists OR it's firm default
    ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_ownership_assignment 
    CHECK (owner_id IS NOT NULL OR (owner_id IS NULL AND firm_id IS NOT NULL));

    -- Add ownership_type to distinguish individual vs firm ownership
    ALTER TABLE property_ownership_periods 
    ADD COLUMN IF NOT EXISTS ownership_type varchar(20) DEFAULT 'individual';

    ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_ownership_type 
    CHECK (ownership_type IN ('individual', 'firm_default', 'corporate', 'partnership'));

    -- Add constraints to ensure data integrity
    ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_firm_ownership_logic 
    CHECK (
        (ownership_type = 'individual' AND owner_id IS NOT NULL) OR
        (ownership_type = 'firm_default' AND owner_id IS NULL AND firm_id IS NOT NULL) OR
        (ownership_type IN ('corporate', 'partnership') AND owner_id IS NOT NULL)
    );

    -- Create index for firm_id
    CREATE INDEX idx_property_ownership_firm ON property_ownership_periods (firm_id);
    CREATE INDEX idx_property_ownership_type ON property_ownership_periods (ownership_type);

    RAISE NOTICE 'Property ownership periods table enhanced successfully';

    -- =====================================================
    -- CREATE OWNERSHIP VALIDATION FUNCTIONS
    -- =====================================================

    RAISE NOTICE 'Creating ownership validation functions...';

    -- Function to validate ownership percentages don't exceed 100%
    CREATE OR REPLACE FUNCTION validate_property_ownership_percentages(p_property_id int4)
    RETURNS boolean AS $func$
    DECLARE
        v_total_percentage decimal(5,2);
    BEGIN
        SELECT COALESCE(SUM(ownership_percentage), 0) INTO v_total_percentage
        FROM property_ownership_periods
        WHERE property_id = p_property_id
        AND end_date IS NULL;
        
        RETURN v_total_percentage <= 100.00;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get property ownership distribution
    CREATE OR REPLACE FUNCTION get_property_ownership_distribution(p_property_id int4)
    RETURNS TABLE (
        ownership_period_id int4,
        owner_id int4,
        firm_id int4,
        owner_name varchar(100),
        firm_name varchar(100),
        ownership_percentage decimal(5,2),
        ownership_type varchar(20),
        start_date date,
        end_date date
    ) AS $func$
    BEGIN
        RETURN QUERY
        SELECT 
            pop.ownership_period_id,
            pop.owner_id,
            pop.firm_id,
            o.full_name as owner_name,
            f.firm_name,
            pop.ownership_percentage,
            pop.ownership_type,
            pop.start_date,
            pop.end_date,
            CASE WHEN pop.end_date IS NULL THEN true ELSE false END as is_active
        FROM property_ownership_periods pop
        LEFT JOIN owners o ON pop.owner_id = o.owner_id
        LEFT JOIN firms f ON pop.firm_id = f.firm_id
        WHERE pop.property_id = p_property_id
        ORDER BY (pop.end_date IS NULL) DESC, pop.ownership_percentage DESC;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to auto-assign firm default ownership for unassigned properties
    CREATE OR REPLACE FUNCTION assign_firm_default_ownership(p_property_id int4, p_firm_id int4)
    RETURNS boolean AS $func$
    DECLARE
        v_existing_ownership decimal(5,2);
        v_remaining_percentage decimal(5,2);
    BEGIN
        -- Calculate existing ownership
        SELECT COALESCE(SUM(ownership_percentage), 0) INTO v_existing_ownership
        FROM property_ownership_periods
        WHERE property_id = p_property_id
        AND end_date IS NULL;
        
        -- Calculate remaining percentage
        v_remaining_percentage := 100.00 - v_existing_ownership;
        
        -- Only create firm default if there's remaining ownership
        IF v_remaining_percentage > 0 THEN
            INSERT INTO property_ownership_periods (
                property_id, firm_id, ownership_percentage,
                ownership_type, start_date
            ) VALUES (
                p_property_id, p_firm_id, v_remaining_percentage,
                'firm_default', CURRENT_DATE
            );
            RETURN true;
        END IF;
        
        RETURN false;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE 'Ownership validation functions created successfully';

    -- =====================================================
    -- CREATE OWNERSHIP MANAGEMENT FUNCTIONS
    -- =====================================================

    RAISE NOTICE 'Creating ownership management functions...';

    -- Function to transfer ownership
    CREATE OR REPLACE FUNCTION transfer_property_ownership(
        p_property_id int4,
        p_from_owner_id int4,
        p_to_owner_id int4,
        p_percentage_to_transfer decimal(5,2),
        p_transfer_date date DEFAULT CURRENT_DATE
    ) RETURNS boolean AS $func$
    DECLARE
        v_from_percentage decimal(5,2);
        v_remaining_percentage decimal(5,2);
    BEGIN
        -- Get current ownership percentage
        SELECT ownership_percentage INTO v_from_percentage
        FROM property_ownership_periods
        WHERE property_id = p_property_id
        AND owner_id = p_from_owner_id
        AND end_date IS NULL;
        
        -- Check if transfer is valid
        IF v_from_percentage IS NULL OR v_from_percentage < p_percentage_to_transfer THEN
            RETURN false;
        END IF;
        
        -- Calculate remaining percentage
        v_remaining_percentage := v_from_percentage - p_percentage_to_transfer;
        
        -- Update source ownership
        IF v_remaining_percentage > 0 THEN
            UPDATE property_ownership_periods 
            SET ownership_percentage = v_remaining_percentage,
                updated_at = CURRENT_TIMESTAMP
            WHERE property_id = p_property_id
            AND owner_id = p_from_owner_id
            AND end_date IS NULL;
        ELSE
            -- End the ownership period if no percentage remains
            UPDATE property_ownership_periods 
            SET end_date = p_transfer_date,
                updated_at = CURRENT_TIMESTAMP
            WHERE property_id = p_property_id
            AND owner_id = p_from_owner_id
            AND end_date IS NULL;
        END IF;
        
        -- Create or update target ownership
        IF EXISTS (
            SELECT 1 FROM property_ownership_periods
            WHERE property_id = p_property_id
            AND owner_id = p_to_owner_id
            AND end_date IS NULL
        ) THEN
            -- Add to existing ownership
            UPDATE property_ownership_periods 
            SET ownership_percentage = ownership_percentage + p_percentage_to_transfer,
                updated_at = CURRENT_TIMESTAMP
            WHERE property_id = p_property_id
            AND owner_id = p_to_owner_id
            AND end_date IS NULL;
        ELSE
            -- Create new ownership record
            INSERT INTO property_ownership_periods (
                property_id, owner_id, ownership_percentage,
                ownership_type, start_date
            ) VALUES (
                p_property_id, p_to_owner_id, p_percentage_to_transfer,
                'individual', p_transfer_date
            );
        END IF;
        
        RETURN true;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE 'Ownership management functions created successfully';

    -- =====================================================
    -- CREATE OWNERSHIP VIEWS
    -- =====================================================

    RAISE NOTICE 'Creating ownership analysis views...';

    -- View for property ownership summary
    CREATE OR REPLACE VIEW property_ownership_summary AS
    SELECT 
        p.property_id,
        p.property_name,
        p.firm_id,
        f.firm_name,
        -- Individual ownership
        COALESCE(individual_ownership.total_individual_percentage, 0) as individual_ownership_percentage,
        individual_ownership.owner_count,
        -- Firm default ownership
        COALESCE(firm_ownership.firm_default_percentage, 0) as firm_default_percentage,
        -- Total assigned
        COALESCE(individual_ownership.total_individual_percentage, 0) + 
        COALESCE(firm_ownership.firm_default_percentage, 0) as total_assigned_percentage,
        -- Validation
        CASE 
            WHEN COALESCE(individual_ownership.total_individual_percentage, 0) + 
                 COALESCE(firm_ownership.firm_default_percentage, 0) = 100 THEN true
            ELSE false
        END as ownership_complete
    FROM properties p
    JOIN firms f ON p.firm_id = f.firm_id
    LEFT JOIN (
        SELECT 
            property_id,
            SUM(ownership_percentage) as total_individual_percentage,
            COUNT(*) as owner_count
        FROM property_ownership_periods
        WHERE ownership_type = 'individual'
        AND end_date IS NULL
        GROUP BY property_id
    ) individual_ownership ON p.property_id = individual_ownership.property_id
    LEFT JOIN (
        SELECT 
            property_id,
            SUM(ownership_percentage) as firm_default_percentage
        FROM property_ownership_periods
        WHERE ownership_type = 'firm_default'
        AND end_date IS NULL
        GROUP BY property_id
    ) firm_ownership ON p.property_id = firm_ownership.property_id;

    -- View for owner portfolio summary
    CREATE OR REPLACE VIEW owner_portfolio_summary AS
    SELECT 
        o.owner_id,
        o.full_name,
        o.firm_id,
        f.firm_name,
        COUNT(DISTINCT pop.property_id) as owned_properties,
        SUM(pop.ownership_percentage) as total_ownership_percentage,
        AVG(pop.ownership_percentage) as average_ownership_percentage,
        COUNT(CASE WHEN pop.ownership_percentage = 100 THEN 1 END) as fully_owned_properties,
        COUNT(CASE WHEN pop.ownership_percentage < 100 THEN 1 END) as partially_owned_properties
    FROM owners o
    JOIN firms f ON o.firm_id = f.firm_id
    LEFT JOIN property_ownership_periods pop ON o.owner_id = pop.owner_id
        AND pop.end_date IS NULL
    WHERE o.is_active = true
    GROUP BY o.owner_id, o.full_name, o.firm_id, f.firm_name;

    RAISE NOTICE 'Ownership analysis views created successfully';

    -- =====================================================
    -- CREATE OWNERSHIP TRIGGERS
    -- =====================================================

    RAISE NOTICE 'Creating ownership validation triggers...';

    -- Trigger to validate ownership percentages on insert/update
    CREATE OR REPLACE FUNCTION validate_ownership_percentage_trigger()
    RETURNS trigger AS $func$
    BEGIN
        -- Validate that total ownership doesn't exceed 100%
        IF NOT validate_property_ownership_percentages(NEW.property_id) THEN
            RAISE EXCEPTION 'Total ownership percentage for property % would exceed 100%%', NEW.property_id;
        END IF;
        
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_validate_ownership_percentage
        AFTER INSERT OR UPDATE ON property_ownership_periods
        FOR EACH ROW
        EXECUTE FUNCTION validate_ownership_percentage_trigger();

    -- Trigger to auto-assign firm default ownership for new properties
    CREATE OR REPLACE FUNCTION auto_assign_firm_ownership_trigger()
    RETURNS trigger AS $func$
    BEGIN
        -- Auto-assign 100% firm default ownership for new properties
        PERFORM assign_firm_default_ownership(NEW.property_id, NEW.firm_id);
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_auto_assign_firm_ownership
        AFTER INSERT ON properties
        FOR EACH ROW
        EXECUTE FUNCTION auto_assign_firm_ownership_trigger();

    RAISE NOTICE 'Ownership validation triggers created successfully';

    -- =====================================================
    -- UPDATE EXISTING DATA
    -- =====================================================

    RAISE NOTICE 'Updating existing ownership data with firm relationships...';

    -- Update existing ownership periods with firm_id from properties
    UPDATE property_ownership_periods 
    SET firm_id = p.firm_id,
        ownership_type = 'individual'
    FROM properties p
    WHERE property_ownership_periods.property_id = p.property_id
    AND property_ownership_periods.firm_id IS NULL;

    -- Assign firm default ownership for properties without full ownership
    INSERT INTO property_ownership_periods (
        property_id, firm_id, ownership_percentage, ownership_type, start_date
    )
    SELECT 
        p.property_id,
        p.firm_id,
        100.00 - COALESCE(existing_ownership.total_percentage, 0),
        'firm_default',
        CURRENT_DATE
    FROM properties p
    LEFT JOIN (
        SELECT 
            property_id,
            SUM(ownership_percentage) as total_percentage
        FROM property_ownership_periods
        WHERE end_date IS NULL
        GROUP BY property_id
    ) existing_ownership ON p.property_id = existing_ownership.property_id
    WHERE COALESCE(existing_ownership.total_percentage, 0) < 100.00;

    RAISE NOTICE 'Existing ownership data updated successfully';

    -- =====================================================
    -- RECORD MIGRATION SUCCESS
    -- =====================================================

    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '002',
        'Enhance Ownership Model - Add firm-default ownership, ownership validation, transfer functions, and flexible ownership assignment',
        'To rollback: DROP TRIGGER trg_auto_assign_firm_ownership, trg_validate_ownership_percentage; DROP FUNCTION validate_ownership_percentage_trigger, auto_assign_firm_ownership_trigger, transfer_property_ownership, assign_firm_default_ownership, get_property_ownership_distribution, validate_property_ownership_percentages; DROP VIEW owner_portfolio_summary, property_ownership_summary; ALTER TABLE property_ownership_periods DROP COLUMN ownership_type, DROP CONSTRAINT chk_firm_ownership_logic, chk_ownership_type, chk_ownership_assignment, fk_ownership_periods_firm_id, DROP COLUMN firm_id, ALTER COLUMN owner_id SET NOT NULL;'
    );

    RAISE NOTICE '✅ Migration 002 completed successfully!';
    RAISE NOTICE 'Enhanced ownership model with firm-default ownership support';
    RAISE NOTICE 'Next: Run migration 003_improve_approval_workflow.sql';

END $$;