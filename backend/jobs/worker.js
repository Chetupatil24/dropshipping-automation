require('dotenv').config();
const { inventorySyncQueue, orderProcessingQueue, shippingQueue, notificationQueue } = require('../config/queue');
const logger = require('../utils/logger');

// Import job processors
const inventorySync = require('./inventorySync');
const processOrder = require('./processOrder');
const createShippingLabel = require('./createShippingLabel');
const sendNotification = require('./sendNotification');

// Register job processors
inventorySyncQueue.process(inventorySync);
orderProcessingQueue.process(processOrder);
shippingQueue.process(createShippingLabel);
notificationQueue.process(sendNotification);

logger.info('Job worker started successfully');

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing job queues');
  
  await Promise.all([
    inventorySyncQueue.close(),
    orderProcessingQueue.close(),
    shippingQueue.close(),
    notificationQueue.close()
  ]);
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing job queues');
  
  await Promise.all([
    inventorySyncQueue.close(),
    orderProcessingQueue.close(),
    shippingQueue.close(),
    notificationQueue.close()
  ]);
  
  process.exit(0);
});
