const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Validate environment on startup
const envValidator = require('./utils/validate-env');
// Configure Cloudinary
const { cloudinary, upload } = require('./config/cloudinary');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection, sequelize } = require('./config/sequelize');
const { connectRedis } = require('./config/redis');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const scheduler = require('./jobs/scheduler');

// Create Express app
const app = express();

// Middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'https://ruthan.com',
  'https://www.ruthan.com',
  'https://admin.ruthan.com',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/tracking', require('./routes/tracking')); // Shipping transparency
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Step 1: Validate environment configuration
    console.log('Validating environment configuration...\n');
    
    // Bypass env validation in local dev if user just wants it to boot up without strict keys
    if(process.env.NODE_ENV === 'production') {
      const isValid = await envValidator.validate();
      if (!isValid) {
        console.error('\n❌ Environment validation failed. Please fix the errors above.\n');
        process.exit(1);
      }
      console.log('✓ Environment validated successfully\n');
    }

    // Step 2: Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('Database connection failed - continuing without strict DB lock for local preview');
    } else {
      // Step 3: Sync database
      await syncDatabase();
    }

    // Step 4: Connect to Redis (optional based on ENV)
    if(process.env.REDIS_URL) {
      await connectRedis().catch(e => console.log("Redis not connected, skipping caching."));
    }

    // Step 5: Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

module.exports = app;
