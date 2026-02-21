const axios = require('axios');
const logger = require('../../utils/logger');

class VFulfillService {
    constructor() {
        this.apiKey = process.env.VFULFILL_API_KEY;
        this.apiSecret = process.env.VFULFILL_API_SECRET;
        this.baseURL = process.env.VFULFILL_API_URL || 'https://api.vfulfill.io/v1';
    }

    // Get authentication token
    async getAccessToken() {
        try {
            const response = await axios.post(`${this.baseURL}/auth/token`, {
                api_key: this.apiKey,
                api_secret: this.apiSecret
            });

            return response.data.access_token;
        } catch (error) {
            logger.error('vFulfill authentication failed:', error);
            throw error;
        }
    }

    // Get product details
    async getProduct(productId) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.get(
                `${this.baseURL}/products/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const product = response.data.data;

            return {
                supplierProductId: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                costPrice: product.wholesale_price,
                images: product.images || [],
                stock: product.stock || 0,
                category: product.category,
                sku: product.sku,
                codAvailable: true, // vFulfill always supports COD
                shippingTime: '3-4 days',
                warehouseLocation: 'India'
            };
        } catch (error) {
            logger.error('Error fetching vFulfill product:', error);
            throw error;
        }
    }

    // Search products
    async searchProducts(query, page = 1, pageSize = 20) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.get(
                `${this.baseURL}/products/search`,
                {
                    params: {
                        q: query,
                        page,
                        limit: pageSize
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.data.products;
        } catch (error) {
            logger.error('Error searching vFulfill products:', error);
            throw error;
        }
    }

    // Create order
    async createOrder(order) {
        try {
            const token = await this.getAccessToken();

            const orderData = {
                order_number: order.orderNumber,
                customer: {
                    name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
                    email: order.customerEmail,
                    phone: order.customerPhone
                },
                shipping_address: {
                    address_line1: order.shippingAddress.address1,
                    address_line2: order.shippingAddress.address2 || '',
                    city: order.shippingAddress.city,
                    state: order.shippingAddress.state,
                    postal_code: order.shippingAddress.postalCode,
                    country: order.shippingAddress.country || 'India'
                },
                payment_method: order.paymentMethod, // 'prepaid' or 'cod'
                cod_verification: true, // Enable verification calls
                items: order.items.map(item => ({
                    product_id: item.supplierProductId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await axios.post(
                `${this.baseURL}/orders`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('vFulfill order created:', {
                orderId: order.id,
                vfulfillOrderId: response.data.data.order_id
            });

            return {
                supplierOrderId: response.data.data.order_id,
                status: 'placed',
                estimatedDelivery: response.data.data.estimated_delivery,
                trackingNumber: response.data.data.tracking_number || null
            };
        } catch (error) {
            logger.error('Error creating vFulfill order:', error);
            throw error;
        }
    }

    // Get order status and tracking
    async getOrderStatus(supplierOrderId) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.get(
                `${this.baseURL}/orders/${supplierOrderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const orderData = response.data.data;

            return {
                status: orderData.status,
                trackingNumber: orderData.tracking_number,
                trackingUrl: orderData.tracking_url,
                estimatedDelivery: orderData.estimated_delivery
            };
        } catch (error) {
            logger.error('Error fetching vFulfill order status:', error);
            throw error;
        }
    }

    // Cancel order
    async cancelOrder(supplierOrderId) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.post(
                `${this.baseURL}/orders/${supplierOrderId}/cancel`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('vFulfill order cancelled:', { supplierOrderId });

            return response.data;
        } catch (error) {
            logger.error('Error cancelling vFulfill order:', error);
            throw error;
        }
    }
}

module.exports = new VFulfillService();
