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
                clientId: process.env.QIKINK_API_KEY,       // 826421948352624
                apiSecret: process.env.QIKINK_API_SECRET,   // b32b8f16...
                baseUrl: process.env.QIKINK_BASE_URL || 'https://api.qikink.com',
                enabled: process.env.QIKINK_ENABLED === 'true',
                authType: 'basic', // Basic Auth: clientId:apiSecret
                timeout: 30000
            },
            printrove: {
                name: 'Printrove',
                email: process.env.PRINTROVE_EMAIL,
                password: process.env.PRINTROVE_PASSWORD,
                tokenUrl: 'https://api.printrove.com/api/external/token',
                baseUrl: process.env.PRINTROVE_BASE_URL || 'https://api.printrove.com/api/external',
                enabled: process.env.PRINTROVE_ENABLED === 'true',
                authType: 'printrove', // Email/password → Bearer token
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
            },
            baapstore: {
                name: 'Baap Store',
                apiKey: process.env.BAAP_STORE_API_KEY,
                baseUrl: process.env.BAAP_STORE_BASE_URL || 'https://baapstore.com/api/v1',
                enabled: process.env.BAAP_STORE_ENABLED === 'true',
                authType: 'bearer',
                timeout: 30000
            },
            eprolo: {
                name: 'Eprolo',
                apiKey: process.env.EPROLO_API_KEY,
                baseUrl: process.env.EPROLO_BASE_URL || 'https://openapi.eprolo.com',
                enabled: process.env.EPROLO_ENABLED === 'true',
                authType: 'bearer',
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
                // Qikink: Basic Auth (clientId:apiSecret)
                const credentials = Buffer.from(
                    `${config.clientId}:${config.apiSecret}`
                ).toString('base64');
                return {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                };

            case 'bearer':
                // Generic Bearer Token (Baap Store, Eprolo)
                return {
                    'Authorization': `Bearer ${config.apiKey || config.apiToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };

            case 'printrove':
                // Printrove uses email/password → token (handled by PrintroveTokenService)
                // Return placeholder; adapter calls PrintroveTokenService.getHeaders() instead
                return {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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
