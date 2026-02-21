const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Printrove API Adapter
 * Handles all interactions with Printrove Print-on-Demand service
 */
class PrintroveAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('printrove');
        this.vendorId = 'printrove';
    }

    /**
     * Create order on Printrove
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Printrove integration is disabled');
            }

            const printroveOrder = this.transformOrder(orderData);

            logger.info(`Creating Printrove order for Order #${orderData.orderId}`);

            const response = await axios.post(
                `${this.config.baseUrl}/orders`,
                printroveOrder,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.status === 'success') {
                logger.info(`Printrove order created: ${response.data.data.order_id}`);
                return {
                    success: true,
                    vendorOrderId: response.data.data.order_id,
                    vendor: 'printrove',
                    trackingNumber: response.data.data.awb_number || null,
                    estimatedDelivery: response.data.data.expected_delivery_date || null,
                    rawResponse: response.data
                };
            } else {
                throw new Error(response.data.message || 'Printrove order creation failed');
            }

        } catch (error) {
            logger.error('Printrove order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'printrove',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Printrove format
     */
    transformOrder(orderData) {
        return {
            external_order_id: orderData.orderId.toString(),
            customer_details: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                phone: orderData.customer.phone,
                address: {
                    line1: orderData.customer.address,
                    line2: orderData.customer.address2 || '',
                    city: orderData.customer.city,
                    state: orderData.customer.state,
                    pincode: orderData.customer.pincode,
                    country: 'IN'
                }
            },
            products: orderData.items.map(item => ({
                sku: item.vendor_sku,
                quantity: item.quantity,
                name: item.name,
                design_url: item.design_url || null,
                mockup_url: item.mockup_url || null,
                customization_data: item.customization || {}
            })),
            shipping_mode: orderData.shippingMethod || 'surface',
            payment_mode: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
            notes: orderData.notes || ''
        };
    }

    /**
     * Get order status from Printrove
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/orders/${vendorOrderId}`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.status === 'success') {
                const order = response.data.data;
                return {
                    success: true,
                    status: order.order_status,
                    trackingNumber: order.awb_number,
                    carrier: order.courier_name,
                    shippedAt: order.shipped_date,
                    deliveredAt: order.delivered_date,
                    rawData: order
                };
            }

            throw new Error('Failed to get order status');

        } catch (error) {
            logger.error('Printrove status check failed', {
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
     * Get product catalog from Printrove
     */
    async getProducts(page = 1, limit = 100) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/catalog/products`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    params: { page, per_page: limit },
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    products: response.data.data.products.map(p => this.transformProduct(p)),
                    total: response.data.data.total_count,
                    hasMore: response.data.data.has_more
                };
            }

            throw new Error('Failed to fetch products');

        } catch (error) {
            logger.error('Printrove product fetch failed', { error: error.message });
            return {
                success: false,
                products: [],
                error: error.message
            };
        }
    }

    /**
     * Transform Printrove product to our format
     */
    transformProduct(printroveProduct) {
        return {
            vendor: 'printrove',
            vendor_sku: printroveProduct.sku,
            vendor_product_id: printroveProduct.product_id,
            name: printroveProduct.product_name,
            description: printroveProduct.description,
            vendor_price: printroveProduct.base_price,
            images: printroveProduct.product_images || [],
            category: printroveProduct.category_name,
            variants: printroveProduct.variants || [],
            customizable: true, // Printrove is always customizable
            in_stock: printroveProduct.is_available
        };
    }

    /**
     * Cancel order on Printrove
     */
    async cancelOrder(vendorOrderId, reason) {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/orders/${vendorOrderId}/cancel`,
                { cancellation_reason: reason },
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            return {
                success: response.data.status === 'success',
                message: response.data.message
            };

        } catch (error) {
            logger.error('Printrove order cancellation failed', {
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
     * Upload design to Printrove
     */
    async uploadDesign(imageUrl, productId) {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/designs/upload`,
                {
                    image_url: imageUrl,
                    product_id: productId
                },
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: 60000 // Longer timeout for uploads
                }
            );

            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    designId: response.data.data.design_id,
                    mockupUrl: response.data.data.mockup_url
                };
            }

            throw new Error('Design upload failed');

        } catch (error) {
            logger.error('Printrove design upload failed', { error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PrintroveAdapter();
