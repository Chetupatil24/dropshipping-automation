const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { Order } = require('../models');

module.exports = async (job) => {
  try {
    const { orderId, type } = job.data;

    logger.info('Sending notification:', { orderId, type });

    const order = await Order.findByPk(orderId, {
      include: ['items', 'user']
    });

    if (!order) {
      throw new Error('Order not found');
    }

    switch (type) {
      case 'order_confirmation':
        await emailService.sendOrderConfirmation(order);
        break;

      case 'shipping_update':
        await emailService.sendShippingUpdate(order);
        break;

      case 'delivery_confirmation':
        await emailService.sendDeliveryConfirmation(order);
        break;

      default:
        logger.warn('Unknown notification type:', type);
    }

    logger.info('Notification sent:', { orderId, type });

    return { success: true, orderId, type };
  } catch (error) {
    logger.error('Notification failed:', error);
    throw error;
  }
};
