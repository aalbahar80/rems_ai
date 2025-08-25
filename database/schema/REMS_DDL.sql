-- =====================================================
-- 001 - Owners Table (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Core owners entity table
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS owners CASCADE;

-- Create sequence for owners
CREATE SEQUENCE IF NOT EXISTS owners_id_seq;

-- Create the normalized owners table
CREATE TABLE "rems"."owners" (
    "owner_id" int4 NOT NULL DEFAULT nextval('owners_id_seq'::regclass),
    "first_name" text NOT NULL,
    "middle_name" text,
    "last_name" text NOT NULL,
    "full_name" text NOT NULL,
    "display_name" text,
    "nationality" varchar(50),
    "phone_primary" varchar(20),
    "phone_secondary" varchar(20),
    "email" varchar(100),
    "national_id_type" varchar(20) DEFAULT 'civil_id',
    "national_id_number" varchar(50),
    "address" text,
    "preferred_language" varchar(5) DEFAULT 'en',
    "is_active" boolean DEFAULT true,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("owner_id")
);

-- Add constraints
ALTER TABLE owners ADD CONSTRAINT chk_preferred_language 
    CHECK (preferred_language IN ('en', 'ar', 'both'));

ALTER TABLE owners ADD CONSTRAINT chk_national_id_type 
    CHECK (national_id_type IN ('civil_id', 'passport', 'driving_license', 'other'));

ALTER TABLE owners ADD CONSTRAINT unique_national_id 
    UNIQUE (national_id_type, national_id_number);

ALTER TABLE owners ADD CONSTRAINT unique_email 
    UNIQUE (email);

-- Create indexes for performance
CREATE INDEX idx_owners_full_name ON rems.owners USING btree (full_name);
CREATE INDEX idx_owners_first_last ON rems.owners USING btree (first_name, last_name);
CREATE INDEX idx_owners_email ON rems.owners USING btree (email);
CREATE INDEX idx_owners_national_id ON rems.owners USING btree (national_id_number);
CREATE INDEX idx_owners_active ON rems.owners USING btree (is_active);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_owners_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_owners_timestamp
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE FUNCTION update_owners_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."owners" IS 'Core owners entity - supports global naming conventions and multi-language input';
COMMENT ON COLUMN "rems"."owners"."first_name" IS 'First name (accepts Arabic, English, or any language)';
COMMENT ON COLUMN "rems"."owners"."middle_name" IS 'Middle name(s) - optional field for additional names';
COMMENT ON COLUMN "rems"."owners"."last_name" IS 'Last name or family name';
COMMENT ON COLUMN "rems"."owners"."full_name" IS 'Complete display name - manually entered for flexibility';
COMMENT ON COLUMN "rems"."owners"."display_name" IS 'Preferred display name for UI (nickname, short name, etc.)';
COMMENT ON COLUMN "rems"."owners"."national_id_type" IS 'Type of ID: civil_id, passport, driving_license, other';
COMMENT ON COLUMN "rems"."owners"."national_id_number" IS 'Unique identifier number';
COMMENT ON COLUMN "rems"."owners"."preferred_language" IS 'User language preference: en, ar, both';
COMMENT ON COLUMN "rems"."owners"."is_active" IS 'Whether owner is currently active in the system';


-- =====================================================
-- 002 - Properties Table (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Core properties entity table
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS properties CASCADE;

-- Create sequence for properties
CREATE SEQUENCE IF NOT EXISTS properties_id_seq;

-- Create the normalized properties table
CREATE TABLE "rems"."properties" (
    "property_id" int4 NOT NULL DEFAULT nextval('properties_id_seq'::regclass),
    "property_code" varchar(10) NOT NULL UNIQUE,
    "property_name" text,
    "location" varchar(100),
    "address" text,
    "area_sqm" numeric(10,2),
    "total_units" int4 DEFAULT 0,
    "property_type" varchar(50) DEFAULT 'residential',
    "construction_year" int4,
    "construction_cost" numeric(15,2),
    "planning_permit" varchar(50),
    "valuation_amount" numeric(15,2),
    "valuation_date" date,
    "valuation_method" varchar(50),
    "is_active" boolean DEFAULT true,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("property_id")
);

-- Add constraints
ALTER TABLE properties ADD CONSTRAINT chk_property_type 
    CHECK (property_type IN ('residential', 'commercial', 'mixed_use', 'land', 'other'));

ALTER TABLE properties ADD CONSTRAINT chk_positive_area 
    CHECK (area_sqm > 0);

ALTER TABLE properties ADD CONSTRAINT chk_positive_units 
    CHECK (total_units >= 0);

ALTER TABLE properties ADD CONSTRAINT chk_construction_year 
    CHECK (construction_year BETWEEN 1900 AND 2100);

-- Create indexes for performance
CREATE UNIQUE INDEX idx_properties_code ON rems.properties USING btree (property_code);
CREATE INDEX idx_properties_location ON rems.properties USING btree (location);
CREATE INDEX idx_properties_type ON rems.properties USING btree (property_type);
CREATE INDEX idx_properties_active ON rems.properties USING btree (is_active);
CREATE INDEX idx_properties_area ON rems.properties USING btree (area_sqm);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_properties_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_properties_timestamp
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."properties" IS 'Core properties entity - manages all property information and metadata';
COMMENT ON COLUMN "rems"."properties"."property_code" IS 'Unique property identifier (Z1, Z2, M2, S1, etc.)';
COMMENT ON COLUMN "rems"."properties"."property_name" IS 'Descriptive name for the property';
COMMENT ON COLUMN "rems"."properties"."location" IS 'General location/area name';
COMMENT ON COLUMN "rems"."properties"."address" IS 'Full postal address';
COMMENT ON COLUMN "rems"."properties"."area_sqm" IS 'Total property area in square meters';
COMMENT ON COLUMN "rems"."properties"."total_units" IS 'Total number of rental units in property';
COMMENT ON COLUMN "rems"."properties"."property_type" IS 'residential, commercial, mixed_use, land, other';
COMMENT ON COLUMN "rems"."properties"."planning_permit" IS 'Government planning permit number';
COMMENT ON COLUMN "rems"."properties"."valuation_amount" IS 'Most recent property valuation';
COMMENT ON COLUMN "rems"."properties"."valuation_method" IS 'Valuation method used (income_approach, comparable_sales, etc.)';


-- =====================================================
-- 003 - Property Ownership Periods (Normalized REMS)
-- Real Estate Management System
-- Purpose: Temporal ownership tracking with percentages
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS property_ownership_periods CASCADE;

-- Create sequence for ownership periods
CREATE SEQUENCE IF NOT EXISTS ownership_periods_id_seq;

-- Create the normalized property ownership periods table
CREATE TABLE "rems"."property_ownership_periods" (
    "ownership_id" int4 NOT NULL DEFAULT nextval('ownership_periods_id_seq'::regclass),
    "property_id" int4 NOT NULL,
    "owner_id" int4 NOT NULL,
    "ownership_percentage" numeric(5,2) NOT NULL DEFAULT 100.00,
    "start_date" date NOT NULL DEFAULT CURRENT_DATE,
    "end_date" date,
    "is_primary_contact" boolean DEFAULT false,
    "management_fee_percentage" numeric(5,2) DEFAULT 5.00,
    "acquisition_method" varchar(50),
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("ownership_id")
);

-- Add foreign key constraints
ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT fk_ownership_property 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT fk_ownership_owner 
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE;

-- Add business logic constraints
ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_ownership_percentage 
    CHECK (ownership_percentage > 0 AND ownership_percentage <= 100);

ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_management_fee 
    CHECK (management_fee_percentage >= 0 AND management_fee_percentage <= 50);

ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_date_logic 
    CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE property_ownership_periods 
    ADD CONSTRAINT chk_acquisition_method 
    CHECK (acquisition_method IS NULL OR acquisition_method IN 
        ('purchase', 'inheritance', 'gift', 'transfer', 'founding', 'other'));

-- Create indexes for performance
CREATE INDEX idx_ownership_property ON rems.property_ownership_periods USING btree (property_id);
CREATE INDEX idx_ownership_owner ON rems.property_ownership_periods USING btree (owner_id);
CREATE INDEX idx_ownership_dates ON rems.property_ownership_periods USING btree (start_date, end_date);
CREATE INDEX idx_ownership_current ON rems.property_ownership_periods USING btree (property_id, end_date) WHERE end_date IS NULL;
CREATE INDEX idx_ownership_primary_contact ON rems.property_ownership_periods USING btree (property_id, is_primary_contact) WHERE is_primary_contact = true;

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_ownership_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_ownership_timestamp
    BEFORE UPDATE ON property_ownership_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_ownership_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."property_ownership_periods" IS 'Temporal property ownership tracking with percentage-based shares';
COMMENT ON COLUMN "rems"."property_ownership_periods"."ownership_percentage" IS 'Percentage of property owned (0.01 to 100.00)';
COMMENT ON COLUMN "rems"."property_ownership_periods"."start_date" IS 'When ownership period began';
COMMENT ON COLUMN "rems"."property_ownership_periods"."end_date" IS 'When ownership ended (NULL = current ownership)';
COMMENT ON COLUMN "rems"."property_ownership_periods"."is_primary_contact" IS 'Primary contact for property management decisions';
COMMENT ON COLUMN "rems"."property_ownership_periods"."management_fee_percentage" IS 'Management fee charged on collected rent';
COMMENT ON COLUMN "rems"."property_ownership_periods"."acquisition_method" IS 'How ownership was acquired';

-- Create helpful function to get current ownership
CREATE OR REPLACE FUNCTION get_current_ownership(prop_code VARCHAR(10), check_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    owner_name TEXT,
    ownership_percentage NUMERIC(5,2),
    is_primary_contact BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.full_name,
        pop.ownership_percentage,
        pop.is_primary_contact
    FROM property_ownership_periods pop
    JOIN owners o ON pop.owner_id = o.owner_id
    JOIN properties p ON pop.property_id = p.property_id
    WHERE p.property_code = prop_code
      AND pop.start_date <= check_date
      AND (pop.end_date IS NULL OR pop.end_date >= check_date)
    ORDER BY pop.ownership_percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 004 - Units Table (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Individual rental units within properties
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS units CASCADE;

-- Create sequence for units
CREATE SEQUENCE IF NOT EXISTS units_id_seq;

-- Create the normalized units table
CREATE TABLE "rems"."units" (
    "unit_id" int4 NOT NULL DEFAULT nextval('units_id_seq'::regclass),
    "property_id" int4 NOT NULL,
    "unit_number" varchar(20) NOT NULL,
    "unit_type" varchar(50) NOT NULL DEFAULT 'apartment',
    "number_of_livingrooms" int4 DEFAULT 0,
    "number_of_bedrooms" int4 DEFAULT 0,
    "number_of_bathrooms" int4 DEFAULT 0,
    "number_of_parking_spaces" int4 DEFAULT 0,
    "area_sqm" numeric(8,2),
    "base_rent_amount" numeric(10,2),
    "is_active" boolean DEFAULT true,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("unit_id")
);

-- Add foreign key constraint
ALTER TABLE units 
    ADD CONSTRAINT fk_units_property 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

-- Add business logic constraints
ALTER TABLE units 
    ADD CONSTRAINT chk_unit_type 
    CHECK (unit_type IN ('studio', 'apartment', 'storage', 'single_family_home', 'parking', 'commercial', 'office', 'other'));

ALTER TABLE units 
    ADD CONSTRAINT chk_positive_rooms 
    CHECK (number_of_livingrooms >= 0 AND number_of_bedrooms >= 0 AND number_of_bathrooms >= 0 AND number_of_parking_spaces >= 0);

ALTER TABLE units 
    ADD CONSTRAINT chk_positive_area 
    CHECK (area_sqm IS NULL OR area_sqm > 0);

ALTER TABLE units 
    ADD CONSTRAINT chk_positive_rent 
    CHECK (base_rent_amount IS NULL OR base_rent_amount >= 0);

-- Unique constraint for unit number within property
ALTER TABLE units 
    ADD CONSTRAINT unique_unit_per_property 
    UNIQUE (property_id, unit_number);

-- Create indexes for performance
CREATE INDEX idx_units_property ON rems.units USING btree (property_id);
CREATE INDEX idx_units_type ON rems.units USING btree (unit_type);
CREATE INDEX idx_units_bedrooms ON rems.units USING btree (number_of_bedrooms);
CREATE INDEX idx_units_active ON rems.units USING btree (is_active);
CREATE INDEX idx_units_rent ON rems.units USING btree (base_rent_amount);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_units_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_units_timestamp
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_units_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."units" IS 'Individual rental units within properties - detailed unit specifications';
COMMENT ON COLUMN "rems"."units"."unit_number" IS 'Unit identifier within property (101, 102, G01, etc.)';
COMMENT ON COLUMN "rems"."units"."unit_type" IS 'studio, apartment, storage, single_family_home, parking, commercial, office, other';
COMMENT ON COLUMN "rems"."units"."number_of_livingrooms" IS 'Number of living rooms/common areas';
COMMENT ON COLUMN "rems"."units"."number_of_bedrooms" IS 'Number of bedrooms (0 for studio)';
COMMENT ON COLUMN "rems"."units"."number_of_bathrooms" IS 'Number of bathrooms/powder rooms';
COMMENT ON COLUMN "rems"."units"."number_of_parking_spaces" IS 'Dedicated parking spaces for this unit';
COMMENT ON COLUMN "rems"."units"."area_sqm" IS 'Unit area in square meters';
COMMENT ON COLUMN "rems"."units"."base_rent_amount" IS 'Standard monthly rent amount for this unit';

-- Update properties table with correct total_units count
UPDATE properties 
SET total_units = (
    SELECT COUNT(*) 
    FROM units 
    WHERE units.property_id = properties.property_id
);

-- Create helpful view for unit summary
CREATE OR REPLACE VIEW units_summary AS
SELECT 
    p.property_code,
    p.property_name,
    p.location,
    COUNT(u.unit_id) as total_units,
    COUNT(CASE WHEN u.unit_type = 'apartment' THEN 1 END) as apartments,
    COUNT(CASE WHEN u.unit_type = 'studio' THEN 1 END) as studios,
    COUNT(CASE WHEN u.unit_type = 'storage' THEN 1 END) as storage_units,
    COUNT(CASE WHEN u.unit_type = 'parking' THEN 1 END) as parking_spaces,
    COUNT(CASE WHEN u.unit_type = 'single_family_home' THEN 1 END) as houses,
    ROUND(AVG(u.base_rent_amount), 2) as avg_rent,
    SUM(u.base_rent_amount) as total_potential_rent
FROM properties p
LEFT JOIN units u ON p.property_id = u.property_id AND u.is_active = true
GROUP BY p.property_id, p.property_code, p.property_name, p.location
ORDER BY p.property_code;

-- =====================================================
-- 005 - Tenants Table (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Tenant entity with complete contact information
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS tenants CASCADE;

-- Create sequence for tenants
CREATE SEQUENCE IF NOT EXISTS tenants_id_seq;

-- Create the normalized tenants table
CREATE TABLE "rems"."tenants" (
    "tenant_id" int4 NOT NULL DEFAULT nextval('tenants_id_seq'::regclass),
    "first_name" text NOT NULL,
    "middle_name" text,
    "last_name" text NOT NULL,
    "full_name" text NOT NULL,
    "nationality" varchar(50),
    "home_phone" varchar(20),
    "work_phone" varchar(20),
    "mobile" varchar(20),
    "email" varchar(100),
    "work_address" text,
    "national_id_type" varchar(20) DEFAULT 'civil_id',
    "national_id" varchar(50),
    "is_active" boolean DEFAULT true,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("tenant_id")
);

-- Add constraints
ALTER TABLE tenants ADD CONSTRAINT chk_tenant_national_id_type 
    CHECK (national_id_type IN ('civil_id', 'passport', 'driving_license', 'other'));

ALTER TABLE tenants ADD CONSTRAINT unique_tenant_national_id 
    UNIQUE (national_id_type, national_id);

ALTER TABLE tenants ADD CONSTRAINT unique_tenant_email 
    UNIQUE (email);

-- Create indexes for performance
CREATE INDEX idx_tenants_full_name ON rems.tenants USING btree (full_name);
CREATE INDEX idx_tenants_first_last ON rems.tenants USING btree (first_name, last_name);
CREATE INDEX idx_tenants_nationality ON rems.tenants USING btree (nationality);
CREATE INDEX idx_tenants_email ON rems.tenants USING btree (email);
CREATE INDEX idx_tenants_national_id ON rems.tenants USING btree (national_id);
CREATE INDEX idx_tenants_active ON rems.tenants USING btree (is_active);
CREATE INDEX idx_tenants_mobile ON rems.tenants USING btree (mobile);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_tenants_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_tenants_timestamp
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_tenants_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."tenants" IS 'Tenant entity with complete contact and identification information';
COMMENT ON COLUMN "rems"."tenants"."first_name" IS 'First name (accepts Arabic, English, or any language)';
COMMENT ON COLUMN "rems"."tenants"."middle_name" IS 'Middle name(s) - optional field for additional names';
COMMENT ON COLUMN "rems"."tenants"."last_name" IS 'Last name or family name';
COMMENT ON COLUMN "rems"."tenants"."full_name" IS 'Complete display name - manually entered for flexibility';
COMMENT ON COLUMN "rems"."tenants"."nationality" IS 'Tenant nationality';
COMMENT ON COLUMN "rems"."tenants"."work_address" IS 'Tenant workplace address';
COMMENT ON COLUMN "rems"."tenants"."national_id_type" IS 'Type of ID: civil_id, passport, driving_license, other';
COMMENT ON COLUMN "rems"."tenants"."national_id" IS 'Unique identifier number';
COMMENT ON COLUMN "rems"."tenants"."is_active" IS 'Whether tenant is currently active in the system';

-- Create helpful views for tenant management
CREATE OR REPLACE VIEW active_tenants AS
SELECT 
    tenant_id,
    full_name,
    nationality,
    mobile,
    email,
    work_address,
    created_at
FROM tenants 
WHERE is_active = true
ORDER BY full_name;

CREATE OR REPLACE VIEW tenants_by_nationality AS
SELECT 
    nationality,
    COUNT(*) as tenant_count,
    STRING_AGG(full_name, '; ' ORDER BY full_name) as tenant_names
FROM tenants 
WHERE is_active = true
GROUP BY nationality
ORDER BY tenant_count DESC;

-- =====================================================
-- 006 - Rental Contracts (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Rental agreements linking tenants to units
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS rental_contracts CASCADE;

-- Create sequence for rental contracts
CREATE SEQUENCE IF NOT EXISTS rental_contracts_id_seq;

-- Create the normalized rental contracts table
CREATE TABLE "rems"."rental_contracts" (
    "contract_id" int4 NOT NULL DEFAULT nextval('rental_contracts_id_seq'::regclass),
    "unit_id" int4 NOT NULL,
    "tenant_id" int4 NOT NULL,
    "second_tenant_id" int4,
    "contract_number" varchar(50) UNIQUE,
    "start_date" date NOT NULL,
    "end_date" date NOT NULL,
    "monthly_rent" numeric(10,2) NOT NULL,
    "deposit_amount" numeric(10,2) DEFAULT 0,
    "contract_status" varchar(20) DEFAULT 'upcoming',
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("contract_id")
);

-- Add foreign key constraints
ALTER TABLE rental_contracts 
    ADD CONSTRAINT fk_contracts_unit 
    FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE;

ALTER TABLE rental_contracts 
    ADD CONSTRAINT fk_contracts_tenant 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;

ALTER TABLE rental_contracts 
    ADD CONSTRAINT fk_contracts_second_tenant 
    FOREIGN KEY (second_tenant_id) REFERENCES tenants(tenant_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE rental_contracts 
    ADD CONSTRAINT chk_contract_status 
    CHECK (contract_status IN ('upcoming', 'active', 'terminated', 'expired'));

ALTER TABLE rental_contracts 
    ADD CONSTRAINT chk_contract_dates 
    CHECK (end_date > start_date);

ALTER TABLE rental_contracts 
    ADD CONSTRAINT chk_positive_rent 
    CHECK (monthly_rent > 0);

ALTER TABLE rental_contracts 
    ADD CONSTRAINT chk_positive_deposit 
    CHECK (deposit_amount >= 0);

ALTER TABLE rental_contracts 
    ADD CONSTRAINT chk_different_tenants 
    CHECK (tenant_id != second_tenant_id);

-- Create indexes for performance
CREATE INDEX idx_contracts_unit ON rems.rental_contracts USING btree (unit_id);
CREATE INDEX idx_contracts_tenant ON rems.rental_contracts USING btree (tenant_id);
CREATE INDEX idx_contracts_second_tenant ON rems.rental_contracts USING btree (second_tenant_id);
CREATE INDEX idx_contracts_status ON rems.rental_contracts USING btree (contract_status);
CREATE INDEX idx_contracts_dates ON rems.rental_contracts USING btree (start_date, end_date);
CREATE INDEX idx_contracts_number ON rems.rental_contracts USING btree (contract_number);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_contracts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_contracts_timestamp
    BEFORE UPDATE ON rental_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_contracts_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."rental_contracts" IS 'Rental agreements linking tenants to units with temporal validity';
COMMENT ON COLUMN "rems"."rental_contracts"."unit_id" IS 'Reference to the rented unit';
COMMENT ON COLUMN "rems"."rental_contracts"."tenant_id" IS 'Primary tenant (required)';
COMMENT ON COLUMN "rems"."rental_contracts"."second_tenant_id" IS 'Secondary tenant for couples/roommates (optional)';
COMMENT ON COLUMN "rems"."rental_contracts"."contract_number" IS 'Unique contract identifier';
COMMENT ON COLUMN "rems"."rental_contracts"."monthly_rent" IS 'Agreed monthly rental amount';
COMMENT ON COLUMN "rems"."rental_contracts"."deposit_amount" IS 'Security deposit amount';
COMMENT ON COLUMN "rems"."rental_contracts"."contract_status" IS 'upcoming, active, terminated, expired';

-- Create helpful views for contract management
CREATE OR REPLACE VIEW active_contracts_summary AS
SELECT 
    rc.contract_id,
    rc.contract_number,
    p.property_code,
    u.unit_number,
    u.unit_type,
    t1.full_name as primary_tenant,
    t2.full_name as secondary_tenant,
    rc.monthly_rent,
    rc.start_date,
    rc.end_date,
    rc.contract_status,
    CASE 
        WHEN rc.end_date < CURRENT_DATE THEN 'OVERDUE'
        WHEN rc.end_date - CURRENT_DATE <= 30 THEN 'EXPIRING_SOON'
        ELSE 'NORMAL'
    END as renewal_status
FROM rental_contracts rc
JOIN units u ON rc.unit_id = u.unit_id
JOIN properties p ON u.property_id = p.property_id
JOIN tenants t1 ON rc.tenant_id = t1.tenant_id
LEFT JOIN tenants t2 ON rc.second_tenant_id = t2.tenant_id
WHERE rc.contract_status = 'active'
ORDER BY p.property_code, u.unit_number;

CREATE OR REPLACE VIEW contracts_by_status AS
SELECT 
    contract_status,
    COUNT(*) as contract_count,
    SUM(monthly_rent) as total_monthly_rent,
    AVG(monthly_rent) as avg_monthly_rent,
    MIN(start_date) as earliest_start,
    MAX(end_date) as latest_end
FROM rental_contracts
GROUP BY contract_status
ORDER BY 
    CASE contract_status 
        WHEN 'upcoming' THEN 1
        WHEN 'active' THEN 2  
        WHEN 'terminated' THEN 3
        WHEN 'expired' THEN 4
    END;

-- =====================================================
-- 007 - Expense Categories & Types (Normalized REMS)
-- Real Estate Management System
-- Purpose: Hierarchical expense classification system
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS expense_types CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS expense_categories_id_seq;
CREATE SEQUENCE IF NOT EXISTS expense_types_id_seq;

-- =====================================================
-- EXPENSE CATEGORIES TABLE (Major Classifications)
-- =====================================================

CREATE TABLE "rems"."expense_categories" (
    "category_id" int4 NOT NULL DEFAULT nextval('expense_categories_id_seq'::regclass),
    "category_name" varchar(100) NOT NULL UNIQUE,
    "category_description" text,
    "category_code" varchar(10) UNIQUE,
    "is_tax_deductible" boolean DEFAULT true,
    "is_active" boolean DEFAULT true,
    "display_order" int4 DEFAULT 0,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("category_id")
);

-- =====================================================
-- EXPENSE TYPES TABLE (Detailed Classifications)
-- =====================================================

CREATE TABLE "rems"."expense_types" (
    "type_id" int4 NOT NULL DEFAULT nextval('expense_types_id_seq'::regclass),
    "category_id" int4 NOT NULL,
    "type_name" varchar(100) NOT NULL,
    "type_description" text,
    "type_code" varchar(15),
    "estimated_cost_range_min" numeric(10,2),
    "estimated_cost_range_max" numeric(10,2),
    "frequency" varchar(20) DEFAULT 'as_needed',
    "is_emergency" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "display_order" int4 DEFAULT 0,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("type_id")
);

-- Add foreign key constraint
ALTER TABLE expense_types 
    ADD CONSTRAINT fk_expense_types_category 
    FOREIGN KEY (category_id) REFERENCES expense_categories(category_id) ON DELETE CASCADE;

-- Add constraints for expense categories
ALTER TABLE expense_categories 
    ADD CONSTRAINT chk_display_order_categories 
    CHECK (display_order >= 0);

-- Add constraints for expense types  
ALTER TABLE expense_types 
    ADD CONSTRAINT chk_frequency 
    CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'as_needed', 'emergency'));

ALTER TABLE expense_types 
    ADD CONSTRAINT chk_cost_range 
    CHECK (estimated_cost_range_min IS NULL OR estimated_cost_range_max IS NULL OR estimated_cost_range_max >= estimated_cost_range_min);

ALTER TABLE expense_types 
    ADD CONSTRAINT chk_display_order_types 
    CHECK (display_order >= 0);

-- Unique constraint for type name within category
ALTER TABLE expense_types 
    ADD CONSTRAINT unique_type_per_category 
    UNIQUE (category_id, type_name);

-- Create indexes for performance
CREATE INDEX idx_expense_categories_active ON rems.expense_categories USING btree (is_active);
CREATE INDEX idx_expense_categories_code ON rems.expense_categories USING btree (category_code);
CREATE INDEX idx_expense_categories_order ON rems.expense_categories USING btree (display_order);

CREATE INDEX idx_expense_types_category ON rems.expense_types USING btree (category_id);
CREATE INDEX idx_expense_types_active ON rems.expense_types USING btree (is_active);
CREATE INDEX idx_expense_types_emergency ON rems.expense_types USING btree (is_emergency);
CREATE INDEX idx_expense_types_frequency ON rems.expense_types USING btree (frequency);

-- Create trigger functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_expense_categories_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_expense_types_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_expense_categories_timestamp
    BEFORE UPDATE ON expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_categories_timestamp();

CREATE TRIGGER trigger_update_expense_types_timestamp
    BEFORE UPDATE ON expense_types
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_types_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."expense_categories" IS 'Major expense classifications for financial reporting and chart analysis';
COMMENT ON COLUMN "rems"."expense_categories"."category_name" IS 'Category name (CapEx, OpEx, Utilities, etc.)';
COMMENT ON COLUMN "rems"."expense_categories"."category_code" IS 'Short code for reports (CAPX, OPEX, UTIL, etc.)';
COMMENT ON COLUMN "rems"."expense_categories"."is_tax_deductible" IS 'Whether expenses in this category are typically tax deductible';
COMMENT ON COLUMN "rems"."expense_categories"."display_order" IS 'Order for displaying in charts and reports';

COMMENT ON TABLE "rems"."expense_types" IS 'Detailed expense types within categories for granular tracking';
COMMENT ON COLUMN "rems"."expense_types"."type_name" IS 'Specific expense type (Window repair, repainting, etc.)';
COMMENT ON COLUMN "rems"."expense_types"."frequency" IS 'How often this expense typically occurs';
COMMENT ON COLUMN "rems"."expense_types"."is_emergency" IS 'Whether this is typically an emergency/urgent expense';
COMMENT ON COLUMN "rems"."expense_types"."estimated_cost_range_min" IS 'Typical minimum cost for budgeting';
COMMENT ON COLUMN "rems"."expense_types"."estimated_cost_range_max" IS 'Typical maximum cost for budgeting';

-- =====================================================
-- CREATE HELPFUL VIEWS
-- =====================================================

-- View for expense hierarchy
CREATE OR REPLACE VIEW expense_hierarchy AS
SELECT 
    ec.category_id,
    ec.category_name,
    ec.category_code,
    ec.is_tax_deductible,
    COUNT(et.type_id) as type_count,
    AVG((et.estimated_cost_range_min + et.estimated_cost_range_max) / 2) as avg_estimated_cost,
    COUNT(CASE WHEN et.is_emergency = true THEN 1 END) as emergency_types_count
FROM expense_categories ec
LEFT JOIN expense_types et ON ec.category_id = et.category_id AND et.is_active = true
WHERE ec.is_active = true
GROUP BY ec.category_id, ec.category_name, ec.category_code, ec.is_tax_deductible
ORDER BY ec.display_order;

-- View for emergency expense types
CREATE OR REPLACE VIEW emergency_expense_types AS
SELECT 
    ec.category_name,
    et.type_name,
    et.type_code,
    et.estimated_cost_range_min,
    et.estimated_cost_range_max,
    et.type_description
FROM expense_types et
JOIN expense_categories ec ON et.category_id = ec.category_id
WHERE et.is_emergency = true AND et.is_active = true
ORDER BY ec.category_name, et.type_name;

-- View for budgeting (monthly recurring expenses)
CREATE OR REPLACE VIEW monthly_expense_budget AS
SELECT 
    ec.category_name,
    et.type_name,
    et.estimated_cost_range_min,
    et.estimated_cost_range_max,
    (et.estimated_cost_range_min + et.estimated_cost_range_max) / 2 as avg_monthly_cost
FROM expense_types et
JOIN expense_categories ec ON et.category_id = ec.category_id
WHERE et.frequency = 'monthly' AND et.is_active = true
ORDER BY avg_monthly_cost DESC;

-- =====================================================
-- 008 - Vendors Table (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Vendor/contractor management for maintenance and services
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS vendors CASCADE;

-- Create sequence for vendors
CREATE SEQUENCE IF NOT EXISTS vendors_id_seq;

-- Create the normalized vendors table
CREATE TABLE "rems"."vendors" (
    "vendor_id" int4 NOT NULL DEFAULT nextval('vendors_id_seq'::regclass),
    "vendor_name" text NOT NULL,
    "vendor_type" varchar(50) NOT NULL DEFAULT 'contractor',
    "contact_person" varchar(100),
    "phone_primary" varchar(20),
    "phone_secondary" varchar(20),
    "mobile" varchar(20),
    "email" varchar(100),
    "address" text,
    "national_id" varchar(50),
    "commercial_registration" varchar(50),
    "tax_number" varchar(50),
    "specialization" text,
    "rating" numeric(2,1) DEFAULT 0,
    "total_jobs_completed" int4 DEFAULT 0,
    "payment_terms" varchar(50) DEFAULT 'net_30',
    "preferred_payment_method" varchar(30) DEFAULT 'bank_transfer',
    "emergency_available" boolean DEFAULT false,
    "service_areas" text,
    "is_active" boolean DEFAULT true,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("vendor_id")
);

-- Add constraints
ALTER TABLE vendors ADD CONSTRAINT chk_vendor_type 
    CHECK (vendor_type IN ('contractor', 'supplier', 'service_provider', 'utility_company', 'professional_service', 'maintenance_company', 'cleaning_service', 'security_service', 'other'));

ALTER TABLE vendors ADD CONSTRAINT chk_payment_terms 
    CHECK (payment_terms IN ('immediate', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60', 'advance_payment', 'cash_on_delivery', 'custom'));

ALTER TABLE vendors ADD CONSTRAINT chk_preferred_payment_method 
    CHECK (preferred_payment_method IN ('cash', 'check', 'bank_transfer', 'knet', 'credit_card', 'mobile_payment', 'other'));

ALTER TABLE vendors ADD CONSTRAINT chk_rating_range 
    CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE vendors ADD CONSTRAINT chk_positive_jobs 
    CHECK (total_jobs_completed >= 0);

-- Unique constraints
ALTER TABLE vendors ADD CONSTRAINT unique_vendor_email 
    UNIQUE (email);

ALTER TABLE vendors ADD CONSTRAINT unique_commercial_registration 
    UNIQUE (commercial_registration);

-- Create indexes for performance
CREATE INDEX idx_vendors_type ON rems.vendors USING btree (vendor_type);
CREATE INDEX idx_vendors_specialization ON rems.vendors USING btree (specialization);
CREATE INDEX idx_vendors_rating ON rems.vendors USING btree (rating);
CREATE INDEX idx_vendors_emergency ON rems.vendors USING btree (emergency_available);
CREATE INDEX idx_vendors_active ON rems.vendors USING btree (is_active);
CREATE INDEX idx_vendors_payment_terms ON rems.vendors USING btree (payment_terms);
CREATE INDEX idx_vendors_service_areas ON rems.vendors USING gin (to_tsvector('english', service_areas));

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_vendors_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_vendors_timestamp
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendors_timestamp();

-- Add table and column comments
COMMENT ON TABLE "rems"."vendors" IS 'Vendor and contractor management for maintenance, services, and supplies';
COMMENT ON COLUMN "rems"."vendors"."vendor_name" IS 'Company or individual vendor name';
COMMENT ON COLUMN "rems"."vendors"."vendor_type" IS 'contractor, supplier, service_provider, utility_company, etc.';
COMMENT ON COLUMN "rems"."vendors"."contact_person" IS 'Primary contact person name';
COMMENT ON COLUMN "rems"."vendors"."commercial_registration" IS 'Business license or commercial registration number';
COMMENT ON COLUMN "rems"."vendors"."tax_number" IS 'Tax identification number';
COMMENT ON COLUMN "rems"."vendors"."specialization" IS 'Areas of expertise (plumbing, electrical, HVAC, etc.)';
COMMENT ON COLUMN "rems"."vendors"."rating" IS 'Performance rating from 0 to 5 stars';
COMMENT ON COLUMN "rems"."vendors"."total_jobs_completed" IS 'Total number of completed jobs for tracking';
COMMENT ON COLUMN "rems"."vendors"."payment_terms" IS 'Payment terms (net_30, immediate, advance_payment, etc.)';
COMMENT ON COLUMN "rems"."vendors"."emergency_available" IS 'Whether vendor is available for emergency calls';
COMMENT ON COLUMN "rems"."vendors"."service_areas" IS 'Geographic areas where vendor provides services';

-- Create helpful views for vendor management
CREATE OR REPLACE VIEW active_vendors_by_type AS
SELECT 
    vendor_type,
    COUNT(*) as vendor_count,
    ROUND(AVG(rating), 1) as avg_rating,
    COUNT(CASE WHEN emergency_available = true THEN 1 END) as emergency_available_count,
    STRING_AGG(vendor_name, '; ' ORDER BY rating DESC) as top_vendors
FROM vendors 
WHERE is_active = true
GROUP BY vendor_type
ORDER BY vendor_count DESC;

CREATE OR REPLACE VIEW emergency_vendors AS
SELECT 
    vendor_id,
    vendor_name,
    vendor_type,
    specialization,
    contact_person,
    mobile,
    rating,
    service_areas
FROM vendors 
WHERE emergency_available = true AND is_active = true
ORDER BY rating DESC, vendor_type;

CREATE OR REPLACE VIEW vendor_performance_summary AS
SELECT 
    vendor_id,
    vendor_name,
    vendor_type,
    rating,
    total_jobs_completed,
    CASE 
        WHEN rating >= 4.5 THEN 'Excellent'
        WHEN rating >= 4.0 THEN 'Very Good'
        WHEN rating >= 3.5 THEN 'Good'
        WHEN rating >= 3.0 THEN 'Average'
        ELSE 'Below Average'
    END as performance_category,
    emergency_available,
    payment_terms,
    preferred_payment_method
FROM vendors 
WHERE is_active = true
ORDER BY rating DESC, total_jobs_completed DESC;

-- =====================================================
-- 009 - Maintenance Orders (Normalized REMS Structure)
-- Real Estate Management System
-- Purpose: Maintenance workflow supporting both tenant and owner requests
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS maintenance_orders CASCADE;

-- Create sequence for maintenance orders
CREATE SEQUENCE IF NOT EXISTS maintenance_orders_id_seq;

-- Create the normalized maintenance orders table
CREATE TABLE "rems"."maintenance_orders" (
    "maintenance_order_id" int4 NOT NULL DEFAULT nextval('maintenance_orders_id_seq'::regclass),
    "order_number" varchar(50) UNIQUE,
    "unit_id" int4,
    "property_id" int4,
    "tenant_id" int4,
    "owner_id" int4,
    "requestor_type" varchar(20) NOT NULL,
    "vendor_id" int4,
    "expense_type_id" int4 NOT NULL,
    "title" varchar(200) NOT NULL,
    "description" text NOT NULL,
    "priority" varchar(20) DEFAULT 'medium',
    "status" varchar(30) DEFAULT 'submitted',
    "requested_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_date" timestamp,
    "scheduled_date" timestamp,
    "started_date" timestamp,
    "completed_date" timestamp,
    "estimated_cost" numeric(10,2),
    "actual_cost" numeric(10,2),
    "estimated_duration_hours" int4,
    "actual_duration_hours" int4,
    "tenant_rating" numeric(2,1),
    "owner_rating" numeric(2,1),
    "vendor_notes" text,
    "admin_notes" text,
    "internal_notes" text,
    "photos_before" text,
    "photos_after" text,
    "requires_approval" boolean DEFAULT false,
    "approved_by" int4,
    "approved_date" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("maintenance_order_id")
);

-- Add foreign key constraints
ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_unit 
    FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_property 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_tenant 
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE SET NULL;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_owner 
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE SET NULL;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE SET NULL;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_expense_type 
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(type_id) ON DELETE RESTRICT;

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT fk_maintenance_approved_by 
    FOREIGN KEY (approved_by) REFERENCES owners(owner_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_requestor_type 
    CHECK (requestor_type IN ('tenant', 'owner', 'admin', 'system'));

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_priority 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'emergency'));

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_status 
    CHECK (status IN ('submitted', 'acknowledged', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold'));

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_requestor_logic 
    CHECK (
        (requestor_type = 'tenant' AND tenant_id IS NOT NULL) OR
        (requestor_type = 'owner' AND owner_id IS NOT NULL) OR
        (requestor_type IN ('admin', 'system'))
    );

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_unit_or_property 
    CHECK (unit_id IS NOT NULL OR property_id IS NOT NULL);

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_cost_range 
    CHECK (estimated_cost IS NULL OR estimated_cost >= 0);

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_actual_cost 
    CHECK (actual_cost IS NULL OR actual_cost >= 0);

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_duration_hours 
    CHECK (estimated_duration_hours IS NULL OR estimated_duration_hours > 0);

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_tenant_rating 
    CHECK (tenant_rating IS NULL OR (tenant_rating >= 1 AND tenant_rating <= 5));

ALTER TABLE maintenance_orders 
    ADD CONSTRAINT chk_owner_rating 
    CHECK (owner_rating IS NULL OR (owner_rating >= 1 AND owner_rating <= 5));

-- Create indexes for performance
CREATE INDEX idx_maintenance_unit ON rems.maintenance_orders USING btree (unit_id);
CREATE INDEX idx_maintenance_property ON rems.maintenance_orders USING btree (property_id);
CREATE INDEX idx_maintenance_tenant ON rems.maintenance_orders USING btree (tenant_id);
CREATE INDEX idx_maintenance_owner ON rems.maintenance_orders USING btree (owner_id);
CREATE INDEX idx_maintenance_vendor ON rems.maintenance_orders USING btree (vendor_id);
CREATE INDEX idx_maintenance_requestor_type ON rems.maintenance_orders USING btree (requestor_type);
CREATE INDEX idx_maintenance_status ON rems.maintenance_orders USING btree (status);
CREATE INDEX idx_maintenance_priority ON rems.maintenance_orders USING btree (priority);
CREATE INDEX idx_maintenance_dates ON rems.maintenance_orders USING btree (requested_date, scheduled_date, completed_date);
CREATE INDEX idx_maintenance_expense_type ON rems.maintenance_orders USING btree (expense_type_id);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_maintenance_orders_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_maintenance_orders_timestamp
    BEFORE UPDATE ON maintenance_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_maintenance_orders_timestamp();

-- Create function to auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_maintenance_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'MO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
                           LPAD(nextval('maintenance_orders_id_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating order numbers
CREATE TRIGGER trigger_generate_maintenance_order_number
    BEFORE INSERT ON maintenance_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_maintenance_order_number();

-- Add table and column comments
COMMENT ON TABLE "rems"."maintenance_orders" IS 'Maintenance workflow supporting both tenant and owner initiated requests';
COMMENT ON COLUMN "rems"."maintenance_orders"."order_number" IS 'Auto-generated unique order identifier (MO-YYYY-######)';
COMMENT ON COLUMN "rems"."maintenance_orders"."unit_id" IS 'Specific unit (for unit-level issues)';
COMMENT ON COLUMN "rems"."maintenance_orders"."property_id" IS 'Property (for property-wide issues)';
COMMENT ON COLUMN "rems"."maintenance_orders"."tenant_id" IS 'Tenant who requested (if requestor_type = tenant)';
COMMENT ON COLUMN "rems"."maintenance_orders"."owner_id" IS 'Owner who requested (if requestor_type = owner)';
COMMENT ON COLUMN "rems"."maintenance_orders"."requestor_type" IS 'Who initiated: tenant, owner, admin, system';
COMMENT ON COLUMN "rems"."maintenance_orders"."vendor_id" IS 'Assigned vendor/contractor';
COMMENT ON COLUMN "rems"."maintenance_orders"."priority" IS 'low, medium, high, urgent, emergency';
COMMENT ON COLUMN "rems"."maintenance_orders"."status" IS 'Current workflow status';
COMMENT ON COLUMN "rems"."maintenance_orders"."tenant_rating" IS 'Tenant satisfaction rating (1-5 stars)';
COMMENT ON COLUMN "rems"."maintenance_orders"."owner_rating" IS 'Owner satisfaction rating (1-5 stars)';
COMMENT ON COLUMN "rems"."maintenance_orders"."photos_before" IS 'Photo URLs/paths before work (JSON array)';
COMMENT ON COLUMN "rems"."maintenance_orders"."photos_after" IS 'Photo URLs/paths after completion (JSON array)';

-- Create helpful views for maintenance management
CREATE OR REPLACE VIEW active_maintenance_orders AS
SELECT 
    mo.maintenance_order_id,
    mo.order_number,
    mo.title,
    mo.requestor_type,
    CASE 
        WHEN mo.requestor_type = 'tenant' THEN t.full_name
        WHEN mo.requestor_type = 'owner' THEN o.full_name
        ELSE 'System/Admin'
    END as requestor_name,
    p.property_code,
    u.unit_number,
    et.type_name as expense_type,
    v.vendor_name,
    mo.priority,
    mo.status,
    mo.estimated_cost,
    mo.requested_date,
    mo.scheduled_date
FROM maintenance_orders mo
LEFT JOIN tenants t ON mo.tenant_id = t.tenant_id
LEFT JOIN owners o ON mo.owner_id = o.owner_id
LEFT JOIN properties p ON mo.property_id = p.property_id
LEFT JOIN units u ON mo.unit_id = u.unit_id
LEFT JOIN expense_types et ON mo.expense_type_id = et.type_id
LEFT JOIN vendors v ON mo.vendor_id = v.vendor_id
WHERE mo.status NOT IN ('completed', 'cancelled')
ORDER BY 
    CASE mo.priority 
        WHEN 'emergency' THEN 1
        WHEN 'urgent' THEN 2
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 4
        WHEN 'low' THEN 5
    END,
    mo.requested_date;

CREATE OR REPLACE VIEW maintenance_orders_by_requestor AS
SELECT 
    requestor_type,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status IN ('submitted', 'acknowledged', 'approved', 'scheduled', 'in_progress') THEN 1 END) as active_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
    AVG(actual_cost) as avg_cost,
    AVG(CASE WHEN tenant_rating IS NOT NULL THEN tenant_rating END) as avg_tenant_rating,
    AVG(CASE WHEN owner_rating IS NOT NULL THEN owner_rating END) as avg_owner_rating
FROM maintenance_orders
GROUP BY requestor_type
ORDER BY total_orders DESC;

CREATE OR REPLACE VIEW maintenance_orders_requiring_approval AS
SELECT 
    mo.order_number,
    mo.title,
    mo.requestor_type,
    CASE 
        WHEN mo.requestor_type = 'tenant' THEN t.full_name
        WHEN mo.requestor_type = 'owner' THEN o.full_name
        ELSE 'System/Admin'
    END as requestor_name,
    p.property_code,
    u.unit_number,
    mo.estimated_cost,
    mo.priority,
    mo.requested_date,
    CURRENT_TIMESTAMP - mo.requested_date as pending_duration
FROM maintenance_orders mo
LEFT JOIN tenants t ON mo.tenant_id = t.tenant_id
LEFT JOIN owners o ON mo.owner_id = o.owner_id
LEFT JOIN properties p ON mo.property_id = p.property_id
LEFT JOIN units u ON mo.unit_id = u.unit_id
WHERE mo.requires_approval = true 
  AND mo.status = 'submitted'
  AND mo.approved_date IS NULL
ORDER BY mo.requested_date;

-- =====================================================
-- 010 - Invoices Table (Pure Polymorphic + Template Ready)
-- Real Estate Management System
-- Purpose: Universal invoice system with recurring support and future template capability
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS invoices CASCADE;

-- Create sequence for invoices
CREATE SEQUENCE IF NOT EXISTS invoices_id_seq;

-- Create the polymorphic invoices table
CREATE TABLE "rems"."invoices" (
    "invoice_id" int4 NOT NULL DEFAULT nextval('invoices_id_seq'::regclass),
    "invoice_number" varchar(50) UNIQUE,
    "template_id" int4,
    "invoice_type" varchar(30) NOT NULL,
    "entity_id" int4 NOT NULL,
    "entity_type" varchar(30) NOT NULL,
    "issue_date" date NOT NULL DEFAULT CURRENT_DATE,
    "due_date" date NOT NULL,
    "total_amount" numeric(12,2) NOT NULL,
    "currency" varchar(5) DEFAULT 'KWD',
    "invoice_status" varchar(20) DEFAULT 'draft',
    "payment_terms" varchar(50) DEFAULT 'net_30',
    "is_recurring" boolean DEFAULT false,
    "recurring_frequency" varchar(20),
    "parent_invoice_id" int4,
    "next_generation_date" date,
    "auto_generate" boolean DEFAULT false,
    "tax_amount" numeric(10,2) DEFAULT 0,
    "discount_amount" numeric(10,2) DEFAULT 0,
    "late_fee_amount" numeric(10,2) DEFAULT 0,
    "description" text,
    "terms_conditions" text,
    "notes" text,
    "sent_date" date,
    "created_by" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("invoice_id")
);

-- Add foreign key constraints (template_id will reference future templates table)
ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_parent 
    FOREIGN KEY (parent_invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL;

ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_created_by 
    FOREIGN KEY (created_by) REFERENCES owners(owner_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE invoices 
    ADD CONSTRAINT chk_invoice_type 
    CHECK (invoice_type IN ('rental', 'expense', 'deposit', 'refund', 'late_fee', 'maintenance', 'utility', 'management_fee', 'other'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_entity_type 
    CHECK (entity_type IN ('rental_contract', 'property_expense', 'unit_expense', 'maintenance_order', 'owner_expense', 'vendor_payment'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_invoice_status 
    CHECK (invoice_status IN ('draft', 'sent', 'viewed', 'paid', 'partial_paid', 'overdue', 'cancelled', 'refunded'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_currency 
    CHECK (currency IN ('KWD', 'USD', 'EUR', 'GBP', 'SAR', 'AED'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_payment_terms 
    CHECK (payment_terms IN ('immediate', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60', 'advance_payment', 'custom'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_recurring_frequency 
    CHECK (recurring_frequency IS NULL OR recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'semi_annually', 'annually'));

ALTER TABLE invoices 
    ADD CONSTRAINT chk_due_date_logic 
    CHECK (due_date >= issue_date);

ALTER TABLE invoices 
    ADD CONSTRAINT chk_positive_amounts 
    CHECK (total_amount > 0 AND tax_amount >= 0 AND discount_amount >= 0 AND late_fee_amount >= 0);

ALTER TABLE invoices 
    ADD CONSTRAINT chk_recurring_logic 
    CHECK (
        (is_recurring = false) OR 
        (is_recurring = true AND recurring_frequency IS NOT NULL AND parent_invoice_id IS NULL) OR
        (parent_invoice_id IS NOT NULL)
    );

-- Create indexes for performance
CREATE UNIQUE INDEX idx_invoices_number ON rems.invoices USING btree (invoice_number);
CREATE INDEX idx_invoices_entity ON rems.invoices USING btree (entity_type, entity_id);
CREATE INDEX idx_invoices_status ON rems.invoices USING btree (invoice_status);
CREATE INDEX idx_invoices_type ON rems.invoices USING btree (invoice_type);
CREATE INDEX idx_invoices_dates ON rems.invoices USING btree (issue_date, due_date);
CREATE INDEX idx_invoices_recurring ON rems.invoices USING btree (is_recurring, next_generation_date);
CREATE INDEX idx_invoices_parent ON rems.invoices USING btree (parent_invoice_id);
CREATE INDEX idx_invoices_template ON rems.invoices USING btree (template_id);
CREATE INDEX idx_invoices_overdue ON rems.invoices USING btree (due_date, invoice_status) WHERE invoice_status IN ('sent', 'viewed', 'partial_paid');

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_invoices_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_invoices_timestamp
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_timestamp();

-- Create function to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY-MM') || '-' || 
                             LPAD(nextval('invoices_id_seq')::text, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating invoice numbers
CREATE TRIGGER trigger_generate_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Add table and column comments
COMMENT ON TABLE "rems"."invoices" IS 'Universal polymorphic invoice system with recurring support and future template capability';
COMMENT ON COLUMN "rems"."invoices"."invoice_number" IS 'Auto-generated unique invoice identifier (INV-YYYY-MM-#####)';
COMMENT ON COLUMN "rems"."invoices"."template_id" IS 'Future template reference (NULL = no template used)';
COMMENT ON COLUMN "rems"."invoices"."entity_id" IS 'Polymorphic foreign key - references different tables based on entity_type';
COMMENT ON COLUMN "rems"."invoices"."entity_type" IS 'Determines what entity_id refers to (rental_contract, maintenance_order, etc.)';
COMMENT ON COLUMN "rems"."invoices"."is_recurring" IS 'Whether this invoice is part of a recurring series';
COMMENT ON COLUMN "rems"."invoices"."parent_invoice_id" IS 'References template invoice for recurring series';
COMMENT ON COLUMN "rems"."invoices"."next_generation_date" IS 'When to generate the next recurring invoice';
COMMENT ON COLUMN "rems"."invoices"."auto_generate" IS 'Whether system should automatically create next invoice';

-- Create helpful views for invoice management
CREATE OR REPLACE VIEW active_invoices AS
SELECT 
    i.invoice_id,
    i.invoice_number,
    i.invoice_type,
    i.entity_type,
    CASE 
        WHEN i.entity_type = 'rental_contract' THEN 
            p.property_code || '-' || u.unit_number || ' (' || t.full_name || ')'
        WHEN i.entity_type = 'maintenance_order' THEN 
            'MO: ' || mo.title
        WHEN i.entity_type = 'property_expense' THEN 
            'Property: ' || p2.property_code
        WHEN i.entity_type = 'unit_expense' THEN 
            p3.property_code || '-' || u2.unit_number
        WHEN i.entity_type = 'owner_expense' THEN 
            'Owner: ' || o.full_name
        ELSE 'Other'
    END as entity_description,
    i.total_amount,
    i.invoice_status,
    i.issue_date,
    i.due_date,
    CASE 
        WHEN i.due_date < CURRENT_DATE AND i.invoice_status IN ('sent', 'viewed', 'partial_paid') THEN 'OVERDUE'
        WHEN i.due_date - CURRENT_DATE <= 7 AND i.invoice_status IN ('sent', 'viewed', 'partial_paid') THEN 'DUE_SOON'
        ELSE 'NORMAL'
    END as urgency_status
FROM invoices i
LEFT JOIN rental_contracts rc ON i.entity_type = 'rental_contract' AND i.entity_id = rc.contract_id
LEFT JOIN units u ON rc.unit_id = u.unit_id
LEFT JOIN properties p ON u.property_id = p.property_id
LEFT JOIN tenants t ON rc.tenant_id = t.tenant_id
LEFT JOIN maintenance_orders mo ON i.entity_type = 'maintenance_order' AND i.entity_id = mo.maintenance_order_id
LEFT JOIN properties p2 ON i.entity_type = 'property_expense' AND i.entity_id = p2.property_id
LEFT JOIN units u2 ON i.entity_type = 'unit_expense' AND i.entity_id = u2.unit_id
LEFT JOIN properties p3 ON u2.property_id = p3.property_id
LEFT JOIN owners o ON i.entity_type = 'owner_expense' AND i.entity_id = o.owner_id
WHERE i.invoice_status NOT IN ('paid', 'cancelled', 'refunded')
ORDER BY 
    CASE 
        WHEN i.due_date < CURRENT_DATE THEN 1
        WHEN i.due_date - CURRENT_DATE <= 7 THEN 2
        ELSE 3
    END,
    i.due_date;

CREATE OR REPLACE VIEW recurring_invoices_due AS
SELECT 
    i.invoice_id,
    i.invoice_number,
    i.entity_type,
    i.recurring_frequency,
    i.next_generation_date,
    i.total_amount,
    i.description
FROM invoices i
WHERE i.is_recurring = true 
  AND i.auto_generate = true
  AND i.next_generation_date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY i.next_generation_date;

CREATE OR REPLACE VIEW invoice_summary_by_type AS
SELECT 
    invoice_type,
    entity_type,
    COUNT(*) as invoice_count,
    SUM(total_amount) as total_amount,
    AVG(total_amount) as avg_amount,
    COUNT(CASE WHEN invoice_status = 'paid' THEN 1 END) as paid_count,
    COUNT(CASE WHEN invoice_status IN ('sent', 'viewed', 'partial_paid') AND due_date < CURRENT_DATE THEN 1 END) as overdue_count
FROM invoices
GROUP BY invoice_type, entity_type
ORDER BY total_amount DESC;

-- =====================================================
-- 011 - Receipts Table (Enhanced Payment Details + Template Ready)
-- Real Estate Management System
-- Purpose: Payment documentation with detailed payment gateway integration
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS receipts CASCADE;

-- Create sequence for receipts
CREATE SEQUENCE IF NOT EXISTS receipts_id_seq;

-- Create the enhanced receipts table
CREATE TABLE "rems"."receipts" (
    "receipt_id" int4 NOT NULL DEFAULT nextval('receipts_id_seq'::regclass),
    "receipt_number" varchar(50) UNIQUE,
    "template_id" int4,
    "invoice_id" int4,
    "payment_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_received" numeric(12,2) NOT NULL,
    "currency" varchar(5) DEFAULT 'KWD',
    "payment_method" varchar(30) NOT NULL,
    "payment_provider" varchar(50),
    "payment_type" varchar(30),
    "external_transaction_id" varchar(100),
    "provider_fee_amount" numeric(10,2) DEFAULT 0,
    "exchange_rate" numeric(10,6) DEFAULT 1.000000,
    "bank_reference" varchar(50),
    "check_number" varchar(30),
    "payment_status" varchar(20) DEFAULT 'completed',
    "payment_description" text,
    "payer_name" varchar(100),
    "payer_contact" varchar(50),
    "received_by" int4,
    "location_received" varchar(100),
    "verification_code" varchar(20),
    "receipt_type" varchar(20) DEFAULT 'payment',
    "refund_reason" text,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("receipt_id")
);

-- Add foreign key constraints
ALTER TABLE receipts 
    ADD CONSTRAINT fk_receipts_invoice 
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL;

ALTER TABLE receipts 
    ADD CONSTRAINT fk_receipts_received_by 
    FOREIGN KEY (received_by) REFERENCES owners(owner_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE receipts 
    ADD CONSTRAINT chk_payment_method 
    CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'knet', 'credit_card', 'debit_card', 'mobile_payment', 'online_payment', 'wire_transfer', 'other'));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_payment_provider 
    CHECK (payment_provider IS NULL OR payment_provider IN (
        'NBK', 'CBK', 'KFH', 'Gulf_Bank', 'Warba_Bank', 'Boubyan_Bank', 'KAMCO', 
        'Myfatoorah', 'UPayments', 'Western_Union', 'MoneyGram', 'PayPal', 
        'Visa', 'Mastercard', 'AMEX', 'KNET', 'manual', 'other'
    ));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_payment_type 
    CHECK (payment_type IS NULL OR payment_type IN (
        'knet', 'visa', 'mastercard', 'amex', 'discover', 'cash', 'wire', 'check', 
        'ach', 'mobile_wallet', 'bank_transfer', 'other'
    ));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_payment_status 
    CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'disputed'));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_receipt_type 
    CHECK (receipt_type IN ('payment', 'refund', 'partial_payment', 'advance_payment', 'deposit', 'adjustment'));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_currency 
    CHECK (currency IN ('KWD', 'USD', 'EUR', 'GBP', 'SAR', 'AED'));

ALTER TABLE receipts 
    ADD CONSTRAINT chk_positive_amounts 
    CHECK (amount_received > 0 AND provider_fee_amount >= 0);

ALTER TABLE receipts 
    ADD CONSTRAINT chk_exchange_rate 
    CHECK (exchange_rate > 0);

-- Create indexes for performance
CREATE UNIQUE INDEX idx_receipts_number ON rems.receipts USING btree (receipt_number);
CREATE INDEX idx_receipts_invoice ON rems.receipts USING btree (invoice_id);
CREATE INDEX idx_receipts_payment_date ON rems.receipts USING btree (payment_date);
CREATE INDEX idx_receipts_payment_method ON rems.receipts USING btree (payment_method);
CREATE INDEX idx_receipts_payment_provider ON rems.receipts USING btree (payment_provider);
CREATE INDEX idx_receipts_payment_status ON rems.receipts USING btree (payment_status);
CREATE INDEX idx_receipts_external_transaction ON rems.receipts USING btree (external_transaction_id);
CREATE INDEX idx_receipts_template ON rems.receipts USING btree (template_id);
CREATE INDEX idx_receipts_type ON rems.receipts USING btree (receipt_type);
CREATE INDEX idx_receipts_received_by ON rems.receipts USING btree (received_by);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_receipts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_receipts_timestamp
    BEFORE UPDATE ON receipts
    FOR EACH ROW
    EXECUTE FUNCTION update_receipts_timestamp();

-- Create function to auto-generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.receipt_number IS NULL THEN
        NEW.receipt_number := 'RCP-' || TO_CHAR(CURRENT_DATE, 'YYYY-MM') || '-' || 
                             LPAD(nextval('receipts_id_seq')::text, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating receipt numbers
CREATE TRIGGER trigger_generate_receipt_number
    BEFORE INSERT ON receipts
    FOR EACH ROW
    EXECUTE FUNCTION generate_receipt_number();

-- Add table and column comments
COMMENT ON TABLE "rems"."receipts" IS 'Payment documentation with enhanced payment gateway integration and template support';
COMMENT ON COLUMN "rems"."receipts"."receipt_number" IS 'Auto-generated unique receipt identifier (RCP-YYYY-MM-#####)';
COMMENT ON COLUMN "rems"."receipts"."template_id" IS 'Future receipt template reference (NULL = no template used)';
COMMENT ON COLUMN "rems"."receipts"."invoice_id" IS 'Related invoice (nullable for direct payments)';
COMMENT ON COLUMN "rems"."receipts"."payment_method" IS 'How payment was made (cash, knet, bank_transfer, etc.)';
COMMENT ON COLUMN "rems"."receipts"."payment_provider" IS 'Payment gateway or bank (NBK, Myfatoorah, KNET, etc.)';
COMMENT ON COLUMN "rems"."receipts"."payment_type" IS 'Specific payment instrument (visa, mastercard, knet, cash, etc.)';
COMMENT ON COLUMN "rems"."receipts"."external_transaction_id" IS 'Payment gateway transaction reference';
COMMENT ON COLUMN "rems"."receipts"."provider_fee_amount" IS 'Fee charged by payment provider';
COMMENT ON COLUMN "rems"."receipts"."exchange_rate" IS 'Currency conversion rate if different from KWD';
COMMENT ON COLUMN "rems"."receipts"."verification_code" IS 'Internal verification or approval code';
COMMENT ON COLUMN "rems"."receipts"."receipt_type" IS 'payment, refund, partial_payment, advance_payment, etc.';
COMMENT ON COLUMN "rems"."receipts"."location_received" IS 'Where payment was received (office, bank, online, etc.)';

-- Create helpful views for payment analytics
CREATE OR REPLACE VIEW payment_method_analysis AS
SELECT 
    payment_method,
    payment_provider,
    COUNT(*) as transaction_count,
    SUM(amount_received) as total_amount,
    AVG(amount_received) as avg_amount,
    SUM(provider_fee_amount) as total_fees,
    AVG(provider_fee_amount) as avg_fee,
    ROUND(AVG(provider_fee_amount * 100.0 / NULLIF(amount_received, 0)), 2) as avg_fee_percentage,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
    ROUND(COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 1) as success_rate
FROM receipts
GROUP BY payment_method, payment_provider
ORDER BY total_amount DESC;

CREATE OR REPLACE VIEW daily_payment_summary AS
SELECT 
    DATE(payment_date) as payment_day,
    COUNT(*) as transaction_count,
    SUM(amount_received) as daily_total,
    COUNT(DISTINCT payment_method) as payment_methods_used,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as successful_payments,
    STRING_AGG(DISTINCT payment_provider, ', ') as providers_used
FROM receipts
WHERE payment_status = 'completed'
GROUP BY DATE(payment_date)
ORDER BY payment_day DESC;

CREATE OR REPLACE VIEW payment_provider_performance AS
SELECT 
    payment_provider,
    COUNT(*) as total_transactions,
    SUM(amount_received) as total_volume,
    SUM(provider_fee_amount) as total_fees_charged,
    AVG(provider_fee_amount * 100.0 / NULLIF(amount_received, 0)) as avg_fee_rate,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as successful_count,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_count,
    ROUND(COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 1) as success_rate,
    MIN(payment_date) as first_transaction,
    MAX(payment_date) as latest_transaction
FROM receipts
WHERE payment_provider IS NOT NULL
GROUP BY payment_provider
ORDER BY total_volume DESC;

CREATE OR REPLACE VIEW invoice_payment_status AS
SELECT 
    i.invoice_id,
    i.invoice_number,
    i.invoice_type,
    i.total_amount as invoice_amount,
    COALESCE(SUM(r.amount_received), 0) as amount_paid,
    i.total_amount - COALESCE(SUM(r.amount_received), 0) as amount_outstanding,
    CASE 
        WHEN COALESCE(SUM(r.amount_received), 0) = 0 THEN 'UNPAID'
        WHEN COALESCE(SUM(r.amount_received), 0) >= i.total_amount THEN 'PAID'
        ELSE 'PARTIAL'
    END as payment_status,
    COUNT(r.receipt_id) as payment_count,
    STRING_AGG(r.payment_method, ', ') as payment_methods_used
FROM invoices i
LEFT JOIN receipts r ON i.invoice_id = r.invoice_id AND r.payment_status = 'completed'
GROUP BY i.invoice_id, i.invoice_number, i.invoice_type, i.total_amount
ORDER BY i.invoice_id;

-- =====================================================
-- 012 - Rental Transactions (Updated with Invoice/Receipt Links)
-- Real Estate Management System
-- Purpose: Rental transaction records linked to invoice/receipt system
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS rental_transactions CASCADE;

-- Create sequence for rental transactions
CREATE SEQUENCE IF NOT EXISTS rental_transactions_id_seq;

-- Create the updated rental transactions table
CREATE TABLE "rems"."rental_transactions" (
    "rental_transaction_id" int4 NOT NULL DEFAULT nextval('rental_transactions_id_seq'::regclass),
    "contract_id" int4 NOT NULL,
    "invoice_id" int4,
    "receipt_id" int4,
    "year" int4 NOT NULL,
    "month" int4 NOT NULL,
    "transaction_date" date NOT NULL DEFAULT CURRENT_DATE,
    "actual_rent" numeric(10,2) NOT NULL,
    "collected_amount" numeric(10,2) DEFAULT 0,
    "uncollected_amount" numeric(10,2) DEFAULT 0,
    "late_fee_amount" numeric(10,2) DEFAULT 0,
    "discount_amount" numeric(10,2) DEFAULT 0,
    "payment_status" varchar(20) DEFAULT 'pending',
    "due_date" date,
    "payment_method" varchar(30),
    "payment_reference" varchar(100),
    "currency" varchar(5) DEFAULT 'KWD',
    "exchange_rate" numeric(10,6) DEFAULT 1.000000,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("rental_transaction_id")
);

-- Add foreign key constraints
ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_contract 
    FOREIGN KEY (contract_id) REFERENCES rental_contracts(contract_id) ON DELETE CASCADE;

ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_invoice 
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL;

ALTER TABLE rental_transactions 
    ADD CONSTRAINT fk_rental_transactions_receipt 
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_year 
    CHECK (year BETWEEN 2000 AND 2100);

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_month 
    CHECK (month BETWEEN 1 AND 12);

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_payment_status 
    CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled', 'refunded'));

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_positive_amounts 
    CHECK (actual_rent > 0 AND collected_amount >= 0 AND uncollected_amount >= 0 
           AND late_fee_amount >= 0 AND discount_amount >= 0);

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_currency 
    CHECK (currency IN ('KWD', 'USD', 'EUR', 'GBP', 'SAR', 'AED'));

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_exchange_rate 
    CHECK (exchange_rate > 0);

ALTER TABLE rental_transactions 
    ADD CONSTRAINT chk_rental_collected_logic 
    CHECK (collected_amount <= (actual_rent + late_fee_amount - discount_amount));

-- Create unique constraint for contract/year/month combination
ALTER TABLE rental_transactions 
    ADD CONSTRAINT unique_rental_contract_period 
    UNIQUE (contract_id, year, month);

-- Create indexes for performance
CREATE INDEX idx_rental_transactions_contract ON rems.rental_transactions USING btree (contract_id);
CREATE INDEX idx_rental_transactions_invoice ON rems.rental_transactions USING btree (invoice_id);
CREATE INDEX idx_rental_transactions_receipt ON rems.rental_transactions USING btree (receipt_id);
CREATE INDEX idx_rental_transactions_year_month ON rems.rental_transactions USING btree (year, month);
CREATE INDEX idx_rental_transactions_payment_status ON rems.rental_transactions USING btree (payment_status);
CREATE INDEX idx_rental_transactions_date ON rems.rental_transactions USING btree (transaction_date);
CREATE INDEX idx_rental_transactions_overdue ON rems.rental_transactions USING btree (due_date, payment_status) 
    WHERE payment_status IN ('pending', 'partial', 'overdue');

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_rental_transactions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_rental_transactions_timestamp
    BEFORE UPDATE ON rental_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_rental_transactions_timestamp();

-- Create trigger to auto-calculate uncollected amount
CREATE OR REPLACE FUNCTION calculate_rental_uncollected_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-calculate uncollected amount if not explicitly set
    IF NEW.uncollected_amount = 0 AND NEW.collected_amount != (NEW.actual_rent + NEW.late_fee_amount - NEW.discount_amount) THEN
        NEW.uncollected_amount := GREATEST(0, NEW.actual_rent + NEW.late_fee_amount - NEW.discount_amount - NEW.collected_amount);
    END IF;
    
    -- Auto-set payment status based on amounts
    IF NEW.collected_amount = 0 THEN
        NEW.payment_status := 'pending';
    ELSIF NEW.collected_amount >= (NEW.actual_rent + NEW.late_fee_amount - NEW.discount_amount) THEN
        NEW.payment_status := 'paid';
    ELSE
        NEW.payment_status := 'partial';
    END IF;
    
    -- Set overdue status if past due date
    IF NEW.due_date IS NOT NULL AND NEW.due_date < CURRENT_DATE AND NEW.payment_status IN ('pending', 'partial') THEN
        NEW.payment_status := 'overdue';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-calculations
CREATE TRIGGER trigger_calculate_rental_uncollected_amount
    BEFORE INSERT OR UPDATE ON rental_transactions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_rental_uncollected_amount();

-- Add table and column comments
COMMENT ON TABLE "rems"."rental_transactions" IS 'Rental transaction records with full invoice/receipt integration and auto-calculations';
COMMENT ON COLUMN "rems"."rental_transactions"."rental_transaction_id" IS 'Unique rental transaction identifier with rental prefix';
COMMENT ON COLUMN "rems"."rental_transactions"."contract_id" IS 'Reference to rental contract';
COMMENT ON COLUMN "rems"."rental_transactions"."invoice_id" IS 'Reference to generated rental invoice';
COMMENT ON COLUMN "rems"."rental_transactions"."receipt_id" IS 'Reference to payment receipt';
COMMENT ON COLUMN "rems"."rental_transactions"."actual_rent" IS 'Expected rent amount for the period';
COMMENT ON COLUMN "rems"."rental_transactions"."collected_amount" IS 'Amount actually collected';
COMMENT ON COLUMN "rems"."rental_transactions"."uncollected_amount" IS 'Outstanding balance (auto-calculated)';
COMMENT ON COLUMN "rems"."rental_transactions"."late_fee_amount" IS 'Late payment penalties';
COMMENT ON COLUMN "rems"."rental_transactions"."discount_amount" IS 'Discounts applied to rent';
COMMENT ON COLUMN "rems"."rental_transactions"."payment_status" IS 'pending, partial, paid, overdue, cancelled, refunded (auto-calculated)';

-- Create helpful views for rental transaction management
CREATE OR REPLACE VIEW rental_transaction_summary AS
SELECT 
    rt.rental_transaction_id,
    p.property_code,
    u.unit_number,
    t.full_name as tenant_name,
    rt.year,
    rt.month,
    rt.actual_rent,
    rt.collected_amount,
    rt.uncollected_amount,
    rt.late_fee_amount,
    rt.payment_status,
    i.invoice_number,
    r.receipt_number,
    rt.transaction_date,
    rt.due_date
FROM rental_transactions rt
JOIN rental_contracts rc ON rt.contract_id = rc.contract_id
JOIN units u ON rc.unit_id = u.unit_id
JOIN properties p ON u.property_id = p.property_id
JOIN tenants t ON rc.tenant_id = t.tenant_id
LEFT JOIN invoices i ON rt.invoice_id = i.invoice_id
LEFT JOIN receipts r ON rt.receipt_id = r.receipt_id
ORDER BY rt.year DESC, rt.month DESC, p.property_code, u.unit_number;

CREATE OR REPLACE VIEW overdue_rental_transactions AS
SELECT 
    rt.rental_transaction_id,
    p.property_code || '-' || u.unit_number as unit_reference,
    t.full_name as tenant_name,
    t.mobile as tenant_contact,
    rt.year,
    rt.month,
    rt.actual_rent,
    rt.collected_amount,
    rt.uncollected_amount,
    rt.late_fee_amount,
    rt.due_date,
    CURRENT_DATE - rt.due_date as days_overdue,
    CASE 
        WHEN CURRENT_DATE - rt.due_date <= 30 THEN 'Recent'
        WHEN CURRENT_DATE - rt.due_date <= 90 THEN 'Moderate'
        WHEN CURRENT_DATE - rt.due_date <= 180 THEN 'High Risk'
        ELSE 'Critical'
    END as risk_category
FROM rental_transactions rt
JOIN rental_contracts rc ON rt.contract_id = rc.contract_id
JOIN units u ON rc.unit_id = u.unit_id
JOIN properties p ON u.property_id = p.property_id
JOIN tenants t ON rc.tenant_id = t.tenant_id
WHERE rt.payment_status IN ('overdue', 'partial') 
  AND rt.uncollected_amount > 0
ORDER BY rt.due_date, rt.uncollected_amount DESC;

CREATE OR REPLACE VIEW monthly_rental_income_summary AS
SELECT 
    rt.year,
    rt.month,
    COUNT(*) as transaction_count,
    SUM(rt.actual_rent) as total_rent_due,
    SUM(rt.collected_amount) as total_collected,
    SUM(rt.uncollected_amount) as total_outstanding,
    SUM(rt.late_fee_amount) as total_late_fees,
    CASE 
        WHEN SUM(rt.actual_rent + rt.late_fee_amount) > 0 THEN
            ROUND(SUM(rt.collected_amount) * 100.0 / SUM(rt.actual_rent + rt.late_fee_amount), 2)
        ELSE 0 
    END as collection_rate,
    COUNT(CASE WHEN rt.payment_status = 'paid' THEN 1 END) as paid_transactions,
    COUNT(CASE WHEN rt.payment_status IN ('overdue', 'partial') THEN 1 END) as problem_transactions
FROM rental_transactions rt
GROUP BY rt.year, rt.month
ORDER BY rt.year DESC, rt.month DESC;

CREATE OR REPLACE VIEW rental_payment_analysis AS
SELECT 
    payment_method,
    COUNT(*) as transaction_count,
    SUM(collected_amount) as total_amount,
    AVG(collected_amount) as avg_amount,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as successful_payments,
    ROUND(COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) * 100.0 / COUNT(*), 1) as success_rate
FROM rental_transactions
WHERE payment_method IS NOT NULL
GROUP BY payment_method
ORDER BY total_amount DESC;

-- =====================================================
-- 013 - Expense Transactions (Updated with Invoice/Receipt Links)
-- Real Estate Management System  
-- Purpose: Expense transaction records linked to invoice/receipt system
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS expense_transactions CASCADE;

-- Create sequence for expense transactions
CREATE SEQUENCE IF NOT EXISTS expense_transactions_id_seq;

-- Create the updated expense transactions table
CREATE TABLE "rems"."expense_transactions" (
    "expense_transaction_id" int4 NOT NULL DEFAULT nextval('expense_transactions_id_seq'::regclass),
    "property_id" int4 NOT NULL,
    "expense_category_id" int4 NOT NULL,
    "expense_type_id" int4 NOT NULL,
    "vendor_id" int4,
    "maintenance_order_id" int4,
    "invoice_id" int4,
    "receipt_id" int4,
    "expense_date" date NOT NULL DEFAULT CURRENT_DATE,
    "amount" numeric(12,2) NOT NULL,
    "currency" varchar(5) DEFAULT 'KWD',
    "exchange_rate" numeric(10,6) DEFAULT 1.000000,
    "description" text NOT NULL,
    "payment_status" varchar(20) DEFAULT 'pending',
    "approval_required" boolean DEFAULT false,
    "approved_by" int4,
    "approved_date" timestamp,
    "payment_method" varchar(30),
    "payment_reference" varchar(100),
    "tax_amount" numeric(10,2) DEFAULT 0,
    "discount_amount" numeric(10,2) DEFAULT 0,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("expense_transaction_id")
);

-- Add foreign key constraints
ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_property 
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_category 
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(category_id) ON DELETE RESTRICT;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_type 
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(type_id) ON DELETE RESTRICT;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE SET NULL;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_maintenance_order 
    FOREIGN KEY (maintenance_order_id) REFERENCES maintenance_orders(maintenance_order_id) ON DELETE SET NULL;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_invoice 
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_receipt 
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id) ON DELETE SET NULL;

ALTER TABLE expense_transactions 
    ADD CONSTRAINT fk_expense_transactions_approved_by 
    FOREIGN KEY (approved_by) REFERENCES owners(owner_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE expense_transactions 
    ADD CONSTRAINT chk_expense_payment_status 
    CHECK (payment_status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled', 'refunded'));

ALTER TABLE expense_transactions 
    ADD CONSTRAINT chk_expense_currency 
    CHECK (currency IN ('KWD', 'USD', 'EUR', 'GBP', 'SAR', 'AED'));

ALTER TABLE expense_transactions 
    ADD CONSTRAINT chk_expense_positive_amounts 
    CHECK (amount > 0 AND tax_amount >= 0 AND discount_amount >= 0);

ALTER TABLE expense_transactions 
    ADD CONSTRAINT chk_expense_exchange_rate 
    CHECK (exchange_rate > 0);

ALTER TABLE expense_transactions 
    ADD CONSTRAINT chk_expense_approval_logic 
    CHECK (
        (approval_required = false) OR 
        (approval_required = true AND approved_by IS NULL AND payment_status IN ('pending', 'rejected')) OR
        (approval_required = true AND approved_by IS NOT NULL AND approved_date IS NOT NULL)
    );

-- Create indexes for performance
CREATE INDEX idx_expense_transactions_property ON rems.expense_transactions USING btree (property_id);
CREATE INDEX idx_expense_transactions_category ON rems.expense_transactions USING btree (expense_category_id);
CREATE INDEX idx_expense_transactions_type ON rems.expense_transactions USING btree (expense_type_id);
CREATE INDEX idx_expense_transactions_vendor ON rems.expense_transactions USING btree (vendor_id);
CREATE INDEX idx_expense_transactions_maintenance_order ON rems.expense_transactions USING btree (maintenance_order_id);
CREATE INDEX idx_expense_transactions_invoice ON rems.expense_transactions USING btree (invoice_id);
CREATE INDEX idx_expense_transactions_receipt ON rems.expense_transactions USING btree (receipt_id);
CREATE INDEX idx_expense_transactions_payment_status ON rems.expense_transactions USING btree (payment_status);
CREATE INDEX idx_expense_transactions_date ON rems.expense_transactions USING btree (expense_date);
CREATE INDEX idx_expense_transactions_approval ON rems.expense_transactions USING btree (approval_required, approved_by);
CREATE INDEX idx_expense_transactions_amount ON rems.expense_transactions USING btree (amount);

-- Create trigger function for auto-updating timestamp
CREATE OR REPLACE FUNCTION update_expense_transactions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update the updated_at timestamp
CREATE TRIGGER trigger_update_expense_transactions_timestamp
    BEFORE UPDATE ON expense_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_transactions_timestamp();

-- Create trigger for approval workflow
CREATE OR REPLACE FUNCTION expense_approval_workflow()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-approve small expenses or specific categories
    IF NEW.approval_required = false OR NEW.amount <= 100.00 THEN
        NEW.payment_status := 'approved';
    END IF;
    
    -- Set approved date when approval is granted
    IF NEW.approved_by IS NOT NULL AND OLD.approved_by IS NULL THEN
        NEW.approved_date := CURRENT_TIMESTAMP;
        NEW.payment_status := 'approved';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for approval workflow
CREATE TRIGGER trigger_expense_approval_workflow
    BEFORE INSERT OR UPDATE ON expense_transactions
    FOR EACH ROW
    EXECUTE FUNCTION expense_approval_workflow();

-- Add table and column comments
COMMENT ON TABLE "rems"."expense_transactions" IS 'Expense transaction records with full invoice/receipt integration and approval workflow';
COMMENT ON COLUMN "rems"."expense_transactions"."expense_transaction_id" IS 'Unique expense transaction identifier with expense prefix';
COMMENT ON COLUMN "rems"."expense_transactions"."property_id" IS 'Property where expense occurred';
COMMENT ON COLUMN "rems"."expense_transactions"."vendor_id" IS 'Vendor who provided service/product';
COMMENT ON COLUMN "rems"."expense_transactions"."maintenance_order_id" IS 'Related maintenance order (if applicable)';
COMMENT ON COLUMN "rems"."expense_transactions"."invoice_id" IS 'Generated or received invoice';
COMMENT ON COLUMN "rems"."expense_transactions"."receipt_id" IS 'Payment receipt';
COMMENT ON COLUMN "rems"."expense_transactions"."amount" IS 'Total expense amount';
COMMENT ON COLUMN "rems"."expense_transactions"."payment_status" IS 'pending, approved, paid, rejected, cancelled, refunded';
COMMENT ON COLUMN "rems"."expense_transactions"."approval_required" IS 'Whether expense requires owner approval';
COMMENT ON COLUMN "rems"."expense_transactions"."approved_by" IS 'Owner who approved the expense';

-- Create helpful views for expense transaction management
CREATE OR REPLACE VIEW expense_transaction_summary AS
SELECT 
    et.expense_transaction_id,
    p.property_code,
    ec.category_name,
    etp.type_name,
    v.vendor_name,
    et.expense_date,
    et.amount,
    et.payment_status,
    et.approval_required,
    CASE WHEN et.approved_by IS NOT NULL THEN o.full_name ELSE NULL END as approved_by_name,
    i.invoice_number,
    r.receipt_number,
    et.description
FROM expense_transactions et
JOIN properties p ON et.property_id = p.property_id
JOIN expense_categories ec ON et.expense_category_id = ec.category_id
JOIN expense_types etp ON et.expense_type_id = etp.type_id
LEFT JOIN vendors v ON et.vendor_id = v.vendor_id
LEFT JOIN owners o ON et.approved_by = o.owner_id
LEFT JOIN invoices i ON et.invoice_id = i.invoice_id
LEFT JOIN receipts r ON et.receipt_id = r.receipt_id
ORDER BY et.expense_date DESC;

CREATE OR REPLACE VIEW expenses_requiring_approval AS
SELECT 
    et.expense_transaction_id,
    p.property_code,
    ec.category_name,
    etp.type_name,
    et.amount,
    et.description,
    et.expense_date,
    CURRENT_DATE - et.expense_date as days_pending,
    CASE 
        WHEN CURRENT_DATE - et.expense_date <= 3 THEN 'Recent'
        WHEN CURRENT_DATE - et.expense_date <= 7 THEN 'Needs Attention'
        ELSE 'Urgent'
    END as urgency
FROM expense_transactions et
JOIN properties p ON et.property_id = p.property_id
JOIN expense_categories ec ON et.expense_category_id = ec.category_id
JOIN expense_types etp ON et.expense_type_id = etp.type_id
WHERE et.approval_required = true 
  AND et.payment_status = 'pending'
  AND et.approved_by IS NULL
ORDER BY et.expense_date;

CREATE OR REPLACE VIEW monthly_expense_summary AS
SELECT 
    DATE_TRUNC('month', et.expense_date) as expense_month,
    ec.category_name,
    COUNT(*) as transaction_count,
    SUM(et.amount) as total_amount,
    AVG(et.amount) as avg_amount,
    COUNT(CASE WHEN et.payment_status = 'paid' THEN 1 END) as paid_count,
    COUNT(CASE WHEN et.approval_required = true THEN 1 END) as required_approval_count
FROM expense_transactions et
JOIN expense_categories ec ON et.expense_category_id = ec.category_id
GROUP BY DATE_TRUNC('month', et.expense_date), ec.category_name, ec.category_id
ORDER BY expense_month DESC, ec.category_name;

CREATE OR REPLACE VIEW vendor_expense_analysis AS
SELECT 
    v.vendor_name,
    v.vendor_type,
    COUNT(*) as transaction_count,
    SUM(et.amount) as total_spent,
    AVG(et.amount) as avg_transaction,
    COUNT(CASE WHEN et.payment_status = 'paid' THEN 1 END) as paid_transactions,
    MIN(et.expense_date) as first_transaction,
    MAX(et.expense_date) as latest_transaction,
    STRING_AGG(DISTINCT ec.category_name, ', ') as expense_categories
FROM expense_transactions et
JOIN vendors v ON et.vendor_id = v.vendor_id
JOIN expense_categories ec ON et.expense_category_id = ec.category_id
GROUP BY v.vendor_id, v.vendor_name, v.vendor_type
ORDER BY total_spent DESC;

CREATE OR REPLACE VIEW maintenance_expense_correlation AS
SELECT 
    mo.maintenance_order_id,
    mo.order_number,
    mo.title,
    mo.estimated_cost,
    et.amount as actual_cost,
    et.amount - mo.estimated_cost as cost_variance,
    ROUND((et.amount - mo.estimated_cost) * 100.0 / NULLIF(mo.estimated_cost, 0), 1) as variance_percentage,
    mo.status as maintenance_status,
    et.payment_status as payment_status,
    v.vendor_name
FROM maintenance_orders mo
JOIN expense_transactions et ON mo.maintenance_order_id = et.maintenance_order_id
LEFT JOIN vendors v ON et.vendor_id = v.vendor_id
ORDER BY ABS(et.amount - mo.estimated_cost) DESC;

-- =====================================================
-- 014 - Users & Authentication Module (REMS Phase 2)
-- Real Estate Management System
-- Purpose: User management with polymorphic entity relationships
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_sessions_id_seq;
CREATE SEQUENCE IF NOT EXISTS password_resets_id_seq;

-- =====================================================
-- USERS TABLE (Core Authentication)
-- =====================================================

CREATE TABLE "rems"."users" (
    "user_id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(50) NOT NULL UNIQUE,
    "email" varchar(100) NOT NULL UNIQUE,
    "password_hash" varchar(255) NOT NULL,
    "user_type" varchar(20) NOT NULL DEFAULT 'tenant',
    "related_entity_id" int4,
    "related_entity_type" varchar(20),
    "preferred_language" varchar(5) DEFAULT 'en',
    "timezone" varchar(50) DEFAULT 'Asia/Kuwait',
    "is_active" boolean DEFAULT true,
    "email_verified" boolean DEFAULT false,
    "email_verified_at" timestamp,
    "last_login" timestamp,
    "login_attempts" int4 DEFAULT 0,
    "locked_until" timestamp,
    "permissions" jsonb DEFAULT '{}',
    "settings" jsonb DEFAULT '{}',
    "profile_image" varchar(255),
    "phone" varchar(20),
    "two_factor_enabled" boolean DEFAULT false,
    "two_factor_secret" varchar(32),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id")
);

-- =====================================================
-- USER SESSIONS TABLE (Session Management)
-- =====================================================

CREATE TABLE "rems"."user_sessions" (
    "session_id" varchar(128) NOT NULL,
    "user_id" int4 NOT NULL,
    "ip_address" inet,
    "user_agent" text,
    "device_info" jsonb,
    "login_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "logout_time" timestamp,
    "last_activity" timestamp DEFAULT CURRENT_TIMESTAMP,
    "is_active" boolean DEFAULT true,
    "expires_at" timestamp NOT NULL,
    "remember_token" varchar(100),
    "location_info" jsonb,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("session_id")
);

-- =====================================================
-- PASSWORD RESETS TABLE (Password Recovery)
-- =====================================================

CREATE TABLE "rems"."password_resets" (
    "reset_id" int4 NOT NULL DEFAULT nextval('password_resets_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "token" varchar(255) NOT NULL UNIQUE,
    "ip_address" inet,
    "user_agent" text,
    "expires_at" timestamp NOT NULL,
    "used_at" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("reset_id")
);

-- =====================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Note: We cannot use traditional FK constraints for polymorphic relationships
-- Instead, we use triggers for validation (see validate_user_entity_relationship function below)
ALTER TABLE user_sessions 
    ADD CONSTRAINT fk_user_sessions_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE password_resets 
    ADD CONSTRAINT fk_password_resets_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- =====================================================
-- ADD BUSINESS LOGIC CONSTRAINTS
-- =====================================================

-- Users constraints
ALTER TABLE users 
    ADD CONSTRAINT chk_user_type 
    CHECK (user_type IN ('admin', 'accountant', 'owner', 'tenant', 'vendor', 'maintenance_staff'));

ALTER TABLE users 
    ADD CONSTRAINT chk_related_entity_type 
    CHECK (related_entity_type IS NULL OR related_entity_type IN ('owner', 'tenant', 'vendor'));

ALTER TABLE users 
    ADD CONSTRAINT chk_entity_relationship_logic 
    CHECK (
        (user_type = 'admin' AND related_entity_id IS NULL) OR
        (user_type = 'accountant' AND related_entity_id IS NULL) OR
        (user_type = 'maintenance_staff' AND related_entity_id IS NULL) OR
        (user_type = 'owner' AND related_entity_type = 'owner' AND related_entity_id IS NOT NULL) OR
        (user_type = 'tenant' AND related_entity_type = 'tenant' AND related_entity_id IS NOT NULL) OR
        (user_type = 'vendor' AND related_entity_type = 'vendor' AND related_entity_id IS NOT NULL)
    );

ALTER TABLE users 
    ADD CONSTRAINT chk_preferred_language 
    CHECK (preferred_language IN ('en', 'ar', 'both'));

ALTER TABLE users 
    ADD CONSTRAINT chk_login_attempts 
    CHECK (login_attempts >= 0 AND login_attempts <= 10);

-- Session constraints
ALTER TABLE user_sessions 
    ADD CONSTRAINT chk_session_times 
    CHECK (logout_time IS NULL OR logout_time >= login_time);

ALTER TABLE user_sessions 
    ADD CONSTRAINT chk_expires_at 
    CHECK (expires_at > login_time);

-- Password reset constraints
ALTER TABLE password_resets 
    ADD CONSTRAINT chk_reset_expires 
    CHECK (expires_at > created_at);

ALTER TABLE password_resets 
    ADD CONSTRAINT chk_reset_used_logic 
    CHECK (used_at IS NULL OR used_at >= created_at);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE UNIQUE INDEX idx_users_username ON rems.users USING btree (username);
CREATE UNIQUE INDEX idx_users_email ON rems.users USING btree (email);
CREATE INDEX idx_users_type ON rems.users USING btree (user_type);
CREATE INDEX idx_users_related_entity ON rems.users USING btree (related_entity_type, related_entity_id);
CREATE INDEX idx_users_active ON rems.users USING btree (is_active);
CREATE INDEX idx_users_last_login ON rems.users USING btree (last_login);
CREATE INDEX idx_users_locked ON rems.users USING btree (locked_until) WHERE locked_until IS NOT NULL;

-- Sessions indexes
CREATE INDEX idx_user_sessions_user ON rems.user_sessions USING btree (user_id);
CREATE INDEX idx_user_sessions_active ON rems.user_sessions USING btree (is_active, expires_at);
CREATE INDEX idx_user_sessions_activity ON rems.user_sessions USING btree (last_activity);
CREATE INDEX idx_user_sessions_ip ON rems.user_sessions USING btree (ip_address);

-- Password resets indexes
CREATE INDEX idx_password_resets_user ON rems.password_resets USING btree (user_id);
CREATE INDEX idx_password_resets_token ON rems.password_resets USING btree (token);
CREATE INDEX idx_password_resets_expires ON rems.password_resets USING btree (expires_at);
CREATE INDEX idx_password_resets_unused ON rems.password_resets USING btree (expires_at) WHERE used_at IS NULL;

-- =====================================================
-- CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update last activity for sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate polymorphic entity relationships
CREATE OR REPLACE FUNCTION validate_user_entity_relationship()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate entity exists based on type
    IF NEW.related_entity_type = 'owner' THEN
        IF NOT EXISTS (SELECT 1 FROM owners WHERE owner_id = NEW.related_entity_id) THEN
            RAISE EXCEPTION 'Referenced owner does not exist';
        END IF;
    ELSIF NEW.related_entity_type = 'tenant' THEN
        IF NOT EXISTS (SELECT 1 FROM tenants WHERE tenant_id = NEW.related_entity_id) THEN
            RAISE EXCEPTION 'Referenced tenant does not exist';
        END IF;
    ELSIF NEW.related_entity_type = 'vendor' THEN
        IF NOT EXISTS (SELECT 1 FROM vendors WHERE vendor_id = NEW.related_entity_id) THEN
            RAISE EXCEPTION 'Referenced vendor does not exist';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Account lockout management
CREATE OR REPLACE FUNCTION manage_account_lockout()
RETURNS TRIGGER AS $$
BEGIN
    -- Lock account after 5 failed attempts for 30 minutes
    IF NEW.login_attempts >= 5 AND OLD.login_attempts < 5 THEN
        NEW.locked_until = CURRENT_TIMESTAMP + INTERVAL '30 minutes';
    END IF;
    
    -- Unlock account if lockout period expired
    IF NEW.locked_until IS NOT NULL AND NEW.locked_until < CURRENT_TIMESTAMP THEN
        NEW.locked_until = NULL;
        NEW.login_attempts = 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

CREATE TRIGGER trigger_update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_timestamp();

CREATE TRIGGER trigger_update_session_activity
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();

CREATE TRIGGER trigger_validate_user_entity_relationship
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_entity_relationship();

CREATE TRIGGER trigger_manage_account_lockout
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION manage_account_lockout();

-- =====================================================
-- ADD TABLE AND COLUMN COMMENTS
-- =====================================================

COMMENT ON TABLE "rems"."users" IS 'Core user authentication with polymorphic entity relationships';
COMMENT ON COLUMN "rems"."users"."username" IS 'Unique username for login';
COMMENT ON COLUMN "rems"."users"."user_type" IS 'admin, accountant, owner, tenant, vendor, maintenance_staff';
COMMENT ON COLUMN "rems"."users"."related_entity_id" IS 'Polymorphic FK to owner_id, tenant_id, or vendor_id';
COMMENT ON COLUMN "rems"."users"."related_entity_type" IS 'Determines what related_entity_id references';
COMMENT ON COLUMN "rems"."users"."permissions" IS 'JSON object containing role-based permissions';
COMMENT ON COLUMN "rems"."users"."settings" IS 'JSON object for user preferences and configuration';
COMMENT ON COLUMN "rems"."users"."login_attempts" IS 'Failed login attempt counter for security';
COMMENT ON COLUMN "rems"."users"."locked_until" IS 'Account lock expiration time';

COMMENT ON TABLE "rems"."user_sessions" IS 'Active user sessions for security and analytics';
COMMENT ON COLUMN "rems"."user_sessions"."session_id" IS 'Unique session identifier (UUID recommended)';
COMMENT ON COLUMN "rems"."user_sessions"."device_info" IS 'JSON containing device/browser information';
COMMENT ON COLUMN "rems"."user_sessions"."location_info" IS 'JSON containing geolocation data if available';

COMMENT ON TABLE "rems"."password_resets" IS 'Password reset tokens for secure recovery process';
COMMENT ON COLUMN "rems"."password_resets"."token" IS 'Secure random token for password reset verification';

-- =====================================================
-- CREATE HELPFUL VIEWS
-- =====================================================

-- Active users with entity information
CREATE OR REPLACE VIEW active_users_summary AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.user_type,
    u.related_entity_type,
    CASE 
        WHEN u.related_entity_type = 'owner' THEN o.full_name
        WHEN u.related_entity_type = 'tenant' THEN t.full_name
        WHEN u.related_entity_type = 'vendor' THEN v.vendor_name
        ELSE 'System User'
    END as entity_name,
    u.preferred_language,
    u.last_login,
    u.is_active,
    u.email_verified,
    CASE WHEN u.locked_until > CURRENT_TIMESTAMP THEN true ELSE false END as is_locked
FROM users u
LEFT JOIN owners o ON u.related_entity_type = 'owner' AND u.related_entity_id = o.owner_id
LEFT JOIN tenants t ON u.related_entity_type = 'tenant' AND u.related_entity_id = t.tenant_id  
LEFT JOIN vendors v ON u.related_entity_type = 'vendor' AND u.related_entity_id = v.vendor_id
WHERE u.is_active = true
ORDER BY u.user_type, u.username;

-- User session analytics
CREATE OR REPLACE VIEW user_session_analytics AS
SELECT 
    u.username,
    u.user_type,
    COUNT(s.session_id) as active_sessions,
    MAX(s.last_activity) as latest_activity,
    STRING_AGG(DISTINCT s.device_info->>'device', ', ') as devices_used,
    STRING_AGG(DISTINCT HOST(s.ip_address), ', ') as ip_addresses
FROM users u
LEFT JOIN user_sessions s ON u.user_id = s.user_id AND s.is_active = true
GROUP BY u.user_id, u.username, u.user_type
ORDER BY active_sessions DESC, latest_activity DESC;

-- User permissions summary
CREATE OR REPLACE VIEW user_permissions_summary AS
SELECT 
    u.user_id,
    u.username,
    u.user_type,
    u.permissions,
    CASE 
        WHEN u.permissions ? 'system_admin' THEN 'System Administrator'
        WHEN u.permissions ? 'financial_access' THEN 'Financial Access'
        WHEN u.permissions ? 'can_approve_maintenance' THEN 'Maintenance Approval'
        WHEN u.permissions ? 'can_view_assigned_orders' THEN 'Vendor Access'
        ELSE 'Standard User'
    END as access_level,
    u.is_active,
    u.created_at
FROM users u
ORDER BY u.user_type, u.username;

-- =====================================================
-- 015 - System Configuration Module (REMS Phase 2) - FIXED
-- Real Estate Management System
-- Purpose: System settings, currencies, templates, and notifications
-- Database: rems, Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing if recreating
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS currencies CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS system_settings_id_seq;
CREATE SEQUENCE IF NOT EXISTS currencies_id_seq;
CREATE SEQUENCE IF NOT EXISTS email_templates_id_seq;
CREATE SEQUENCE IF NOT EXISTS notifications_id_seq;

-- =====================================================
-- SYSTEM SETTINGS TABLE (Core Configuration)
-- =====================================================

CREATE TABLE "rems"."system_settings" (
    "setting_id" int4 NOT NULL DEFAULT nextval('system_settings_id_seq'::regclass),
    "setting_key" varchar(100) NOT NULL UNIQUE,
    "setting_value" text,
    "setting_type" varchar(20) NOT NULL DEFAULT 'string',
    "category" varchar(50) NOT NULL DEFAULT 'general',
    "description" text,
    "is_public" boolean DEFAULT false,
    "requires_restart" boolean DEFAULT false,
    "validation_rule" text,
    "default_value" text,
    "updated_by" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("setting_id")
);

-- =====================================================
-- CURRENCIES TABLE (Multi-currency Support)
-- =====================================================

CREATE TABLE "rems"."currencies" (
    "currency_id" int4 NOT NULL DEFAULT nextval('currencies_id_seq'::regclass),
    "currency_code" varchar(5) NOT NULL UNIQUE,
    "currency_name" varchar(100) NOT NULL,
    "currency_symbol" varchar(10),
    "exchange_rate_to_base" numeric(12,6) NOT NULL DEFAULT 1.000000,
    "is_base_currency" boolean DEFAULT false,
    "decimal_places" int4 DEFAULT 3,
    "is_active" boolean DEFAULT true,
    "last_rate_update" timestamp,
    "rate_source" varchar(50),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("currency_id")
);

-- =====================================================
-- EMAIL TEMPLATES TABLE (Communication Templates)
-- =====================================================

CREATE TABLE "rems"."email_templates" (
    "template_id" int4 NOT NULL DEFAULT nextval('email_templates_id_seq'::regclass),
    "template_name" varchar(100) NOT NULL,
    "template_type" varchar(50) NOT NULL,
    "subject" varchar(255) NOT NULL,
    "body_html" text,
    "body_text" text,
    "variables" jsonb DEFAULT '[]',
    "language" varchar(5) DEFAULT 'en',
    "is_active" boolean DEFAULT true,
    "is_system_template" boolean DEFAULT false,
    "category" varchar(50),
    "description" text,
    "created_by" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("template_id")
);

-- =====================================================
-- NOTIFICATIONS TABLE (System Notifications)
-- =====================================================

CREATE TABLE "rems"."notifications" (
    "notification_id" int4 NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "type" varchar(50) NOT NULL,
    "title" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "data" jsonb DEFAULT '{}',
    "is_read" boolean DEFAULT false,
    "read_at" timestamp,
    "expires_at" timestamp,
    "priority" varchar(20) DEFAULT 'normal',
    "action_url" varchar(500),
    "action_text" varchar(100),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("notification_id")
);

-- =====================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

ALTER TABLE system_settings 
    ADD CONSTRAINT fk_system_settings_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE email_templates 
    ADD CONSTRAINT fk_email_templates_created_by 
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- =====================================================
-- ADD BUSINESS LOGIC CONSTRAINTS
-- =====================================================

-- System settings constraints
ALTER TABLE system_settings 
    ADD CONSTRAINT chk_setting_type 
    CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array', 'email', 'url', 'password'));

ALTER TABLE system_settings 
    ADD CONSTRAINT chk_setting_category 
    CHECK (category IN ('general', 'email', 'payment', 'maintenance', 'security', 'appearance', 'localization', 'api', 'backup'));

-- Currencies constraints
ALTER TABLE currencies 
    ADD CONSTRAINT chk_currency_code_format 
    CHECK (currency_code ~ '^[A-Z]{3}$');

ALTER TABLE currencies 
    ADD CONSTRAINT chk_positive_exchange_rate 
    CHECK (exchange_rate_to_base > 0);

ALTER TABLE currencies 
    ADD CONSTRAINT chk_decimal_places 
    CHECK (decimal_places >= 0 AND decimal_places <= 8);

-- Email templates constraints
ALTER TABLE email_templates 
    ADD CONSTRAINT chk_template_type 
    CHECK (template_type IN ('welcome', 'password_reset', 'invoice', 'receipt', 'maintenance_request', 
                            'maintenance_completed', 'payment_reminder', 'lease_expiry', 'system_alert', 'custom'));

ALTER TABLE email_templates 
    ADD CONSTRAINT chk_template_language 
    CHECK (language IN ('en', 'ar', 'both'));

ALTER TABLE email_templates 
    ADD CONSTRAINT chk_template_category 
    CHECK (category IS NULL OR category IN ('authentication', 'financial', 'maintenance', 'leasing', 'system', 'marketing'));

-- Notifications constraints
ALTER TABLE notifications 
    ADD CONSTRAINT chk_notification_type 
    CHECK (type IN ('info', 'warning', 'error', 'success', 'maintenance', 'payment', 'system', 'reminder'));

ALTER TABLE notifications 
    ADD CONSTRAINT chk_notification_priority 
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE notifications 
    ADD CONSTRAINT chk_expires_logic 
    CHECK (expires_at IS NULL OR expires_at > created_at);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- System settings indexes
CREATE UNIQUE INDEX idx_system_settings_key ON rems.system_settings USING btree (setting_key);
CREATE INDEX idx_system_settings_category ON rems.system_settings USING btree (category);
CREATE INDEX idx_system_settings_type ON rems.system_settings USING btree (setting_type);
CREATE INDEX idx_system_settings_public ON rems.system_settings USING btree (is_public);

-- Currencies indexes
CREATE UNIQUE INDEX idx_currencies_code ON rems.currencies USING btree (currency_code);
CREATE INDEX idx_currencies_active ON rems.currencies USING btree (is_active);
CREATE INDEX idx_currencies_base ON rems.currencies USING btree (is_base_currency);
CREATE INDEX idx_currencies_rate_update ON rems.currencies USING btree (last_rate_update);

-- Email templates indexes
CREATE INDEX idx_email_templates_type ON rems.email_templates USING btree (template_type);
CREATE INDEX idx_email_templates_language ON rems.email_templates USING btree (language);
CREATE INDEX idx_email_templates_active ON rems.email_templates USING btree (is_active);
CREATE INDEX idx_email_templates_category ON rems.email_templates USING btree (category);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON rems.notifications USING btree (user_id);
CREATE INDEX idx_notifications_type ON rems.notifications USING btree (type);
CREATE INDEX idx_notifications_read ON rems.notifications USING btree (is_read, created_at);
CREATE INDEX idx_notifications_priority ON rems.notifications USING btree (priority, created_at);
CREATE INDEX idx_notifications_expires ON rems.notifications USING btree (expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Auto-update timestamp functions
CREATE OR REPLACE FUNCTION update_system_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_currencies_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_email_templates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure only one base currency
CREATE OR REPLACE FUNCTION ensure_single_base_currency()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_base_currency = true THEN
        UPDATE currencies SET is_base_currency = false 
        WHERE currency_id != NEW.currency_id AND is_base_currency = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate setting values based on type (COMPLETELY FIXED)
CREATE OR REPLACE FUNCTION validate_setting_value()
RETURNS TRIGGER AS $$
BEGIN
    -- Only validate if setting_value is not NULL
    IF NEW.setting_value IS NOT NULL THEN
        CASE NEW.setting_type
            WHEN 'boolean' THEN
                IF NEW.setting_value NOT IN ('true', 'false', '1', '0') THEN
                    RAISE EXCEPTION 'Boolean setting must be true/false or 1/0';
                END IF;
            WHEN 'number' THEN
                IF NOT (NEW.setting_value ~ '^-?[0-9]+\.?[0-9]*$' OR NEW.setting_value ~ '^-?[0-9]*\.[0-9]+$') THEN
                    RAISE EXCEPTION 'Number setting must be a valid number';
                END IF;
            WHEN 'email' THEN
                IF NOT (NEW.setting_value ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
                    RAISE EXCEPTION 'Email setting must be a valid email address';
                END IF;
            WHEN 'url' THEN
                IF NOT (NEW.setting_value ~ '^https?://') THEN
                    RAISE EXCEPTION 'URL setting must start with http:// or https://';
                END IF;
            WHEN 'json' THEN
                BEGIN
                    PERFORM NEW.setting_value::json;
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE EXCEPTION 'JSON setting must be valid JSON';
                END;
            WHEN 'array' THEN
                BEGIN
                    PERFORM NEW.setting_value::json;
                    IF jsonb_typeof(NEW.setting_value::jsonb) != 'array' THEN
                        RAISE EXCEPTION 'Array setting must be a valid JSON array';
                    END IF;
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE EXCEPTION 'Array setting must be a valid JSON array';
                END;
            ELSE
                -- Handle string, password, and any other types
                -- No validation needed for these types
                NULL;
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

CREATE TRIGGER trigger_update_system_settings_timestamp
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_timestamp();

CREATE TRIGGER trigger_update_currencies_timestamp
    BEFORE UPDATE ON currencies
    FOR EACH ROW
    EXECUTE FUNCTION update_currencies_timestamp();

CREATE TRIGGER trigger_update_email_templates_timestamp
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_email_templates_timestamp();

CREATE TRIGGER trigger_ensure_single_base_currency
    BEFORE INSERT OR UPDATE ON currencies
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_base_currency();

CREATE TRIGGER trigger_validate_setting_value
    BEFORE INSERT OR UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION validate_setting_value();

-- =====================================================
-- ADD TABLE AND COLUMN COMMENTS
-- =====================================================

COMMENT ON TABLE "rems"."system_settings" IS 'System-wide configuration settings with validation and categories';
COMMENT ON COLUMN "rems"."system_settings"."setting_key" IS 'Unique identifier for the setting (e.g., default_currency, late_fee_percentage)';
COMMENT ON COLUMN "rems"."system_settings"."setting_type" IS 'Data type for validation: string, number, boolean, json, array, email, url, password';
COMMENT ON COLUMN "rems"."system_settings"."is_public" IS 'Whether setting can be accessed by non-admin users';
COMMENT ON COLUMN "rems"."system_settings"."requires_restart" IS 'Whether changing this setting requires system restart';

COMMENT ON TABLE "rems"."currencies" IS 'Multi-currency support with exchange rates and formatting';
COMMENT ON COLUMN "rems"."currencies"."exchange_rate_to_base" IS 'Exchange rate relative to base currency (KWD)';
COMMENT ON COLUMN "rems"."currencies"."is_base_currency" IS 'Only one currency can be base currency';
COMMENT ON COLUMN "rems"."currencies"."decimal_places" IS 'Number of decimal places for display (KWD=3, USD=2)';

COMMENT ON TABLE "rems"."email_templates" IS 'Email templates for automated communications';
COMMENT ON COLUMN "rems"."email_templates"."variables" IS 'JSON array of available template variables';
COMMENT ON COLUMN "rems"."email_templates"."is_system_template" IS 'System templates cannot be deleted';

COMMENT ON TABLE "rems"."notifications" IS 'In-app notifications for users';
COMMENT ON COLUMN "rems"."notifications"."data" IS 'JSON object containing notification-specific data';
COMMENT ON COLUMN "rems"."notifications"."action_url" IS 'Optional URL for notification action button';

-- =====================================================
-- INSERT SAMPLE DATA - SYSTEM SETTINGS
-- =====================================================

INSERT INTO system_settings (
    setting_key, setting_value, setting_type, category, description, 
    is_public, requires_restart, default_value
) VALUES 

-- General Settings
('system_name', 'REMS - Real Estate Management System', 'string', 'general', 'System display name', true, false, 'REMS'),
('system_version', '2.0.0', 'string', 'general', 'Current system version', true, false, '1.0.0'),
('system_timezone', 'Asia/Kuwait', 'string', 'general', 'Default system timezone', true, true, 'UTC'),
('default_language', 'en', 'string', 'localization', 'Default system language', true, false, 'en'),
('date_format', 'Y-m-d', 'string', 'localization', 'Date display format', true, false, 'Y-m-d'),
('time_format', 'H:i:s', 'string', 'localization', 'Time display format', true, false, 'H:i:s'),

-- Financial Settings
('default_currency', 'KWD', 'string', 'general', 'Default system currency', true, false, 'KWD'),
('late_fee_percentage', '10.0', 'number', 'payment', 'Late payment fee percentage', false, false, '5.0'),
('late_fee_grace_days', '3', 'number', 'payment', 'Grace period before late fees apply', false, false, '0'),
('management_fee_percentage', '5.0', 'number', 'payment', 'Default management fee percentage', false, false, '5.0'),
('auto_generate_invoices', 'true', 'boolean', 'payment', 'Automatically generate recurring invoices', false, false, 'true'),
('invoice_due_days', '30', 'number', 'payment', 'Default invoice due period in days', false, false, '30'),

-- Email Settings
('smtp_host', 'smtp.gmail.com', 'string', 'email', 'SMTP server hostname', false, true, ''),
('smtp_port', '587', 'number', 'email', 'SMTP server port', false, true, '587'),
('smtp_username', 'rems@company.com', 'email', 'email', 'SMTP username/email', false, true, ''),
('smtp_password', 'encrypted_password_here', 'password', 'email', 'SMTP password (encrypted)', false, true, ''),
('smtp_encryption', 'tls', 'string', 'email', 'SMTP encryption type', false, true, 'tls'),
('from_email', 'noreply@rems.local', 'email', 'email', 'Default from email address', false, false, ''),
('from_name', 'REMS System', 'string', 'email', 'Default from name', false, false, 'REMS'),

-- Maintenance Settings
('auto_assign_maintenance', 'false', 'boolean', 'maintenance', 'Auto-assign maintenance orders to vendors', false, false, 'false'),
('maintenance_approval_threshold', '500.0', 'number', 'maintenance', 'Amount requiring owner approval', false, false, '1000.0'),
('emergency_response_hours', '2', 'number', 'maintenance', 'Emergency response time in hours', true, false, '4'),
('maintenance_rating_required', 'true', 'boolean', 'maintenance', 'Require rating after maintenance completion', false, false, 'false'),

-- Security Settings
('session_timeout', '1440', 'number', 'security', 'Session timeout in minutes', false, true, '1440'),
('max_login_attempts', '5', 'number', 'security', 'Maximum failed login attempts before lockout', false, false, '3'),
('lockout_duration', '30', 'number', 'security', 'Account lockout duration in minutes', false, false, '15'),
('password_min_length', '8', 'number', 'security', 'Minimum password length', false, false, '6'),
('require_2fa', 'false', 'boolean', 'security', 'Require two-factor authentication', false, false, 'false'),

-- Appearance Settings
('default_theme', 'light', 'string', 'appearance', 'Default UI theme', true, false, 'light'),
('items_per_page', '25', 'number', 'appearance', 'Default pagination size', true, false, '20'),
('dashboard_refresh_interval', '300', 'number', 'appearance', 'Dashboard auto-refresh in seconds', true, false, '300'),

-- API Settings
('api_rate_limit', '1000', 'number', 'api', 'API requests per hour limit', false, false, '100'),
('api_timeout', '30', 'number', 'api', 'API request timeout in seconds', false, true, '30'),

-- Backup Settings
('auto_backup_enabled', 'true', 'boolean', 'backup', 'Enable automatic database backups', false, false, 'false'),
('backup_retention_days', '30', 'number', 'backup', 'Backup retention period in days', false, false, '7'),
('backup_frequency', 'daily', 'string', 'backup', 'Backup frequency', false, false, 'weekly');

-- =====================================================
-- INSERT SAMPLE DATA - CURRENCIES
-- =====================================================

INSERT INTO currencies (
    currency_code, currency_name, currency_symbol, exchange_rate_to_base, 
    is_base_currency, decimal_places, is_active, rate_source
) VALUES 
('KWD', 'Kuwaiti Dinar', 'د.ك', 1.000000, true, 3, true, 'Central Bank of Kuwait'),
('USD', 'US Dollar', '$', 0.305000, false, 2, true, 'xe.com'),
('EUR', 'Euro', '€', 0.279000, false, 2, true, 'xe.com'),
('GBP', 'British Pound', '£', 0.240000, false, 2, true, 'xe.com'),
('SAR', 'Saudi Riyal', 'ر.س', 1.145000, false, 2, true, 'SAMA'),
('AED', 'UAE Dirham', 'د.إ', 1.120000, false, 2, true, 'Central Bank of UAE'),
('QAR', 'Qatari Riyal', 'ر.ق', 1.110000, false, 2, true, 'Qatar Central Bank'),
('BHD', 'Bahraini Dinar', 'د.ب', 0.115000, false, 3, true, 'Central Bank of Bahrain'),
('OMR', 'Omani Rial', 'ر.ع', 0.117000, false, 3, true, 'Central Bank of Oman'),
('JPY', 'Japanese Yen', '¥', 45.500000, false, 0, true, 'xe.com');

-- =====================================================
-- INSERT SAMPLE DATA - EMAIL TEMPLATES
-- =====================================================

INSERT INTO email_templates (
    template_name, template_type, subject, body_html, body_text, 
    variables, language, category, description, is_system_template
) VALUES 

-- Authentication Templates
(
    'Welcome New User', 'welcome', 'Welcome to REMS - {{system_name}}',
    '<h1>Welcome to {{system_name}}</h1>
     <p>Dear {{user_name}},</p>
     <p>Your account has been created successfully. Your login details:</p>
     <ul>
       <li>Username: {{username}}</li>
       <li>Email: {{email}}</li>
     </ul>
     <p>Please login and change your password: <a href="{{login_url}}" class="btn-primary">Login Here</a></p>
     <p>Best regards,<br/>{{system_name}} Team</p>',
    'Welcome to {{system_name}}

Dear {{user_name}},

Your account has been created successfully. Your login details:
- Username: {{username}}
- Email: {{email}}

Please login and change your password: {{login_url}}

Best regards,
{{system_name}} Team',
    '["system_name", "user_name", "username", "email", "login_url"]',
    'en', 'authentication', 'Welcome email for new users', true
),

(
    'Password Reset Request', 'password_reset', 'Password Reset - {{system_name}}',
    '<h1>Password Reset Request</h1>
     <p>Dear {{user_name}},</p>
     <p>We received a request to reset your password. Click the link below to reset it:</p>
     <p><a href="{{reset_url}}" class="btn-primary">Reset Password</a></p>
     <p>This link will expire in {{expiry_hours}} hours.</p>
     <p>If you did not request this reset, please ignore this email.</p>
     <p>Best regards,<br/>{{system_name}} Team</p>',
    'Password Reset Request

Dear {{user_name}},

We received a request to reset your password. Use this link to reset it:
{{reset_url}}

This link will expire in {{expiry_hours}} hours.

If you did not request this reset, please ignore this email.

Best regards,
{{system_name}} Team',
    '["system_name", "user_name", "reset_url", "expiry_hours"]',
    'en', 'authentication', 'Password reset email template', true
),

-- Financial Templates
(
    'Invoice Generated', 'invoice', 'Invoice {{invoice_number}} - {{system_name}}',
    '<h1>Invoice {{invoice_number}}</h1>
     <p>Dear {{recipient_name}},</p>
     <p>A new invoice has been generated for you:</p>
     <table border="1" style="border-collapse: collapse; width: 100%;">
       <tr><td><strong>Invoice Number:</strong></td><td>{{invoice_number}}</td></tr>
       <tr><td><strong>Issue Date:</strong></td><td>{{issue_date}}</td></tr>
       <tr><td><strong>Due Date:</strong></td><td>{{due_date}}</td></tr>
       <tr><td><strong>Amount:</strong></td><td>{{amount}} {{currency}}</td></tr>
       <tr><td><strong>Description:</strong></td><td>{{description}}</td></tr>
     </table>
     <p><a href="{{view_url}}">View Invoice</a> | <a href="{{pay_url}}">Pay Now</a></p>
     <p>Best regards,<br/>{{system_name}} Team</p>',
    'Invoice {{invoice_number}}

Dear {{recipient_name}},

A new invoice has been generated for you:

Invoice Number: {{invoice_number}}
Issue Date: {{issue_date}}
Due Date: {{due_date}}
Amount: {{amount}} {{currency}}
Description: {{description}}

View Invoice: {{view_url}}
Pay Now: {{pay_url}}

Best regards,
{{system_name}} Team',
    '["system_name", "recipient_name", "invoice_number", "issue_date", "due_date", "amount", "currency", "description", "view_url", "pay_url"]',
    'en', 'financial', 'Invoice notification template', true
),

-- Maintenance Templates
(
    'Maintenance Request Received', 'maintenance_request', 'Maintenance Request {{order_number}} Received',
    '<h1>Maintenance Request Received</h1>
     <p>Dear {{requestor_name}},</p>
     <p>Your maintenance request has been received and assigned order number: <strong>{{order_number}}</strong></p>
     <p><strong>Details:</strong></p>
     <ul>
       <li>Title: {{title}}</li>
       <li>Priority: {{priority}}</li>
       <li>Property: {{property_name}}</li>
       <li>Unit: {{unit_number}}</li>
       <li>Estimated Cost: {{estimated_cost}} {{currency}}</li>
     </ul>
     <p>We will update you on the progress. <a href="{{track_url}}">Track Status</a></p>
     <p>Best regards,<br/>Maintenance Team</p>',
    'Maintenance Request Received

Dear {{requestor_name}},

Your maintenance request has been received and assigned order number: {{order_number}}

Details:
- Title: {{title}}
- Priority: {{priority}}
- Property: {{property_name}}
- Unit: {{unit_number}}
- Estimated Cost: {{estimated_cost}} {{currency}}

We will update you on the progress. Track Status: {{track_url}}

Best regards,
Maintenance Team',
    '["requestor_name", "order_number", "title", "priority", "property_name", "unit_number", "estimated_cost", "currency", "track_url"]',
    'en', 'maintenance', 'Maintenance request acknowledgment', true
),

-- Payment Reminder Template
(
    'Payment Reminder', 'payment_reminder', 'Payment Reminder - Invoice {{invoice_number}}',
    '<h1>Payment Reminder</h1>
     <p>Dear {{recipient_name}},</p>
     <p>This is a friendly reminder that your payment is due:</p>
     <p><strong>Invoice {{invoice_number}}</strong><br/>
        Amount Due: {{amount}} {{currency}}<br/>
        Due Date: {{due_date}}<br/>
        Days Overdue: {{days_overdue}}</p>
     <p>Please make your payment as soon as possible to avoid late fees.</p>
     <p><a href="{{pay_url}}" class="btn-success">Pay Now</a></p>
     <p>If you have already made this payment, please disregard this reminder.</p>
     <p>Best regards,<br/>{{system_name}} Team</p>',
    'Payment Reminder

Dear {{recipient_name}},

This is a friendly reminder that your payment is due:

Invoice {{invoice_number}}
Amount Due: {{amount}} {{currency}}
Due Date: {{due_date}}
Days Overdue: {{days_overdue}}

Please make your payment as soon as possible to avoid late fees.

Pay Now: {{pay_url}}

If you have already made this payment, please disregard this reminder.

Best regards,
{{system_name}} Team',
    '["recipient_name", "invoice_number", "amount", "currency", "due_date", "days_overdue", "pay_url", "system_name"]',
    'en', 'financial', 'Payment reminder for overdue invoices', true
);

-- =====================================================
-- CREATE HELPFUL VIEWS
-- =====================================================

-- System configuration overview
CREATE OR REPLACE VIEW system_configuration_overview AS
SELECT 
    category,
    COUNT(*) as setting_count,
    COUNT(CASE WHEN is_public = true THEN 1 END) as public_settings,
    COUNT(CASE WHEN requires_restart = true THEN 1 END) as restart_required_settings,
    STRING_AGG(setting_key, ', ' ORDER BY setting_key) as setting_keys
FROM system_settings
GROUP BY category
ORDER BY category;

-- Active currencies with rates
CREATE OR REPLACE VIEW active_currencies_summary AS
SELECT 
    currency_code,
    currency_name,
    currency_symbol,
    exchange_rate_to_base,
    is_base_currency,
    decimal_places,
    CASE 
        WHEN last_rate_update IS NULL THEN 'Never Updated'
        WHEN last_rate_update < CURRENT_TIMESTAMP - INTERVAL '24 hours' THEN 'Outdated'
        WHEN last_rate_update < CURRENT_TIMESTAMP - INTERVAL '1 hour' THEN 'Needs Update'
        ELSE 'Current'
    END as rate_status,
    rate_source
FROM currencies
WHERE is_active = true
ORDER BY is_base_currency DESC, currency_code;

-- Email template summary
CREATE OR REPLACE VIEW email_templates_summary AS
SELECT 
    category,
    language,
    COUNT(*) as template_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_templates,
    COUNT(CASE WHEN is_system_template = true THEN 1 END) as system_templates,
    STRING_AGG(template_type, ', ' ORDER BY template_type) as template_types
FROM email_templates
GROUP BY category, language
ORDER BY category, language;

-- User notification summary
CREATE OR REPLACE VIEW user_notifications_summary AS
SELECT 
    u.username,
    u.user_type,
    COUNT(n.notification_id) as total_notifications,
    COUNT(CASE WHEN n.is_read = false THEN 1 END) as unread_count,
    COUNT(CASE WHEN n.priority IN ('high', 'urgent') THEN 1 END) as high_priority_count,
    MAX(n.created_at) as latest_notification,
    STRING_AGG(DISTINCT n.type, ', ') as notification_types
FROM users u
LEFT JOIN notifications n ON u.user_id = n.user_id
WHERE u.is_active = true
GROUP BY u.user_id, u.username, u.user_type
ORDER BY unread_count DESC, high_priority_count DESC;

-- =====================================================
-- 016 - Audit & History Module (Fixed Dependencies)
-- Real Estate Management System
-- Purpose: Comprehensive audit trail and system logging
-- Database: rems, Schema: rems
-- Note: Users table dependencies removed for standalone execution
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- Drop existing tables if recreating
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS entity_audit_log CASCADE;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS entity_audit_log_id_seq;
CREATE SEQUENCE IF NOT EXISTS login_history_id_seq;
CREATE SEQUENCE IF NOT EXISTS system_logs_id_seq;

-- =====================================================
-- ENTITY AUDIT LOG TABLE (Universal Change Tracking)
-- =====================================================

CREATE TABLE "rems"."entity_audit_log" (
    "audit_id" int4 NOT NULL DEFAULT nextval('entity_audit_log_id_seq'::regclass),
    "table_name" varchar(50) NOT NULL,
    "entity_id" int4 NOT NULL,
    "operation_type" varchar(10) NOT NULL,
    "old_values" jsonb,
    "new_values" jsonb,
    "changed_by" int4,
    "change_reason" text,
    "ip_address" inet,
    "user_agent" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("audit_id")
);

-- Add foreign key constraints to users table
ALTER TABLE entity_audit_log 
    ADD CONSTRAINT fk_entity_audit_changed_by 
    FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE entity_audit_log ADD CONSTRAINT chk_operation_type 
    CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE'));

ALTER TABLE entity_audit_log ADD CONSTRAINT chk_table_name 
    CHECK (table_name IN (
        'owners', 'properties', 'property_ownership_periods', 'units', 'tenants', 
        'rental_contracts', 'expense_categories', 'expense_types', 'vendors', 
        'maintenance_orders', 'invoices', 'receipts', 'rental_transactions', 
        'expense_transactions', 'users', 'system_settings'
    ));

-- =====================================================
-- LOGIN HISTORY TABLE (Authentication Tracking)
-- =====================================================

CREATE TABLE "rems"."login_history" (
    "login_id" int4 NOT NULL DEFAULT nextval('login_history_id_seq'::regclass),
    "user_id" int4,
    "username" varchar(100),
    "login_type" varchar(20) DEFAULT 'web',
    "ip_address" inet,
    "device_info" text,
    "browser_info" text,
    "location" varchar(100),
    "success" boolean NOT NULL,
    "failure_reason" varchar(100),
    "session_duration" interval,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("login_id")
);

-- Add foreign key constraints to users table  
ALTER TABLE login_history 
    ADD CONSTRAINT fk_login_history_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE login_history ADD CONSTRAINT chk_login_type 
    CHECK (login_type IN ('web', 'mobile', 'api', 'admin'));

-- =====================================================
-- SYSTEM LOGS TABLE (Application Logging)
-- =====================================================

CREATE TABLE "rems"."system_logs" (
    "log_id" int4 NOT NULL DEFAULT nextval('system_logs_id_seq'::regclass),
    "log_level" varchar(10) NOT NULL,
    "category" varchar(50) NOT NULL,
    "message" text NOT NULL,
    "context" jsonb,
    "stack_trace" text,
    "user_id" int4,
    "ip_address" inet,
    "user_agent" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("log_id")
);

-- Add foreign key constraints to users table
ALTER TABLE system_logs 
    ADD CONSTRAINT fk_system_logs_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL;

-- Add business logic constraints
ALTER TABLE system_logs ADD CONSTRAINT chk_log_level 
    CHECK (log_level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'));

ALTER TABLE system_logs ADD CONSTRAINT chk_category 
    CHECK (category IN (
        'authentication', 'authorization', 'database', 'payment', 'email', 
        'maintenance', 'security', 'performance', 'integration', 'user_action'
    ));

-- Create indexes for performance
CREATE INDEX idx_entity_audit_table_entity ON rems.entity_audit_log USING btree (table_name, entity_id);
CREATE INDEX idx_entity_audit_operation ON rems.entity_audit_log USING btree (operation_type);
CREATE INDEX idx_entity_audit_changed_by ON rems.entity_audit_log USING btree (changed_by);
CREATE INDEX idx_entity_audit_created ON rems.entity_audit_log USING btree (created_at);

CREATE INDEX idx_login_history_user ON rems.login_history USING btree (user_id);
CREATE INDEX idx_login_history_username ON rems.login_history USING btree (username);
CREATE INDEX idx_login_history_success ON rems.login_history USING btree (success);
CREATE INDEX idx_login_history_created ON rems.login_history USING btree (created_at);
CREATE INDEX idx_login_history_ip ON rems.login_history USING btree (ip_address);

CREATE INDEX idx_system_logs_level ON rems.system_logs USING btree (log_level);
CREATE INDEX idx_system_logs_category ON rems.system_logs USING btree (category);
CREATE INDEX idx_system_logs_user ON rems.system_logs USING btree (user_id);
CREATE INDEX idx_system_logs_created ON rems.system_logs USING btree (created_at);

-- Create trigger functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_audit_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add table and column comments
COMMENT ON TABLE "rems"."entity_audit_log" IS 'Universal audit trail for all entity changes across the system';
COMMENT ON COLUMN "rems"."entity_audit_log"."table_name" IS 'Name of the table where change occurred';
COMMENT ON COLUMN "rems"."entity_audit_log"."entity_id" IS 'ID of the record that was changed';
COMMENT ON COLUMN "rems"."entity_audit_log"."operation_type" IS 'INSERT, UPDATE, or DELETE';
COMMENT ON COLUMN "rems"."entity_audit_log"."old_values" IS 'JSON of field values before change (UPDATE/DELETE)';
COMMENT ON COLUMN "rems"."entity_audit_log"."new_values" IS 'JSON of field values after change (INSERT/UPDATE)';
COMMENT ON COLUMN "rems"."entity_audit_log"."changed_by" IS 'User ID who made the change (will link to users table)';

COMMENT ON TABLE "rems"."login_history" IS 'Complete authentication and login tracking for security analysis';
COMMENT ON COLUMN "rems"."login_history"."login_type" IS 'web, mobile, api, admin';
COMMENT ON COLUMN "rems"."login_history"."device_info" IS 'Device fingerprint and hardware info';
COMMENT ON COLUMN "rems"."login_history"."browser_info" IS 'Browser type, version, and capabilities';
COMMENT ON COLUMN "rems"."login_history"."success" IS 'Whether login was successful';
COMMENT ON COLUMN "rems"."login_history"."failure_reason" IS 'Reason for failed login (invalid password, locked account, etc.)';

COMMENT ON TABLE "rems"."system_logs" IS 'Application-level logging for debugging and monitoring';
COMMENT ON COLUMN "rems"."system_logs"."log_level" IS 'DEBUG, INFO, WARN, ERROR, FATAL';
COMMENT ON COLUMN "rems"."system_logs"."category" IS 'Functional area where log event occurred';
COMMENT ON COLUMN "rems"."system_logs"."context" IS 'Additional structured data relevant to the log event';

-- =====================================================
-- CREATE HELPFUL VIEWS FOR AUDIT ANALYSIS
-- =====================================================

-- Entity change summary by table
CREATE OR REPLACE VIEW entity_changes_summary AS
SELECT 
    table_name,
    COUNT(*) as total_changes,
    COUNT(CASE WHEN operation_type = 'INSERT' THEN 1 END) as inserts,
    COUNT(CASE WHEN operation_type = 'UPDATE' THEN 1 END) as updates,
    COUNT(CASE WHEN operation_type = 'DELETE' THEN 1 END) as deletes,
    COUNT(DISTINCT entity_id) as unique_entities_affected,
    MIN(created_at) as first_change,
    MAX(created_at) as latest_change
FROM entity_audit_log
GROUP BY table_name
ORDER BY total_changes DESC;

-- Recent entity changes (last 30 days)
CREATE OR REPLACE VIEW recent_entity_changes AS
SELECT 
    eal.audit_id,
    eal.table_name,
    eal.entity_id,
    eal.operation_type,
    eal.change_reason,
    eal.created_at,
    eal.ip_address
FROM entity_audit_log eal
WHERE eal.created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY eal.created_at DESC;

-- Login analytics summary
CREATE OR REPLACE VIEW login_analytics AS
SELECT 
    DATE(created_at) as login_date,
    COUNT(*) as total_attempts,
    COUNT(CASE WHEN success = true THEN 1 END) as successful_logins,
    COUNT(CASE WHEN success = false THEN 1 END) as failed_logins,
    COUNT(DISTINCT username) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips,
    ROUND(COUNT(CASE WHEN success = true THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM login_history
GROUP BY DATE(created_at)
ORDER BY login_date DESC;

-- Security events summary
CREATE OR REPLACE VIEW security_events AS
SELECT 
    lh.username,
    lh.ip_address,
    COUNT(*) as total_attempts,
    COUNT(CASE WHEN lh.success = false THEN 1 END) as failed_attempts,
    MAX(lh.created_at) as latest_attempt,
    STRING_AGG(DISTINCT lh.failure_reason, '; ') as failure_reasons
FROM login_history lh
WHERE lh.success = false
GROUP BY lh.username, lh.ip_address
HAVING COUNT(CASE WHEN lh.success = false THEN 1 END) >= 3
ORDER BY failed_attempts DESC, latest_attempt DESC;

-- System log summary by category and level
CREATE OR REPLACE VIEW system_log_summary AS
SELECT 
    category,
    log_level,
    COUNT(*) as log_count,
    MIN(created_at) as first_occurrence,
    MAX(created_at) as latest_occurrence,
    COUNT(DISTINCT DATE(created_at)) as days_with_logs
FROM system_logs
GROUP BY category, log_level
ORDER BY 
    CASE log_level 
        WHEN 'FATAL' THEN 1
        WHEN 'ERROR' THEN 2
        WHEN 'WARN' THEN 3
        WHEN 'INFO' THEN 4
        WHEN 'DEBUG' THEN 5
    END,
    log_count DESC;

-- Error tracking view
CREATE OR REPLACE VIEW error_tracking AS
SELECT 
    category,
    message,
    COUNT(*) as occurrence_count,
    MAX(created_at) as latest_occurrence,
    STRING_AGG(DISTINCT ip_address::text, ', ') as affected_ips
FROM system_logs
WHERE log_level IN ('ERROR', 'FATAL')
GROUP BY category, message
ORDER BY occurrence_count DESC, latest_occurrence DESC;

-- =====================================================
-- UTILITY FUNCTIONS FOR AUDIT MANAGEMENT
-- =====================================================

-- Function to clean old audit logs (data retention)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM entity_audit_log 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * retention_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM login_history 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * retention_days;
    
    DELETE FROM system_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * retention_days
      AND log_level NOT IN ('ERROR', 'FATAL'); -- Keep error logs longer
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get audit trail for specific entity
CREATE OR REPLACE FUNCTION get_entity_audit_trail(
    p_table_name VARCHAR(50),
    p_entity_id INTEGER
)
RETURNS TABLE (
    audit_id INTEGER,
    operation_type VARCHAR(10),
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    changed_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eal.audit_id,
        eal.operation_type,
        eal.old_values,
        eal.new_values,
        eal.change_reason,
        eal.created_at
    FROM entity_audit_log eal
    WHERE eal.table_name = p_table_name
      AND eal.entity_id = p_entity_id
    ORDER BY eal.created_at DESC;
END;
$$ LANGUAGE plpgsql;

