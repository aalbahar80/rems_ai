const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'rems',
  user: process.env.DB_USER || 'rems_user',
  password: process.env.DB_PASSWORD || 'rems_password',
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // SSL configuration for production
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Connection event handlers
pool.on('connect', (client) => {
  console.log('🔗 Database client connected');
});

pool.on('error', (err, client) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Database connection test function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT NOW() as current_time, version() as postgres_version'
    );
    client.release();

    console.log('✅ Database connection successful');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log(
      '🗄️  PostgreSQL version:',
      result.rows[0].postgres_version.split(' ')[0]
    );

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Schema validation function
const validateSchema = async () => {
  try {
    const client = await pool.connect();

    // Check table count in rems schema
    const tableCountQuery = `
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'rems'
    `;
    const tableResult = await client.query(tableCountQuery);

    // Check key data counts
    const dataChecks = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM rems.owners'),
      client.query('SELECT COUNT(*) as count FROM rems.properties'),
      client.query('SELECT COUNT(*) as count FROM rems.units'),
      client.query('SELECT COUNT(*) as count FROM rems.tenants'),
    ]);

    client.release();

    const schemaInfo = {
      tables: parseInt(tableResult.rows[0].table_count),
      owners: parseInt(dataChecks[0].rows[0].count),
      properties: parseInt(dataChecks[1].rows[0].count),
      units: parseInt(dataChecks[2].rows[0].count),
      tenants: parseInt(dataChecks[3].rows[0].count),
    };

    console.log('📊 Schema validation results:');
    console.log(`   Tables in rems schema: ${schemaInfo.tables}/23`);
    console.log(`   Owners: ${schemaInfo.owners}`);
    console.log(`   Properties: ${schemaInfo.properties}`);
    console.log(`   Units: ${schemaInfo.units}`);
    console.log(`   Tenants: ${schemaInfo.tenants}`);

    return { success: true, data: schemaInfo };
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    return { success: false, error: error.message };
  }
};

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🔍 Query executed:', {
      text: text.substring(0, 50) + '...',
      duration,
      rows: result.rowCount,
    });
    return result;
  } catch (error) {
    console.error('❌ Query error:', {
      text: text.substring(0, 50) + '...',
      error: error.message,
    });
    throw error;
  }
};

// Get connection from pool
const getClient = async () => {
  return await pool.connect();
};

// Graceful shutdown
const closePool = async () => {
  console.log('🔒 Closing database connection pool...');
  await pool.end();
};

// Handle process termination
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  validateSchema,
  closePool,
};
