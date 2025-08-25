-- =====================================================
-- REMS Database Initialization Script
-- =====================================================
-- This script initializes the REMS database and user
-- It uses environment variables passed by Docker Compose
-- 
-- Note: Actual credentials are set via environment variables
-- in docker-compose.yml and .env files (not committed to git)
-- =====================================================

-- The database and user are automatically created by PostgreSQL
-- using the POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD 
-- environment variables from docker-compose.yml

-- Connect to the REMS database (automatically created)
-- Note: \c uses the database name from POSTGRES_DB environment variable
\c rems;

-- Create the REMS schema and grant permissions
-- Note: User permissions are automatically set by PostgreSQL initialization
CREATE SCHEMA IF NOT EXISTS rems;

-- Grant all privileges on the schema to the database user
-- Note: The user name comes from POSTGRES_USER environment variable
GRANT ALL ON SCHEMA rems TO rems_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA rems TO rems_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA rems TO rems_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA rems TO rems_user;

-- Set default search path for the user
-- This ensures the REMS schema is used by default
ALTER USER rems_user SET search_path = rems, public;

-- Create any additional database-level configurations here
-- For example, extensions that might be needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'REMS database initialized successfully';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'Schema: rems created and configured';
    RAISE NOTICE 'User permissions granted';
END $$;