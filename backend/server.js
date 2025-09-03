const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configuration and database
const config = require('./src/config/environment');
const { testConnection, validateSchema } = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth');
const propertyRoutes = require('./src/routes/properties');
const tenantRoutes = require('./src/routes/tenants');
const financialRoutes = require('./src/routes/financial');
const maintenanceRoutes = require('./src/routes/maintenance');
const firmRoutes = require('./src/routes/firms');
const userRoutes = require('./src/routes/users');
const accountantRoutes = require('./src/routes/accountants');
const settingsRoutes = require('./src/routes/settings');

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.security.corsOrigin,
    credentials: true,
  })
);

// Logging middleware
if (config.server.env !== 'test') {
  app.use(morgan(config.logging.format));
}

// Body parsing middleware
app.use(express.json({ limit: config.api.maxUploadSize }));
app.use(
  express.urlencoded({ extended: true, limit: config.api.maxUploadSize })
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'REMS API Server is running!',
    version: config.api.version,
    environment: config.server.env,
    timestamp: new Date().toISOString(),
  });
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    message: 'REMS API Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Database health check
app.get('/api/v1/health/db', async (req, res) => {
  try {
    const connectionTest = await testConnection();
    const schemaValidation = await validateSchema();

    if (connectionTest.success && schemaValidation.success) {
      res.json({
        success: true,
        status: 'healthy',
        message: 'Database connection successful',
        data: {
          connection: connectionTest.data,
          schema: schemaValidation.data,
          expected_tables: 23,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: {
          connection: connectionTest.error,
          schema: schemaValidation.error,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: {
        message: 'Database health check failed',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// Schema info endpoint
app.get('/api/v1/health/schema', async (req, res) => {
  try {
    const schemaValidation = await validateSchema();

    if (schemaValidation.success) {
      res.json({
        success: true,
        message: 'Schema validation successful',
        data: schemaValidation.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        error: {
          message: 'Schema validation failed',
          details: schemaValidation.error,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        message: 'Schema validation error',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/financial', financialRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/firms', firmRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accountants', accountantRoutes);
app.use('/api/v1/settings', settingsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, _next) => {
  console.error('❌ Unhandled error:', error);

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error',
      ...(config.server.env === 'development' && { stack: error.stack }),
    },
    timestamp: new Date().toISOString(),
  });
});

// Start server
const server = app.listen(config.server.port, config.server.host, async () => {
  console.log(
    `🚀 REMS API Server running on ${config.server.host}:${config.server.port}`
  );
  console.log(
    `📊 Health check: http://localhost:${config.server.port}/api/health`
  );
  console.log(
    `🗄️  Database health: http://localhost:${config.server.port}/api/v1/health/db`
  );
  console.log(
    `📋 Schema info: http://localhost:${config.server.port}/api/v1/health/schema`
  );

  // Test database connection on startup
  console.log('\n🔍 Testing database connection...');
  await testConnection();
  await validateSchema();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;
