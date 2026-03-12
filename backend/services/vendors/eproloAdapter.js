const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Eprolo API Adapter
 * Eprolo is a global dropshipping + POD platform (https://eprolo.com)
 * Open API: https://openapi.eprolo.com
 * Authentication: API Key in Authorization header
 */
class EproloAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('eprolo');
        this.vendorId = 'eprolo';
        this.baseUrl = this.config.baseUrl;
    }

    /**
     * Get auth headers for Eprolo API
     */
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Fetch product catalog from Eprolo
     */
    async getProducts({ page = 1, pageSize = 50, categoryId = null, keyword = null } = {}) {
        try {
            if (!this.config.enabled) {
                logger.info('Eprolo integration disabled');
                return [];
            }

            const params = { page, pageSize };
            if (categoryId) params.categoryId = categoryId;
            if (keyword) params.keyword = keyword;

            const response = await axios.get(`${this.baseUrl}/product/list`, {
                headers: this.getHeaders(),
                params,
                timeout: this.config.timeout
            });

            const data = response.data;
            if (data.result) {
                return data.result.productList || data.result || [];
            }
            return data.productList || data.data || data || [];
        } catch (error) {
            logger.error('Eprolo getProducts failed', {
                error: error.message,
                response: error.response?.data
            });
            return [];
        }
    }

    /**
     * Get single product details
     */
    async getProduct(productId) {
        try {
            const response = await axios.get(`${this.baseUrl}/product/detail`, {
                headers: this.getHeaders(),
                params: { productId },
                timeout: this.config.timeout
            });

            const data = response.data;
            return data.result || data.product || data.data || data;
        } catch (error) {
            logger.error('Eprolo getProduct failed', {
                productId,
                error: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }

    /**
     * Create order on Eprolo
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Eprolo integration is disabled');
            }

            const eproloOrder = this.transformOrder(orderData);

            logger.info(`Creating Eprolo order for Order #${orderData.orderId}`);

            const response = await axios.post(
                `${this.baseUrl}/order/add`,
                eproloOrder,
                {
                    headers: this.getHeaders(),
                    timeout: this.config.timeout
                }
            );

            const responseData = response.data;

            // Eprolo responses: { code: 200, result: { orderId: "..." } }
            if (responseData && (responseData.code === 200 || responseData.code === '200' || responseData.success)) {
                const result = responseData.result || responseData.data || {};
                const orderId = result.orderId || result.order_id || result.id || responseData.orderId;

                logger.info(`Eprolo order created: ${orderId}`);

                return {
                    success: true,
                    vendorOrderId: String(orderId),
                    vendor: 'eprolo',
                    trackingNumber: result.trackingNumber || null,
                    estimatedDelivery: result.estimatedDelivery || null,
                    rawResponse: responseData
                };
            } else {
                throw new Error(responseData.message || responseData.msg || 'Eprolo order creation failed');
            }

        } catch (error) {
            logger.error('Eprolo order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'eprolo',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Eprolo format
     */
    transformOrder(orderData) {
        return {
            orderNo: String(orderData.orderId),
            shippingAddress: {
                receiverName: orderData.customer.name,
                countryCode: 'IN',
                province: orderData.customer.state,
                city: orderData.customer.city,
                address: orderData.customer.address,
                zip: orderData.customer.pincode,
                email: orderData.customer.email,
                phone: orderData.customer.phone
            },
            orderProductList: orderData.items.map(item => ({
                productId: item.product_id || item.vendor_sku,
                productSku: item.vendor_sku || item.sku,
                quantity: item.quantity,
                productName: item.name
            })),
            paymentMethod: orderData.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
            logisticsMethod: orderData.shippingMethod || 'standard'
        };
    }

    /**
     * Get order tracking from Eprolo
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(`${this.baseUrl}/order/query`, {
                headers: this.getHeaders(),
                params: { orderId: vendorOrderId },
                timeout: this.config.timeout
            });

            const data = response.data;
            const result = data.result || data.data || data;

            return {
                success: true,
                vendorOrderId,
                status: result.orderStatus || result.status,
                trackingNumber: result.trackingNumber || result.logistics_no,
                carrier: result.logisticsCompany || result.carrier,
                trackingUrl: result.trackingUrl || null,
                estimatedDelivery: result.estimatedDelivery || null,
                rawData: result
            };
        } catch (error) {
            logger.error('Eprolo getOrderStatus failed', {
                vendorOrderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendorOrderId,
                error: error.message
            };
        }
    }

    /**
     * Cancel order on Eprolo
     */
    async cancelOrder(vendorOrderId, reason = 'Customer request') {
        try {
            const response = await axios.post(
                `${this.baseUrl}/order/cancel`,
                { orderId: vendorOrderId, reason },
                {
                    headers: this.getHeaders(),
                    timeout: this.config.timeout
                }
            );

            const data = response.data;
            return {
                success: data.code === 200 || data.code === '200' || !!data.success,
                message: data.message || data.msg || 'Order cancellation requested',
                rawResponse: data
            };
        } catch (error) {
            logger.error('Eprolo cancelOrder failed', { vendorOrderId, error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get tracking info by tracking number
     */
    async getTracking(trackingNumber) {
        try {
            const response = await axios.get(`${this.baseUrl}/logistics/track`, {
                headers: this.getHeaders(),
                params: { trackingNumber },
                timeout: this.config.timeout
            });

            const data = response.data;
            const result = data.result || data.data || data;

            return {
                success: true,
                trackingNumber,
                status: result.status,
                carrier: result.logisticsCompany,
                trackingUrl: result.trackingUrl,
                history: (result.trackDetailList || result.events || []).map(event => ({
                    timestamp: event.time || event.timestamp,
                    description: event.description || event.event,
                    location: event.location || ''
                }))
            };
        } catch (error) {
            logger.error('Eprolo getTracking failed', { trackingNumber, error: error.message });
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EproloAdapter();
