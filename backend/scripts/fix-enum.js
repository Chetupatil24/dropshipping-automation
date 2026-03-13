#!/usr/bin/env node
/**
 * Fix supplier type enum and re-run sync
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Sequelize } = require('sequelize');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;

const seq = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
  logging: false
});

async function main() {
  await seq.authenticate();
  console.log('✅ Connected');

  // Check current enum values
  const [enumVals] = await seq.query(
    "SELECT unnest(enum_range(NULL::enum_suppliers_type)) AS val"
  );
  console.log('Current enum values:', enumVals.map(r => r.val).join(', '));

  // Add new enum values (safe - ignores if already exists)
  const newVals = ['qikink', 'printrove', 'baapstore', 'eprolo', 'vfulfill', 'seasonsway', 'vendorboat'];
  for (const val of newVals) {
    try {
      await seq.query(`ALTER TYPE enum_suppliers_type ADD VALUE IF NOT EXISTS '${val}'`);
      console.log(`  ✅ Added enum value: ${val}`);
    } catch (e) {
      console.log(`  ⚠️  ${val}: ${e.message}`);
    }
  }

  // Check updated enum
  const [enumVals2] = await seq.query(
    "SELECT unnest(enum_range(NULL::enum_suppliers_type)) AS val"
  );
  console.log('Updated enum values:', enumVals2.map(r => r.val).join(', '));

  await seq.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
