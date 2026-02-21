const { Order, OrderItem, Product, User } = require('../models');
const supplierService = require('../integrations/supplierService');
const trackingService = require('./trackingService');
const emailService = require('./emailService'); // Fixed: was email.service
const logger = require('../utils/logger');
const productService = require('./product.service');
const { Op } = require('sequelize');

class OrderService {
  // Create new order
  async createOrder(orderData, userId) {
    try {
      const { items, shippingAddress, customerEmail, customerPhone } = orderData;

      // Validate and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        // Check stock
        const stockCheck = await productService.checkStock(item.productId, item.quantity);
        if (!stockCheck.available) {
          throw new Error(`Product ${product.name}: ${stockCheck.reason}`);
        }

        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.images[0] || null,
          quantity: item.quantity,
          price: product.price,
          costPrice: product.costPrice,
          subtotal: itemTotal
        });
      }

      // Calculate shipping and total
      const shippingCost = this.calculateShipping(shippingAddress, subtotal);
      const tax = this.calculateTax(subtotal);
      const total = subtotal + shippingCost + tax;

      // Generate order number
      const orderNumber = this.generateOrderNumber();

      // Create order
      const order = await Order.create({
        orderNumber,
        userId,
        status: 'pending',
        paymentStatus: 'pending',
        subtotal,
        shippingCost,
        tax,
        total,
        customerEmail,
        customerPhone,
        shippingAddress,
        billingAddress: orderData.billingAddress || shippingAddress
      });

      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          ...item,
          orderId: order.id
        });
      }

      logger.info('Order created:', { orderId: order.id, orderNumber });

      return await this.getOrder(order.id);
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrder(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ]
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get orders for user
  async getUserOrders(userId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows } = await Order.findAndCountAll({
        where: { userId },
        include: [{ model: OrderItem, as: 'items' }],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        orders: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get all orders (admin)
  async getAllOrders(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 20, status, paymentStatus } = { ...filters, ...pagination };
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (paymentStatus) where.paymentStatus = paymentStatus;

      const { count, rows } = await Order.findAndCountAll({
        where,
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        orders: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, additionalData = {}) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      const updateData = { status, ...additionalData };

      // Set timestamps based on status
      if (status === 'shipped' && !order.shippedAt) {
        updateData.shippedAt = new Date();
      }
      if (status === 'delivered' && !order.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
      if (status === 'cancelled' && !order.cancelledAt) {
        updateData.cancelledAt = new Date();
      }

      await order.update(updateData);
      logger.info('Order status updated:', { orderId, status });

      // Send notification
      await this.sendOrderStatusNotification(order);

      return order;
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw error;
    }
  }

  // Process order after payment
  async processOrder(orderId) {
    try {
      const order = await this.getOrder(orderId);

      // Update payment status
      await order.update({
        paymentStatus: 'paid',
        status: 'confirmed'
      });

      // Reduce stock for each item
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({
            stock: product.stock - item.quantity
          });
        }
      }

      logger.info('Order processed:', { orderId });

      // Send confirmation email
      await emailService.sendOrderConfirmation(order);

      // Send WhatsApp Notification (Twilio/WATI Integration Placeholder)
      await this.sendWhatsAppNotification(order);

      return order;
    } catch (error) {
      logger.error('Error processing order:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const order = await this.getOrder(orderId);

      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      await order.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        notes: reason
      });

      // Restore stock
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({
            stock: product.stock + item.quantity
          });
        }
      }

      logger.info('Order cancelled:', { orderId, reason });

      return order;
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Helper: Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // Helper: Calculate shipping cost
  calculateShipping(address, subtotal) {
    // Free shipping above ₹1000
    if (subtotal >= 1000) {
      return 0;
    }

    // Metro cities: ₹50, Others: ₹80
    const metroCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];
    return metroCities.includes(address.city) ? 50 : 80;
  }

  // Helper: Calculate tax (18% GST)
  calculateTax(subtotal) {
    return parseFloat((subtotal * 0.18).toFixed(2));
  }

  // Helper: Send order status notification
  async sendOrderStatusNotification(order) {
    try {
      // This will be implemented in notification service
      logger.info('Order notification sent:', { orderId: order.id, status: order.status });
    } catch (error) {
      logger.error('Error sending order notification:', error);
    }
  }

  // Helper: Send WhatsApp Notification to Customer
  async sendWhatsAppNotification(order) {
    try {
      if (!order.customerPhone) {
        logger.warn('Skipping WhatsApp notification: No phone number provided for order', { orderId: order.id });
        return;
      }

      // TODO: Integrate actual Twilio or WATI API here
      // const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      // const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      // const client = require('twilio')(twilioAccountSid, twilioAuthToken);

      const messageBody = `*Ruthan Shopping Spot*\nHi ${order.user?.firstName || 'Customer'}, your order #${order.orderNumber} for ₹${order.total} has been confirmed! 🎉\nWe will notify you once it ships. Tracking link: https://ruthan.com/track?order=${order.orderNumber}`;

      logger.info('🚀 [WHATSAPP API MOCK] Sending message to:', {
        phone: order.customerPhone,
        message: messageBody
      });

      /* 
      await client.messages.create({
         body: messageBody,
         from: 'whatsapp:+14155238886', // Twilio Sandbox number
         to: \`whatsapp:\${order.customerPhone}\`
       }); 
      */

    } catch (error) {
      logger.error('Error sending WhatsApp notification:', error);
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        todayOrders,
        todaySales,
        pendingOrders,
        totalRevenue
      ] = await Promise.all([
        Order.count({
          where: {
            createdAt: { [Op.gte]: today }
          }
        }),
        Order.sum('total', {
          where: {
            createdAt: { [Op.gte]: today },
            paymentStatus: 'paid'
          }
        }),
        Order.count({
          where: {
            status: { [Op.in]: ['pending', 'confirmed', 'processing'] }
          }
        }),
        Order.sum('total', {
          where: {
            paymentStatus: 'paid'
          }
        })
      ]);

      return {
        todayOrders,
        todaySales: todaySales || 0,
        pendingOrders,
        totalRevenue: totalRevenue || 0
      };
    } catch (error) {
      logger.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
