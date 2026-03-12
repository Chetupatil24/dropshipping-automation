/**
 * UNIFIED VENDOR PRODUCT SYNC
 * Syncs products from ALL active vendors into the database
 *
 * Usage:
 *   node scripts/sync-all-vendors.js              # sync all active vendors
 *   node scripts/sync-all-vendors.js printrove     # Printrove only
 *   node scripts/sync-all-vendors.js baapstore     # Baap Store only
 *   node scripts/sync-all-vendors.js eprolo        # Eprolo only
 *   node scripts/sync-all-vendors.js qikink        # Qikink only
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Product, Supplier, sequelize: seq } = require('../models');
const logger = require('../utils/logger');

const target = process.argv[2] || 'all';
const maxPerVendor = parseInt(process.argv[3]) || 100;

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function slugify(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80);
}

function uniqueSlug(base, existing) {
    let slug = base;
    let i = 2;
    while (existing.has(slug)) { slug = `${base}-${i++}`; }
    existing.add(slug);
    return slug;
}

async function upsertProduct(data, supplierId) {
    const [product, created] = await Product.findOrCreate({
        where: { supplierProductId: data.supplierProductId },
        defaults: { ...data, supplierId }
    });
    if (!created) {
        await product.update({ ...data, supplierId });
    }
    return { product, created };
}

// ─── Printrove Sync ─────────────────────────────────────────────────────────

async function syncPrintrove(maxProducts) {
    console.log('\n🟣 Starting Printrove sync...');
    const printroveTokenService = require('../services/vendors/printroveTokenService');
    const axios = require('axios');

    let supplier = await Supplier.findOne({ where: { name: 'Printrove' } });
    if (!supplier) {
        supplier = await Supplier.create({
            name: 'Printrove', type: 'printrove',
            isActive: true,
            settings: { baseUrl: 'https://api.printrove.com/api/external', vendorType: 'printrove' }
        });
    }

    const existingSlugs = new Set(
        (await Product.findAll({ attributes: ['slug'], raw: true })).map(p => p.slug)
    );

    let synced = 0, failed = 0;
    let page = 1;
    let hasMore = true;
    const perPage = 50;

    while (hasMore && synced < maxProducts) {
        try {
            const headers = await printroveTokenService.getHeaders();
            const res = await axios.get('https://api.printrove.com/api/external/products', {
                headers,
                params: { page, per_page: perPage },
                timeout: 20000
            });

            const products = res.data?.products || res.data?.data?.products || [];
            const links = res.data?.links || {};
            hasMore = !!links.next && products.length === perPage;

            if (products.length === 0) {
                console.log('  ℹ️  Printrove: no products in catalog yet');
                break;
            }

            for (const p of products) {
                if (synced >= maxProducts) break;
                try {
                    const baseSlug = slugify(p.product_name || p.name);
                    const slug = uniqueSlug(baseSlug, existingSlugs);
                    const basePrice = parseFloat(p.base_price || p.price || 0);

                    await upsertProduct({
                        name: p.product_name || p.name,
                        slug,
                        description: p.description || '',
                        price: basePrice / 83,
                        costPrice: basePrice / 83,
                        compareAtPrice: null,
                        images: (p.product_images || p.images || []).map(img => img.url || img).filter(Boolean),
                        category: p.category_name || p.category || 'Custom Prints',
                        sku: `PR-${p.sku || p.product_id}`,
                        supplierProductId: `printrove_${p.product_id || p.sku}`,
                        vendor_id: 'printrove',
                        vendor_sku: p.sku,
                        stock: p.is_available ? 999 : 0,
                        isActive: true,
                        tags: ['printrove', 'print-on-demand', p.category_name].filter(Boolean),
                        dimensions: { sku: p.sku, variants: p.variants || [], customizable: true },
                        lastSyncedAt: new Date()
                    }, supplier.id);
                    synced++;
                } catch (err) {
                    failed++;
                }
            }
            page++;
            await sleep(500);
        } catch (err) {
            console.log(`  ❌ Printrove page ${page} error: ${err.message}`);
            break;
        }
    }
    console.log(`  ✅ Printrove: ${synced} synced, ${failed} failed`);
    return synced;
}

// ─── Baap Store Sync ─────────────────────────────────────────────────────────

async function syncBaapStore(maxProducts) {
    if (!process.env.BAAP_STORE_API_KEY) {
        console.log('\n⏭️  Baap Store: Skipped (no API key — add BAAP_STORE_API_KEY to .env)');
        return 0;
    }
    console.log('\n🟢 Starting Baap Store sync...');
    const baapstoreAdapter = require('../services/vendors/baapstoreAdapter');

    let supplier = await Supplier.findOne({ where: { name: 'Baap Store' } });
    if (!supplier) {
        supplier = await Supplier.create({
            name: 'Baap Store', type: 'baapstore',
            apiKey: process.env.BAAP_STORE_API_KEY,
            isActive: true,
            settings: { baseUrl: 'https://baapstore.com/api/v1', vendorType: 'baapstore' }
        });
    }

    const existingSlugs = new Set(
        (await Product.findAll({ attributes: ['slug'], raw: true })).map(p => p.slug)
    );

    let synced = 0, failed = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore && synced < maxProducts) {
        try {
            const products = await baapstoreAdapter.getProducts({ page, limit: 50 });
            if (!products || products.length === 0) { hasMore = false; break; }
            hasMore = products.length === 50;

            for (const p of products) {
                if (synced >= maxProducts) break;
                try {
                    const baseSlug = slugify(p.name || p.product_name);
                    const slug = uniqueSlug(baseSlug, existingSlugs);
                    const price = parseFloat(p.price || p.selling_price || 0);

                    await upsertProduct({
                        name: p.name || p.product_name,
                        slug,
                        description: p.description || '',
                        price,
                        costPrice: parseFloat(p.purchase_price || price * 0.4),
                        compareAtPrice: null,
                        images: (p.images || []).map(img => img.url || img).filter(Boolean),
                        category: p.category || 'General',
                        sku: `BS-${p.sku || p.id}`,
                        supplierProductId: `baapstore_${p.id || p.product_id}`,
                        vendor_id: 'baapstore',
                        vendor_sku: p.sku || String(p.id),
                        stock: parseInt(p.stock || p.quantity || 100),
                        isActive: true,
                        tags: ['baapstore', p.category].filter(Boolean),
                        dimensions: { variants: p.variants || [] },
                        lastSyncedAt: new Date()
                    }, supplier.id);
                    synced++;
                } catch (err) {
                    failed++;
                    if (process.env.NODE_ENV === 'development') console.log(`  ⚠️ Baap Store product error: ${err.message}`);
                }
            }
            page++;
            await sleep(500);
        } catch (err) {
            console.log(`  ❌ Baap Store page ${page} error: ${err.message}`);
            break;
        }
    }
    console.log(`  ✅ Baap Store: ${synced} synced, ${failed} failed`);
    return synced;
}

// ─── Eprolo Sync ─────────────────────────────────────────────────────────────

async function syncEprolo(maxProducts) {
    if (!process.env.EPROLO_API_KEY) {
        console.log('\n⏭️  Eprolo: Skipped (no API key — add EPROLO_API_KEY to .env)');
        return 0;
    }
    console.log('\n🔷 Starting Eprolo sync...');
    const eproloAdapter = require('../services/vendors/eproloAdapter');

    let supplier = await Supplier.findOne({ where: { name: 'Eprolo' } });
    if (!supplier) {
        supplier = await Supplier.create({
            name: 'Eprolo', type: 'eprolo',
            apiKey: process.env.EPROLO_API_KEY,
            isActive: true,
            settings: { baseUrl: 'https://openapi.eprolo.com', vendorType: 'eprolo' }
        });
    }

    const existingSlugs = new Set(
        (await Product.findAll({ attributes: ['slug'], raw: true })).map(p => p.slug)
    );

    let synced = 0, failed = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore && synced < maxProducts) {
        try {
            const products = await eproloAdapter.getProducts({ page, pageSize: 50 });
            if (!products || products.length === 0) { hasMore = false; break; }
            hasMore = products.length === 50;

            for (const p of products) {
                if (synced >= maxProducts) break;
                try {
                    const baseSlug = slugify(p.productTitle || p.name);
                    const slug = uniqueSlug(baseSlug, existingSlugs);
                    const price = parseFloat(p.price || p.sellPrice || 0);

                    await upsertProduct({
                        name: p.productTitle || p.name,
                        slug,
                        description: p.description || '',
                        price,
                        costPrice: parseFloat(p.costPrice || price * 0.4),
                        compareAtPrice: null,
                        images: (p.images || p.productImages || []).map(img => img.imageUrl || img.url || img).filter(Boolean),
                        category: p.categoryName || p.category || 'General',
                        sku: `EP-${p.sku || p.productId}`,
                        supplierProductId: `eprolo_${p.productId || p.id}`,
                        vendor_id: 'eprolo',
                        vendor_sku: p.sku || String(p.productId),
                        stock: parseInt(p.stock || p.inventory || 100),
                        isActive: true,
                        tags: ['eprolo', p.categoryName].filter(Boolean),
                        dimensions: { variants: p.variants || [] },
                        lastSyncedAt: new Date()
                    }, supplier.id);
                    synced++;
                } catch (err) {
                    failed++;
                    if (process.env.NODE_ENV === 'development') console.log(`  ⚠️ Eprolo product error: ${err.message}`);
                }
            }
            page++;
            await sleep(500);
        } catch (err) {
            console.log(`  ❌ Eprolo page ${page} error: ${err.message}`);
            break;
        }
    }
    console.log(`  ✅ Eprolo: ${synced} synced, ${failed} failed`);
    return synced;
}

// ─── Vfulfill Sync (placeholder — needs API key) ────────────────────────────

async function syncVfulfill() {
    if (!process.env.VFULFILL_API_KEY) {
        console.log('\n⏭️  Vfulfill: Skipped (no API key — email support@vfulfill.io)');
        return 0;
    }
    console.log('\n🟡 Vfulfill sync: coming soon once API key received');
    return 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║    RUTHAN — Unified Vendor Product Sync   ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`Target: ${target}  |  Max per vendor: ${maxPerVendor}\n`);

    const { sequelize } = require('../config/sequelize');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const totals = {};

    if (target === 'all' || target === 'printrove') {
        totals.printrove = await syncPrintrove(maxPerVendor);
    }
    if (target === 'all' || target === 'baapstore') {
        totals.baapstore = await syncBaapStore(maxPerVendor);
    }
    if (target === 'all' || target === 'eprolo') {
        totals.eprolo = await syncEprolo(maxPerVendor);
    }
    if (target === 'all') {
        totals.vfulfill = await syncVfulfill();
    }

    const totalInDB = await Product.count({ where: { isActive: true } });
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║              Sync Complete                ║');
    console.log('╚══════════════════════════════════════════╝');
    Object.entries(totals).forEach(([v, n]) => console.log(`  ${v}: ${n} synced`));
    console.log(`\n  📦 Total active products in DB: ${totalInDB}`);
    console.log('');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Sync failed:', err.message);
    process.exit(1);
});
