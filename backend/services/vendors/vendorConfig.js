require('dotenv').config();

/**
 * Vendor Configuration Manager
 * Centralizes all vendor API configurations
 */
class VendorConfig {
    constructor() {
        this.vendors = {
            qikink: {
                name: 'Qikink',
                apiKey: process.env.QIKINK_API_KEY,
                apiSecret: process.env.QIKINK_API_SECRET,
                baseUrl: process.env.QIKINK_BASE_URL || 'https://api.qikink.com',
                enabled: process.env.QIKINK_ENABLED === 'true',
                authType: 'basic', // Basic Auth
                timeout: 30000
            },
            printrove: {
                name: 'Printrove',
                apiToken: process.env.PRINTROVE_API_TOKEN,
                baseUrl: process.env.PRINTROVE_BASE_URL || 'https://api.printrove.com/api/v1',
                enabled: process.env.PRINTROVE_ENABLED === 'true',
                authType: 'bearer', // Bearer Token
                timeout: 30000
            },
            seasonsway: {
                name: 'Seasonsway',
                apiKey: process.env.SEASONSWAY_API_KEY,
                baseUrl: process.env.SEASONSWAY_BASE_URL || 'https://api.seasonsway.com',
                enabled: process.env.SEASONSWAY_ENABLED === 'true',
                authType: 'apikey', // API Key in header
                timeout: 30000
            },
            vendorboat: {
                name: 'Vendorboat',
                apiKey: process.env.VENDORBOAT_API_KEY,
                baseUrl: process.env.VENDORBOAT_BASE_URL || 'https://api.vendorboat.com',
                enabled: process.env.VENDORBOAT_ENABLED === 'true',
                authType: 'apikey',
                timeout: 30000
            }
        };
    }

    /**
     * Get configuration for a specific vendor
     */
    getVendorConfig(vendorId) {
        const config = this.vendors[vendorId];
        if (!config) {
            throw new Error(`Unknown vendor: ${vendorId}`);
        }
        return config;
    }

    /**
     * Get all enabled vendors
     */
    getEnabledVendors() {
        return Object.keys(this.vendors).filter(
            vendorId => this.vendors[vendorId].enabled
        );
    }

    /**
     * Check if vendor is enabled
     */
    isVendorEnabled(vendorId) {
        return this.vendors[vendorId]?.enabled || false;
    }

    /**
     * Get auth headers for specific vendor
     */
    getAuthHeaders(vendorId) {
        const config = this.getVendorConfig(vendorId);

        switch (config.authType) {
            case 'basic':
                // Qikink: Basic Auth
                const credentials = Buffer.from(
                    `${config.apiKey}:${config.apiSecret}`
                ).toString('base64');
                return {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                };

            case 'bearer':
                // Printrove: Bearer Token
                return {
                    'Authorization': `Bearer ${config.apiToken}`,
                    'Content-Type': 'application/json'
                };

            case 'apikey':
                // Seasonsway & Vendorboat: API Key in header
                return {
                    'X-API-Key': config.apiKey,
                    'Content-Type': 'application/json'
                };

            default:
                return {
                    'Content-Type': 'application/json'
                };
        }
    }
}

module.exports = new VendorConfig();
