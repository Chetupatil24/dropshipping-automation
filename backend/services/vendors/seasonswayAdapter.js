const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Seasonsway API Adapter
 * NOTE: Update specific API endpoints based on Seasonsway documentation
 */
class SeasonswayAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('seasonsway');
        this.vendorId = 'seasonsway';
    }

    /**
     * Create order on Seasonsway
     * TODO: Update endpoint and payload structure based on Seasonsway API docs
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Seasonsway integration is disabled');
            }

            const seasonswayOrder = this.transformOrder(orderData);

            logger.info(`Creating Seasonsway order for Order #${orderData.orderId}`);

            // TODO: Update endpoint path based on Seasonsway documentation
            const response = await axios.post(
                `${this.config.baseUrl}/api/orders/create`,
                seasonswayOrder,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            // TODO: Update response handling based on Seasonsway API response format
            if (response.data && response.data.success) {
                logger.info(`Seasonsway order created: ${response.data.order_id}`);
                return {
                    success: true,
                    vendorOrderId: response.data.order_id,
                    vendor: 'seasonsway',
                    trackingNumber: response.data.tracking_id || null,
                    estimatedDelivery: response.data.delivery_date || null,
                    rawResponse: response.data
                };
            } else {
                throw new Error(response.data.error || 'Seasonsway order creation failed');
            }

        } catch (error) {
            logger.error('Seasonsway order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'seasonsway',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Seasonsway format
     * TODO: Update payload structure based on Seasonsway API requirements
     */
    transformOrder(orderData) {
        return {
            order_id: orderData.orderId.toString(),
            customer: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                phone: orderData.customer.phone
            },
            shipping_address: {
                address: orderData.customer.address,
                city: orderData.customer.city,
                state: orderData.customer.state,
                pincode: orderData.customer.pincode,
                country: 'India'
            },
            items: orderData.items.map(item => ({
                sku: item.vendor_sku,
                quantity: item.quantity,
                product_name: item.name
            })),
            shipping_method: orderData.shippingMethod || 'standard',
            payment_status: orderData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'paid'
        };
    }

    /**
     * Get order status from Seasonsway
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/orders/${vendorOrderId}`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.success) {
                return {
                    success: true,
                    status: response.data.status,
                    trackingNumber: response.data.tracking_id,
                    carrier: response.data.courier,
                    shippedAt: response.data.shipped_date,
                    deliveredAt: response.data.delivered_date,
                    rawData: response.data
                };
            }

            throw new Error('Failed to get order status');

        } catch (error) {
            logger.error('Seasonsway status check failed', {
                vendorOrderId,
                error: error.message
            });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get product catalog from Seasonsway
     */
    async getProducts(page = 1, limit = 100) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/products`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    params: { page, limit },
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.success) {
                return {
                    success: true,
                    products: response.data.products.map(p => this.transformProduct(p)),
                    total: response.data.total,
                    hasMore: response.data.has_more
                };
            }

            throw new Error('Failed to fetch products');

        } catch (error) {
            logger.error('Seasonsway product fetch failed', { error: error.message });
            return {
                success: false,
                products: [],
                error: error.message
            };
        }
    }

    /**
     * Transform Seasonsway product to our format
     */
    transformProduct(seasonswayProduct) {
        return {
            vendor: 'seasonsway',
            vendor_sku: seasonswayProduct.sku,
            vendor_product_id: seasonswayProduct.id,
            name: seasonswayProduct.name,
            description: seasonswayProduct.description,
            vendor_price: seasonswayProduct.price,
            images: seasonswayProduct.images || [],
            category: seasonswayProduct.category,
            variants: seasonswayProduct.variants || [],
            customizable: seasonswayProduct.customizable || false,
            in_stock: seasonswayProduct.stock > 0
        };
    }

    /**
     * Cancel order on Seasonsway
     */
    async cancelOrder(vendorOrderId, reason) {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/api/orders/${vendorOrderId}/cancel`,
                { reason },
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            return {
                success: response.data.success,
                message: response.data.message
            };

        } catch (error) {
            logger.error('Seasonsway order cancellation failed', {
                vendorOrderId,
                error: error.message
            });
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new SeasonswayAdapter();
