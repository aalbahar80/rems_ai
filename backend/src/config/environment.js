require('dotenv').config();

// Environment configuration
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'rems',
    user: process.env.DB_USER || 'rems_user',
    password: process.env.DB_PASSWORD || 'rems_password',
    schema: process.env.DB_SCHEMA || 'rems',
  },

  // JWT configuration
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests per window
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },

  // Email configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'noreply@rems.local',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // API configuration
  api: {
    version: 'v1',
    basePath: '/api/v1',
    maxUploadSize: process.env.MAX_UPLOAD_SIZE || '10mb',
    allowedFileTypes: (
      process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png'
    ).split(','),
  },

  // Pagination defaults
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT) || 20,
    maxLimit: parseInt(process.env.MAX_PAGE_LIMIT) || 100,
  },
};

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

if (config.server.env === 'production') {
  requiredEnvVars.push('JWT_SECRET');
}

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    '❌ Missing required environment variables:',
    missingVars.join(', ')
  );
  console.error('Please check your .env file configuration');
  process.exit(1);
}

// Log configuration on startup
if (config.server.env !== 'test') {
  console.log('🚀 Environment configuration loaded:');
  console.log(`   Environment: ${config.server.env}`);
  console.log(`   Server: ${config.server.host}:${config.server.port}`);
  console.log(
    `   Database: ${config.database.host}:${config.database.port}/${config.database.database}`
  );
  console.log(`   API Base Path: ${config.api.basePath}`);
}

module.exports = config;
