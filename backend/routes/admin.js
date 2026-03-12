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

// ─── Vendor Management ──────────────────────────────────────────────────────

/**
 * GET /api/admin/vendors
 * List all configured vendors and their enabled status
 */
router.get('/vendors', auth, adminAuth, async (req, res, next) => {
  try {
    const vendorConfig = require('../services/vendors/vendorConfig');
    const vendors = vendorConfig.vendors;

    const list = Object.entries(vendors).map(([id, cfg]) => ({
      id,
      name: cfg.name,
      enabled: cfg.enabled,
      hasApiKey: !!(cfg.apiKey || cfg.clientId || cfg.email),
      baseUrl: cfg.baseUrl,
      authType: cfg.authType
    }));

    res.json({ success: true, vendors: list });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/vendors/sync
 * Trigger product sync for a specific vendor
 * Body: { vendor: 'printrove' | 'baapstore' | 'eprolo' | 'qikink' | 'all' }
 */
router.post('/vendors/sync', auth, adminAuth, async (req, res, next) => {
  try {
    const { vendor = 'all', maxProducts = 100 } = req.body;

    const validVendors = ['all', 'printrove', 'baapstore', 'eprolo', 'qikink', 'seasonsway', 'vendorboat'];
    if (!validVendors.includes(vendor)) {
      return res.status(400).json({ success: false, error: `Invalid vendor. Choose from: ${validVendors.join(', ')}` });
    }

    // Queue the sync job
    const { inventorySyncQueue } = require('../config/queue');
    await inventorySyncQueue.add({ vendor, maxProducts, action: 'vendor-sync' });

    res.json({
      success: true,
      message: `Sync job queued for vendor: ${vendor}`,
      vendor,
      maxProducts
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/vendors/:vendorId/products
 * List all products for a specific vendor
 */
router.get('/vendors/:vendorId/products', auth, adminAuth, async (req, res, next) => {
  try {
    const { Product } = require('../models');
    const { vendorId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where: { vendor_id: vendorId, isActive: true },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      vendor: vendorId,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      products: rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/vendors/:vendorId/products
 * Remove all products for a specific vendor (cleanup before re-sync)
 */
router.delete('/vendors/:vendorId/products', auth, adminAuth, async (req, res, next) => {
  try {
    const { Product } = require('../models');
    const { vendorId } = req.params;
    const logger = require('../utils/logger');

    const count = await Product.destroy({ where: { vendor_id: vendorId } });

    logger.info(`Admin deleted ${count} products for vendor: ${vendorId}`, { userId: req.user.id });

    res.json({
      success: true,
      message: `Deleted ${count} products for vendor: ${vendorId}`,
      deletedCount: count
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
