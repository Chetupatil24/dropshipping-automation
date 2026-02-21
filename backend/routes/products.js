const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { auth, adminAuth } = require('../middleware/auth');
const { validate, createProductSchema } = require('../middleware/validation');

// Get all products (public)
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, category, search } = req.query;
    const result = await productService.getProducts({ category, search }, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post('/', auth, adminAuth, validate(createProductSchema), async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.validatedBody);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
router.put('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Check stock
router.get('/:id/stock', async (req, res, next) => {
  try {
    const { quantity = 1 } = req.query;
    const result = await productService.checkStock(req.params.id, parseInt(quantity));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
