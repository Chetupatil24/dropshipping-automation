const { Product } = require('../models');
const { sequelize } = require('../config/sequelize');
const logger = require('../utils/logger');

async function assignVendorIds() {
    try {
        await sequelize.authenticate();
        logger.info('Database connected');

        const products = await Product.findAll();
        logger.info(`Found ${products.length} products to check`);

        let updatedCount = 0;

        for (const product of products) {
            const lowerName = product.name.toLowerCase();
            const lowerDesc = (product.description || '').toLowerCase();
            const category = (product.category || '').toLowerCase();

            let vendorId = null;

            // 1. Shoes (Seasonsway)
            if (
                category.includes('shoe') ||
                category.includes('footwear') ||
                lowerName.includes('shoe') ||
                lowerName.includes('sandal') ||
                lowerName.includes('sneaker')
            ) {
                vendorId = 'seasonsway';
            }

            // 2. Ethnic Wear (Seasonsway)
            else if (
                category.includes('saree') ||
                category.includes('kurti') ||
                category.includes('ethnic') ||
                lowerName.includes('saree') ||
                lowerName.includes('kurta')
            ) {
                vendorId = 'seasonsway';
            }

            // 3. Custom/Printed Dresses (Qikink)
            else if (
                lowerName.includes('all-over-print') ||
                lowerName.includes('aop') ||
                (category.includes('dress') && lowerName.includes('print'))
            ) {
                vendorId = 'qikink';
            }

            // 4. Custom Accessories (Qikink)
            else if (
                category.includes('case') ||
                category.includes('mug') ||
                lowerName.includes('mug') ||
                lowerName.includes('case')
            ) {
                vendorId = 'qikink';
            }

            // 5. High-Quality Basics (Printrove)
            else if (
                lowerName.includes('oversized') ||
                lowerName.includes('hoodie') ||
                lowerName.includes('sweatshirt') ||
                lowerName.includes('jogger')
            ) {
                vendorId = 'printrove';
            }

            // Default fallback for T-Shirts if not caught above
            else if (category.includes('t-shirt') || lowerName.includes('t-shirt')) {
                vendorId = 'qikink'; // or Printrove, defaulting to Qikink as requested
            }

            if (vendorId && product.vendor_id !== vendorId) {
                await product.update({ vendor_id: vendorId });
                logger.info(`Assigned ${vendorId} to product: ${product.name}`);
                updatedCount++;
            }
        }

        logger.info(`Completed! Assigned vendors to ${updatedCount} products.`);

    } catch (error) {
        logger.error('Error assigning vendors:', error);
    } finally {
        await sequelize.close();
    }
}

assignVendorIds();
