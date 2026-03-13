#!/usr/bin/env node
/**
 * DB cleanup + vendor sync script
 * 1. Delete all CJ products from DB
 * 2. Load Qikink products
 * 3. Load Printrove products
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;

const seq = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
  logging: false
});

async function run() {
  try {
    await seq.authenticate();
    console.log('✅ DB connected');

    // ── 1. Show schema ──
    const [cols] = await seq.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='products' ORDER BY ordinal_position"
    );
    console.log('Columns:', cols.map(c => c.column_name).join(', '));

    // ── 2. Count by vendor ──
    const [counts] = await seq.query(
      "SELECT vendor_id, COUNT(*) as cnt FROM products GROUP BY vendor_id ORDER BY cnt DESC"
    );
    console.log('\nProduct counts by vendor_id:');
    counts.forEach(r => console.log(` ${r.vendor_id || '(null)'}: ${r.cnt}`));

    // ── 3. Sample rows with supplierProductId ──
    const [samples] = await seq.query(
      "SELECT id, name, vendor_id, \"supplierProductId\" FROM products LIMIT 5"
    );
    console.log('\nSample rows:', JSON.stringify(samples, null, 2));

    // ── 4. Check supplierProductId patterns ──
    const [patterns] = await seq.query(
      "SELECT LEFT(\"supplierProductId\", 10) as prefix, COUNT(*) FROM products GROUP BY prefix ORDER BY count DESC LIMIT 10"
    );
    console.log('\nsupplierProductId prefixes:', JSON.stringify(patterns));

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await seq.close();
  }
}

run();
