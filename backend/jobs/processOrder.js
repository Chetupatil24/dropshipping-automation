const { Order } = require('../models');
const supplierService = require('../integrations/supplierService');
const logger = require('../utils/logger');

module.exports = async (job) => {
  try {
    const { orderId } = job.data;
    
    logger.info('Processing order:', { orderId });

    // Get order
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Place order with supplier
    const result = await supplierService.placeSupplierOrder(order);

    // Update order status
    await order.update({ status: 'processing' });

    logger.info('Order processing completed:', { orderId, result });
    
    return { success: true, orderId, result };
  } catch (error) {
    logger.error('Order processing failed:', error);
    throw error;
  }
};
