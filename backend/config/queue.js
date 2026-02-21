const Queue = require('bull');
const logger = require('../utils/logger');

// Create queues
const inventorySyncQueue = new Queue('inventory-sync', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const orderProcessingQueue = new Queue('order-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const shippingQueue = new Queue('shipping', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const notificationQueue = new Queue('notification', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const trackingSyncQueue = new Queue('tracking-sync', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

// Queue event handlers
[inventorySyncQueue, orderProcessingQueue, shippingQueue, notificationQueue, trackingSyncQueue].forEach(queue => {
  queue.on('completed', (job, result) => {
    logger.info(`Job completed: ${queue.name}`, { jobId: job.id });
  });

  queue.on('failed', (job, err) => {
    logger.error(`Job failed: ${queue.name}`, { jobId: job.id, error: err.message });
  });

  queue.on('error', (error) => {
    logger.error(`Queue error: ${queue.name}`, { error: error.message });
  });
});

module.exports = {
  inventorySyncQueue,
  orderProcessingQueue,
  shippingQueue,
  notificationQueue,
  trackingSyncQueue
};
