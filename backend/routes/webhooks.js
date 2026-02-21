const express = require('express');
const router = express.Router();
const razorpay = require('../integrations/razorpay');
const logger = require('../utils/logger');

// Razorpay webhook
router.post('/payment', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const payload = req.body.toString();
    
    await razorpay.handleWebhook(payload, signature);
    
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Shiprocket webhook (if needed)
router.post('/shipping', express.json(), async (req, res, next) => {
  try {
    logger.info('Shipping webhook received:', req.body);
    
    // Handle shipping updates
    // Update order status based on tracking events
    
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Shipping webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
