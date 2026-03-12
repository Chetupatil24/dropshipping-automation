const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Baap Store API Adapter
 * Baap Store is an Indian dropshipping platform (https://baapstore.com)
 * Authentication: API Key in Authorization header
 * Docs: https://baapstore.com/api-docs
 */
class BaapStoreAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('baapstore');
        this.vendorId = 'baapstore';
        this.baseUrl = this.config.baseUrl;
    }

    /**
     * Get auth headers
     */
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Fetch product catalog from Baap Store
     */
    async getProducts({ page = 1, limit = 50, category = null } = {}) {
        try {
            if (!this.config.enabled) {
                logger.info('Baap Store integration disabled');
                return [];
            }

            const params = { page, limit };
            if (category) params.category = category;

            const response = await axios.get(`${this.baseUrl}/products`, {
                headers: this.getHeaders(),
                params,
                timeout: this.config.timeout
            });

            const data = response.data;
            return data.products || data.data || data || [];
        } catch (error) {
            logger.error('Baap Store getProducts failed', {
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
            const response = await axios.get(`${this.baseUrl}/products/${productId}`, {
                headers: this.getHeaders(),
                timeout: this.config.timeout
            });

            const data = response.data;
            return data.product || data.data || data;
        } catch (error) {
            logger.error('Baap Store getProduct failed', {
                productId,
                error: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }

    /**
     * Create order on Baap Store
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Baap Store integration is disabled');
            }

            const baapOrder = this.transformOrder(orderData);

            logger.info(`Creating Baap Store order for Order #${orderData.orderId}`);

            const response = await axios.post(
                `${this.baseUrl}/orders`,
                baapOrder,
                {
                    headers: this.getHeaders(),
                    timeout: this.config.timeout
                }
            );

            const responseData = response.data;

            if (responseData && (responseData.success || responseData.status === 'success' || responseData.order_id || responseData.id)) {
                const orderId = responseData.order_id || responseData.id || responseData.data?.order_id;
                logger.info(`Baap Store order created: ${orderId}`);

                return {
                    success: true,
                    vendorOrderId: String(orderId),
                    vendor: 'baapstore',
                    trackingNumber: responseData.tracking_number || responseData.awb || null,
                    estimatedDelivery: responseData.estimated_delivery || null,
                    rawResponse: responseData
                };
            } else {
                throw new Error(responseData.message || responseData.error || 'Baap Store order creation failed');
            }

        } catch (error) {
            logger.error('Baap Store order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'baapstore',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Baap Store format
     */
    transformOrder(orderData) {
        return {
            external_order_id: String(orderData.orderId),
            shipping_address: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                phone: orderData.customer.phone,
                address_line1: orderData.customer.address,
                city: orderData.customer.city,
                state: orderData.customer.state,
                pincode: orderData.customer.pincode,
                country: 'India'
            },
            products: orderData.items.map(item => ({
                sku: item.vendor_sku || item.sku,
                quantity: item.quantity,
                product_name: item.name,
                variant_id: item.variant_id || null
            })),
            payment_mode: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
            shipping_method: orderData.shippingMethod || 'standard'
        };
    }

    /**
     * Get order status/tracking from Baap Store
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(`${this.baseUrl}/orders/${vendorOrderId}`, {
                headers: this.getHeaders(),
                timeout: this.config.timeout
            });

            const data = response.data;
            const order = data.order || data.data || data;

            return {
                success: true,
                vendorOrderId,
                status: order.status || order.order_status,
                trackingNumber: order.tracking_number || order.awb,
                carrier: order.carrier || order.courier,
                trackingUrl: order.tracking_url || null,
                estimatedDelivery: order.estimated_delivery || null,
                rawData: order
            };
        } catch (error) {
            logger.error('Baap Store getOrderStatus failed', {
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
     * Cancel order on Baap Store
     */
    async cancelOrder(vendorOrderId, reason = 'Customer request') {
        try {
            const response = await axios.post(
                `${this.baseUrl}/orders/${vendorOrderId}/cancel`,
                { reason },
                {
                    headers: this.getHeaders(),
                    timeout: this.config.timeout
                }
            );

            const data = response.data;
            return {
                success: !!(data.success || data.status === 'success'),
                message: data.message || 'Order cancellation requested',
                rawResponse: data
            };
        } catch (error) {
            logger.error('Baap Store cancelOrder failed', { vendorOrderId, error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check product availability
     */
    async checkStock(skus) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/inventory/check`,
                { skus },
                {
                    headers: this.getHeaders(),
                    timeout: this.config.timeout
                }
            );

            return response.data.inventory || response.data || [];
        } catch (error) {
            logger.error('Baap Store checkStock failed', { error: error.message });
            return [];
        }
    }
}

module.exports = new BaapStoreAdapter();
