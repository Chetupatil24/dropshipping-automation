const { Order } = require('../models');
const logger = require('../utils/logger');
const cjdropship = require('../integrations/suppliers/cjdropship');

// Import vFulfill
let vfulfill;
try {
    vfulfill = require('../integrations/suppliers/vfulfill');
} catch (error) {
    logger.warn('vFulfill not configured');
}

module.exports = async (job) => {
    try {
        logger.info('Starting tracking sync job');

        // Get all orders that are processing but don't have tracking yet
        const orders = await Order.findAll({
            where: {
                status: 'processing',
                trackingNumber: null
            }
        });

        logger.info(`Found ${orders.length} orders pending tracking`);

        for (const order of orders) {
            try {
                if (!order.supplierOrderId) {
                    continue;
                }

                let trackingData;

                // Determine supplier and fetch tracking
                // This is a simplified approach - you may need to store supplier type with order
                if (order.supplierOrderId.startsWith('VF')) {
                    // vFulfill order
                    if (vfulfill) {
                        trackingData = await vfulfill.getOrderStatus(order.supplierOrderId);
                    }
                } else if (order.supplierOrderId.startsWith('CJ')) {
                    // CJ Dropshipping order
                    trackingData = await cjdropship.getOrderStatus(order.supplierOrderId);
                }
                // Removed AliExpress support (not in use)

                if (trackingData && trackingData.trackingNumber) {
                    // Update order with tracking info
                    await order.update({
                        trackingNumber: trackingData.trackingNumber,
                        trackingUrl: trackingData.trackingUrl || null,
                        status: trackingData.status === 'shipped' ? 'shipped' : order.status
                    });

                    logger.info('Tracking updated for order:', {
                        orderId: order.id,
                        trackingNumber: trackingData.trackingNumber
                    });

                    // Send tracking email to customer
                    const emailService = require('../services/emailService');
                    await emailService.sendTrackingUpdate(order, trackingData.trackingNumber);
                }
            } catch (error) {
                logger.error('Error fetching tracking for order:', {
                    orderId: order.id,
                    error: error.message
                });
                // Continue with next order
            }
        }

        logger.info('Tracking sync job completed');

        return { success: true, ordersChecked: orders.length };
    } catch (error) {
        logger.error('Tracking sync job failed:', error);
        throw error;
    }
};
