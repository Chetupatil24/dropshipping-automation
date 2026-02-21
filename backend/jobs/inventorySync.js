const supplierService = require('../integrations/supplierService');
const logger = require('../utils/logger');

module.exports = async (job) => {
  try {
    logger.info('Starting inventory sync job');

    await supplierService.syncAllSuppliers();

    logger.info('Inventory sync job completed');
    
    return { success: true, message: 'Inventory synced successfully' };
  } catch (error) {
    logger.error('Inventory sync job failed:', error);
    throw error;
  }
};
