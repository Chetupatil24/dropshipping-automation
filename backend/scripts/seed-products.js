require('dotenv').config();
const { Product, Supplier, sequelize } = require('../models');

/**
 * Seed database with sample products
 * This allows the platform to be fully functional while CJ API access is being resolved
 */
async function seedProducts() {
    console.log('🌱 Seeding Ruthan - The Shopping Spot with sample products...\n');

    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Create or get supplier
        let supplier = await Supplier.findOne({ where: { name: 'Ruthan Catalog' } });
        if (!supplier) {
            supplier = await Supplier.create({
                name: 'Ruthan Catalog',
                country: 'IN',
                shippingTime: '3-7 days',
                isActive: true,
                config: { type: 'internal' }
            });
            console.log('✅ Created Ruthan Catalog supplier\n');
        }

        // Sample products for The Shopping Spot
        const sampleProducts = [
            {
                name: 'Premium Cotton Casual T-Shirt',
                description: 'Comfortable cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a modern fit. Available in multiple colors.',
                price: 599,
                originalPrice: 999,
                costPrice: 300,
                currency: 'INR',
                stock: 150,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
                category: 'Fashion',
                sku: 'RTN-TSHIRT-001',
                tags: ['mens', 'fashion', 'casual', 't-shirt', 'cotton'],
                isActive: true,
                weight: 200,
                dimensions: 'M: 28x38cm',
                metadata: {
                    brand: 'Ruthan Collection',
                    material: '100% Cotton',
                    careInstructions: 'Machine wash cold',
                    sizes: ['S', 'M', 'L', 'XL', 'XXL']
                }
            },
            {
                name: 'Running Shoes - Lightweight',
                description: 'Ultra-lightweight running shoes with superior cushioning. Breathable mesh upper and durable rubber outsole. Perfect for daily running and workouts.',
                price: 1999,
                originalPrice: 3499,
                costPrice: 1200,
                currency: 'INR',
                stock: 80,
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
                category: 'Footwear',
                sku: 'RTN-SHOES-001',
                tags: ['mens', 'shoes', 'running', 'sports', 'fitness'],
                isActive: true,
                weight: 400,
                dimensions: '28cm length',
                metadata: {
                    brand: 'Ruthan Sports',
                    material: 'Mesh & Rubber',
                    sizes: ['6', '7', '8', '9', '10', '11']
                }
            },
            {
                name: 'Wireless Bluetooth Earbuds',
                description: 'Premium wireless earbuds with active noise cancellation. 30-hour battery life with charging case. Crystal clear sound and comfortable fit.',
                price: 2499,
                originalPrice: 4999,
                costPrice: 1500,
                currency: 'INR',
                stock: 200,
                images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'],
                category: 'Electronics',
                sku: 'RTN-AUDIO-001',
                tags: ['electronics', 'audio', 'wireless', 'bluetooth', 'earbuds'],
                isActive: true,
                weight: 50,
                metadata: {
                    brand: 'Ruthan Audio',
                    batteryLife: '30 hours',
                    features: ['ANC', 'Touch Controls', 'Water Resistant']
                }
            },
            {
                name: 'Women\'s Elegant Kurti',
                description: 'Beautiful ethnic kurti for women. Comfortable cotton blend fabric with elegant embroidery. Perfect for casual and festive occasions.',
                price: 799,
                originalPrice: 1499,
                costPrice: 400,
                currency: 'INR',
                stock: 120,
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
                category: 'Fashion',
                sku: 'RTN-KURTI-001',
                tags: ['womens', 'fashion', 'ethnic', 'kurti', 'traditional'],
                isActive: true,
                weight: 250,
                metadata: {
                    brand: 'Ruthan Ethnic',
                    material: 'Cotton Blend',
                    sizes: ['S', 'M', 'L', 'XL', 'XXL']
                }
            },
            {
                name: 'Smart Watch - Fitness Tracker',
                description: 'Feature-packed smartwatch with health monitoring. Track steps, heart rate, sleep, and more. 7-day battery life with AMOLED display.',
                price: 3499,
                originalPrice: 6999,
                costPrice: 2000,
                currency: 'INR',
                stock: 60,
                images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'],
                category: 'Electronics',
                sku: 'RTN-WATCH-001',
                tags: ['electronics', 'smartwatch', 'fitness', 'health', 'wearable'],
                isActive: true,
                weight: 80,
                metadata: {
                    brand: 'Ruthan Tech',
                    batteryLife: '7 days',
                    features: ['Heart Rate', 'Sleep Tracking', 'Water Resistant', '100+ Sports Modes']
                }
            },
            {
                name: 'Backpack - Laptop & Travel',
                description: 'Spacious backpack with dedicated laptop compartment. Multiple pockets, water-resistant material. Perfect for work, travel, and college.',
                price: 1299,
                originalPrice: 2499,
                costPrice: 700,
                currency: 'INR',
                stock: 100,
                images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
                category: 'Lifestyle',
                sku: 'RTN-BAG-001',
                tags: ['backpack', 'laptop', 'travel', 'office', 'college'],
                isActive: true,
                weight: 600,
                dimensions: '45x30x15cm',
                metadata: {
                    brand: 'Ruthan Gear',
                    material: 'Water-resistant Polyester',
                    laptopSize: 'Fits up to 15.6 inches',
                    features: ['USB Charging Port', 'Anti-theft Pocket']
                }
            },
            {
                name: 'Men\'s Denim Jeans - Slim Fit',
                description: 'Classic slim-fit denim jeans. Premium quality fabric with comfortable stretch. Timeless style for everyday wear.',
                price: 1199,
                originalPrice: 2199,
                costPrice: 650,
                currency: 'INR',
                stock: 90,
                images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
                category: 'Fashion',
                sku: 'RTN-JEANS-001',
                tags: ['mens', 'fashion', 'jeans', 'denim', 'casual'],
                isActive: true,
                weight: 500,
                metadata: {
                    brand: 'Ruthan Denim',
                    material: '98% Cotton, 2% Elastane',
                    sizes: ['28', '30', '32', '34', '36', '38']
                }
            },
            {
                name: 'Yoga Mat with Carry Bag',
                description: 'Premium non-slip yoga mat. Extra thick for comfort, eco-friendly material. Comes with carrying bag and strap.',
                price: 699,
                originalPrice: 1299,
                costPrice: 350,
                currency: 'INR',
                stock: 150,
                images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
                category: 'Lifestyle',
                sku: 'RTN-YOGA-001',
                tags: ['fitness', 'yoga', 'exercise', 'health', 'wellness'],
                isActive: true,
                weight: 1200,
                dimensions: '183x61x0.6cm',
                metadata: {
                    brand: 'Ruthan Fitness',
                    material: 'Eco-friendly TPE',
                    thickness: '6mm',
                    features: ['Non-slip', 'Lightweight', 'Carrying Strap']
                }
            },
            {
                name: 'Stainless Steel Water Bottle',
                description: 'Insulated stainless steel water bottle. Keeps drinks cold for 24hrs, hot for 12hrs. BPA-free, leak-proof design.',
                price: 499,
                originalPrice: 899,
                costPrice: 250,
                currency: 'INR',
                stock: 200,
                images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'],
                category: 'Lifestyle',
                sku: 'RTN-BOTTLE-001',
                tags: ['bottle', 'water', 'fitness', 'eco-friendly', 'insulated'],
                isActive: true,
                weight: 300,
                metadata: {
                    brand: 'Ruthan Eco',
                    capacity: '750ml',
                    material: 'Stainless Steel',
                    features: ['Double-walled', 'BPA-free', 'Leak-proof']
                }
            },
            {
                name: 'Sunglasses - UV Protection',
                description: 'Stylish polarized sunglasses with 100% UV protection. Durable frame with anti-glare lenses. Perfect for driving and outdoor activities.',
                price: 899,
                originalPrice: 1799,
                costPrice: 450,
                currency: 'INR',
                stock: 110,
                images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
                category: 'Accessories',
                sku: 'RTN-SUNGLASS-001',
                tags: ['sunglasses', 'eyewear', 'accessories', 'fashion', 'uv-protection'],
                isActive: true,
                weight: 50,
                metadata: {
                    brand: 'Ruthan Vision',
                    protection: 'UV400',
                    features: ['Polarized', 'Anti-glare', 'Scratch-resistant']
                }
            }
        ];

        console.log('Creating products...\n');
        let created = 0;
        let skipped = 0;

        for (const productData of sampleProducts) {
            // Check if product already exists
            const existing = await Product.findOne({ where: { sku: productData.sku } });

            if (existing) {
                console.log(`⏭️  Skipped: ${productData.name} (already exists)`);
                skipped++;
                continue;
            }

            // Create product
            const product = await Product.create({
                ...productData,
                supplierId: supplier.id
            });

            console.log(`✅ Created: ${product.name} - ₹${product.price}`);
            created++;
        }

        console.log('\n' + '='.repeat(70));
        console.log('📊 SEED SUMMARY');
        console.log('='.repeat(70));
        console.log(`✅ Products created: ${created}`);
        console.log(`⏭️  Products skipped: ${skipped}`);
        console.log(`📦 Total products in catalog: ${created + skipped}`);
        console.log('='.repeat(70));
        console.log('\n🎉 Product seeding complete!');
        console.log('✅ Ruthan - The Shopping Spot is ready to use!\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run seeding
seedProducts();
