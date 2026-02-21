const express = require('express');
const router = express.Router();
const orderService = require('../services/order.service');
const productService = require('../services/product.service');
const { auth, adminAuth } = require('../middleware/auth');

// Dashboard metrics
router.get('/dashboard', auth, adminAuth, async (req, res, next) => {
  try {
    const metrics = await orderService.getDashboardMetrics();
    const lowStockProducts = await productService.getLowStockProducts();
    
    res.json({
      ...metrics,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5) // Top 5
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders (admin)
router.get('/orders', auth, adminAuth, async (req, res, next) => {
  try {
    const { page, limit, status, paymentStatus } = req.query;
    const result = await orderService.getAllOrders({ status, paymentStatus }, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Update order (admin)
router.put('/orders/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.body);
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// Sync inventory manually
router.post('/sync-inventory', auth, adminAuth, async (req, res, next) => {
  try {
    const { inventorySyncQueue } = require('../config/queue');
    await inventorySyncQueue.add({});
    
    res.json({ message: 'Inventory sync job queued' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
