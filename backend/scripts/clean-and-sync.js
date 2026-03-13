#!/usr/bin/env node
/**
 * Clean DB + Sync Qikink + Printrove Products
 * Usage: node backend/scripts/clean-and-sync.js
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Sequelize } = require('sequelize');
const axios = require('axios');
const path = require('path');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;

const seq = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
  logging: false
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function uniqueSlug(base, existingSlugs) {
  let slug = base;
  let i = 2;
  while (existingSlugs.has(slug)) { slug = `${base}-${i++}`; }
  existingSlugs.add(slug);
  return slug;
}

// ── Step 1: Delete all CJ products (vendor_id IS NULL or 'cj') ──────────────
async function deleteCJProducts() {
  console.log('\n🗑️  Deleting all CJ/orphan products...');

  const [beforeCount] = await seq.query("SELECT COUNT(*) as cnt FROM products");
  console.log(`   Before: ${beforeCount[0].cnt} products`);

  // CJ products have vendor_id = NULL or vendor_id = 'cj'
  const [deleted] = await seq.query(
    "DELETE FROM products WHERE vendor_id IS NULL OR vendor_id = 'cj' OR vendor_id = 'cj_dropshipping' RETURNING id"
  );
  console.log(`   ✅ Deleted ${deleted.length} CJ/orphan products`);

  const [afterCount] = await seq.query("SELECT COUNT(*) as cnt FROM products");
  console.log(`   After: ${afterCount[0].cnt} products remaining`);

  return deleted.length;
}

// ── Step 2: Sync Qikink Products ────────────────────────────────────────────
async function syncQikink() {
  console.log('\n🟡 Syncing Qikink products...');

  if (!process.env.QIKINK_API_KEY || !process.env.QIKINK_API_SECRET) {
    console.log('   ⏭️  Skipped (no QIKINK_API_KEY/SECRET in .env)');
    return 0;
  }

  const credentials = Buffer.from(
    `${process.env.QIKINK_API_KEY}:${process.env.QIKINK_API_SECRET}`
  ).toString('base64');

  const headers = {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  };

  // Get or create Qikink supplier record
  const [[supplier]] = await seq.query(
    "SELECT id FROM suppliers WHERE name = 'Qikink' LIMIT 1"
  );
  let supplierId;
  if (!supplier) {
    const [[newSupplier]] = await seq.query(
      `INSERT INTO suppliers (id, name, type, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'Qikink', 'qikink', true, NOW(), NOW()) RETURNING id`
    );
    supplierId = newSupplier.id;
  } else {
    supplierId = supplier.id;
  }

  const existingSlugsRows = await seq.query('SELECT slug FROM products');
  const existingSlugs = new Set(existingSlugsRows[0].map(r => r.slug));

  let synced = 0, failed = 0, page = 1, hasMore = true;
  const baseUrl = process.env.QIKINK_BASE_URL || 'https://api.qikink.com';

  while (hasMore) {
    try {
      const response = await axios.get(`${baseUrl}/products`, {
        headers,
        params: { page, limit: 50 },
        timeout: 30000
      });

      const data = response.data;
      const products = data.products || data.data?.products || data.data || [];

      if (!products.length) {
        if (page === 1) console.log('   ℹ️  Qikink: no products found in catalog');
        hasMore = false;
        break;
      }

      hasMore = products.length === 50;

      for (const p of products) {
        try {
          const baseSlug = slugify(p.product_name || p.name || p.title);
          const slug = uniqueSlug(baseSlug, existingSlugs);
          const price = parseFloat(p.base_price || p.price || p.selling_price || 0);
          const images = (p.images || p.product_images || [])
            .map(img => (typeof img === 'string' ? img : img.url || img.src || img.image_url))
            .filter(Boolean);

          await seq.query(
            `INSERT INTO products (
              id, name, slug, description, price, "costPrice", "compareAtPrice",
              images, category, sku, "supplierProductId", vendor_id, vendor_sku,
              stock, "isActive", tags, dimensions, "lastSyncedAt", "supplierId",
              "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid(), :name, :slug, :desc, :price, :costPrice, NULL,
              :images, :category, :sku, :supplierProductId, 'qikink', :vendorSku,
              :stock, true, :tags, :dimensions, NOW(), :supplierId, NOW(), NOW()
            )
            ON CONFLICT ("supplierProductId") DO UPDATE SET
              name = EXCLUDED.name,
              slug = EXCLUDED.slug,
              price = EXCLUDED.price,
              images = EXCLUDED.images,
              stock = EXCLUDED.stock,
              "lastSyncedAt" = NOW(),
              "updatedAt" = NOW()`,
            {
              replacements: {
                name: p.product_name || p.name || p.title,
                slug,
                desc: p.description || '',
                price,
                costPrice: parseFloat(p.cost_price || p.purchase_price || price * 0.4),
                images: JSON.stringify(images),
                category: p.category_name || p.category || 'Print on Demand',
                sku: `QK-${p.sku || p.product_id || p.id}`,
                supplierProductId: `qikink_${p.product_id || p.id || p.sku}`,
                vendorSku: p.sku || String(p.product_id || p.id),
                stock: p.is_available !== false ? 999 : 0,
                tags: JSON.stringify(['qikink', 'print-on-demand', p.category_name].filter(Boolean)),
                dimensions: JSON.stringify({ sku: p.sku, variants: p.variants || [], customizable: true }),
                supplierId
              }
            }
          );
          synced++;
        } catch (err) {
          failed++;
          if (process.env.NODE_ENV === 'development') console.log(`   ⚠️  Qikink product error: ${err.message}`);
        }
      }

      process.stdout.write(`   ✅ Qikink: ${synced} synced...\r`);
      page++;
      await sleep(500);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('   ❌ Qikink: Authentication failed — check QIKINK_API_KEY and QIKINK_API_SECRET');
      } else if (err.response?.status === 404) {
        console.log('   ℹ️  Qikink: Products endpoint not found — catalog may be empty');
      } else {
        console.log(`   ❌ Qikink page ${page} error: ${err.response?.status || err.message}`);
      }
      hasMore = false;
    }
  }

  console.log(`   ✅ Qikink: ${synced} synced, ${failed} failed`);
  return synced;
}

// ── Step 3: Sync Printrove Products ─────────────────────────────────────────
async function syncPrintrove() {
  console.log('\n🟣 Syncing Printrove products...');

  if (!process.env.PRINTROVE_EMAIL || !process.env.PRINTROVE_PASSWORD) {
    console.log('   ⏭️  Skipped (no PRINTROVE_EMAIL/PASSWORD in .env)');
    return 0;
  }

  // Step 1: Get auth token
  let token;
  try {
    const tokenRes = await axios.post(
      'https://api.printrove.com/api/external/token',
      {
        email: process.env.PRINTROVE_EMAIL,
        password: process.env.PRINTROVE_PASSWORD
      },
      { timeout: 15000 }
    );
    token = tokenRes.data?.token || tokenRes.data?.data?.token || tokenRes.data?.access_token;
    if (!token) throw new Error('No token in response: ' + JSON.stringify(tokenRes.data));
    console.log('   🔑 Printrove authenticated');
  } catch (err) {
    console.log(`   ❌ Printrove auth failed: ${err.response?.data?.message || err.message}`);
    return 0;
  }

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

  // Get or create Printrove supplier record
  const [[supplier]] = await seq.query(
    "SELECT id FROM suppliers WHERE name = 'Printrove' LIMIT 1"
  );
  let supplierId;
  if (!supplier) {
    const [[newSupplier]] = await seq.query(
      `INSERT INTO suppliers (id, name, type, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'Printrove', 'printrove', true, NOW(), NOW()) RETURNING id`
    );
    supplierId = newSupplier.id;
  } else {
    supplierId = supplier.id;
  }

  const existingSlugsRows = await seq.query('SELECT slug FROM products');
  const existingSlugs = new Set(existingSlugsRows[0].map(r => r.slug));

  let synced = 0, failed = 0, page = 1, hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get('https://api.printrove.com/api/external/products', {
        headers,
        params: { page, per_page: 50 },
        timeout: 20000
      });

      const data = response.data;
      const products = data.products || data.data?.products || data.data || [];
      const links = data.links || data.meta || {};
      hasMore = !!(links.next || (data.meta?.current_page < data.meta?.last_page));

      if (!products.length) {
        if (page === 1) console.log('   ℹ️  Printrove: no products in catalog (add products at printrove.com first)');
        hasMore = false;
        break;
      }

      for (const p of products) {
        try {
          const baseSlug = slugify(p.product_name || p.name);
          const slug = uniqueSlug(baseSlug, existingSlugs);
          const basePrice = parseFloat(p.base_price || p.price || 0);
          const images = (p.product_images || p.images || [])
            .map(img => (typeof img === 'string' ? img : img.url || img.src))
            .filter(Boolean);
          if (p.thumbnail) images.unshift(p.thumbnail);

          await seq.query(
            `INSERT INTO products (
              id, name, slug, description, price, "costPrice", "compareAtPrice",
              images, category, sku, "supplierProductId", vendor_id, vendor_sku,
              stock, "isActive", tags, dimensions, "lastSyncedAt", "supplierId",
              "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid(), :name, :slug, :desc, :price, :costPrice, NULL,
              :images, :category, :sku, :supplierProductId, 'printrove', :vendorSku,
              :stock, true, :tags, :dimensions, NOW(), :supplierId, NOW(), NOW()
            )
            ON CONFLICT ("supplierProductId") DO UPDATE SET
              name = EXCLUDED.name,
              slug = EXCLUDED.slug,
              price = EXCLUDED.price,
              images = EXCLUDED.images,
              stock = EXCLUDED.stock,
              "lastSyncedAt" = NOW(),
              "updatedAt" = NOW()`,
            {
              replacements: {
                name: p.product_name || p.name,
                slug,
                desc: p.description || '',
                price: basePrice / 83,
                costPrice: (basePrice * 0.7) / 83,
                images: JSON.stringify(images.slice(0, 5)),
                category: p.category_name || p.category || 'Custom Prints',
                sku: `PR-${p.sku || p.product_id}`,
                supplierProductId: `printrove_${p.product_id || p.sku}`,
                vendorSku: p.sku || String(p.product_id),
                stock: p.is_available !== false ? 999 : 0,
                tags: JSON.stringify(['printrove', 'print-on-demand', p.category_name].filter(Boolean)),
                dimensions: JSON.stringify({ sku: p.sku, variants: p.variants || [], customizable: true }),
                supplierId
              }
            }
          );
          synced++;
        } catch (err) {
          failed++;
          if (process.env.NODE_ENV === 'development') console.log(`   ⚠️  Printrove error: ${err.message}`);
        }
      }

      process.stdout.write(`   ✅ Printrove: ${synced} synced...\r`);
      page++;
      await sleep(500);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('   ❌ Printrove: Token expired or invalid');
      } else {
        console.log(`   ❌ Printrove page ${page} error: ${err.response?.status || err.message}`);
      }
      hasMore = false;
    }
  }

  console.log(`   ✅ Printrove: ${synced} synced, ${failed} failed`);
  return synced;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   RUTHAN — Clean DB + Sync Vendors        ║');
  console.log('╚══════════════════════════════════════════╝');

  try {
    await seq.authenticate();
    console.log('✅ Database connected');

    const deleted = await deleteCJProducts();
    const qikinkCount = await syncQikink();
    const printroveCount = await syncPrintrove();

    const [[totalRow]] = await seq.query("SELECT COUNT(*) as cnt FROM products WHERE \"isActive\" = true");

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║              Summary                      ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`  CJ products deleted: ${deleted}`);
    console.log(`  Qikink products synced: ${qikinkCount}`);
    console.log(`  Printrove products synced: ${printroveCount}`);
    console.log(`  Total active products in DB: ${totalRow.cnt}`);
    console.log('');

  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  } finally {
    await seq.close();
  }
}

main();
