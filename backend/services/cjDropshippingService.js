const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// File-based token cache so token survives across process restarts
const TOKEN_CACHE_FILE = path.join(require('os').tmpdir(), 'cj_token_cache.json');

function loadCachedToken() {
    try {
        if (fs.existsSync(TOKEN_CACHE_FILE)) {
            const data = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf8'));
            if (data.accessToken && data.tokenExpiry && new Date() < new Date(data.tokenExpiry)) {
                return data;
            }
        }
    } catch (_) {}
    return null;
}

function saveCachedToken(accessToken, tokenExpiry) {
    try {
        fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify({ accessToken, tokenExpiry }), 'utf8');
    } catch (_) {}
}

class CJDropshippingService {
    constructor() {
        this.email = process.env.CJ_DROPSHIP_EMAIL;
        this.password = process.env.CJ_DROPSHIP_PASSWORD;
        this.apiKey = process.env.CJ_API_KEY;
        this.baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1';
        // Load from file cache first
        const cached = loadCachedToken();
        this.accessToken = cached ? cached.accessToken : null;
        this.tokenExpiry = cached ? new Date(cached.tokenExpiry) : null;
    }

    /**
     * Get access token from CJ API using email + API key (not password)
     */
    async getAccessToken() {
        // Return cached token if still valid
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            // CJ API v2: authenticate with email + apiKey (not password)
            const response = await axios.post(`${this.baseUrl}/authentication/getAccessToken`, {
                email: this.email,
                password: this.apiKey  // CJ API key is used as password in v2
            });

            if (response.data && response.data.result && response.data.data) {
                this.accessToken = response.data.data.accessToken;
                this.tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
                // Persist token to file so next process run reuses it
                saveCachedToken(this.accessToken, this.tokenExpiry);
                logger.info('CJ Dropshipping: Access token obtained successfully');
                return this.accessToken;
            } else {
                throw new Error(response.data?.message || 'Failed to get access token');
            }
        } catch (error) {
            const responseData = error.response?.data;
            // If rate-limited but we have an old token, keep using it
            if (responseData?.code === 1600200 && this.accessToken) {
                logger.warn('CJ auth rate-limited (429), reusing existing token');
                return this.accessToken;
            }
            logger.error('CJ authentication failed', {
                error: error.message,
                response: responseData
            });
            throw new Error(`CJ Authentication failed: ${responseData?.message || error.message}`);
        }
    }

    /**
     * Make authenticated request to CJ API
     */
    async makeRequest(endpoint, data = {}, method = 'POST') {
        try {
            // Get fresh access token
            const token = await this.getAccessToken();

            const config = {
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'CJ-Access-Token': token,
                    'Content-Type': 'application/json'
                }
            };

            if (method === 'POST') {
                config.data = data;
            } else {
                config.params = data;
            }

            const response = await axios(config);

            // CJ API returns success in response.data.result === true
            if (response.data && response.data.result === false) {
                throw new Error(response.data.message || 'CJ API returned error');
            }

            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error(`CJ API Error: ${endpoint}`, {
                    status: error.response.status,
                    message: error.response.data?.message || error.message
                });
                throw new Error(`CJ API Error: ${error.response.data?.message || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Create order in CJ Dropshipping system
     */
    async createOrder(orderData) {
        try {
            const response = await this.makeRequest('/shopping/order/createOrder', {
                orderNumber: orderData.orderNumber,
                shippingCountry: orderData.shippingAddress.country || 'IN',
                shippingProvince: orderData.shippingAddress.state,
                shippingCity: orderData.shippingAddress.city,
                shippingAddress: orderData.shippingAddress.address,
                shippingCustomerName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
                shippingPhone: orderData.shippingAddress.phone,
                shippingZip: orderData.shippingAddress.pincode,
                shippingEmail: orderData.shippingAddress.email || orderData.user.email,
                products: orderData.items.map(item => ({
                    vid: item.product.cjVariantId,
                    quantity: item.quantity
                }))
            });

            logger.info('CJ Dropshipping order created successfully', {
                orderNumber: orderData.orderNumber,
                cjOrderId: response.data?.orderId
            });

            return {
                success: true,
                cjOrderId: response.data?.orderId,
                status: 'pending'
            };
        } catch (error) {
            logger.error('CJ Dropshipping order creation failed', {
                error: error.message,
                orderNumber: orderData.orderNumber
            });
            throw error;
        }
    }

    /**
     * Get tracking information
     */
    async getTracking(cjOrderNumber) {
        try {
            const response = await this.makeRequest('/shopping/order/getOrderDetail', {
                orderNumber: cjOrderNumber
            });

            const order = response.data;

            return {
                trackingNumber: order.logisticsTrackNumber,
                carrier: order.logisticsName,
                trackingUrl: order.trackingUrl,
                status: this.mapCJStatus(order.orderStatus),
                history: order.trackingInfo?.map(event => ({
                    timestamp: event.time,
                    location: event.location,
                    status: event.status,
                    description: event.trackingStatus
                })) || []
            };
        } catch (error) {
            logger.error('Failed to get CJ tracking', {
                error: error.message,
                cjOrderNumber
            });
            return null;
        }
    }

    /**
     * Map CJ status codes to our standard status
     */
    mapCJStatus(cjStatus) {
        const statusMap = {
            '0': 'pending',
            '1': 'processing',
            '2': 'shipped',
            '3': 'delivered',
            '4': 'cancelled',
            '5': 'out_for_delivery'
        };
        return statusMap[String(cjStatus)] || 'unknown';
    }

    /**
     * Get product list
     */
    async getProducts(params = {}) {
        try {
            const response = await this.makeRequest('/product/list', {
                pageNum: params.page || 1,
                pageSize: params.pageSize || 50,
                categoryId: params.categoryId
            }, 'GET');

            const products = response.data?.list || [];
            logger.info(`Retrieved ${products.length} products from CJ Dropshipping`);
            return products;
        } catch (error) {
            logger.error('Failed to get CJ products', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Get product details
     */
    async getProductDetail(productId) {
        try {
            const response = await this.makeRequest('/product/query', {
                pid: productId
            }, 'GET');

            return response.data;
        } catch (error) {
            logger.error('Failed to get CJ product detail', {
                error: error.message,
                productId
            });
            return null;
        }
    }

    /**
     * Test connection
     */
    async testConnection() {
        try {
            // Try to get a small product list as a connection test
            const response = await this.makeRequest('/product/list', {
                pageNum: 1,
                pageSize: 1
            });

            return {
                success: true,
                message: 'CJ Dropshipping API connection successful',
                productCount: response.data?.total || 0
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.toString()
            };
        }
    }
}

module.exports = new CJDropshippingService();

