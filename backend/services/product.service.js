const { Product, Supplier } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class ProductService {
  // Get all products with filtering and pagination
  async getProducts(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 20, category, search, isActive = true } = { ...filters, ...pagination };
      const offset = (page - 1) * limit;

      const where = { isActive };

      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [{ model: Supplier, as: 'supplier' }],
        order: [['createdAt', 'DESC']]
      });

      return {
        products: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product
  async getProduct(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [{ model: Supplier, as: 'supplier' }]
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      logger.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({
        where: { slug, isActive: true },
        include: [{ model: Supplier, as: 'supplier' }]
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      logger.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  // Create product
  async createProduct(productData) {
    try {
      // Generate slug from name
      if (!productData.slug) {
        productData.slug = this.generateSlug(productData.name);
      }

      const product = await Product.create(productData);
      logger.info('Product created:', { productId: product.id, sku: product.sku });
      
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, updateData) {
    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Update slug if name changes
      if (updateData.name && updateData.name !== product.name) {
        updateData.slug = this.generateSlug(updateData.name);
      }

      await product.update(updateData);
      logger.info('Product updated:', { productId: id });
      
      return product;
    } catch (error) {
      logger.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Soft delete - just mark as inactive
      await product.update({ isActive: false });
      logger.info('Product deleted:', { productId: id });
      
      return true;
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw error;
    }
  }

  // Update stock
  async updateStock(id, quantity) {
    try {
      const product = await Product.findByPk(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      await product.update({ stock: quantity, lastSyncedAt: new Date() });
      logger.info('Product stock updated:', { productId: id, stock: quantity });
      
      return product;
    } catch (error) {
      logger.error('Error updating stock:', error);
      throw error;
    }
  }

  // Check stock availability
  async checkStock(productId, quantity) {
    try {
      const product = await Product.findByPk(productId);
      
      if (!product) {
        return { available: false, reason: 'Product not found' };
      }

      if (!product.isActive) {
        return { available: false, reason: 'Product not available' };
      }

      if (product.stock < quantity) {
        return { 
          available: false, 
          reason: 'Insufficient stock',
          availableStock: product.stock
        };
      }

      return { available: true };
    } catch (error) {
      logger.error('Error checking stock:', error);
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts() {
    try {
      const products = await Product.findAll({
        where: {
          stock: {
            [Op.lte]: sequelize.col('lowStockThreshold')
          },
          isActive: true
        },
        include: [{ model: Supplier, as: 'supplier' }]
      });

      return products;
    } catch (error) {
      logger.error('Error fetching low stock products:', error);
      throw error;
    }
  }

  // Helper: Generate slug from name
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

module.exports = new ProductService();
