const vFulfillService = require('./vFulfillService');
const { Order, OrderTrackingHistory } = require('../models');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class TrackingService {
    /**
     * Update tracking information for a specific order
     * Gets latest tracking from vFulfill or CJ and updates database
     */
    async updateOrderTracking(orderId) {
        try {
            const order = await Order.findByPk(orderId, {
                include: ['user', 'items']
            });

            if (!order || !order.fulfillmentOrderId) {
                logger.warn(`Order ${orderId} has no fulfillment ID`);
                return null;
            }

            let tracking;

            // Get tracking from appropriate fulfillment service
            if (order.fulfillmentService === 'vfulfill') {
                tracking = await vFulfillService.getTracking(order.fulfillmentOrderId);
            } else {
                // For Printrove, Qikink, Baap Store, Eprolo — tracking comes via webhook or adapter
                logger.info(`Tracking for ${order.fulfillmentService} handled by vendor adapter`);
                return null;
            }

            if (!tracking) {
                logger.warn(`No tracking data for order ${orderId}`);
                return null;
            }

            // Store previous status to detect changes
            const previousStatus = order.fulfillmentStatus;

            // Update order with latest tracking information
            await order.update({
                trackingNumber: tracking.trackingNumber || order.trackingNumber,
                trackingUrl: tracking.trackingUrl || order.trackingUrl,
                carrierName: tracking.carrier || order.carrierName,
                carrierPhone: tracking.carrierPhone || order.carrierPhone,
                fulfillmentStatus: tracking.status || order.fulfillmentStatus,
                currentLocation: tracking.currentLocation,
                lastTrackingUpdate: new Date(),
                // Set timestamps when status changes
                shippedAt: tracking.status === 'shipped' && !order.shippedAt ? new Date() : order.shippedAt,
                deliveredAt: tracking.status === 'delivered' && !order.deliveredAt ? new Date() : order.deliveredAt
            });

            // Save detailed tracking history for complete transparency
            if (tracking.history && Array.isArray(tracking.history)) {
                for (const event of tracking.history) {
                    // Check if this event already exists (avoid duplicates)
                    const existing = await OrderTrackingHistory.findOne({
                        where: {
                            orderId: order.id,
                            timestamp: event.timestamp,
                            description: event.description
                        }
                    });

                    if (!existing) {
                        await OrderTrackingHistory.create({
                            orderId: order.id,
                            status: event.status,
                            location: event.location,
                            description: event.description,
                            timestamp: event.timestamp
                        });
                    }
                }
            }

            // Send notifications when status changes
            if (previousStatus !== tracking.status) {
                logger.info(`Order ${order.orderNumber} status changed: ${previousStatus} → ${tracking.status}`);
                await this.sendStatusNotification(order, tracking.status, tracking);
            }

            logger.info(`Updated tracking for order ${order.orderNumber}`, {
                status: tracking.status,
                trackingNumber: tracking.trackingNumber,
                location: tracking.currentLocation
            });

            return {
                success: true,
                tracking,
                statusChanged: previousStatus !== tracking.status
            };

        } catch (error) {
            logger.error(`Failed to update tracking for order ${orderId}`, {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Send customer notifications when order status changes
     */
    async sendStatusNotification(order, newStatus, tracking) {
        try {
            switch (newStatus) {
                case 'processing':
                    // Order is being processed at warehouse
                    logger.info(`Order ${order.orderNumber} is being processed`);
                    // Could send "We're preparing your order" email here
                    break;

                case 'shipped':
                    // Order has been shipped - IMPORTANT NOTIFICATION
                    await emailService.sendShippingNotification(order, tracking.trackingNumber);
                    logger.info(`Sent shipping notification for order ${order.orderNumber}`);
                    break;

                case 'out_for_delivery':
                    // Package is out for delivery today
                    await emailService.sendEmail({
                        to: order.user.email,
                        subject: `Your Ruthan order arrives today! 🚚`,
                        text: `Your order #${order.orderNumber} is out for delivery and should arrive today!`,
                        html: `
              <h2>📦 Out for Delivery!</h2>
              <p>Good news! Your order #${order.orderNumber} is out for delivery.</p>
              <p><strong>Tracking: ${tracking.trackingNumber}</strong></p>
              <p>Expected delivery: Today</p>
            `
                    });
                    logger.info(`Sent out-for-delivery notification for order ${order.orderNumber}`);
                    break;

                case 'delivered':
                    // Order has been delivered - FINAL NOTIFICATION
                    await emailService.sendEmail({
                        to: order.user.email,
                        subject: `Order Delivered! Thank you for shopping with Ruthan ❤️`,
                        text: `Your order #${order.orderNumber} has been delivered successfully!`,
                        html: `
              <h2>✅ Delivered Successfully!</h2>
              <p>Your order #${order.orderNumber} has been delivered.</p>
              <p>Thank you for shopping with Ruthan!</p>
              <p><a href="${process.env.FRONTEND_URL}/orders/${order.id}">Rate your experience</a></p>
            `
                    });
                    logger.info(`Sent delivery confirmation for order ${order.orderNumber}`);
                    break;
            }
        } catch (error) {
            logger.error(`Failed to send notification for order ${order.orderNumber}`, {
                error: error.message
            });
            // Don't throw - notification failure shouldn't break tracking update
        }
    }

    /**
     * Background job: Sync tracking for all active orders
     * Should be run every 6 hours via cron job
     */
    async syncAllTracking() {
        try {
            // Get all orders that are in transit (not delivered or cancelled)
            const activeOrders = await Order.findAll({
                where: {
                    fulfillmentStatus: ['pending', 'processing', 'shipped', 'out_for_delivery']
                }
            });

            logger.info(`Starting tracking sync for ${activeOrders.length} active orders`);

            let successCount = 0;
            let errorCount = 0;

            for (const order of activeOrders) {
                try {
                    await this.updateOrderTracking(order.id);
                    successCount++;

                    // Small delay to avoid rate limiting from APIs
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    errorCount++;
                    logger.error(`Failed to sync tracking for order ${order.id}`, {
                        error: error.message
                    });
                }
            }

            logger.info(`Tracking sync complete`, {
                total: activeOrders.length,
                success: successCount,
                errors: errorCount
            });

            return {
                total: activeOrders.length,
                success: successCount,
                errors: errorCount
            };

        } catch (error) {
            logger.error('Failed to sync tracking for all orders', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Get complete tracking information for an order
     * Returns order details + full tracking history
     */
    async getOrderTrackingInfo(orderId, userId = null) {
        try {
            const whereClause = { id: orderId };
            if (userId) {
                whereClause.userId = userId;
            }

            const order = await Order.findOne({
                where: whereClause,
                include: ['user', 'items']
            });

            if (!order) {
                return null;
            }

            // Get tracking history from database
            const history = await OrderTrackingHistory.findAll({
                where: { orderId: order.id },
                order: [['timestamp', 'DESC']]
            });

            // Try to get fresh tracking update if order has fulfillment ID
            if (order.fulfillmentOrderId) {
                try {
                    await this.updateOrderTracking(order.id);
                    await order.reload();
                } catch (error) {
                    logger.warn(`Could not refresh tracking for order ${orderId}`, {
                        error: error.message
                    });
                    // Continue with cached data
                }
            }

            return {
                orderNumber: order.orderNumber,
                status: order.fulfillmentStatus,
                trackingNumber: order.trackingNumber,
                trackingUrl: order.trackingUrl,
                carrier: order.carrierName,
                carrierPhone: order.carrierPhone,
                currentLocation: order.currentLocation,
                estimatedDelivery: order.estimatedDeliveryDate,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
                lastUpdate: order.lastTrackingUpdate,
                history: history.map(h => ({
                    timestamp: h.timestamp,
                    location: h.location,
                    status: h.status,
                    description: h.description
                }))
            };

        } catch (error) {
            logger.error(`Failed to get tracking info for order ${orderId}`, {
                error: error.message
            });
            throw error;
        }
    }
}

module.exports = new TrackingService();
