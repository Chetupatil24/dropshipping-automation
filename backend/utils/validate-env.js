const logger = require('./logger');

class EnvironmentValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    // Validate required environment variables
    validateRequired() {
        // Database: accept DATABASE_URL (Supabase) OR individual DB_* vars
        const hasDbUrl = !!process.env.DATABASE_URL;
        const hasDbParts = process.env.DB_HOST && process.env.DB_NAME &&
                           process.env.DB_USER && process.env.DB_PASSWORD;

        if (!hasDbUrl && !hasDbParts) {
            this.errors.push(
                'Missing database config: set DATABASE_URL (Supabase) OR DB_HOST/DB_NAME/DB_USER/DB_PASSWORD'
            );
        }

        // JWT is always required
        if (!process.env.JWT_SECRET) {
            this.errors.push('Missing required environment variable: JWT_SECRET');
        }

        // Validate JWT_SECRET strength
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
            this.warnings.push('JWT_SECRET should be at least 32 characters for security');
        }
    }

    // Validate optional but recommended variables
    validateOptional() {
        const optional = {
            'RAZORPAY_KEY_ID': 'Payment gateway (Razorpay) will not work',
            'RAZORPAY_KEY_SECRET': 'Payment gateway (Razorpay) will not work',
            'SHIPROCKET_EMAIL': 'Shipping automation will not work',
            'SHIPROCKET_PASSWORD': 'Shipping automation will not work',
            'EMAIL_HOST': 'Email notifications will not work',
            'EMAIL_USER': 'Email notifications will not work',
            'EMAIL_PASSWORD': 'Email notifications will not work'
        };

        Object.entries(optional).forEach(([key, impact]) => {
            if (!process.env[key]) {
                this.warnings.push(`Missing optional variable: ${key} - ${impact}`);
            }
        });
    }

    // Validate supplier integrations
    validateSuppliers() {
        const suppliers = {
            'ALIEXPRESS_API_KEY': 'AliExpress integration',
            'ALIEXPRESS_API_SECRET': 'AliExpress integration',
            'CJ_DROPSHIP_API_KEY': 'CJ Dropshipping integration',
            'CJ_DROPSHIP_EMAIL': 'CJ Dropshipping authentication',
            'CJ_DROPSHIP_PASSWORD': 'CJ Dropshipping authentication',
            'INDIAMART_API_KEY': 'IndiaMART inquiry fetching'
        };

        const missingSuppliers = [];
        Object.entries(suppliers).forEach(([key, desc]) => {
            if (!process.env[key]) {
                missingSuppliers.push(`${key} (${desc})`);
            }
        });

        if (missingSuppliers.length > 0) {
            this.warnings.push(
                `Supplier integrations partially configured. Missing:\n  ${missingSuppliers.join('\n  ')}`
            );
        }
    }

    // Test database connectivity
    async validateDatabase() {
        try {
            const { sequelize } = require('../config/sequelize');
            await sequelize.authenticate();
            logger.info('✓ Database connection successful');
            return true;
        } catch (error) {
            this.errors.push(`Database connection failed: ${error.message}`);
            return false;
        }
    }

    // Test Redis connectivity (optional — background jobs disabled without Redis)
    async validateRedis() {
        if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
            this.warnings.push('Redis not configured (REDIS_URL or REDIS_HOST). Background job queues will be disabled.');
            return true;
        }
        try {
            const Redis = require('ioredis');
            const redis = new Redis(process.env.REDIS_URL || {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                maxRetriesPerRequest: 1
            });

            await redis.ping();
            await redis.quit();
            logger.info('✓ Redis connection successful');
            return true;
        } catch (error) {
            this.warnings.push(`Redis connection failed: ${error.message} — background jobs will not run`);
            return true; // Non-fatal
        }
    }

    // Run all validations
    async validate() {
        logger.info('Starting environment validation...');

        // Synchronous validations
        this.validateRequired();
        this.validateOptional();
        this.validateSuppliers();

        // Async validations
        await this.validateDatabase();
        await this.validateRedis();

        // Report results
        this.report();

        return this.errors.length === 0;
    }

    // Report validation results
    report() {
        console.log('\n=== Environment Validation Report ===\n');

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✓ All validations passed!\n');
            return;
        }

        if (this.errors.length > 0) {
            console.log('❌ ERRORS (must fix):');
            this.errors.forEach(err => console.log(`  - ${err}`));
            console.log('');
        }

        if (this.warnings.length > 0) {
            console.log('⚠️  WARNINGS (recommended to fix):');
            this.warnings.forEach(warn => console.log(`  - ${warn}`));
            console.log('');
        }

        if (this.errors.length > 0) {
            console.log('System cannot start with errors. Please fix the issues above.\n');
        } else {
            console.log('System can start, but some features may be disabled.\n');
        }
    }
}

module.exports = new EnvironmentValidator();
