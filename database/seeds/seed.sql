-- =====================================================
-- REMS (Real Estate Management System) - International Seed Data
-- Version: 2.1 - Fixed for DDL compatibility
-- Purpose: Test data with international names and realistic scenarios
-- Database: PostgreSQL 15+
-- Schema: rems
-- =====================================================

-- Ensure we're using the rems schema
SET search_path = rems, public;

-- =====================================================
-- 001 - Owners Table
-- International property owners from different backgrounds
-- =====================================================

INSERT INTO owners (
    first_name, middle_name, last_name, full_name, 
    nationality, preferred_language, is_active, notes
) VALUES 
-- Primary owner with largest portfolio
(
    'Alexander', 'James', 'Richardson', 'Alexander James Richardson',
    'British', 'en', true, 'Main property owner - 8 properties, established investor'
),
-- Family business owner - Fixed: changed 'es' to 'en' (only en/ar/both allowed)
(
    'Sofia', 'Marie', 'Martinez', 'Sofia Marie Martinez',
    'Spanish', 'en', true, 'Property owner - S series portfolio, family real estate business'
),
-- Co-owner for shared properties
(
    'Ahmad', 'Hassan', 'Al-Rashid', 'Ahmad Hassan Al-Rashid',
    'Kuwaiti', 'ar', true, 'Co-owner of AHS1 property (50% share)'
),
-- Individual investor
(
    'Chen', 'Wei', 'Zhang', 'Chen Wei Zhang',
    'Chinese', 'en', true, 'Owner of AL property, tech entrepreneur investing in real estate'
),
-- Partnership owners
(
    'David', 'Michael', 'Thompson', 'David Michael Thompson',
    'American', 'en', true, 'Co-owner of AF property (50% share), investment partnership'
),
(
    'Francois', 'Pierre', 'Dubois', 'Francois Pierre Dubois',
    'French', 'en', true, 'Co-owner of AF property (50% share), investment partnership'
);

-- =====================================================
-- 002 - Properties Table
-- Properties in various Kuwait locations
-- =====================================================

INSERT INTO properties (
    property_code, property_name, location, area_sqm, 
    total_units, property_type, planning_permit, 
    valuation_amount, valuation_method, is_active
) VALUES 
-- Richardson's Z Portfolio (Zone properties)
('Z1', 'Richardson Tower One', 'Salmiya', 1032.00, 0, 'residential', 'PM/19821', 1571785.71, 'income_approach_7%', true),
('Z2', 'Richardson Tower Two', 'Salmiya', 792.00, 0, 'residential', 'PM/21421', 881714.29, 'income_approach_7%', true),
('Z3', 'Richardson Plaza', 'Salmiya', 832.00, 0, 'residential', 'PM/19592', 938142.86, 'income_approach_7%', true),
('Z4', 'Richardson Gardens', 'Salmiya', 777.50, 0, 'residential', 'PM/27190', NULL, NULL, true),
('Z6', 'Richardson Heights', 'Salmiya', 1037.50, 0, 'residential', 'PM/17539', NULL, NULL, true),
('Z7', 'Richardson Court', 'Salmiya', 1000.00, 0, 'residential', 'PM/33880', NULL, NULL, true),
('Z8', 'Richardson Residence', 'Salmiya', 1045.00, 0, 'residential', 'PM/26302', NULL, NULL, true),
('Z10', 'Richardson Studios', 'Salmiya', 652.00, 0, 'residential', 'PM/36055', NULL, NULL, true),

-- Martinez's S Portfolio (Sofia's properties)
('S1', 'Martinez Tower', 'Salmiya', 1026.00, 0, 'residential', 'PM/7992', NULL, NULL, true),
('S2', 'Martinez Plaza', 'Hawalli', 585.00, 0, 'residential', 'PM/25655', NULL, NULL, true),
('S3', 'Martinez Residences', 'Salmiya', 790.00, 0, 'residential', 'PM/30344', NULL, NULL, true),
('S4', 'Martinez Apartments', 'Fahaheel', 400.00, 0, 'residential', 'PM/19013', NULL, NULL, true),

-- Shared Properties
('AHS1', 'Ahmad-Sofia Joint Venture', 'Salmiya', 852.50, 0, 'residential', 'PM/21333', NULL, NULL, true),
('AL', 'Zhang International Building', 'Salmiya', 902.00, 0, 'mixed_use', 'PM/19038', NULL, NULL, true),
('AF', 'Thompson-Dubois Partnership', 'Qortuba', 957.00, 0, 'residential', 'PM/32992', NULL, NULL, true);

-- =====================================================
-- 003 - Property Ownership Periods
-- Ownership structure with international partnerships
-- Fixed: Changed acquisition_method values to match constraint
-- =====================================================

INSERT INTO property_ownership_periods (
    property_id, owner_id, ownership_percentage, start_date, 
    is_primary_contact, acquisition_method, notes
) VALUES 
-- Richardson's properties (Z series) - 100% ownership
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2012-01-01', true, 'purchase', 'Z1 - Primary investment property'),

((SELECT property_id FROM properties WHERE property_code = 'Z2'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2013-06-01', true, 'purchase', 'Z2 - Expansion of portfolio'),

((SELECT property_id FROM properties WHERE property_code = 'Z3'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2014-03-15', true, 'purchase', 'Z3 - New development project'),

((SELECT property_id FROM properties WHERE property_code = 'Z4'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2015-09-01', true, 'purchase', 'Z4 - Garden property acquisition'),

((SELECT property_id FROM properties WHERE property_code = 'Z6'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2016-01-01', true, 'purchase', 'Z6 - Heights development'),

((SELECT property_id FROM properties WHERE property_code = 'Z7'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2017-04-01', true, 'purchase', 'Z7 - Court project'),

((SELECT property_id FROM properties WHERE property_code = 'Z8'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2018-07-01', true, 'purchase', 'Z8 - Premium residence'),

((SELECT property_id FROM properties WHERE property_code = 'Z10'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 
 100.00, '2020-02-01', true, 'purchase', 'Z10 - Studio complex'),

-- Martinez properties (S series) - 100% ownership
((SELECT property_id FROM properties WHERE property_code = 'S1'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 
 100.00, '2014-01-01', true, 'inheritance', 'S1 - Family property inherited'),

((SELECT property_id FROM properties WHERE property_code = 'S2'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 
 100.00, '2015-06-01', true, 'purchase', 'S2 - Strategic location in Hawalli'),

((SELECT property_id FROM properties WHERE property_code = 'S3'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 
 100.00, '2016-03-01', true, 'purchase', 'S3 - New residential development'),

((SELECT property_id FROM properties WHERE property_code = 'S4'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 
 100.00, '2019-01-01', true, 'purchase', 'S4 - Fahaheel expansion'),

-- Zhang property (AL) - 100% ownership
((SELECT property_id FROM properties WHERE property_code = 'AL'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang'), 
 100.00, '2018-05-01', true, 'purchase', 'AL - Mixed-use investment property'),

-- AHS1 - Shared 50/50 between Martinez and Al-Rashid
((SELECT property_id FROM properties WHERE property_code = 'AHS1'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 
 50.00, '2020-01-01', true, 'founding', 'AHS1 - Joint venture, primary contact'),

((SELECT property_id FROM properties WHERE property_code = 'AHS1'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Ahmad Hassan Al-Rashid'), 
 50.00, '2020-01-01', false, 'founding', 'AHS1 - Joint venture partner'),

-- AF - Shared 50/50 between Thompson and Dubois
((SELECT property_id FROM properties WHERE property_code = 'AF'), 
 (SELECT owner_id FROM owners WHERE full_name = 'David Michael Thompson'), 
 50.00, '2019-06-01', true, 'founding', 'AF - Investment partnership, primary contact'),

((SELECT property_id FROM properties WHERE property_code = 'AF'), 
 (SELECT owner_id FROM owners WHERE full_name = 'Francois Pierre Dubois'), 
 50.00, '2019-06-01', false, 'founding', 'AF - Investment partnership');

-- =====================================================
-- 004 - Units Table
-- Fixed: Removed 'penthouse' unit_type (not in constraint)
-- =====================================================

INSERT INTO units (
    property_id, unit_number, unit_type, number_of_livingrooms, 
    number_of_bedrooms, number_of_bathrooms, number_of_parking_spaces,
    area_sqm, base_rent_amount
) VALUES 
-- Z1 Units (Richardson Tower One)
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 '101', 'apartment', 1, 2, 2, 1, 85.5, 450.00),
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 '102', 'apartment', 1, 1, 1, 1, 65.0, 350.00),
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 '103', 'studio', 1, 0, 1, 0, 45.0, 280.00),
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 '201', 'apartment', 1, 2, 2, 1, 85.5, 450.00),
((SELECT property_id FROM properties WHERE property_code = 'Z1'), 
 'G01', 'storage', 0, 0, 0, 0, 12.0, 50.00),

-- Z2 Units (Richardson Tower Two) - Fixed: Changed 'penthouse' to 'apartment'
((SELECT property_id FROM properties WHERE property_code = 'Z2'), 
 '201', 'apartment', 1, 2, 2, 1, 80.0, 420.00),
((SELECT property_id FROM properties WHERE property_code = 'Z2'), 
 '202', 'apartment', 1, 1, 1, 1, 60.0, 320.00),
((SELECT property_id FROM properties WHERE property_code = 'Z2'), 
 '301', 'apartment', 2, 3, 3, 2, 150.0, 850.00),
((SELECT property_id FROM properties WHERE property_code = 'Z2'), 
 'P01', 'parking', 0, 0, 0, 1, 15.0, 40.00),

-- S1 Units (Martinez Tower) - Fixed: Changed 'penthouse' to 'apartment'
((SELECT property_id FROM properties WHERE property_code = 'S1'), 
 '301', 'apartment', 1, 3, 2, 1, 120.0, 550.00),
((SELECT property_id FROM properties WHERE property_code = 'S1'), 
 '302', 'apartment', 1, 2, 2, 1, 90.0, 450.00),
((SELECT property_id FROM properties WHERE property_code = 'S1'), 
 '303', 'apartment', 1, 1, 1, 0, 70.0, 350.00),
((SELECT property_id FROM properties WHERE property_code = 'S1'), 
 '401', 'apartment', 2, 4, 3, 2, 180.0, 950.00),

-- S2 Units (Martinez Plaza - Hawalli)
((SELECT property_id FROM properties WHERE property_code = 'S2'), 
 '401', 'apartment', 1, 2, 2, 1, 85.0, 380.00),
((SELECT property_id FROM properties WHERE property_code = 'S2'), 
 '402', 'apartment', 1, 1, 1, 1, 65.0, 290.00),
((SELECT property_id FROM properties WHERE property_code = 'S2'), 
 '501', 'studio', 0, 0, 1, 0, 40.0, 220.00),

-- AHS1 Units (Joint Venture Property)
((SELECT property_id FROM properties WHERE property_code = 'AHS1'), 
 '501', 'apartment', 1, 2, 2, 1, 88.0, 440.00),
((SELECT property_id FROM properties WHERE property_code = 'AHS1'), 
 '502', 'apartment', 1, 1, 1, 1, 68.0, 340.00),
((SELECT property_id FROM properties WHERE property_code = 'AHS1'), 
 '601', 'apartment', 1, 3, 2, 1, 110.0, 520.00),

-- AL Units (Zhang International Building - Mixed Use)
((SELECT property_id FROM properties WHERE property_code = 'AL'), 
 '601', 'apartment', 1, 3, 2, 2, 130.0, 600.00),
((SELECT property_id FROM properties WHERE property_code = 'AL'), 
 'G01', 'commercial', 0, 0, 1, 2, 200.0, 1200.00),
((SELECT property_id FROM properties WHERE property_code = 'AL'), 
 'G02', 'storage', 0, 0, 0, 0, 20.0, 80.00),

-- AF Units (Thompson-Dubois Partnership)
((SELECT property_id FROM properties WHERE property_code = 'AF'), 
 '701', 'single_family_home', 2, 4, 3, 2, 200.0, 800.00),
((SELECT property_id FROM properties WHERE property_code = 'AF'), 
 '702', 'apartment', 1, 2, 2, 1, 95.0, 480.00),
((SELECT property_id FROM properties WHERE property_code = 'AF'), 
 '703', 'apartment', 1, 3, 2, 2, 120.0, 580.00);

-- Update properties table with correct total_units count
UPDATE properties 
SET total_units = (
    SELECT COUNT(*) 
    FROM units 
    WHERE units.property_id = properties.property_id
);

-- =====================================================
-- 005 - Tenants Table
-- International mix of residential and commercial tenants
-- =====================================================

INSERT INTO tenants (
    first_name, middle_name, last_name, full_name, 
    nationality, mobile, email, national_id_type, national_id, 
    work_address, is_active, notes
) VALUES 
-- Professional tenants
(
    'Mohammed', 'Ahmed', 'Al-Rasheed', 'Mohammed Ahmed Al-Rasheed',
    'Kuwaiti', '+965-9999-1001', 'mohammed.rasheed@email.com', 'civil_id', '287010012345',
    'Kuwait City - Ministry of Finance', true, 'Government employee, long-term tenant'
),
(
    'Emma', 'Louise', 'Johnson', 'Emma Louise Johnson',
    'British', '+965-9999-1002', 'emma.johnson@school.edu.kw', 'civil_id', '289020023456',
    'American School of Kuwait', true, 'International school teacher'
),
(
    'Carlos', 'Miguel', 'Rodriguez', 'Carlos Miguel Rodriguez',
    'Spanish', '+965-9999-1003', 'carlos.rodriguez@oil.com', 'civil_id', '285030034567', 
    'Kuwait Petroleum Corporation', true, 'Oil industry engineer'
),
(
    'Fatima', 'Ali', 'Hassan', 'Fatima Ali Hassan',
    'Lebanese', '+965-9999-1004', 'fatima.hassan@bank.com', 'civil_id', '291040045678',
    'National Bank of Kuwait', true, 'Banking professional'
),

-- Medical professionals
(
    'Dr. Ahmed', 'Hassan', 'El-Masri', 'Dr. Ahmed Hassan El-Masri',
    'Egyptian', '+965-9999-2001', 'ahmed.elmasri@hospital.kw', 'civil_id', '187050056789',
    'Al-Sabah Hospital', true, 'Cardiologist at government hospital'
),
(
    'Dr. Priya', 'Sharma', 'Patel', 'Dr. Priya Sharma Patel',
    'Indian', '+965-9999-2002', 'priya.patel@clinic.com', 'civil_id', '188060067890',
    'International Medical Center', true, 'Pediatrician'
),

-- IT Professionals
(
    'John', 'Michael', 'Anderson', 'John Michael Anderson',
    'American', '+965-9999-2003', 'john.anderson@tech.com', 'civil_id', '189070078901',
    'Kuwait IT Solutions', true, 'Software architect'
),
(
    'Maria', 'Jose', 'Santos', 'Maria Jose Santos',
    'Filipino', '+965-9999-2004', 'maria.santos@company.com', 'civil_id', '190080089012',
    'Zain Telecommunications', true, 'Network engineer'
),

-- Families
(
    'Robert', 'James', 'Williams', 'Robert James Williams',
    'Canadian', '+965-9999-3001', 'robert.williams@embassy.ca', 'civil_id', '286090090123',
    'Canadian Embassy Kuwait', true, 'Diplomat - family of 4'
),
(
    'Sarah', 'Elizabeth', 'Williams', 'Sarah Elizabeth Williams',
    'Canadian', '+965-9999-3002', 'sarah.williams@intl.org', 'civil_id', '292100001234',
    'United Nations Kuwait', true, 'UN Program Officer - spouse of Robert'
),

-- Young professionals
(
    'Kim', 'Min', 'Jung', 'Kim Min Jung',
    'Korean', '+965-9999-3003', 'kim.jung@samsung.com', 'civil_id', '294050012345',
    'Samsung Electronics Kuwait', true, 'Marketing manager'
),
(
    'Alessandro', 'Marco', 'Rossi', 'Alessandro Marco Rossi',
    'Italian', '+965-9999-3004', 'alessandro.rossi@fashion.com', 'civil_id', '293060023456',
    'Luxury Retail Group', true, 'Fashion retail manager'
),

-- Business/Commercial tenants
(
    'Global', 'Trading', 'Company LLC', 'Global Trading Company LLC',
    'Kuwaiti', '+965-2222-0001', 'info@globaltrading.kw', 'other', 'CR-123456789',
    'Kuwait Free Trade Zone', true, 'Import/Export business - commercial tenant'
),
(
    'Tech', 'Innovations', 'Kuwait WLL', 'Tech Innovations Kuwait WLL',
    'Kuwaiti', '+965-2222-0002', 'contact@techinnovations.kw', 'other', 'CR-987654321',
    'Kuwait Business Town', true, 'IT consulting firm - office space'
),
(
    'Legal', 'Associates', 'Partners', 'Legal Associates & Partners',
    'Kuwaiti', '+965-2222-0003', 'info@legalassociates.kw', 'other', 'CR-456789123',
    'Kuwait City Legal District', true, 'Law firm - professional office'
);

-- =====================================================
-- 006 - Rental Contracts
-- Active, upcoming, and historical contracts
-- =====================================================

INSERT INTO rental_contracts (
    unit_id, tenant_id, second_tenant_id, contract_number, 
    start_date, end_date, monthly_rent, deposit_amount, 
    contract_status, notes
) VALUES 

-- ACTIVE CONTRACTS (Currently ongoing)
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = '101'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Mohammed Ahmed Al-Rasheed'),
    NULL,
    'CONT-2024-001',
    '2024-03-01', '2025-02-28',
    450.00, 450.00,
    'active', 'Government employee - stable long-term tenant'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = '102'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Emma Louise Johnson'),
    NULL,
    'CONT-2024-002',
    '2024-09-01', '2025-08-31',
    350.00, 350.00,
    'active', 'School year contract - teacher'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S1' AND u.unit_number = '301'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Robert James Williams'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Sarah Elizabeth Williams'),
    'CONT-2024-003',
    '2024-01-01', '2025-12-31',
    550.00, 1100.00,
    'active', 'Diplomatic family - 2-year contract'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AHS1' AND u.unit_number = '501'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Carlos Miguel Rodriguez'),
    NULL,
    'CONT-2024-004',
    '2024-06-01', '2025-05-31',
    440.00, 880.00,
    'active', 'Oil company engineer - corporate guarantee'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AL' AND u.unit_number = '601'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Dr. Ahmed Hassan El-Masri'),
    NULL,
    'CONT-2024-005',
    '2024-04-01', '2025-03-31',
    600.00, 1200.00,
    'active', 'Medical professional - hospital nearby'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AL' AND u.unit_number = 'G01'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Tech Innovations Kuwait WLL'),
    NULL,
    'CONT-2024-006',
    '2024-01-01', '2026-12-31',
    1200.00, 3600.00,
    'active', 'Commercial lease - 3-year term'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S2' AND u.unit_number = '401'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Dr. Priya Sharma Patel'),
    NULL,
    'CONT-2024-007',
    '2024-05-01', '2025-04-30',
    380.00, 760.00,
    'active', 'Near medical district'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AF' AND u.unit_number = '701'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'John Michael Anderson'),
    NULL,
    'CONT-2024-008',
    '2024-08-01', '2025-07-31',
    800.00, 1600.00,
    'active', 'American expat - single family home'
),

-- UPCOMING CONTRACTS (Starting in future)
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z2' AND u.unit_number = '301'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Kim Min Jung'),
    NULL,
    'CONT-2025-001',
    '2025-09-01', '2026-08-31',
    850.00, 850.00,
    'upcoming', 'Premium unit - luxury apartment'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S2' AND u.unit_number = '501'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Alessandro Marco Rossi'),
    NULL,
    'CONT-2025-002',
    '2025-10-01', '2026-09-30',
    220.00, 220.00,
    'upcoming', 'Studio apartment - young professional'
),

-- TERMINATED CONTRACTS (Ended early)
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = '201'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Maria Jose Santos'),
    NULL,
    'CONT-2024-T01',
    '2024-02-01', '2025-01-31',
    450.00, 450.00,
    'terminated', 'Early termination - job relocation to Dubai'
),

-- EXPIRED CONTRACTS (Naturally completed)
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = '103'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Fatima Ali Hassan'),
    NULL,
    'CONT-2023-010',
    '2023-06-01', '2024-05-31',
    280.00, 280.00,
    'expired', 'Completed 1-year contract, moved to larger unit'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S1' AND u.unit_number = '302'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Legal Associates & Partners'),
    NULL,
    'CONT-2022-030',
    '2022-12-01', '2023-11-30',
    450.00, 900.00,
    'expired', 'Legal office - relocated to business district'
),

-- Additional active contracts for better coverage
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = 'G01'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Global Trading Company LLC'),
    NULL,
    'CONT-2024-025',
    '2024-07-01', '2025-06-30',
    50.00, 100.00,
    'active', 'Storage unit for trading company inventory'
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z2' AND u.unit_number = 'P01'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Carlos Miguel Rodriguez'),
    NULL,
    'CONT-2024-026',
    '2024-06-01', '2025-05-31',
    40.00, 40.00,
    'active', 'Additional parking space for second vehicle'
);

-- =====================================================
-- 007 - Expense Categories & Types
-- Comprehensive expense classification system
-- =====================================================

INSERT INTO expense_categories (
    category_name, category_description, category_code, 
    is_tax_deductible, display_order
) VALUES 
('Capital Expenditure', 'Major improvements and asset purchases that add long-term value', 'CAPX', true, 1),
('Operating Expenses', 'Day-to-day operational costs for property management', 'OPEX', true, 2),
('Utilities', 'Water, electricity, gas, internet, and other utility services', 'UTIL', true, 3),
('Maintenance & Repairs', 'Regular maintenance and repair work to keep properties functional', 'MAINT', true, 4),
('Professional Services', 'Legal, accounting, consulting, and other professional fees', 'PROF', true, 5),
('Insurance & Taxes', 'Property insurance, municipal taxes, and government fees', 'TAX', true, 6),
('Marketing & Leasing', 'Advertising, tenant acquisition, and leasing-related costs', 'MKTG', true, 7),
('Management Fees', 'Property management and administrative fees', 'MGMT', true, 8),
('Financing Costs', 'Interest, bank fees, and loan-related expenses', 'FIN', true, 9),
('Emergency Repairs', 'Urgent repairs that cannot be delayed', 'EMRG', true, 10);

INSERT INTO expense_types (
    category_id, type_name, type_description, type_code,
    estimated_cost_range_min, estimated_cost_range_max, 
    frequency, is_emergency
) VALUES

-- CAPITAL EXPENDITURE TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'CAPX'), 
 'Major Renovation', 'Complete unit renovation including flooring, kitchen, bathroom', 'CAPX-RENOV',
 2000.00, 8000.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'CAPX'), 
 'Roof Replacement', 'Complete roof replacement or major roof repairs', 'CAPX-ROOF',
 3000.00, 15000.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'CAPX'), 
 'HVAC System Installation', 'New air conditioning or heating system installation', 'CAPX-HVAC',
 1500.00, 5000.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'CAPX'), 
 'Elevator Installation', 'New elevator installation or major upgrades', 'CAPX-ELEV',
 15000.00, 50000.00, 'as_needed', false),

-- OPERATING EXPENSES TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'OPEX'), 
 'Cleaning Services', 'Regular cleaning of common areas and vacant units', 'OPEX-CLEAN',
 50.00, 200.00, 'monthly', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'OPEX'), 
 'Security Services', 'Building security and monitoring services', 'OPEX-SEC',
 300.00, 800.00, 'monthly', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'OPEX'), 
 'Landscaping', 'Garden maintenance and outdoor area upkeep', 'OPEX-LAND',
 100.00, 400.00, 'monthly', false),

-- UTILITIES TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'UTIL'), 
 'Electricity Bill', 'Monthly electricity consumption for common areas', 'UTIL-ELEC',
 200.00, 800.00, 'monthly', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'UTIL'), 
 'Water Bill', 'Monthly water consumption for building', 'UTIL-WATER',
 150.00, 500.00, 'monthly', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'UTIL'), 
 'Internet & Cable', 'Building-wide internet and cable services', 'UTIL-NET',
 80.00, 200.00, 'monthly', false),

-- MAINTENANCE & REPAIRS TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'MAINT'), 
 'Plumbing Repairs', 'General plumbing maintenance and repairs', 'MAINT-PLUMB',
 50.00, 500.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'MAINT'), 
 'Electrical Repairs', 'Electrical system maintenance and repairs', 'MAINT-ELEC',
 80.00, 600.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'MAINT'), 
 'Painting & Touch-ups', 'Interior and exterior painting work', 'MAINT-PAINT',
 200.00, 1000.00, 'annually', false),

-- PROFESSIONAL SERVICES TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'PROF'), 
 'Legal Fees', 'Legal consultation, contract review, litigation support', 'PROF-LEG',
 200.00, 2000.00, 'as_needed', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'PROF'), 
 'Accounting Services', 'Bookkeeping, tax preparation, financial audits', 'PROF-ACC',
 300.00, 1500.00, 'annually', false),

-- INSURANCE & TAXES TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'TAX'), 
 'Property Insurance', 'Building and liability insurance premiums', 'TAX-INS',
 1000.00, 5000.00, 'annually', false),

((SELECT category_id FROM expense_categories WHERE category_code = 'TAX'), 
 'Municipal Taxes', 'Local government property taxes and fees', 'TAX-MUN',
 500.00, 3000.00, 'annually', false),

-- EMERGENCY REPAIRS TYPES
((SELECT category_id FROM expense_categories WHERE category_code = 'EMRG'), 
 'Emergency Plumbing', 'Urgent plumbing repairs (leaks, blockages)', 'EMRG-PLUMB',
 100.00, 1000.00, 'emergency', true),

((SELECT category_id FROM expense_categories WHERE category_code = 'EMRG'), 
 'Emergency Electrical', 'Urgent electrical repairs (power outages, safety issues)', 'EMRG-ELEC',
 150.00, 1200.00, 'emergency', true),

((SELECT category_id FROM expense_categories WHERE category_code = 'EMRG'), 
 'Emergency HVAC', 'Urgent air conditioning or heating repairs', 'EMRG-HVAC',
 200.00, 1500.00, 'emergency', true);

-- =====================================================
-- 008 - Vendors Table
-- International vendor network
-- =====================================================

INSERT INTO vendors (
    vendor_name, vendor_type, contact_person, phone_primary, mobile, 
    email, address, commercial_registration, specialization, rating,
    total_jobs_completed, payment_terms, preferred_payment_method,
    emergency_available, service_areas, notes
) VALUES 

-- CONTRACTORS
('Richardson Contracting Group', 'contractor', 'James Mitchell', '+965-2222-1001', '+965-9999-1001',
 'info@richardson-contracting.com', 'Block 3, Street 45, Salmiya, Kuwait', 'CR-123456789',
 'General Construction, Renovation, Building Maintenance', 4.5, 145,
 'net_30', 'bank_transfer', true, 'All Kuwait Areas', 'Preferred contractor for major renovations'),

('Al-Hamra Construction', 'contractor', 'Ahmad Al-Hamra', '+965-2222-1002', '+965-9999-1002',
 'info@alhamra-construction.kw', 'Industrial Area, Kuwait City', 'CR-234567890',
 'Commercial Construction, Office Fit-outs', 4.7, 89,
 'net_45', 'bank_transfer', false, 'Kuwait City, Salmiya, Hawalli', 'Specialized in commercial properties'),

('Kumar Technical Services', 'contractor', 'Rajesh Kumar', '+965-2222-1003', '+965-9999-1003',
 'service@kumar-technical.com', 'Farwaniya, Kuwait', 'CR-345678901',
 'HVAC Installation, Air Conditioning Repair, Ventilation', 4.8, 267,
 'net_30', 'bank_transfer', true, 'All Kuwait', '24/7 emergency HVAC services'),

-- PLUMBING & ELECTRICAL
('ProPlumb Kuwait', 'contractor', 'Michael O''Brien', '+965-2222-1004', '+965-9999-1004',
 'service@proplumb.kw', 'Jahra, Kuwait', 'CR-456789012',
 'Plumbing Installation, Pipe Repair, Water Systems', 4.3, 189,
 'immediate', 'cash', true, 'All Kuwait Areas', 'Emergency plumbing specialist'),

('ElectroTech Solutions', 'contractor', 'Giovanni Rossi', '+965-2222-1005', '+965-9999-1005',
 'info@electrotech.kw', 'Hawalli, Kuwait', 'CR-567890123',
 'Electrical Installation, Wiring, Safety Inspection', 4.6, 256,
 'net_7', 'knet', true, 'Hawalli, Salmiya, Kuwait City', 'Licensed electrical contractor'),

-- CLEANING & MAINTENANCE SERVICES
('Crystal Clean Services', 'cleaning_service', 'Maria Rodriguez', '+965-2222-2001', '+965-9999-2001',
 'booking@crystalclean.kw', 'Ahmadi, Kuwait', 'CR-678901234',
 'Deep Cleaning, Regular Maintenance, Post-Construction Cleanup', 4.4, 434,
 'net_15', 'bank_transfer', false, 'All Kuwait Areas', 'Professional cleaning teams'),

('SecureGuard Kuwait', 'security_service', 'Captain Hassan Ali', '+965-2222-2002', '+965-9999-2002',
 'operations@secureguard.kw', 'Capital Tower, Kuwait City', 'CR-789012345',
 'Building Security, Surveillance, Access Control', 4.2, 42,
 'net_30', 'bank_transfer', true, 'Kuwait City, Salmiya', '24/7 security monitoring'),

-- SUPPLIERS
('BuildMart Supplies', 'supplier', 'David Thompson', '+965-2222-3001', '+965-9999-3001',
 'sales@buildmart.kw', 'Industrial Area Shuwaikh, Kuwait', 'CR-890123456',
 'Construction Materials, Hardware, Tools, Paint', 4.0, 178,
 'net_45', 'bank_transfer', false, 'Kuwait Wide Delivery', 'Bulk construction supplies'),

('Modern Home Furnishings', 'supplier', 'Sophie Laurent', '+965-2222-3002', '+965-9999-3002',
 'info@modernhome.kw', 'The Avenues Mall, Kuwait', 'CR-901234567',
 'Furniture, Appliances, Interior Decoration', 4.7, 95,
 'advance_payment', 'credit_card', false, 'Kuwait, Delivery Available', 'Premium furniture supplier'),

-- PROFESSIONAL SERVICES
('Sterling Engineering Consultants', 'professional_service', 'Eng. Robert Sterling', '+965-2222-4001', '+965-9999-4001',
 'consult@sterling-eng.com', 'Kuwait Business Tower, Kuwait City', 'CR-012345678',
 'Structural Engineering, MEP Design, Project Management', 5.0, 53,
 'net_60', 'bank_transfer', false, 'Kuwait, GCC Region', 'Licensed professional engineers'),

('PWC Accounting Services', 'professional_service', 'Ahmed Khalil', '+965-2222-4002', '+965-9999-4002',
 'realestate@pwc.kw', 'Al-Hamra Tower, Kuwait City', 'CR-123450987',
 'Accounting, Financial Audit, Tax Consultation', 4.9, 167,
 'net_30', 'bank_transfer', false, 'Kuwait Wide Services', 'Big 4 accounting firm'),

-- UTILITY COMPANIES
('Ministry of Electricity & Water', 'utility_company', 'Customer Service', '+965-135', NULL,
 'customer.service@mew.gov.kw', 'MEW Headquarters, Kuwait City', 'GOV-MEW-001',
 'Electricity Supply, Water Supply, Infrastructure', 3.8, 999,
 'immediate', 'bank_transfer', true, 'All Kuwait', 'Government utility provider'),

-- MAINTENANCE COMPANIES
('Total Facility Management', 'maintenance_company', 'John Williams', '+965-2222-5001', '+965-9999-5001',
 'service@tfm-kuwait.com', 'Fahaheel, Kuwait', 'CR-234561890',
 'Building Maintenance, Facility Management, Preventive Maintenance', 4.5, 223,
 'net_30', 'bank_transfer', true, 'All Kuwait Areas', 'Comprehensive facility management');

-- =====================================================
-- 009 - Maintenance Orders
-- Fixed: Corrected requestor logic constraints
-- =====================================================

INSERT INTO maintenance_orders (
    unit_id, property_id, tenant_id, owner_id, requestor_type, vendor_id, 
    expense_type_id, title, description, priority, status,
    estimated_cost, estimated_duration_hours, requires_approval
) VALUES 

-- TENANT-INITIATED REQUESTS
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'Z1' AND u.unit_number = '101'),
    (SELECT property_id FROM properties WHERE property_code = 'Z1'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Mohammed Ahmed Al-Rasheed'),
    NULL,
    'tenant',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ProPlumb Kuwait'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Plumbing Repairs'),
    'Kitchen Sink Leak',
    'Kitchen sink has been leaking under the cabinet. Water pooling detected.',
    'high', 'approved',
    150.00, 3, true
),

(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S1' AND u.unit_number = '301'),
    (SELECT property_id FROM properties WHERE property_code = 'S1'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Robert James Williams'),
    NULL,
    'tenant',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Kumar Technical Services'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Emergency HVAC'),
    'AC Unit Failure - Family Home',
    'AC stopped working completely. Family with young children, urgent repair needed.',
    'emergency', 'in_progress',
    300.00, 4, false
),

-- OWNER-INITIATED REQUESTS - Fixed: Removed unit_id for property-wide maintenance
(
    NULL,
    (SELECT property_id FROM properties WHERE property_code = 'Z2'),
    NULL,
    (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
    'owner',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Modern Home Furnishings'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Major Renovation'),
    'Property Upgrade Project',
    'Complete renovation project to luxury standard for premium rental market.',
    'medium', 'scheduled',
    5500.00, 40, true
),

(
    NULL,
    (SELECT property_id FROM properties WHERE property_code = 'AL'),
    NULL,
    (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang'),
    'owner',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Crystal Clean Services'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Cleaning Services'),
    'Quarterly Deep Clean - Commercial Areas',
    'Quarterly deep cleaning of commercial spaces and common areas.',
    'low', 'approved',
    400.00, 16, true
),

-- EMERGENCY TENANT REQUEST
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'S2' AND u.unit_number = '401'),
    (SELECT property_id FROM properties WHERE property_code = 'S2'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Dr. Priya Sharma Patel'),
    NULL,
    'tenant',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ProPlumb Kuwait'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Emergency Plumbing'),
    'Bathroom Flood Emergency',
    'Major water leak in bathroom. Water shut off. Immediate repair required.',
    'emergency', 'completed',
    450.00, 6, false
),

-- PREVENTIVE MAINTENANCE - OWNER REQUEST
(
    NULL,
    (SELECT property_id FROM properties WHERE property_code = 'Z1'),
    NULL,
    (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
    'owner',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Total Facility Management'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Painting & Touch-ups'),
    'Annual Building Exterior Maintenance',
    'Scheduled annual exterior painting and waterproofing maintenance.',
    'low', 'submitted',
    3000.00, 40, true
),

-- SHARED PROPERTY MAINTENANCE
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AHS1' AND u.unit_number = '501'),
    (SELECT property_id FROM properties WHERE property_code = 'AHS1'),
    NULL,
    (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'),
    'owner',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ElectroTech Solutions'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Electrical Repairs'),
    'Electrical Safety Upgrade',
    'Upgrade old electrical outlets and switches to modern safety standards.',
    'medium', 'submitted',
    280.00, 6, true
),

-- COMMERCIAL TENANT REQUEST
(
    (SELECT unit_id FROM units u JOIN properties p ON u.property_id = p.property_id WHERE p.property_code = 'AL' AND u.unit_number = 'G01'),
    (SELECT property_id FROM properties WHERE property_code = 'AL'),
    (SELECT tenant_id FROM tenants WHERE full_name = 'Tech Innovations Kuwait WLL'),
    NULL,
    'tenant',
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Kumar Technical Services'),
    (SELECT type_id FROM expense_types WHERE type_name = 'HVAC System Installation'),
    'Server Room Cooling Upgrade',
    'Additional cooling required for IT server room. Current AC insufficient.',
    'high', 'approved',
    1800.00, 8, true
);

-- Update completed maintenance orders with completion details
UPDATE maintenance_orders 
SET 
    acknowledged_date = requested_date + INTERVAL '2 hours',
    scheduled_date = requested_date + INTERVAL '1 day',
    started_date = requested_date + INTERVAL '1 day 2 hours',
    completed_date = requested_date + INTERVAL '1 day 8 hours',
    actual_cost = 420.00,
    actual_duration_hours = 5,
    tenant_rating = 4.5,
    vendor_notes = 'Replaced damaged pipe section. All connections tested and secure.',
    admin_notes = 'Emergency response handled well. Tenant satisfied with quick resolution.'
WHERE title = 'Bathroom Flood Emergency';

-- =====================================================
-- 010 - Invoices Table
-- Various invoice types with recurring patterns
-- =====================================================

INSERT INTO invoices (
    template_id, invoice_type, entity_id, entity_type, issue_date, due_date, 
    total_amount, invoice_status, is_recurring, recurring_frequency, 
    auto_generate, description, created_by
) VALUES 

-- RENTAL INVOICES (Monthly Recurring)
(NULL, 'rental',
 (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-001'),
 'rental_contract', '2024-12-01', '2024-12-31',
 450.00, 'sent', true, 'monthly', true,
 'Monthly rent - Z1-101 - December 2024',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson')),

(NULL, 'rental',
 (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-003'),
 'rental_contract', '2024-12-01', '2024-12-31',
 550.00, 'paid', true, 'monthly', true,
 'Monthly rent - S1-301 - December 2024',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez')),

-- MAINTENANCE INVOICES
(NULL, 'maintenance',
 (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'Kitchen Sink Leak'),
 'maintenance_order', '2024-11-15', '2024-12-15',
 150.00, 'paid', false, NULL, false,
 'Plumbing repair - Kitchen sink leak',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson')),

(NULL, 'maintenance',
 (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'AC Unit Failure - Family Home'),
 'maintenance_order', '2024-11-20', '2024-12-20',
 300.00, 'overdue', false, NULL, false,
 'Emergency HVAC repair',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez')),

-- UTILITY INVOICES (Recurring)
(NULL, 'utility',
 (SELECT property_id FROM properties WHERE property_code = 'Z1'),
 'property_expense', '2024-12-01', '2024-12-31',
 800.00, 'paid', true, 'monthly', true,
 'Electricity bill - Z1 Building - December 2024',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson')),

(NULL, 'utility',
 (SELECT property_id FROM properties WHERE property_code = 'S1'),
 'property_expense', '2024-12-01', '2024-12-31',
 450.00, 'sent', true, 'monthly', true,
 'Water bill - S1 Building - December 2024',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez')),

-- MANAGEMENT FEE INVOICES
(NULL, 'management_fee',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
 'owner_expense', '2024-12-01', '2024-12-31',
 1200.00, 'paid', true, 'monthly', true,
 'Property management fee - December 2024 (8 properties)',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson')),

-- COMMERCIAL LEASE INVOICE
(NULL, 'rental',
 (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-006'),
 'rental_contract', '2024-12-01', '2024-12-31',
 1200.00, 'paid', true, 'monthly', true,
 'Commercial lease - AL-G01 - December 2024',
 (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang')),

-- DEPOSIT REFUND
(NULL, 'refund',
 (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2023-010'),
 'rental_contract', '2024-06-01', '2024-06-15',
 280.00, 'paid', false, NULL, false,
 'Security deposit refund - Contract completion',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson')),

-- LATE FEE INVOICE
(NULL, 'late_fee',
 (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-007'),
 'rental_contract', '2024-11-05', '2024-11-05',
 38.00, 'sent', false, NULL, false,
 'Late payment fee - 10% penalty on October rent',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'));

-- =====================================================
-- 011 - Receipts Table
-- Payment records with various gateway integrations
-- =====================================================

INSERT INTO receipts (
    template_id, invoice_id, payment_date, amount_received, payment_method, 
    payment_provider, payment_type, external_transaction_id, provider_fee_amount,
    payment_status, payment_description, payer_name, received_by, location_received
) VALUES 

-- KNET PAYMENTS (Kuwait local)
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Monthly rent - S1-301%'),
 '2024-12-01 14:30:00', 550.00, 'knet',
 'KNET', 'knet', 'KNET-2024-12-001-789456', 2.75,
 'completed', 'Monthly rent payment via KNET',
 'Robert James Williams',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'),
 'Online Payment Portal'),

-- CREDIT CARD PAYMENTS
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Commercial lease - AL-G01%'),
 '2024-12-01 09:15:00', 1200.00, 'credit_card',
 'Myfatoorah', 'visa', 'MF-2024-12-VIS-891234', 36.00,
 'completed', 'Commercial rent payment via Visa',
 'Tech Innovations Kuwait WLL',
 (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang'),
 'Online Payment Gateway'),

-- BANK TRANSFER
(NULL,
 (SELECT invoice_id FROM invoices WHERE description = 'Plumbing repair - Kitchen sink leak'),
 '2024-11-16 11:00:00', 150.00, 'bank_transfer',
 'NBK', 'wire', 'NBK-TF-2024-789456', 0.00,
 'completed', 'Maintenance payment - Bank transfer',
 'Property Management Account',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
 'NBK Online Banking'),

-- CASH PAYMENT
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Electricity bill - Z1%'),
 '2024-12-02 16:45:00', 800.00, 'cash',
 'manual', 'cash', NULL, 0.00,
 'completed', 'Utility bill payment - Cash at office',
 'Building Management',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
 'Property Management Office'),

-- MOBILE PAYMENT
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Water bill - S1%'),
 '2024-12-03 12:20:00', 450.00, 'mobile_payment',
 'UPayments', 'mobile_wallet', 'UP-MOB-2024-456789', 13.50,
 'completed', 'Water bill payment via mobile app',
 'Building Management',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'),
 'UPayments Mobile App'),

-- MANAGEMENT FEE PAYMENT
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Property management fee%'),
 '2024-12-01 08:00:00', 1200.00, 'credit_card',
 'Myfatoorah', 'mastercard', 'MF-2024-12-MCD-123456', 36.00,
 'completed', 'Management fee payment via Mastercard',
 'Alexander James Richardson',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
 'Automated Payment System'),

-- DEPOSIT REFUND PAYMENT
(NULL,
 (SELECT invoice_id FROM invoices WHERE description = 'Security deposit refund - Contract completion'),
 '2024-06-02 14:00:00', 280.00, 'bank_transfer',
 'NBK', 'wire', 'NBK-REF-2024-654321', 0.00,
 'completed', 'Security deposit refund transfer',
 'Property Management',
 (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
 'NBK Transfer'),

-- FAILED PAYMENT (For tracking)
(NULL,
 (SELECT invoice_id FROM invoices WHERE description LIKE 'Late payment fee%'),
 '2024-11-06 13:45:00', 38.00, 'credit_card',
 'Myfatoorah', 'visa', 'MF-2024-11-FAIL-001', 0.00,
 'failed', 'Payment failed - Card declined',
 'Priya Sharma Patel',
 (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'),
 'Online Gateway - Failed');

-- =====================================================
-- 012 - Rental Transactions
-- Monthly rental payment tracking
-- =====================================================

INSERT INTO rental_transactions (
    contract_id, invoice_id, receipt_id, year, month, transaction_date,
    actual_rent, collected_amount, late_fee_amount, due_date, 
    payment_method, payment_reference, notes
) VALUES 

-- CURRENT MONTH PAID TRANSACTIONS
(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-003'),
    (SELECT invoice_id FROM invoices WHERE description LIKE 'Monthly rent - S1-301%'),
    (SELECT receipt_id FROM receipts WHERE payment_description = 'Monthly rent payment via KNET'),
    2024, 12, '2024-12-01',
    550.00, 550.00, 0.00, '2024-12-31',
    'knet', 'KNET-2024-12-001-789456',
    'December rent - Paid on time via KNET'
),

(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-006'),
    (SELECT invoice_id FROM invoices WHERE description LIKE 'Commercial lease - AL-G01%'),
    (SELECT receipt_id FROM receipts WHERE payment_description = 'Commercial rent payment via Visa'),
    2024, 12, '2024-12-01',
    1200.00, 1200.00, 0.00, '2024-12-31',
    'credit_card', 'MF-2024-12-VIS-891234',
    'Commercial lease - December payment'
),

-- PREVIOUS MONTHS TRANSACTIONS
(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-001'),
    NULL, NULL,
    2024, 11, '2024-11-01',
    450.00, 450.00, 0.00, '2024-11-30',
    'bank_transfer', 'NBK-TF-2024-11-001',
    'November rent - Bank transfer'
),

(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-002'),
    NULL, NULL,
    2024, 11, '2024-11-01',
    350.00, 350.00, 0.00, '2024-11-30',
    'cash', 'CASH-PMT-2024-11-002',
    'November rent - Cash payment at office'
),

(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-004'),
    NULL, NULL,
    2024, 11, '2024-11-01',
    440.00, 440.00, 0.00, '2024-11-30',
    'knet', 'KNET-2024-11-004',
    'November rent - Corporate payment'
),

-- PARTIAL PAYMENT TRANSACTION
(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-005'),
    NULL, NULL,
    2024, 11, '2024-11-01',
    600.00, 300.00, 0.00, '2024-11-30',
    'check', 'CHK-2024-11-005',
    'November rent - Partial payment received'
),

-- LATE PAYMENT WITH FEE
(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-007'),
    (SELECT invoice_id FROM invoices WHERE description LIKE 'Late payment fee%'),
    NULL,
    2024, 10, '2024-10-05',
    380.00, 380.00, 38.00, '2024-10-31',
    'credit_card', 'MF-2024-10-LATE',
    'October rent - Paid late with 10% penalty'
),

-- DISCOUNTED TRANSACTION
(
    (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-008'),
    NULL, NULL,
    2024, 11, '2024-11-01',
    800.00, 760.00, 0.00, '2024-11-30',
    'bank_transfer', 'NBK-DISC-2024-11',
    'November rent - 5% discount for property issues'
);

-- Update discount amount for discounted transaction
UPDATE rental_transactions 
SET discount_amount = 40.00
WHERE year = 2024 AND month = 11 
  AND contract_id = (SELECT contract_id FROM rental_contracts WHERE contract_number = 'CONT-2024-008');

-- =====================================================
-- 013 - Expense Transactions
-- Fixed: approval_required logic
-- =====================================================

INSERT INTO expense_transactions (
    property_id, expense_category_id, expense_type_id, vendor_id, 
    maintenance_order_id, invoice_id, receipt_id, expense_date, amount,
    description, payment_status, approval_required, approved_by, approved_date,
    payment_method, payment_reference, notes
) VALUES 

-- MAINTENANCE EXPENSES (Linked to orders)
(
    (SELECT property_id FROM properties WHERE property_code = 'Z1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'MAINT'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Plumbing Repairs'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ProPlumb Kuwait'),
    (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'Kitchen Sink Leak'),
    (SELECT invoice_id FROM invoices WHERE description = 'Plumbing repair - Kitchen sink leak'),
    (SELECT receipt_id FROM receipts WHERE payment_description = 'Maintenance payment - Bank transfer'),
    '2024-11-16', 150.00,
    'Kitchen sink leak repair - Z1-101',
    'paid', false, NULL, NULL,
    'bank_transfer', 'NBK-TF-2024-789456',
    'Routine plumbing repair completed successfully'
),

-- Fixed: Added approved_date when approved_by is set
(
    (SELECT property_id FROM properties WHERE property_code = 'S1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'EMRG'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Emergency HVAC'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Kumar Technical Services'),
    (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'AC Unit Failure - Family Home'),
    (SELECT invoice_id FROM invoices WHERE description = 'Emergency HVAC repair'),
    NULL,
    '2024-11-22', 300.00,
    'Emergency AC repair - S1-301',
    'approved', true, 
    (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'),
    '2024-11-22 10:00:00',
    NULL, NULL,
    'Emergency repair approved for family with children'
),

-- UTILITY EXPENSES (Monthly recurring)
(
    (SELECT property_id FROM properties WHERE property_code = 'Z1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'UTIL'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Electricity Bill'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Ministry of Electricity & Water'),
    NULL,
    (SELECT invoice_id FROM invoices WHERE description LIKE 'Electricity bill - Z1%'),
    (SELECT receipt_id FROM receipts WHERE payment_description = 'Utility bill payment - Cash at office'),
    '2024-12-02', 800.00,
    'Monthly electricity - Z1 Building December 2024',
    'paid', false, NULL, NULL,
    'cash', 'MEW-ELEC-DEC-Z1',
    'Regular monthly utility payment'
),

(
    (SELECT property_id FROM properties WHERE property_code = 'S1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'UTIL'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Water Bill'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Ministry of Electricity & Water'),
    NULL,
    (SELECT invoice_id FROM invoices WHERE description LIKE 'Water bill - S1%'),
    (SELECT receipt_id FROM receipts WHERE payment_description = 'Water bill payment via mobile app'),
    '2024-12-03', 450.00,
    'Monthly water - S1 Building December 2024',
    'paid', false, NULL, NULL,
    'mobile_payment', 'UP-MOB-2024-456789',
    'Paid through UPayments app'
),

-- CAPITAL EXPENDITURE (Renovation) - Fixed: Added approved_date
(
    (SELECT property_id FROM properties WHERE property_code = 'Z2'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'CAPX'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Major Renovation'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Richardson Contracting Group'),
    (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'Property Upgrade Project'),
    NULL, NULL,
    '2024-11-15', 5500.00,
    'Luxury renovation - Z2',
    'approved', true,
    (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'),
    '2024-11-15 09:00:00',
    NULL, NULL,
    'Major renovation to increase property value'
),

-- CLEANING SERVICES - Fixed: Added approved_date
(
    (SELECT property_id FROM properties WHERE property_code = 'AL'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'OPEX'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Cleaning Services'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Crystal Clean Services'),
    (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'Quarterly Deep Clean - Commercial Areas'),
    NULL, NULL,
    '2024-11-10', 400.00,
    'Quarterly deep cleaning - AL Building',
    'approved', true,
    (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang'),
    '2024-11-10 14:00:00',
    NULL, NULL,
    'Scheduled quarterly cleaning for commercial areas'
),

-- PROFESSIONAL SERVICES - Pending approval
(
    (SELECT property_id FROM properties WHERE property_code = 'AHS1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'PROF'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Legal Fees'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Legal Associates & Partners'),
    NULL, NULL, NULL,
    '2024-11-08', 500.00,
    'Legal consultation - Joint venture agreement review',
    'pending', true, NULL, NULL,
    NULL, NULL,
    'Legal review for shared property documentation'
),

-- INSURANCE
(
    (SELECT property_id FROM properties WHERE property_code = 'S1'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'TAX'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Property Insurance'),
    NULL, NULL, NULL, NULL,
    '2024-11-01', 2400.00,
    'Annual property insurance premium - S1 Building',
    'paid', false, NULL, NULL,
    'bank_transfer', 'INS-ANNUAL-S1-2024',
    'Annual insurance renewal'
),

-- EMERGENCY REPAIR
(
    (SELECT property_id FROM properties WHERE property_code = 'S2'),
    (SELECT category_id FROM expense_categories WHERE category_code = 'EMRG'),
    (SELECT type_id FROM expense_types WHERE type_name = 'Emergency Plumbing'),
    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ProPlumb Kuwait'),
    (SELECT maintenance_order_id FROM maintenance_orders WHERE title = 'Bathroom Flood Emergency'),
    NULL, NULL,
    '2024-11-25', 450.00,
    'Emergency plumbing - bathroom flood repair',
    'paid', false, NULL, NULL,
    'cash', 'EMRG-CASH-2024-11-25',
    'Emergency repair completed, paid immediately'
);

-- =====================================================
-- 014 - Users & Authentication Module
-- System users with role-based access
-- =====================================================

-- Insert admin users
INSERT INTO users (
    username, email, password_hash, user_type, preferred_language, 
    is_active, email_verified, permissions, settings
) VALUES 
('admin', 'admin@rems.local', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
 'admin', 'en', true, true,
 '{"system_admin": true, "full_access": true, "can_create_users": true}',
 '{"dashboard_theme": "dark", "notifications_enabled": true, "timezone": "Asia/Kuwait"}'),

('accountant', 'accounting@rems.local',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'accountant', 'en', true, true,
 '{"financial_access": true, "can_approve_expenses": true, "can_generate_reports": true}',
 '{"dashboard_theme": "light", "default_currency": "KWD", "fiscal_year_start": "January"}');

-- Insert owner users - Fixed: Using actual owner IDs from database
INSERT INTO users (
    username, email, password_hash, user_type, related_entity_id, related_entity_type,
    preferred_language, is_active, email_verified, permissions, phone
) VALUES 
('owner_richardson', 'alexander@richardson-properties.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'owner', (SELECT owner_id FROM owners WHERE full_name = 'Alexander James Richardson'), 'owner', 
 'en', true, true,
 '{"can_view_properties": true, "can_approve_maintenance": true, "can_view_financials": true}',
 '+965-9999-0001'),

('owner_martinez', 'sofia@martinez-estates.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'owner', (SELECT owner_id FROM owners WHERE full_name = 'Sofia Marie Martinez'), 'owner', 
 'en', true, true,
 '{"can_view_properties": true, "can_approve_maintenance": true, "can_view_financials": true}',
 '+965-9999-0002'),

('owner_zhang', 'chen@zhang-investments.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'owner', (SELECT owner_id FROM owners WHERE full_name = 'Chen Wei Zhang'), 'owner', 
 'en', true, true,
 '{"can_view_properties": true, "can_approve_maintenance": true, "can_view_financials": true}',
 '+965-9999-0003');

-- Insert tenant users - Fixed: Using actual tenant IDs
INSERT INTO users (
    username, email, password_hash, user_type, related_entity_id, related_entity_type,
    preferred_language, is_active, email_verified, permissions, phone
) VALUES 
('tenant_mohammed', 'mohammed.rasheed@tenant.local',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'tenant', (SELECT tenant_id FROM tenants WHERE full_name = 'Mohammed Ahmed Al-Rasheed'), 'tenant', 
 'ar', true, true,
 '{"can_submit_maintenance": true, "can_view_rent_history": true, "can_make_payments": true}',
 '+965-9999-1001'),

('tenant_emma', 'emma.johnson@tenant.local',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'tenant', (SELECT tenant_id FROM tenants WHERE full_name = 'Emma Louise Johnson'), 'tenant', 
 'en', true, true,
 '{"can_submit_maintenance": true, "can_view_rent_history": true, "can_make_payments": true}',
 '+965-9999-1002'),

('tenant_williams', 'robert.williams@tenant.local',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'tenant', (SELECT tenant_id FROM tenants WHERE full_name = 'Robert James Williams'), 'tenant', 
 'en', true, true,
 '{"can_submit_maintenance": true, "can_view_rent_history": true, "can_make_payments": true}',
 '+965-9999-3001');

-- Insert vendor users - Fixed: Using actual vendor IDs
INSERT INTO users (
    username, email, password_hash, user_type, related_entity_id, related_entity_type,
    preferred_language, is_active, email_verified, permissions, phone
) VALUES 
('vendor_richardson_contracting', 'info@richardson-contracting.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'vendor', (SELECT vendor_id FROM vendors WHERE vendor_name = 'Richardson Contracting Group'), 'vendor', 
 'en', true, true,
 '{"can_view_assigned_orders": true, "can_update_order_status": true, "can_submit_invoices": true}',
 '+965-2222-1001'),

('vendor_proplumb', 'service@proplumb.kw',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'vendor', (SELECT vendor_id FROM vendors WHERE vendor_name = 'ProPlumb Kuwait'), 'vendor', 
 'en', true, true,
 '{"can_view_assigned_orders": true, "can_update_order_status": true, "can_submit_invoices": true}',
 '+965-2222-1004');

-- Insert maintenance staff
INSERT INTO users (
    username, email, password_hash, user_type, preferred_language,
    is_active, email_verified, permissions
) VALUES 
('maintenance_supervisor', 'maintenance@rems.local',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'maintenance_staff', 'en', true, true,
 '{"can_assign_vendors": true, "can_approve_small_expenses": true, "can_manage_orders": true}');

-- Insert sample active sessions
INSERT INTO user_sessions (
    session_id, user_id, ip_address, user_agent, device_info, 
    expires_at, is_active, location_info
) VALUES 
('sess_admin_' || substring(md5(random()::text), 1, 16),
 (SELECT user_id FROM users WHERE username = 'admin'),
 '192.168.1.100'::inet,
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
 '{"browser": "Chrome", "os": "Windows 10", "device": "Desktop"}',
 CURRENT_TIMESTAMP + INTERVAL '7 days',
 true,
 '{"country": "Kuwait", "city": "Kuwait City"}'),

('sess_tenant_' || substring(md5(random()::text), 1, 16),
 (SELECT user_id FROM users WHERE username = 'tenant_mohammed'),
 '10.0.0.25'::inet,
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
 '{"browser": "Safari", "os": "iOS 17", "device": "iPhone 15"}',
 CURRENT_TIMESTAMP + INTERVAL '30 days',
 true,
 '{"country": "Kuwait", "city": "Salmiya"}');

-- =====================================================
-- 015 - System Notifications
-- User notifications for various events
-- =====================================================

INSERT INTO notifications (
    user_id, type, title, message, data, priority, action_url, action_text
) VALUES 

-- Admin notifications
((SELECT user_id FROM users WHERE username = 'admin'),
 'system', 'System Setup Complete', 
 'REMS system has been successfully configured with international data.',
 '{"module": "system", "status": "complete", "version": "2.0"}',
 'normal', '/admin/dashboard', 'View Dashboard'),

-- Owner notifications
((SELECT user_id FROM users WHERE username = 'owner_richardson'),
 'maintenance', 'Maintenance Request Approval Required',
 'Property renovation for Z2 requires approval (5,500 KWD).',
 '{"maintenance_order_id": 3, "property": "Z2", "amount": 5500, "currency": "KWD"}',
 'high', '/maintenance/orders/3', 'Review Request'),

((SELECT user_id FROM users WHERE username = 'owner_martinez'),
 'payment', 'Monthly Income Report Available',
 'Your December 2024 income report is ready. Total collected: 2,640 KWD.',
 '{"report_type": "monthly_income", "month": "2024-12", "amount": 2640}',
 'normal', '/reports/income/2024/12', 'View Report'),

-- Tenant notifications
((SELECT user_id FROM users WHERE username = 'tenant_mohammed'),
 'maintenance', 'Maintenance Request Update',
 'Your kitchen sink repair has been completed. Please rate the service.',
 '{"maintenance_order_id": 1, "status": "completed", "rating_required": true}',
 'normal', '/maintenance/rate/1', 'Rate Service'),

((SELECT user_id FROM users WHERE username = 'tenant_emma'),
 'payment', 'Rent Payment Reminder',
 'Your January 2025 rent payment (350 KWD) is due in 7 days.',
 '{"invoice_id": 1, "amount": 350, "due_date": "2025-01-31", "days_remaining": 7}',
 'high', '/payments/invoice/1', 'Pay Now'),

-- Vendor notifications
((SELECT user_id FROM users WHERE username = 'vendor_richardson_contracting'),
 'maintenance', 'New Work Order Assigned',
 'Property renovation project assigned for Z2.',
 '{"maintenance_order_id": 3, "property": "Z2", "estimated_value": 5500}',
 'normal', '/vendor/orders/3', 'View Details'),

-- System alerts
((SELECT user_id FROM users WHERE username = 'admin'),
 'warning', 'Low Occupancy Alert',
 'Property Z1 has vacant units. Consider marketing campaign.',
 '{"property": "Z1", "vacant_units": 1, "occupancy_rate": 80}',
 'normal', '/properties/Z1/vacancies', 'View Vacancies');

-- Mark some notifications as read
UPDATE notifications 
SET is_read = true, read_at = CURRENT_TIMESTAMP - INTERVAL '2 hours'
WHERE type = 'system' AND title LIKE '%Setup Complete%';

-- =====================================================
-- 016 - Audit & History Module
-- System activity tracking and logging
-- =====================================================

-- Entity audit log entries
INSERT INTO entity_audit_log (
    table_name, entity_id, operation_type, old_values, new_values,
    changed_by, change_reason, ip_address, user_agent
) VALUES 
('properties', 1, 'UPDATE', 
 '{"valuation_amount": null, "valuation_date": null}',
 '{"valuation_amount": 1571785.71, "valuation_date": "2024-01-15"}',
 (SELECT user_id FROM users WHERE username = 'admin'), 
 'Annual property valuation update', '192.168.1.100'::inet,
 'Mozilla/5.0 Chrome/120.0.0.0'),

('rental_contracts', 1, 'INSERT',
 NULL,
 '{"contract_id": 1, "unit_id": 1, "tenant_id": 1, "monthly_rent": 450.00, "status": "active"}',
 (SELECT user_id FROM users WHERE username = 'owner_richardson'), 
 'New rental contract created', '192.168.1.101'::inet,
 'Mozilla/5.0 Safari/17.0'),

('maintenance_orders', 1, 'UPDATE',
 '{"status": "submitted", "vendor_id": null}',
 '{"status": "approved", "vendor_id": 4}',
 (SELECT user_id FROM users WHERE username = 'admin'), 
 'Maintenance order approved and vendor assigned', '192.168.1.102'::inet,
 'Mozilla/5.0 Chrome Mobile/119.0'),

('invoices', 1, 'UPDATE',
 '{"invoice_status": "draft"}',
 '{"invoice_status": "sent", "sent_date": "2024-12-01"}',
 NULL, 'Automated invoice generation', '10.0.0.50'::inet,
 'REMS-System/2.0 (Automated)');

-- Login history entries
INSERT INTO login_history (
    user_id, username, login_type, ip_address, device_info, browser_info,
    location, success, failure_reason, session_duration
) VALUES 
((SELECT user_id FROM users WHERE username = 'admin'), 
 'admin', 'web', '192.168.1.100'::inet,
 'Windows 10 Desktop', 'Chrome 120.0.0.0',
 'Kuwait City, Kuwait', true, NULL, '02:30:00'::interval),

((SELECT user_id FROM users WHERE username = 'owner_richardson'), 
 'owner_richardson', 'web', '192.168.1.101'::inet,
 'MacBook Pro M3', 'Safari 17.0',
 'London, UK', true, NULL, '00:45:00'::interval),

((SELECT user_id FROM users WHERE username = 'tenant_mohammed'), 
 'tenant_mohammed', 'mobile', '192.168.1.102'::inet,
 'iPhone 15 Pro', 'Safari Mobile',
 'Salmiya, Kuwait', true, NULL, '01:15:00'::interval),

(NULL, 'unknown_user', 'web', '198.51.100.10'::inet,
 'Windows 11', 'Firefox 120.0',
 'Unknown Location', false, 'Invalid credentials', NULL);

-- System logs entries - Fixed: Changed 'report' to 'user_action'
INSERT INTO system_logs (
    log_level, category, message, context, user_id, ip_address, user_agent
) VALUES 
('INFO', 'authentication', 'User login successful', 
 '{"username": "admin", "login_method": "password", "2fa_used": false}',
 (SELECT user_id FROM users WHERE username = 'admin'), 
 '192.168.1.100'::inet, 'Mozilla/5.0'),

('WARN', 'security', 'Multiple failed login attempts detected',
 '{"username": "unknown_user", "attempts": 5, "time_window": "5 minutes"}',
 NULL, '198.51.100.10'::inet, 'Mozilla/5.0'),

('ERROR', 'payment', 'Payment gateway timeout',
 '{"gateway": "Myfatoorah", "invoice_id": 2, "timeout": "30s"}',
 NULL, '10.0.0.50'::inet, 'REMS-System/2.0'),

('INFO', 'maintenance', 'Emergency maintenance order created',
 '{"order_id": 2, "priority": "emergency", "property": "S1-301"}',
 (SELECT user_id FROM users WHERE username = 'tenant_williams'), 
 '192.168.1.102'::inet, 'REMS-Mobile/2.0'),

('INFO', 'user_action', 'Monthly financial report generated',
 '{"report_type": "financial", "month": "2024-12", "properties": 15}',
 (SELECT user_id FROM users WHERE username = 'accountant'), 
 '192.168.1.103'::inet, 'Chrome/120.0');

-- =====================================================
-- END OF SEED DATA
-- =====================================================

-- Final statistics
DO $$
DECLARE
    owner_count INTEGER;
    property_count INTEGER;
    unit_count INTEGER;
    tenant_count INTEGER;
    contract_count INTEGER;
    vendor_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO owner_count FROM owners;
    SELECT COUNT(*) INTO property_count FROM properties;
    SELECT COUNT(*) INTO unit_count FROM units;
    SELECT COUNT(*) INTO tenant_count FROM tenants;
    SELECT COUNT(*) INTO contract_count FROM rental_contracts;
    SELECT COUNT(*) INTO vendor_count FROM vendors;
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'REMS International Seed Data Load Complete';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Owners loaded: %', owner_count;
    RAISE NOTICE 'Properties loaded: %', property_count;
    RAISE NOTICE 'Units loaded: %', unit_count;
    RAISE NOTICE 'Tenants loaded: %', tenant_count;
    RAISE NOTICE 'Rental contracts loaded: %', contract_count;
    RAISE NOTICE 'Vendors loaded: %', vendor_count;
    RAISE NOTICE '==============================================';
END $$;