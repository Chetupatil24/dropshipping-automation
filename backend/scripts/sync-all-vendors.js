/**
 * UNIFIED VENDOR PRODUCT SYNC
 * Syncs products from ALL active vendors into the database
 *
 * Usage:
 *   node scripts/sync-all-vendors.js              # sync all active vendors
 *   node scripts/sync-all-vendors.js cj            # CJ only
 *   node scripts/sync-all-vendors.js printrove     # Printrove only
 *   node scripts/sync-all-vendors.js cj 200        # CJ, 200 products
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

// ─── CJ Dropshipping Sync ───────────────────────────────────────────────────

async function syncCJ(maxProducts) {
    console.log('\n🔵 Starting CJ Dropshipping sync...');
    const cjService = require('../services/cjDropshippingService');

    let supplier = await Supplier.findOne({ where: { name: 'CJ Dropshipping' } });
    if (!supplier) {
        supplier = await Supplier.create({
            name: 'CJ Dropshipping', type: 'cj_dropship',
            apiKey: process.env.CJ_API_KEY, isActive: true,
            settings: { baseUrl: 'https://developers.cjdropshipping.com/api2.0/v1' }
        });
    }

    const existingSlugs = new Set(
        (await Product.findAll({ attributes: ['slug'], raw: true })).map(p => p.slug)
    );

    let synced = 0, failed = 0;
    const pages = Math.ceil(maxProducts / 50);

    for (let page = 1; page <= pages && synced < maxProducts; page++) {
        if (page > 1) await sleep(1500);
        let products;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                products = await cjService.getProducts({ page, pageSize: 50 });
                break;
            } catch (err) {
                if (attempt === 3) { console.log(`  ❌ Page ${page} failed: ${err.message}`); products = null; }
                else await sleep(3000 * attempt);
            }
        }
        if (!products?.length) continue;

        for (const p of products) {
            if (synced >= maxProducts) break;
            try {
                await sleep(1200); // CJ rate limit: 1 req/sec on detail endpoint
                const detail = await cjService.getProductDetail(p.pid || p.productId);
                if (!detail) continue;

                const baseSlug = slugify(detail.productNameEn || detail.productName || p.productName);
                const slug = uniqueSlug(baseSlug, existingSlugs);

                const usdPrice = parseFloat(detail.sellPrice || detail.productPrice || p.productPrice || 1);
                const images = (detail.productImageSet || []).map(img => img.imageUrl || img).filter(Boolean);

                await upsertProduct({
                    name: detail.productNameEn || detail.productName || p.productName,
                    slug,
                    description: detail.productDescEn || detail.description || '',
                    price: usdPrice,
                    costPrice: usdPrice,
                    compareAtPrice: null,
                    images,
                    category: detail.categoryName || detail.category || 'General',
                    sku: `CJ-${detail.pid || detail.productSku || p.pid}`,
                    supplierProductId: `cj_${detail.pid || p.pid}`,
                    vendor_id: 'cj',
                    stock: parseInt(detail.inventoryTotal || detail.inventory || 100),
                    isActive: true,
                    tags: [detail.categoryName, 'cj-dropshipping'].filter(Boolean),
                    dimensions: { cjPid: detail.pid, variants: detail.variants || [] },
                    lastSyncedAt: new Date()
                }, supplier.id);
                synced++;
                if (synced % 10 === 0) process.stdout.write(`  ✅ CJ: ${synced} synced...\r`);
            } catch (err) {
                failed++;
                if (process.env.NODE_ENV === 'development') console.log(`  ⚠️ CJ product error: ${err.message}`);
            }
        }
    }
    console.log(`\n  ✅ CJ Dropshipping: ${synced} synced, ${failed} failed`);
    return synced;
}

// ─── Printrove Sync ─────────────────────────────────────────────────────────

async function syncPrintrove(maxProducts) {
    console.log('\n🟣 Starting Printrove sync...');
    const printroveTokenService = require('../services/vendors/printroveTokenService');
    const axios = require('axios');

    let supplier = await Supplier.findOne({ where: { name: 'Printrove' } });
    if (!supplier) {
        supplier = await Supplier.create({
            name: 'Printrove', type: 'custom',
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
                console.log('  ℹ️  Printrove: no products in catalog yet (add products at printrove.com first)');
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

// ─── Vfulfill Sync (placeholder — needs API key) ────────────────────────────

async function syncVfulfill() {
    if (!process.env.VFULFILL_API_KEY) {
        console.log('\n⏭️  Vfulfill: Skipped (no API key — email support@vfulfill.io)');
        return 0;
    }
    console.log('\n🟡 Vfulfill sync: coming soon once API key received');
    return 0;
}

// ─── Seasonsway Sync (placeholder) ──────────────────────────────────────────

async function syncSeasonsway() {
    if (!process.env.SEASONSWAY_API_KEY) {
        console.log('⏭️  Seasonsway: Skipped (no API key — email seller@seasonsway.com)');
        return 0;
    }
    console.log('🟠 Seasonsway sync: coming soon once API key received');
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

    if (target === 'all' || target === 'cj') {
        totals.cj = await syncCJ(maxPerVendor);
    }
    if (target === 'all' || target === 'printrove') {
        totals.printrove = await syncPrintrove(maxPerVendor);
    }
    if (target === 'all') {
        totals.vfulfill = await syncVfulfill();
        totals.seasonsway = await syncSeasonsway();
    }

    // Final count
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
