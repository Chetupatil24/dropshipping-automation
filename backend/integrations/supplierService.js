const { Product, Supplier } = require('../models');
const logger = require('../utils/logger');
// Active supplier integrations only (removed unused aliexpress, indiamart)
const cjdropship = require('./suppliers/cjdropship');

// Import POD Vendor Adapters
const qikinkAdapter = require('../services/vendors/qikinkAdapter');
const seasonswayAdapter = require('../services/vendors/seasonswayAdapter');
const printroveAdapter = require('../services/vendors/printroveAdapter');
const vendorboatAdapter = require('../services/vendors/vendorboatAdapter');

// Import CJ Dropshipping (existing service)
const cjDropshippingService = require('../services/cjDropshippingService');

class SupplierService {
  // Sync inventory from all suppliers
  async syncAllSuppliers() {
    try {
      const suppliers = await Supplier.findAll({
        where: { isActive: true }
      });

      for (const supplier of suppliers) {
        await this.syncSupplier(supplier);
      }

      logger.info('All suppliers synced successfully');
    } catch (error) {
      logger.error('Error syncing suppliers:', error);
      throw error;
    }
  }

  // Sync single supplier
  async syncSupplier(supplier) {
    try {
      logger.info('Syncing supplier:', { supplierId: supplier.id, type: supplier.type });

      const products = await Product.findAll({
        where: { supplierId: supplier.id, isActive: true }
      });

      for (const product of products) {
        await this.syncProduct(product, supplier);
      }

      await supplier.update({ lastSyncedAt: new Date() });

      logger.info('Supplier synced:', { supplierId: supplier.id });
    } catch (error) {
      logger.error('Error syncing supplier:', error);
      throw error;
    }
  }

  // Sync single product
  async syncProduct(product, supplier) {
    try {
      let supplierData;

      switch (supplier.type) {
        case 'aliexpress':
          supplierData = await aliexpress.getProduct(product.supplierProductId);
          break;

        case 'cj_dropship':
          supplierData = await cjdropship.getProduct(product.supplierProductId);
          break;

        case 'vfulfill':
          // NEW: vFulfill support
          const vfulfill = require('./suppliers/vfulfill');
          supplierData = await vfulfill.getProduct(product.supplierProductId);
          break;

        case 'indiamart':
          // IndiaMART has limited API
          logger.info('IndiaMART sync not implemented');
          return;

        default:
          logger.warn('Unknown supplier type:', supplier.type);
          return;
      }

      // Update product with supplier data
      await product.update({
        stock: supplierData.stock,
        costPrice: supplierData.costPrice,
        lastSyncedAt: new Date()
      });

      // NEW: Dynamic pricing with shipping and RTO buffer
      const isIndianMarket = supplier.type === 'vfulfill';
      const shippingFee = supplierData.shippingFee || 0;
      const newPrice = this.calculateRetailPrice(
        supplierData.costPrice,
        shippingFee,
        isIndianMarket
      );

      if (Math.abs(parseFloat(product.price) - newPrice) > 10) {
        logger.info('Price adjustment needed:', {
          productId: product.id,
          oldPrice: product.price,
          newPrice
        });
        // Optionally auto-update price
        // await product.update({ price: newPrice });
      }

      logger.info('Product synced:', { productId: product.id });
    } catch (error) {
      logger.error('Error syncing product:', { productId: product.id, error: error.message });
    }
  }

  // Place order with supplier (Multi-Vendor Routing)
  async placeSupplierOrder(order) {
    try {
      const orderItems = await order.getItems({ include: [{ model: Product, as: 'product' }] });

      // Group items by Vendor (Qikink, Seasonsway, etc.) OR Supplier (AliExpress, CJ)
      const vendorGroups = {};
      const supplierOrders = {};

      for (const item of orderItems) {
        const product = item.product;

        // Priority 1: Check for Specific POD Vendor ID
        if (product.vendor_id) {
          if (!vendorGroups[product.vendor_id]) {
            vendorGroups[product.vendor_id] = [];
          }
          vendorGroups[product.vendor_id].push({
            ...item.toJSON(),
            vendor_sku: product.vendor_sku || product.sku,
            name: product.name
          });
          continue;
        }

        // Priority 2: Check for General Supplier ID
        if (product.supplierId) {
          if (!supplierOrders[product.supplierId]) {
            supplierOrders[product.supplierId] = [];
          }
          supplierOrders[product.supplierId].push({
            ...item.toJSON(),
            supplierProductId: product.supplierProductId
          });
        }
      }

      const results = [];

      // 1. Process specific POD Vendors (Seasonsway, Qikink, Printrove)
      for (const [vendorId, items] of Object.entries(vendorGroups)) {
        logger.info(`Processing order split for vendor: ${vendorId}`);

        const vendorOrderData = {
          orderId: order.orderNumber, // Use order number for vendor ref
          customer: {
            name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            email: order.customerEmail,
            phone: order.customerPhone || order.shippingAddress.phone,
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.pincode
          },
          items: items,
          shippingMethod: 'standard', // Default
          paymentMethod: order.paymentMethod === 'cod' ? 'cod' : 'prepaid'
        };

        let result = { success: false, vendor: vendorId, error: 'Unknown vendor adapter' };

        try {
          switch (vendorId.toLowerCase()) {
            case 'qikink':
              result = await qikinkAdapter.createOrder(vendorOrderData);
              break;
            case 'seasonsway':
              result = await seasonswayAdapter.createOrder(vendorOrderData);
              break;
            case 'printrove':
              result = await printroveAdapter.createOrder(vendorOrderData);
              break;
            case 'vendorboat':
              result = await vendorboatAdapter.createOrder(vendorOrderData);
              break;
            case 'cj':
            case 'cj_dropshipping':
              // CJ uses existing service
              result = await cjDropshippingService.createOrder(vendorOrderData);
              break;
            default:
              logger.warn(`No adapter found for vendor: ${vendorId}`);
          }
        } catch (err) {
          logger.error(`Failed to place order with ${vendorId}:`, err);
          result = { success: false, vendor: vendorId, error: err.message };
        }

        results.push(result);
      }

      // 2. Process General Suppliers (Legacy Logic)
      for (const [supplierId, items] of Object.entries(supplierOrders)) {
        const supplier = await Supplier.findByPk(supplierId);

        if (!supplier) continue;

        const supplierOrderData = {
          ...order.toJSON(),
          items
        };

        let result;

        switch (supplier.type) {
          case 'aliexpress':
            result = await aliexpress.placeOrder(supplierOrderData);
            break;

          case 'cj_dropship':
            result = await cjdropship.createOrder(supplierOrderData);
            break;

          case 'vfulfill':
            const vfulfill = require('./suppliers/vfulfill');
            result = await vfulfill.createOrder(supplierOrderData);
            break;

          default:
            logger.warn('Cannot place order with supplier type:', supplier.type);
            continue;
        }

        results.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          ...result
        });
      }

      // Update order with results
      if (results.length > 0) {
        const updateData = {
          vendorOrders: results // Store breakdown of all split orders
        };

        // If there's at least one success, set fulfillment status
        const anySuccess = results.some(r => r.success);
        if (anySuccess) {
          updateData.fulfillmentStatus = 'processing';

          // Use the first successful tracking number as the main one for simplicity (or handle multiple tracking nums in UI)
          const firstSuccess = results.find(r => r.success && r.trackingNumber);
          if (firstSuccess) {
            updateData.trackingNumber = firstSuccess.trackingNumber;
            updateData.fulfillmentService = firstSuccess.vendor;
          }
        }

        await order.update(updateData);
      }

      logger.info('Supplier orders placed:', { orderId: order.id, results });

      return results;
    } catch (error) {
      logger.error('Error placing supplier order:', error);
      throw error;
    }
  }

  // NEW: Calculate retail price with 2.5x markup formula
  calculateRetailPrice(costPrice, shippingFee = 0, isIndianMarket = false) {
    // Industry-standard 2.5x markup
    let price;

    if (isIndianMarket) {
      // For Indian market: Add RTO buffer (15% of cost for returns)
      const rtoBuffer = 50; // ₹50 buffer for returns
      price = (costPrice + shippingFee + rtoBuffer) * 2.5;

      // Round to nearest ₹100 for cleaner pricing
      price = Math.round(price / 100) * 100;
    } else {
      // International: Standard 2.5x
      price = (costPrice + shippingFee) * 2.5;
      price = parseFloat(price.toFixed(2));
    }

    return price;
  }

  // Import products from supplier
  async importProducts(supplierId, productIds) {
    try {
      const supplier = await Supplier.findByPk(supplierId);

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      const imported = [];

      for (const productId of productIds) {
        let supplierData;

        switch (supplier.type) {
          case 'aliexpress':
            supplierData = await aliexpress.getProduct(productId);
            break;

          case 'cj_dropship':
            supplierData = await cjdropship.getProduct(productId);
            break;

          default:
            continue;
        }

        // Create product in database
        const product = await Product.create({
          ...supplierData,
          supplierId: supplier.id,
          price: this.calculateRetailPrice(supplierData.costPrice),
          slug: this.generateSlug(supplierData.name),
          sku: `${supplier.name.substring(0, 3).toUpperCase()}-${productId}`
        });

        imported.push(product);
      }

      logger.info('Products imported:', { supplierId, count: imported.length });

      return imported;
    } catch (error) {
      logger.error('Error importing products:', error);
      throw error;
    }
  }

  // Generate slug
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

module.exports = new SupplierService();
