require('dotenv').config();
const { Product, Supplier } = require('../models');
const cjDropshippingService = require('../services/cjDropshippingService');
const logger = require('../utils/logger');

/**
 * Sync products from CJ Dropshipping to database
 */
async function syncCJProducts(options = {}) {
    const {
        maxProducts = 50,
        categoryId = null,
        skipExisting = true
    } = options;

    console.log('\n🔄 Starting CJ Dropshipping Product Sync...\n');
    console.log(`📦 Max products to sync: ${maxProducts}`);
    console.log(`🔖 Category: ${categoryId || 'All categories'}`);
    console.log(`⏭️  Skip existing: ${skipExisting}\n`);

    try {
        // Step 1: Get or create CJ supplier
        console.log('Step 1: Finding/creating CJ Dropshipping supplier...');
        let supplier = await Supplier.findOne({ where: { name: 'CJ Dropshipping' } });

        if (!supplier) {
            supplier = await Supplier.create({
                name: 'CJ Dropshipping',
                apiKey: process.env.CJ_DROPSHIP_API_KEY,
                country: 'CN',
                shippingTime: '7-15 days',
                isActive: true,
                config: {
                    type: 'cj_dropshipping',
                    baseUrl: 'https://developers.cjdropshipping.com/api2.0/v1'
                }
            });
            console.log('✅ CJ Dropshipping supplier created');
        } else {
            console.log('✅ CJ Dropshipping supplier found');
        }

        // Step 2: Fetch products from CJ
        console.log('\nStep 2: Fetching products from CJ Dropshipping API...');
        const pages = Math.ceil(maxProducts / 50);
        let allProducts = [];

        for (let page = 1; page <= pages; page++) {
            console.log(`  Fetching page ${page}/${pages}...`);
            const products = await cjDropshippingService.getProducts({
                page,
                pageSize: 50,
                categoryId
            });

            if (products && products.length > 0) {
                allProducts = allProducts.concat(products);
                console.log(`  ✅ Retrieved ${products.length} products`);
            }

            // Stop if we have enough products
            if (allProducts.length >= maxProducts) {
                allProducts = allProducts.slice(0, maxProducts);
                break;
            }
        }

        console.log(`\n✅ Total products fetched: ${allProducts.length}`);

        // Step 3: Save products to database
        console.log('\nStep 3: Saving products to database...');
        let created = 0;
        let skipped = 0;
        let errors = 0;

        for (const cjProduct of allProducts) {
            try {
                // Check if product already exists
                if (skipExisting) {
                    const existing = await Product.findOne({
                        where: {
                            supplierProductId: cjProduct.pid
                        }
                    });

                    if (existing) {
                        skipped++;
                        continue;
                    }
                }

                // Get product details for more information
                const details = await cjDropshippingService.getProductDetail(cjProduct.pid);

                if (!details) {
                    console.log(`  ⚠️  Skipping ${cjProduct.productNameEn} - no details available`);
                    skipped++;
                    continue;
                }

                // Create product in database
                const product = await Product.create({
                    name: cjProduct.productNameEn || cjProduct.productName,
                    description: details.description || cjProduct.productNameEn || 'No description available',
                    price: parseFloat(cjProduct.sellPrice || details.sellPrice || 0),
                    originalPrice: parseFloat(cjProduct.originalPrice || details.originalPrice || 0),
                    costPrice: parseFloat(cjProduct.costPrice || details.costPrice || 0),
                    currency: 'USD', // CJ prices are in USD
                    stock: details.inventory || 999,
                    images: cjProduct.productImage ? [cjProduct.productImage] : [],
                    category: cjProduct.categoryName || 'General',
                    supplierId: supplier.id,
                    supplierProductId: cjProduct.pid,
                    supplierVariantId: details.vid || null,
                    isActive: true,
                    sku: `CJ-${cjProduct.pid}`,
                    weight: details.packWeight || 0,
                    dimensions: details.packLength && details.packWidth && details.packHeight
                        ? `${details.packLength}x${details.packWidth}x${details.packHeight}`
                        : null,
                    tags: [
                        'CJ Dropshipping',
                        cjProduct.categoryName || 'General',
                        'International'
                    ],
                    metadata: {
                        cjProductId: cjProduct.pid,
                        cjVariantId: details.vid,
                        cjCategoryId: cjProduct.categoryId,
                        shippingMethod: 'International',
                        processingTime: '2-5 days'
                    }
                });

                created++;
                console.log(`  ✅ Created: ${product.name} (₹${(product.price * 83).toFixed(2)})`); // Convert USD to INR approx
            } catch (error) {
                errors++;
                console.error(`  ❌ Error creating product ${cjProduct.productNameEn}:`, error.message);
            }
        }

        // Step 4: Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 SYNC SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Products created: ${created}`);
        console.log(`⏭️  Products skipped: ${skipped}`);
        console.log(`❌ Errors: ${errors}`);
        console.log(`📦 Total processed: ${allProducts.length}`);
        console.log('='.repeat(60));

        console.log('\n🎉 CJ Dropshipping product sync completed!');

        return {
            success: true,
            created,
            skipped,
            errors,
            total: allProducts.length
        };

    } catch (error) {
        console.error('\n❌ Product sync failed:', error.message);
        console.error(error.stack);
        return {
            success: false,
            error: error.message
        };
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const maxProducts = parseInt(args[0]) || 20; // Default 20 products
    const categoryId = args[1] || null;

    console.log('\n🚀 CJ Dropshipping Product Sync Tool');
    console.log('====================================\n');

    syncCJProducts({
        maxProducts,
        categoryId,
        skipExisting: true
    })
        .then(result => {
            if (result.success) {
                console.log('\n✅ Sync completed successfully!');
                process.exit(0);
            } else {
                console.log('\n❌ Sync failed!');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n❌ Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = syncCJProducts;
