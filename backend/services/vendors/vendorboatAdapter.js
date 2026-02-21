const axios = require('axios');
const vendorConfig = require('./vendorConfig');
const logger = require('../../utils/logger');

/**
 * Vendorboat API Adapter
 * NOTE: Update specific API endpoints based on Vendorboat documentation
 */
class VendorboatAdapter {
    constructor() {
        this.config = vendorConfig.getVendorConfig('vendorboat');
        this.vendorId = 'vendorboat';
    }

    /**
     * Create order on Vendorboat
     * TODO: Update endpoint and payload structure based on Vendorboat API docs
     */
    async createOrder(orderData) {
        try {
            if (!this.config.enabled) {
                throw new Error('Vendorboat integration is disabled');
            }

            const vendorboatOrder = this.transformOrder(orderData);

            logger.info(`Creating Vendorboat order for Order #${orderData.orderId}`);

            // TODO: Update endpoint path based on Vendorboat documentation
            const response = await axios.post(
                `${this.config.baseUrl}/api/order/place`,
                vendorboatOrder,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            // TODO: Update response handling based on Vendorboat API response format
            if (response.data && response.data.status === 'success') {
                logger.info(`Vendorboat order created: ${response.data.order_number}`);
                return {
                    success: true,
                    vendorOrderId: response.data.order_number,
                    vendor: 'vendorboat',
                    trackingNumber: response.data.awb || null,
                    estimatedDelivery: response.data.expected_delivery || null,
                    rawResponse: response.data
                };
            } else {
                throw new Error(response.data.message || 'Vendorboat order creation failed');
            }

        } catch (error) {
            logger.error('Vendorboat order creation failed', {
                orderId: orderData.orderId,
                error: error.message,
                response: error.response?.data
            });

            return {
                success: false,
                vendor: 'vendorboat',
                error: error.message,
                errorDetails: error.response?.data
            };
        }
    }

    /**
     * Transform our order format to Vendorboat format
     * TODO: Update payload structure based on Vendorboat API requirements
     */
    transformOrder(orderData) {
        return {
            reference_id: orderData.orderId.toString(),
            buyer_details: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                mobile: orderData.customer.phone
            },
            delivery_address: {
                address_line_1: orderData.customer.address,
                address_line_2: orderData.customer.address2 || '',
                city: orderData.customer.city,
                state: orderData.customer.state,
                zip_code: orderData.customer.pincode,
                country_code: 'IN'
            },
            order_items: orderData.items.map(item => ({
                product_sku: item.vendor_sku,
                qty: item.quantity,
                name: item.name
            })),
            logistics_mode: orderData.shippingMethod || 'surface',
            cod_amount: orderData.paymentMethod === 'cod' ? orderData.totalAmount : 0
        };
    }

    /**
     * Get order status from Vendorboat
     */
    async getOrderStatus(vendorOrderId) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/order/status/${vendorOrderId}`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    status: response.data.order_status,
                    trackingNumber: response.data.awb_number,
                    carrier: response.data.courier_partner,
                    shippedAt: response.data.shipped_on,
                    deliveredAt: response.data.delivered_on,
                    rawData: response.data
                };
            }

            throw new Error('Failed to get order status');

        } catch (error) {
            logger.error('Vendorboat status check failed', {
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
     * Get product catalog from Vendorboat
     */
    async getProducts(page = 1, limit = 100) {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/catalog/list`,
                {
                    headers: vendorConfig.getAuthHeaders(this.vendorId),
                    params: { page, per_page: limit },
                    timeout: this.config.timeout
                }
            );

            if (response.data && response.data.success) {
                return {
                    success: true,
                    products: response.data.data.map(p => this.transformProduct(p)),
                    total: response.data.total,
                    hasMore: page * limit < response.data.total
                };
            }

            throw new Error('Failed to fetch products');

        } catch (error) {
            logger.error('Vendorboat product fetch failed', { error: error.message });
            return {
                success: false,
                products: [],
                error: error.message
            };
        }
    }

    /**
     * Transform Vendorboat product to our format
     */
    transformProduct(vendorboatProduct) {
        return {
            vendor: 'vendorboat',
            vendor_sku: vendorboatProduct.sku,
            vendor_product_id: vendorboatProduct.product_id,
            name: vendorboatProduct.title,
            description: vendorboatProduct.desc,
            vendor_price: vendorboatProduct.base_price,
            images: vendorboatProduct.product_images || [],
            category: vendorboatProduct.category_name,
            variants: vendorboatProduct.variations || [],
            customizable: vendorboatProduct.has_customization || false,
            in_stock: vendorboatProduct.available
        };
    }

    /**
     * Cancel order on Vendorboat
     */
    async cancelOrder(vendorOrderId, reason) {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/api/order/cancel`,
                {
                    order_number: vendorOrderId,
                    cancellation_reason: reason
                },
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
            logger.error('Vendorboat order cancellation failed', {
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

module.exports = new VendorboatAdapter();
