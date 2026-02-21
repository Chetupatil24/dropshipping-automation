const qikinkAdapter = require('./qikinkAdapter');
const printroveAdapter = require('./printroveAdapter');
const seasonswayAdapter = require('./seasonswayAdapter');
const vendorboatAdapter = require('./vendorboatAdapter');
const { Order, OrderItem, Product } = require('../../models');
const logger = require('../../utils/logger');

/**
 * Order Fulfillment Service
 * Routes orders to appropriate vendors and handles splitting multi-vendor orders
 */
class OrderFulfillmentService {
    constructor() {
        this.adapters = {
            qikink: qikinkAdapter,
            printrove: printroveAdapter,
            seasonsway: seasonswayAdapter,
            vendorboat: vendorboatAdapter
        };
    }

    /**
     * Main order processing function
     * Handles order splitting and routing to multiple vendors
     */
    async processOrder(orderId) {
        try {
            logger.info(`Processing order #${orderId}`);

            // Get order with items and customer details
            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: OrderItem,
                        include: [Product]
                    }
                ]
            });

            if (!order) {
                throw new Error(`Order #${orderId} not found`);
            }

            // Get order items with vendor information
            const orderItems = await this.loadOrderItemsWithVendor(order.id);

            // Group items by vendor
            const vendorGroups = this.groupItemsByVendor(orderItems);

            logger.info(`Order #${orderId} split into ${Object.keys(vendorGroups).length} vendor(s)`);

            // Process each vendor group
            const results = [];
            for (const [vendorId, items] of Object.entries(vendorGroups)) {
                const result = await this.processVendorOrder(order, vendorId, items);
                results.push(result);
            }

            // Check results
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            if (failed.length > 0) {
                logger.warn(`Order #${orderId}: ${successful.length} succeeded, ${failed.length} failed`);

                // Log failed orders for retry
                await this.logFailedOrders(order, failed);
            }

            return {
                orderId: order.id,
                success: successful.length === results.length,
                partial: successful.length > 0 && failed.length > 0,
                vendors: {
                    total: results.length,
                    successful: successful.length,
                    failed: failed.length
                },
                results: results
            };

        } catch (error) {
            logger.error(`Order processing failed for Order #${orderId}`, {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Load order items with vendor information from database
     */
    async loadOrderItemsWithVendor(orderId) {
        const items = await OrderItem.findAll({
            where: { order_id: orderId },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'vendor_id', 'vendor_sku', 'name', 'price']
                }
            ]
        });

        return items.map(item => ({
            id: item.id,
            vendor_id: item.Product.vendor_id,
            vendor_sku: item.Product.vendor_sku,
            name: item.Product.name,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization || {}
        }));
    }

    /**
     * Group order items by their vendor
     */
    groupItemsByVendor(orderItems) {
        const groups = {};

        for (const item of orderItems) {
            const vendorId = item.vendor_id;

            if (!vendorId) {
                logger.warn(`Item ${item.id} has no vendor_id, skipping`);
                continue;
            }

            if (!groups[vendorId]) {
                groups[vendorId] = [];
            }

            groups[vendorId].push(item);
        }

        return groups;
    }

    /**
     * Process order for a specific vendor
     */
    async processVendorOrder(order, vendorId, items) {
        try {
            const adapter = this.adapters[vendorId];

            if (!adapter) {
                throw new Error(`No adapter found for vendor: ${vendorId}`);
            }

            // Calculate total for this vendor's items
            const vendorTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Prepare order data for vendor
            const orderData = {
                orderId: order.id,
                customer: {
                    name: order.customer_name,
                    email: order.customer_email,
                    phone: order.customer_phone,
                    address: order.shipping_address,
                    address2: order.shipping_address_2,
                    city: order.shipping_city,
                    state: order.shipping_state,
                    pincode: order.shipping_pincode
                },
                items: items,
                totalAmount: vendorTotal,
                shippingMethod: order.shipping_method,
                paymentMethod: order.payment_method,
                notes: order.notes
            };

            // Create order with vendor
            const result = await adapter.createOrder(orderData);

            // Update database if successful
            if (result.success) {
                await this.saveVendorOrderDetails(order.id, vendorId, result);
            }

            return {
                ...result,
                vendorId: vendorId,
                itemCount: items.length,
                vendorTotal: vendorTotal
            };

        } catch (error) {
            logger.error(`Vendor order processing failed`, {
                vendorId,
                orderId: order.id,
                error: error.message
            });

            return {
                success: false,
                vendorId: vendorId,
                error: error.message,
                itemCount: items.length
            };
        }
    }

    /**
     * Save vendor order details to database
     */
    async saveVendorOrderDetails(orderId, vendorId, result) {
        try {
            // Update order with vendor information
            await Order.update(
                {
                    vendor: vendorId,
                    vendor_order_id: result.vendorOrderId,
                    tracking_number: result.trackingNumber,
                    fulfillment_status: 'processing'
                },
                { where: { id: orderId } }
            );

            logger.info(`Saved vendor order details for Order #${orderId}`);

        } catch (error) {
            logger.error('Failed to save vendor order details', {
                orderId,
                vendorId,
                error: error.message
            });
        }
    }

    /**
     * Log failed orders to database for manual retry
     */
    async logFailedOrders(order, failedResults) {
        try {
            const { FailedOrder } = require('../../models');

            for (const failed of failedResults) {
                await FailedOrder.create({
                    order_id: order.id,
                    vendor_id: failed.vendorId,
                    error_message: failed.error,
                    error_details: JSON.stringify(failed.errorDetails || {}),
                    retry_count: 0,
                    status: 'pending_retry',
                    failed_at: new Date()
                });

                logger.info(`Logged failed order for retry`, {
                    orderId: order.id,
                    vendorId: failed.vendorId
                });
            }

        } catch (error) {
            logger.error('Failed to log failed orders', {
                error: error.message
            });
        }
    }

    /**
     * Retry failed order
     */
    async retryFailedOrder(failedOrderId) {
        try {
            const { FailedOrder } = require('../../models');

            const failedOrder = await FailedOrder.findByPk(failedOrderId);

            if (!failedOrder) {
                throw new Error(`Failed order #${failedOrderId} not found`);
            }

            if (failedOrder.retry_count >= 3) {
                throw new Error('Maximum retry attempts reached');
            }

            logger.info(`Retrying failed order #${failedOrder.order_id} for vendor ${failedOrder.vendor_id}`);

            // Get original order
            const order = await Order.findByPk(failedOrder.order_id, {
                include: [OrderItem]
            });

            // Filter items for this vendor
            const vendorItems = await this.loadOrderItemsWithVendor(order.id);
            const items = vendorItems.filter(item => item.vendor_id === failedOrder.vendor_id);

            // Retry with vendor
            const result = await this.processVendorOrder(order, failedOrder.vendor_id, items);

            // Update failed order record
            if (result.success) {
                await failedOrder.update({
                    status: 'resolved',
                    resolved_at: new Date(),
                    retry_count: failedOrder.retry_count + 1
                });

                logger.info(`Failed order retry successful`, {
                    failedOrderId,
                    orderId: order.id
                });
            } else {
                await failedOrder.update({
                    retry_count: failedOrder.retry_count + 1,
                    error_message: result.error,
                    last_retry_at: new Date()
                });

                logger.warn(`Failed order retry failed`, {
                    failedOrderId,
                    attempt: failedOrder.retry_count + 1
                });
            }

            return result;

        } catch (error) {
            logger.error('Failed order retry error', {
                failedOrderId,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Get order status from vendor
     */
    async getVendorOrderStatus(orderId) {
        try {
            const order = await Order.findByPk(orderId);

            if (!order || !order.vendor || !order.vendor_order_id) {
                throw new Error('Order has no vendor information');
            }

            const adapter = this.adapters[order.vendor];

            if (!adapter) {
                throw new Error(`No adapter for vendor: ${order.vendor}`);
            }

            const status = await adapter.getOrderStatus(order.vendor_order_id);

            // Update tracking in database if available
            if (status.success && status.trackingNumber) {
                await order.update({
                    tracking_number: status.trackingNumber,
                    carrier: status.carrier,
                    fulfillment_status: status.status
                });
            }

            return status;

        } catch (error) {
            logger.error('Failed to get vendor order status', {
                orderId,
                error: error.message
            });
            throw error;
        }
    }
}

module.exports = new OrderFulfillmentService();
