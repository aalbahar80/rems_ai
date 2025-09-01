-- =====================================================
-- 003 - Improve Approval Workflow - FIXED VERSION
-- Real Estate Management System - Schema Migration
-- Purpose: Add comprehensive expense approval workflow system
-- Dependencies: 001_add_firms_support.sql, 002_enhance_ownership_model.sql
-- Version: 2.0.003
-- =====================================================

SET search_path = rems, public;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = '003') THEN
        RAISE NOTICE 'Migration 003 already applied, skipping';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting Migration 003: Improve Approval Workflow';

    -- Create sequences
    CREATE SEQUENCE IF NOT EXISTS approval_decisions_id_seq;
    CREATE SEQUENCE IF NOT EXISTS approval_delegations_id_seq;

    -- Create approval decisions table
    RAISE NOTICE 'Creating approval decisions table...';
    
    CREATE TABLE "rems"."approval_decisions" (
        "decision_id" int4 NOT NULL DEFAULT nextval('approval_decisions_id_seq'::regclass),
        "expense_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "property_id" int4,
        "approval_required_by" varchar(20) NOT NULL DEFAULT 'admin',
        "required_owner_id" int4,
        "approval_status" varchar(20) DEFAULT 'pending',
        "approval_priority" varchar(20) DEFAULT 'normal',
        "approval_deadline" timestamp,
        "approved_by" int4,
        "approved_at" timestamp,
        "rejection_reason" text,
        "escalated_to_admin" boolean DEFAULT false,
        "escalated_at" timestamp,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("decision_id")
    );

    -- Add foreign key constraints
    ALTER TABLE approval_decisions 
    ADD CONSTRAINT fk_approval_decisions_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE approval_decisions 
    ADD CONSTRAINT fk_approval_decisions_property_id 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

    ALTER TABLE approval_decisions 
    ADD CONSTRAINT chk_approval_required_by 
    CHECK (approval_required_by IN ('owner', 'admin', 'auto_approved'));

    ALTER TABLE approval_decisions 
    ADD CONSTRAINT chk_approval_status 
    CHECK (approval_status IN ('pending', 'approved', 'rejected', 'escalated', 'expired'));

    ALTER TABLE approval_decisions 
    ADD CONSTRAINT chk_approval_priority 
    CHECK (approval_priority IN ('low', 'normal', 'high', 'urgent'));

    -- Create indexes
    CREATE INDEX idx_approval_decisions_firm ON approval_decisions (firm_id);
    CREATE INDEX idx_approval_decisions_status ON approval_decisions (approval_status);
    CREATE INDEX idx_approval_decisions_deadline ON approval_decisions (approval_deadline);
    CREATE INDEX idx_approval_decisions_property ON approval_decisions (property_id);

    RAISE NOTICE 'Approval decisions table created successfully';

    -- Create approval delegations table
    RAISE NOTICE 'Creating approval delegations table...';
    
    CREATE TABLE "rems"."approval_delegations" (
        "delegation_id" int4 NOT NULL DEFAULT nextval('approval_delegations_id_seq'::regclass),
        "delegator_owner_id" int4 NOT NULL,
        "delegate_user_id" int4 NOT NULL,
        "firm_id" int4 NOT NULL,
        "max_amount_limit" decimal(12,2),
        "property_restrictions" int4[],
        "is_active" boolean DEFAULT true,
        "start_date" date DEFAULT CURRENT_DATE,
        "end_date" date,
        "created_by" int4,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("delegation_id")
    );

    -- Add constraints
    ALTER TABLE approval_delegations 
    ADD CONSTRAINT fk_approval_delegations_firm_id 
    FOREIGN KEY (firm_id) REFERENCES firms(firm_id) ON DELETE CASCADE;

    ALTER TABLE approval_delegations 
    ADD CONSTRAINT fk_approval_delegations_delegate_user 
    FOREIGN KEY (delegate_user_id) REFERENCES users(user_id) ON DELETE CASCADE;

    ALTER TABLE approval_delegations 
    ADD CONSTRAINT chk_delegation_dates 
    CHECK (end_date IS NULL OR end_date >= start_date);

    -- Create indexes
    CREATE INDEX idx_approval_delegations_firm ON approval_delegations (firm_id);
    CREATE INDEX idx_approval_delegations_active ON approval_delegations (is_active, end_date);
    CREATE INDEX idx_approval_delegations_delegate ON approval_delegations (delegate_user_id);

    RAISE NOTICE 'Approval delegations table created successfully';

    -- Add approval-related columns to expense_transactions table
    RAISE NOTICE 'Enhancing expense_transactions table for approval workflow...';
    
    ALTER TABLE expense_transactions 
    ADD COLUMN IF NOT EXISTS approval_threshold_exceeded boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS auto_approved boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS approval_requested_at timestamp,
    ADD COLUMN IF NOT EXISTS final_approval_at timestamp;

    -- Create approval workflow functions
    RAISE NOTICE 'Creating approval workflow functions...';
    
    -- Function to determine approval requirements
    CREATE OR REPLACE FUNCTION determine_approval_requirement(p_expense_id int4)
    RETURNS varchar(20) AS $func$
    DECLARE
        v_expense_record RECORD;
        v_threshold decimal(12,2) := 1000.00; -- Default threshold
        v_ownership_record RECORD;
    BEGIN
        -- Get expense details
        SELECT * INTO v_expense_record FROM expense_transactions WHERE expense_transaction_id = p_expense_id;
        
        IF NOT FOUND THEN
            RETURN 'error';
        END IF;
        
        -- Check if amount exceeds threshold
        IF v_expense_record.amount <= v_threshold THEN
            RETURN 'auto_approved';
        END IF;
        
        -- Check property ownership to determine if owner approval needed
        SELECT * INTO v_ownership_record 
        FROM property_ownership_periods pop
        WHERE pop.property_id = v_expense_record.property_id
        AND pop.end_date IS NULL
        AND pop.ownership_type = 'individual'
        LIMIT 1;
        
        IF FOUND THEN
            RETURN 'owner';
        ELSE
            RETURN 'admin';
        END IF;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to create approval decision
    CREATE OR REPLACE FUNCTION create_approval_decision(p_expense_id int4)
    RETURNS int4 AS $func$
    DECLARE
        v_expense_record RECORD;
        v_approval_type varchar(20);
        v_decision_id int4;
        v_owner_id int4;
        v_deadline timestamp;
    BEGIN
        -- Get expense details
        SELECT * INTO v_expense_record FROM expense_transactions WHERE expense_transaction_id = p_expense_id;
        
        -- Determine approval requirement
        SELECT determine_approval_requirement(p_expense_id) INTO v_approval_type;
        
        -- Set deadline (72 hours from now)
        v_deadline := CURRENT_TIMESTAMP + INTERVAL '72 hours';
        
        -- Get owner if owner approval required
        IF v_approval_type = 'owner' THEN
            SELECT owner_id INTO v_owner_id 
            FROM property_ownership_periods 
            WHERE property_id = v_expense_record.property_id
            AND end_date IS NULL
            AND ownership_type = 'individual'
            LIMIT 1;
        END IF;
        
        -- Create approval decision
        INSERT INTO approval_decisions (
            expense_id, firm_id, property_id, approval_required_by,
            required_owner_id, approval_deadline, approval_priority
        ) VALUES (
            p_expense_id, v_expense_record.firm_id, v_expense_record.property_id,
            v_approval_type, v_owner_id, v_deadline, 'normal'
        ) RETURNING decision_id INTO v_decision_id;
        
        -- Update expense
        UPDATE expense_transactions 
        SET approval_required = true,
            approval_requested_at = CURRENT_TIMESTAMP
        WHERE expense_transaction_id = p_expense_id;
        
        RETURN v_decision_id;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE 'Approval workflow functions created successfully';

    -- Create approval views
    RAISE NOTICE 'Creating approval workflow views...';
    
    -- View for pending approvals
    CREATE OR REPLACE VIEW pending_approvals_overview AS
    SELECT 
        ad.decision_id,
        ad.expense_id,
        e.amount,
        e.description,
        ec.category_name as category,
        p.property_name,
        ad.approval_required_by,
        ad.required_owner_id,
        o.full_name as required_owner_name,
        ad.approval_priority,
        ad.approval_deadline,
        CASE 
            WHEN ad.approval_deadline < CURRENT_TIMESTAMP THEN 'overdue'
            WHEN ad.approval_deadline <= CURRENT_TIMESTAMP + INTERVAL '24 hours' THEN 'due_soon'
            ELSE 'normal'
        END as urgency_status,
        ad.created_at
    FROM approval_decisions ad
    JOIN expense_transactions e ON ad.expense_id = e.expense_transaction_id
    LEFT JOIN expense_categories ec ON e.expense_category_id = ec.category_id
    LEFT JOIN properties p ON ad.property_id = p.property_id
    LEFT JOIN owners o ON ad.required_owner_id = o.owner_id
    WHERE ad.approval_status = 'pending';

    RAISE NOTICE 'Approval workflow views created successfully';

    -- Record migration success
    INSERT INTO schema_migrations (version, description, rollback_instructions)
    VALUES (
        '003',
        'Improve Approval Workflow - Add approval decisions, delegations, workflow functions and views',
        'To rollback: DROP TABLE approval_delegations, approval_decisions; DROP FUNCTION create_approval_decision, determine_approval_requirement; DROP VIEW pending_approvals_overview; ALTER TABLE expense_transactions DROP COLUMN approval_threshold_exceeded, auto_approved, approval_requested_at, final_approval_at;'
    );

    RAISE NOTICE '✅ Migration 003 completed successfully!';
    RAISE NOTICE 'Approval workflow system implemented';

END $$;