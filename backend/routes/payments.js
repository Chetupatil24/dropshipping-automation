const express = require('express');
const router = express.Router();
const razorpay = require('../integrations/razorpay');
const { auth } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const orderService = require('../services/order.service');
const logger = require('../utils/logger');

// Create payment order
router.post('/create', auth, paymentLimiter, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const order = await orderService.getOrder(orderId);
    
    // Verify user owns the order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create Razorpay order
    const paymentOrder = await razorpay.createPaymentOrder(orderId, parseFloat(order.total));
    
    res.json(paymentOrder);
  } catch (error) {
    next(error);
  }
});

// Verify payment
router.post('/verify', auth, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const order = await orderService.getOrder(orderId);
    
    // Verify user owns the order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await razorpay.handlePaymentSuccess({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    });
    
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    next(error);
  }
});

// Handle payment failure
router.post('/failure', auth, async (req, res, next) => {
  try {
    const { orderId, error } = req.body;
    
    await razorpay.handlePaymentFailure(orderId, error);
    
    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
