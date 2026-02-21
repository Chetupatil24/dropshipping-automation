const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Qikink API Adapter
 * Handles all interactions with Qikink Print-on-Demand service
 */
class QikinkAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('qikink');
        this.vendorId = 'qikink';
    }

    /**
     * Create order on Qikink
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Qikink integration is disabled');
            }

            const qikinkOrder = this.transformOrder(orderData);

            logger.info(`Creating Qikink order for Order #${orderData.orderId}`);

            const response = await axios.post(
                `${this.config.baseUrl}/api/order`,
                qikinkOrder,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.success) {
                logger.info(`Qikink order created: ${response.data.order_id}`);
                return {
                    success: true,
                    vendorOrderId: response.data.order_id,
                    vendor: 'qikink',
                    trackingNumber: response.data.tracking_number || null,
                    estimatedDelivery: response.data.estimated_delivery || null,
                    rawResponse: response.data
                };
            } else {
                throw new Error(response.data.message || 'Qikink order creation failed');
            }

        } catch (error) {
            logger.error('Qikink order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'qikink',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Qikink format
     */
    transformOrder(orderData) {
        return {
            shipping_address: {
                name: orderData.customer.name,
                address_line_1: orderData.customer.address,
                address_line_2: orderData.customer.address2 || '',
                city: orderData.customer.city,
                state: orderData.customer.state,
                pincode: orderData.customer.pincode,
                phone: orderData.customer.phone,
                email: orderData.customer.email
            },
            line_items: orderData.items.map(item => ({
                sku: item.vendor_sku,
                quantity: item.quantity,
                product_name: item.name,
                variant_id: item.variant_id || null,
                customization: item.customization || {}
            })),
            order_reference: orderData.orderId.toString(),
            shipping_method: orderData.shippingMethod || 'standard',
            payment_method: orderData.paymentMethod || 'prepaid'
        };
    }

    /**
     * Get order status from Qikink
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/order/${vendorOrderId}`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.success) {
                return {
                    success: true,
                    status: response.data.status,
                    trackingNumber: response.data.tracking_number,
                    carrier: response.data.courier_name,
                    shippedAt: response.data.shipped_at,
                    deliveredAt: response.data.delivered_at,
                    rawData: response.data
                };
            }

            throw new Error('Failed to get order status');

        } catch (error) {
            logger.error('Qikink status check failed', {
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
     * Get product catalog from Qikink
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
                    hasMore: (page * limit) < response.data.total
                };
            }

            throw new Error('Failed to fetch products');

        } catch (error) {
            logger.error('Qikink product fetch failed', { error: error.message });
            return {
                success: false,
                products: [],
                error: error.message
            };
        }
    }

    /**
     * Transform Qikink product to our format
     */
    transformProduct(qikinkProduct) {
        return {
            vendor: 'qikink',
            vendor_sku: qikinkProduct.sku,
            vendor_product_id: qikinkProduct.id,
            name: qikinkProduct.name,
            description: qikinkProduct.description,
            vendor_price: qikinkProduct.base_price,
            images: qikinkProduct.images || [],
            category: qikinkProduct.category,
            variants: qikinkProduct.variants || [],
            customizable: qikinkProduct.customizable || false,
            in_stock: qikinkProduct.in_stock !== false
        };
    }

    /**
     * Cancel order on Qikink
     */
    async cancelOrder(vendorOrderId, reason) {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/api/order/${vendorOrderId}/cancel`,
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
            logger.error('Qikink order cancellation failed', {
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

module.exports = new QikinkAdapter();
