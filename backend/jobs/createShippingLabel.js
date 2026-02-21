const { Order } = require('../models');
const shiprocket = require('../integrations/shiprocket');
const logger = require('../utils/logger');

module.exports = async (job) => {
  try {
    const { orderId } = job.data;
    
    logger.info('Creating shipping label:', { orderId });

    // Get order
    const order = await Order.findByPk(orderId, {
      include: ['items']
    });
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Create shipping label
    const shippingData = await shiprocket.createShippingLabel(order);

    // Update order
    await order.update({
      trackingNumber: shippingData.trackingNumber,
      trackingUrl: shippingData.trackingUrl,
      shippingProvider: shippingData.shippingProvider,
      status: 'shipped',
      shippedAt: new Date()
    });

    logger.info('Shipping label created:', { orderId, trackingNumber: shippingData.trackingNumber });
    
    return { success: true, orderId, shippingData };
  } catch (error) {
    logger.error('Shipping label creation failed:', error);
    throw error;
  }
};
