const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * Printrove Token Service
 * Auto-generates and caches Bearer token from email/password
 * Token is refreshed when it expires or fails
 */
class PrintroveTokenService {
    constructor() {
        this.token = null;
        this.expiresAt = null;
        this.tokenUrl = 'https://api.printrove.com/api/external/token';
    }

    /**
     * Get a valid token — fetches a new one if expired or missing
     */
    async getToken() {
        if (this.token && this.expiresAt && new Date() < new Date(this.expiresAt)) {
            return this.token;
        }

        const email = process.env.PRINTROVE_EMAIL;
        const password = process.env.PRINTROVE_PASSWORD;

        if (!email || !password) {
            throw new Error('PRINTROVE_EMAIL and PRINTROVE_PASSWORD must be set in .env');
        }

        try {
            logger.info('Fetching new Printrove auth token...');
            const response = await axios.post(
                this.tokenUrl,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 15000
                }
            );

            const data = response.data;
            if (!data.access_token) {
                throw new Error('No access_token in Printrove response');
            }

            this.token = data.access_token;
            this.expiresAt = data.expires_at || null;
            logger.info(`Printrove token fetched. Expires: ${this.expiresAt || 'unknown'}`);
            return this.token;
        } catch (err) {
            logger.error(`Printrove token fetch failed: ${err.message}`);
            throw err;
        }
    }

    /**
     * Get ready-to-use auth headers with valid Bearer token
     */
    async getHeaders() {
        const token = await this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Force token refresh (call when API returns 401)
     */
    invalidate() {
        this.token = null;
        this.expiresAt = null;
        logger.info('Printrove token invalidated — will refresh on next request');
    }
}

module.exports = new PrintroveTokenService();
