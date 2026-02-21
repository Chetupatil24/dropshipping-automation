const cron = require('node-cron');
const { inventorySyncQueue } = require('../config/queue');
const logger = require('../utils/logger');

class Scheduler {
  start() {
    // Sync inventory every hour
    cron.schedule('0 * * * *', async () => {
      logger.info('Scheduled inventory sync triggered');
      await inventorySyncQueue.add({}, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      });
    });

    // Check for pending orders every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      logger.info('Checking for pending orders');
      // This will be handled by order service
    });

    // Update tracking status every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      logger.info('Starting tracking sync job');
      const { trackingSyncQueue } = require('../config/queue');
      await trackingSyncQueue.add({}, {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      });
    });

    logger.info('Schedulers started');
  }

  stop() {
    cron.getTasks().forEach(task => task.stop());
    logger.info('Schedulers stopped');
  }
}

module.exports = new Scheduler();
