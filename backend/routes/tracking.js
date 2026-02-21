const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const { auth } = require('../middleware/auth');
const trackingService = require('../services/trackingService');
const logger = require('../utils/logger');

/**
 * GET /api/tracking/orders/:orderId
 * Get tracking information for a specific order (requires authentication)
 */
router.get('/orders/:orderId', auth, async (req, res) => {
    try {
        const trackingInfo = await trackingService.getOrderTrackingInfo(
            req.params.orderId,
            req.user.id // Ensure user owns this order
        );

        if (!trackingInfo) {
            return res.status(404).json({
                success: false,
                error: 'Order not found or you do not have permission to view it'
            });
        }

        res.json({
            success: true,
            data: trackingInfo
        });

    } catch (error) {
        logger.error('Failed to get order tracking', {
            orderId: req.params.orderId,
            userId: req.user.id,
            error: error.message
        });

        res.status(500).json({
            success: false,
            error: 'Failed to retrieve tracking information'
        });
    }
});

/**
 * GET /api/tracking/public/:orderNumber
 * Public tracking page - track order without login
 * Customers can use this with just their order number
 */
router.get('/public/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderNumber: req.params.orderNumber }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found. Please check your order number.'
            });
        }

        // Get fresh tracking update
        let trackingInfo;
        try {
            trackingInfo = await trackingService.getOrderTrackingInfo(order.id);
        } catch (error) {
            logger.warn(`Could not get tracking for public order ${req.params.orderNumber}`, {
                error: error.message
            });

            // Return basic order info even if tracking fails
            trackingInfo = {
                orderNumber: order.orderNumber,
                status: order.fulfillmentStatus,
                trackingNumber: order.trackingNumber,
                carrier: order.carrierName,
                estimatedDelivery: order.estimatedDeliveryDate
            };
        }

        // Return limited information for security (no personal details)
        res.json({
            success: true,
            data: {
                orderNumber: trackingInfo.orderNumber,
                status: trackingInfo.status,
                trackingNumber: trackingInfo.trackingNumber,
                trackingUrl: trackingInfo.trackingUrl,
                carrier: trackingInfo.carrier,
                currentLocation: trackingInfo.currentLocation,
                estimatedDelivery: trackingInfo.estimatedDelivery,
                shippedAt: trackingInfo.shippedAt,
                deliveredAt: trackingInfo.deliveredAt,
                lastUpdate: trackingInfo.lastUpdate,
                history: trackingInfo.history || []
            }
        });

    } catch (error) {
        logger.error('Failed to get public tracking', {
            orderNumber: req.params.orderNumber,
            error: error.message
        });

        res.status(500).json({
            success: false,
            error: 'Failed to retrieve tracking information'
        });
    }
});

/**
 * POST /api/tracking/refresh/:orderId
 * Manually refresh tracking for an order (for user who owns it)
 */
router.post('/refresh/:orderId', auth, async (req, res) => {
    try {
        // Verify user owns this order
        const order = await Order.findOne({
            where: {
                id: req.params.orderId,
                userId: req.user.id
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Force update tracking
        const result = await trackingService.updateOrderTracking(order.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'No tracking information available yet'
            });
        }

        // Get updated tracking info
        const trackingInfo = await trackingService.getOrderTrackingInfo(order.id, req.user.id);

        res.json({
            success: true,
            message: 'Tracking information updated',
            data: trackingInfo
        });

    } catch (error) {
        logger.error('Failed to refresh tracking', {
            orderId: req.params.orderId,
            userId: req.user.id,
            error: error.message
        });

        res.status(500).json({
            success: false,
            error: 'Failed to refresh tracking information'
        });
    }
});

/**
 * POST /api/tracking/webhook/vfulfill
 * Webhook endpoint for vFulfill to send tracking updates
 */
router.post('/webhook/vfulfill', async (req, res) => {
    try {
        const { order_id, tracking_number, status, location } = req.body;

        logger.info('Received vFulfill webhook', {
            orderId: order_id,
            status,
            trackingNumber: tracking_number
        });

        // Find order by vFulfill order ID
        const order = await Order.findOne({
            where: { fulfillmentOrderId: order_id }
        });

        if (!order) {
            logger.warn(`Webhook received for unknown vFulfill order: ${order_id}`);
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update tracking immediately
        await trackingService.updateOrderTracking(order.id);

        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        logger.error('vFulfill webhook error', {
            error: error.message,
            body: req.body
        });

        res.status(500).json({
            success: false,
            error: 'Webhook processing failed'
        });
    }
});

/**
 * POST /api/tracking/webhook/cj
 * Webhook endpoint for CJ Dropshipping to send tracking updates
 */
router.post('/webhook/cj', async (req, res) => {
    try {
        const { orderNumber, status, trackingNumber } = req.body;

        logger.info('Received CJ webhook', {
            orderNumber,
            status,
            trackingNumber
        });

        // Find order by CJ order number
        const order = await Order.findOne({
            where: { fulfillmentOrderId: orderNumber }
        });

        if (!order) {
            logger.warn(`Webhook received for unknown CJ order: ${orderNumber}`);
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update tracking immediately
        await trackingService.updateOrderTracking(order.id);

        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        logger.error('CJ webhook error', {
            error: error.message,
            body: req.body
        });

        res.status(500).json({
            success: false,
            error: 'Webhook processing failed'
        });
    }
});

/**
 * GET /api/tracking/sync (Admin only - for testing)
 * Manually trigger tracking sync for all orders
 */
router.get('/sync', auth, async (req, res) => {
    try {
        // TODO: Add admin check here
        // if (!req.user.isAdmin) {
        //   return res.status(403).json({ error: 'Admin only' });
        // }

        logger.info('Manual tracking sync triggered', { userId: req.user.id });

        const result = await trackingService.syncAllTracking();

        res.json({
            success: true,
            message: 'Tracking sync completed',
            data: result
        });

    } catch (error) {
        logger.error('Manual tracking sync failed', {
            error: error.message
        });

        res.status(500).json({
            success: false,
            error: 'Tracking sync failed'
        });
    }
});

module.exports = router;
