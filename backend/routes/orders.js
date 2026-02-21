const express = require('express');
const router = express.Router();
const orderService = require('../services/order.service');
const { auth, adminAuth } = require('../middleware/auth');
const { validate, createOrderSchema } = require('../middleware/validation');
const { orderProcessingQueue, notificationQueue } = require('../config/queue');

// Create order
router.post('/', auth, validate(createOrderSchema), async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.validatedBody, req.user.id);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await orderService.getUserOrders(req.user.id, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', auth, async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    
    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// Track order
router.get('/:id/track', async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    
    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      shippingProvider: order.shippingProvider
    });
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    
    // Check if user owns the order
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const cancelledOrder = await orderService.cancelOrder(req.params.id, req.body.reason);
    res.json({ order: cancelledOrder });
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    const { page, limit, status, paymentStatus } = req.query;
    const result = await orderService.getAllOrders({ status, paymentStatus }, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Update order status (admin)
router.put('/:id/status', auth, adminAuth, async (req, res, next) => {
  try {
    const { status, ...additionalData } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status, additionalData);
    
    // Send notification
    await notificationQueue.add({
      orderId: order.id,
      type: 'shipping_update'
    });
    
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
