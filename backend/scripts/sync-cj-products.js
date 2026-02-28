require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
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
                type: 'cj_dropship',
                apiKey: process.env.CJ_API_KEY || process.env.CJ_DROPSHIP_API_KEY,
                isActive: true,
                settings: {
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
            // Respect 1 req/second rate limit on list endpoint
            if (page > 1) await new Promise(resolve => setTimeout(resolve, 1500));

            let products = null;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    products = await cjDropshippingService.getProducts({
                        page,
                        pageSize: 50,
                        categoryId
                    });
                    break;
                } catch (err) {
                    if (err.message.includes('Too Many Requests') && attempt < 3) {
                        console.log(`  ⏳ Rate limited, waiting 5s before retry (attempt ${attempt}/3)...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } else {
                        throw err;
                    }
                }
            }

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

                // Get product details - respect CJ's 1 req/second rate limit
                await new Promise(resolve => setTimeout(resolve, 1200));
                const details = await cjDropshippingService.getProductDetail(cjProduct.pid);

                if (!details) {
                    console.log(`  ⚠️  Skipping ${cjProduct.productNameEn} - no details available`);
                    skipped++;
                    continue;
                }

                // Generate URL-friendly slug from product name + pid suffix for uniqueness
                const productName = cjProduct.productNameEn || cjProduct.productName || 'product';
                const baseSlug = productName
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .substring(0, 60);
                const slug = `${baseSlug}-${cjProduct.pid.toString().slice(-6)}`;

                // Create product in database
                const product = await Product.create({
                    name: productName,
                    slug,
                    description: details.description || productName || 'No description available',
                    price: parseFloat(cjProduct.sellPrice || details.sellPrice || 0),
                    compareAtPrice: parseFloat(cjProduct.originalPrice || details.originalPrice || 0) || null,
                    costPrice: parseFloat(cjProduct.costPrice || details.costPrice || 0),
                    stock: details.inventory || 999,
                    images: cjProduct.productImage ? [cjProduct.productImage] : [],
                    category: cjProduct.categoryName || 'General',
                    supplierId: supplier.id,
                    supplierProductId: cjProduct.pid,
                    isActive: true,
                    sku: `CJ-${cjProduct.pid}`,
                    weight: details.packWeight ? parseFloat(details.packWeight) : null,
                    dimensions: (details.packLength && details.packWidth && details.packHeight)
                        ? { length: details.packLength, width: details.packWidth, height: details.packHeight }
                        : null,
                    tags: [
                        'CJ Dropshipping',
                        cjProduct.categoryName || 'General',
                        'International'
                    ]
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
