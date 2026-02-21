const axios = require('axios');
const logger = require('../utils/logger');

class VFulfillService {
    constructor() {
        this.apiKey = process.env.VFULFILL_API_KEY;
        this.apiSecret = process.env.VFULFILL_API_SECRET;
        this.baseUrl = process.env.VFULFILL_API_URL || 'https://api.vfulfill.io/v1';
    }

    /**
     * Create order in vFulfill system
     */
    async createOrder(orderData) {
        try {
            const response = await axios.post(`${this.baseUrl}/orders`, {
                external_order_id: orderData.orderNumber,
                shipping_address: {
                    name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
                    address1: orderData.shippingAddress.address,
                    address2: orderData.shippingAddress.apartment || '',
                    city: orderData.shippingAddress.city,
                    state: orderData.shippingAddress.state,
                    zip: orderData.shippingAddress.pincode,
                    country: 'IN',
                    phone: orderData.shippingAddress.phone,
                    email: orderData.shippingAddress.email || orderData.user.email
                },
                line_items: orderData.items.map(item => ({
                    product_id: item.product.vfulfillProductId,
                    variant_id: item.product.vfulfillVariantId,
                    quantity: item.quantity,
                    price: item.price
                })),
                shipping_method: orderData.shippingMethod || 'standard'
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            logger.info('vFulfill order created successfully', {
                orderNumber: orderData.orderNumber,
                vfulfillOrderId: response.data.id
            });

            return {
                success: true,
                vfulfillOrderId: response.data.id,
                status: response.data.status,
                estimatedDelivery: response.data.estimated_delivery_date
            };
        } catch (error) {
            logger.error('vFulfill order creation failed', {
                error: error.message,
                orderNumber: orderData.orderNumber
            });
            throw error;
        }
    }

    /**
     * Get tracking information
     */
    async getTracking(vfulfillOrderId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/orders/${vfulfillOrderId}/tracking`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            const tracking = response.data;

            return {
                trackingNumber: tracking.tracking_number,
                carrier: tracking.carrier_name,
                carrierPhone: tracking.carrier_phone,
                trackingUrl: tracking.tracking_url,
                status: tracking.status,
                currentLocation: tracking.current_location,
                estimatedDelivery: tracking.estimated_delivery,
                history: tracking.tracking_events?.map(event => ({
                    timestamp: event.timestamp,
                    location: event.location,
                    status: event.status,
                    description: event.description
                })) || []
            };
        } catch (error) {
            logger.error('Failed to get vFullfill tracking', {
                error: error.message,
                vfulfillOrderId
            });
            return null;
        }
    }

    /**
     * Get order status
     */
    async getOrderStatus(vfulfillOrderId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/orders/${vfulfillOrderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return {
                status: response.data.status,
                trackingNumber: response.data.tracking_number,
                shippedAt: response.data.shipped_at,
                deliveredAt: response.data.delivered_at
            };
        } catch (error) {
            logger.error('Failed to get vFulfill order status', {
                error: error.message,
                vfulfillOrderId
            });
            return null;
        }
    }

    /**
     * Sync products from vFulfill catalog
     */
    async syncProducts() {
        try {
            const response = await axios.get(`${this.baseUrl}/products`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            logger.info(`Synced ${response.data.products?.length || 0} products from vFulfill`);
            return response.data.products || [];
        } catch (error) {
            logger.error('Failed to sync vFulfill products', {
                error: error.message
            });
            return [];
        }
    }
}

module.exports = new VFulfillService();
