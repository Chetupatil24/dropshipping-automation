// seed-pod-products.js — Seed Qikink + Printrove POD products into DB
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');

// Use pooler connection for reliability
const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;

const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
});

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── QIKINK PRODUCTS ────────────────────────────────────────────────────────────
const QIKINK_PRODUCTS = [
  {
    name: 'Classic Round Neck T-Shirt — White',
    category: 'T-Shirts',
    price: 499, costPrice: 230,
    description: 'Premium 180 GSM bio-washed cotton. Comfortable pre-shrunk fabric, perfect for everyday wear. Available for custom print.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    tags: ['t-shirt', 'cotton', 'round-neck', 'pod', 'customizable'],
    vendor_sku: 'QK-RNTS-WHT-01', stock: 999, isFeatured: true
  },
  {
    name: 'Classic Round Neck T-Shirt — Black',
    category: 'T-Shirts',
    price: 499, costPrice: 230,
    description: 'Premium 180 GSM bio-washed cotton. Comfortable pre-shrunk fabric. Black base perfect for bold custom prints.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
    ],
    tags: ['t-shirt', 'cotton', 'round-neck', 'black', 'pod', 'customizable'],
    vendor_sku: 'QK-RNTS-BLK-01', stock: 999
  },
  {
    name: 'Oversized Drop-Shoulder T-Shirt',
    category: 'T-Shirts',
    price: 699, costPrice: 320,
    description: '220 GSM drop-shoulder oversized tee. Trendy baggy fit — ideal for streetwear custom prints. Unisex sizing.',
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
      'https://images.unsplash.com/photo-1503341338985-95231b3b3a22?w=800&q=80'
    ],
    tags: ['t-shirt', 'oversized', 'streetwear', 'drop-shoulder', 'pod'],
    vendor_sku: 'QK-OVTS-01', stock: 999, isFeatured: true
  },
  {
    name: 'Premium Polo T-Shirt — Customizable',
    category: 'T-Shirts',
    price: 799, costPrice: 370,
    description: 'Premium pique cotton polo. Collar and button placket. Great for corporate branding or custom embroidery prints.',
    images: [
      'https://images.unsplash.com/photo-1625910513413-fc00c2f5cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
    ],
    tags: ['polo', 't-shirt', 'premium', 'corporate', 'pod'],
    vendor_sku: 'QK-POLO-01', stock: 999
  },
  {
    name: 'Acid-Wash Graphic T-Shirt',
    category: 'T-Shirts',
    price: 649, costPrice: 290,
    description: '200 GSM acid-washed cotton tee with a vintage finish. Custom print-ready on front chest.',
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'
    ],
    tags: ['graphic', 'acid-wash', 't-shirt', 'vintage', 'pod'],
    vendor_sku: 'QK-AWTS-01', stock: 999
  },
  {
    name: 'Unisex Fleece Hoodie — Navy Blue',
    category: 'Hoodies',
    price: 1299, costPrice: 600,
    description: '320 GSM fleece-lined hoodie. Front kangaroo pocket, drawstring hood. Perfect for cold weather custom prints.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1572470754601-7fcff0497ed3?w=800&q=80'
    ],
    tags: ['hoodie', 'fleece', 'winter', 'pod', 'unisex'],
    vendor_sku: 'QK-HOOK-NVY-01', stock: 500, isFeatured: true
  },
  {
    name: 'Fleece Crewneck Sweatshirt — Grey Melange',
    category: 'Hoodies',
    price: 999, costPrice: 460,
    description: '300 GSM fleece sweatshirt. Ribbed cuffs and hem. Classic fit with front-chest custom print area.',
    images: [
      'https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80',
      'https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80'
    ],
    tags: ['sweatshirt', 'crewneck', 'fleece', 'grey', 'pod'],
    vendor_sku: 'QK-CREW-GRY-01', stock: 500
  },
  {
    name: 'Zip-Up Hoodie — All Black',
    category: 'Hoodies',
    price: 1499, costPrice: 690,
    description: 'Full-zip premium hoodie. Front zip closure, double-lined hood. Perfect for logo and custom artwork prints.',
    images: [
      'https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80'
    ],
    tags: ['hoodie', 'zip-up', 'black', 'winter', 'pod'],
    vendor_sku: 'QK-ZIPH-BLK-01', stock: 500
  },
  {
    name: 'Ceramic Coffee Mug — 325ml White',
    category: 'Mugs',
    price: 349, costPrice: 130,
    description: 'High-quality 325ml white ceramic mug. Full-color 360° sublimation print. Dishwasher & microwave safe.',
    images: [
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80',
      'https://images.unsplash.com/photo-1516682940969-a5f60ba8ee4a?w=800&q=80'
    ],
    tags: ['mug', 'ceramic', 'coffee', 'sublimation', 'pod', 'customizable'],
    vendor_sku: 'QK-MUG-325-01', stock: 999, isFeatured: true
  },
  {
    name: 'Magic Color-Changing Mug — 325ml',
    category: 'Mugs',
    price: 449, costPrice: 175,
    description: 'Heat-activated magic mug. Reveals your custom design when filled with hot liquid. Wow gift option!',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
    ],
    tags: ['mug', 'magic', 'color-changing', 'gift', 'pod'],
    vendor_sku: 'QK-MGMUG-01', stock: 500
  },
  {
    name: 'Canvas Tote Bag — Natural',
    category: 'Bags',
    price: 399, costPrice: 165,
    description: '12oz canvas tote bag with 22" handles. Full-color printed design area. Durable & eco-friendly.',
    images: [
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'
    ],
    tags: ['tote', 'bag', 'canvas', 'eco', 'pod', 'customizable'],
    vendor_sku: 'QK-TOTE-NAT-01', stock: 500
  },
  {
    name: 'Sublimation Phone Case — iPhone 15',
    category: 'Accessories',
    price: 399, costPrice: 130,
    description: 'Premium sublimation phone case for iPhone 15. Full-color custom print, raised edges for screen protection.',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80'
    ],
    tags: ['phone-case', 'iphone', 'sublimation', 'pod', 'accessories'],
    vendor_sku: 'QK-PHCS-IP15-01', stock: 500
  },
  {
    name: 'Custom Canvas Wall Art Print — A4',
    category: 'Home Decor',
    price: 799, costPrice: 320,
    description: 'Gallery-quality stretched canvas art print. Upload your design or photo. Ready to hang. A4 size.',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    tags: ['canvas', 'wall-art', 'home-decor', 'print', 'pod'],
    vendor_sku: 'QK-CVAS-A4-01', stock: 200
  },
  {
    name: 'Custom Embroidered Cap — Black',
    category: 'Accessories',
    price: 699, costPrice: 290,
    description: '6-panel structured cap with custom embroidery on front. Adjustable buckle strap. One-size-fits-all.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'
    ],
    tags: ['cap', 'hat', 'embroidery', 'accessories', 'pod'],
    vendor_sku: 'QK-CAP-BLK-01', stock: 300, isFeatured: true
  },
  {
    name: 'Custom Sports Water Bottle — 500ml',
    category: 'Drinkware',
    price: 499, costPrice: 190,
    description: 'Stainless steel 500ml sports water bottle with sublimation print. Leak-proof lid with carry loop.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80'
    ],
    tags: ['bottle', 'water-bottle', 'sports', 'stainless-steel', 'pod'],
    vendor_sku: 'QK-BOTL-500-01', stock: 500
  },
];

// ─── PRINTROVE PRODUCTS ──────────────────────────────────────────────────────────
const PRINTROVE_PRODUCTS = [
  {
    name: 'Premium Round Neck T-Shirt — White',
    category: 'T-Shirts',
    price: 599, costPrice: 275,
    description: 'Printrove signature 200 GSM premium combed cotton. Wrinkle-resistant, bio-washed with anti-pilling finish. DTG print-ready.',
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80'
    ],
    tags: ['t-shirt', 'premium', 'printrove', 'pod', 'customizable'],
    vendor_sku: 'PR-RNTS-WHT-01', stock: 999, isFeatured: true
  },
  {
    name: 'Premium Tie-Dye T-Shirt',
    category: 'T-Shirts',
    price: 749, costPrice: 340,
    description: 'Trendy tie-dye base t-shirt with custom DTG front print. 200 GSM pre-shrunk cotton. Perfect for youth collections.',
    images: [
      'https://images.unsplash.com/photo-1602810317536-2b779725f02d?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'
    ],
    tags: ['t-shirt', 'tie-dye', 'trendy', 'pod', 'printrove'],
    vendor_sku: 'PR-TDTS-01', stock: 500
  },
  {
    name: 'Satin Shirt — Full Sleeve',
    category: 'Shirts',
    price: 1199, costPrice: 540,
    description: 'Luxury satin full-sleeve shirt. Sublimation print-ready on all-over. Premium stitching with hidden buttons.',
    images: [
      'https://images.unsplash.com/photo-1588280073597-3adf5d9f1f3e?w=800&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80'
    ],
    tags: ['shirt', 'satin', 'full-sleeve', 'premium', 'pod', 'printrove'],
    vendor_sku: 'PR-SATN-FS-01', stock: 300, isFeatured: true
  },
  {
    name: 'Premium Hoodie — Black',
    category: 'Hoodies',
    price: 1399, costPrice: 650,
    description: 'Printrove premium 340 GSM hoodie. Double-layered hood, ribbed cuffs, kangaroo pocket. DTG front print.',
    images: [
      'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    tags: ['hoodie', 'premium', 'black', 'winter', 'pod', 'printrove'],
    vendor_sku: 'PR-HOOK-BLK-01', stock: 500
  },
  {
    name: 'Women\'s Crop Hoodie — Lavender',
    category: 'Hoodies',
    price: 1199, costPrice: 550,
    description: 'Trendy crop-cut hoodie for women. Soft fleece with custom front print area. Perfect for collections.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?w=800&q=80'
    ],
    tags: ['hoodie', 'women', 'crop', 'lavender', 'pod', 'printrove'],
    vendor_sku: 'PR-CRPH-LAV-01', stock: 400, isFeatured: true
  },
  {
    name: 'Satin Bomber Jacket — All Over Print',
    category: 'Jackets',
    price: 2499, costPrice: 1150,
    description: 'Premium satin bomber jacket with all-over dye-sublimation print. Ribbed collar, cuffs and hem. Statement piece.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
    ],
    tags: ['jacket', 'bomber', 'satin', 'all-over-print', 'printrove'],
    vendor_sku: 'PR-BOMB-AOF-01', stock: 200, isFeatured: true
  },
  {
    name: 'Ceramic Magic Mug — 330ml',
    category: 'Mugs',
    price: 499, costPrice: 185,
    description: 'Printrove heat-sensitive magic mug. Reveals vibrant custom design when hot liquid is added. 330ml capacity.',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
    ],
    tags: ['mug', 'magic', 'ceramic', 'gift', 'pod', 'printrove'],
    vendor_sku: 'PR-MGMUG-330-01', stock: 500
  },
  {
    name: 'Premium Canvas Tote Bag',
    category: 'Bags',
    price: 449, costPrice: 175,
    description: 'Heavy-duty premium canvas tote. Full-color front print. Reinforced gusset bottom. 12L capacity.',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80'
    ],
    tags: ['tote', 'canvas', 'premium', 'bag', 'pod', 'printrove'],
    vendor_sku: 'PR-TOTE-PRE-01', stock: 500
  },
  {
    name: 'A5 Hardcover Notebook — Custom Print',
    category: 'Stationery',
    price: 349, costPrice: 130,
    description: 'Premium A5 hardcover notebook with 200 pages. Custom full-color cover print. Lay-flat binding.',
    images: [
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
      'https://images.unsplash.com/photo-1467633557989-01e2a17a6a5c?w=800&q=80'
    ],
    tags: ['notebook', 'stationery', 'hardcover', 'custom', 'pod', 'printrove'],
    vendor_sku: 'PR-NTBK-A5-01', stock: 300
  },
  {
    name: 'Women\'s Cotton Kurti — Full Print',
    category: 'Women\'s Wear',
    price: 1199, costPrice: 530,
    description: 'All-over sublimation print premium cotton kurti. Relaxed A-line fit, 3/4 sleeve. Elegant Indian wear.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'
    ],
    tags: ['kurti', 'women', 'indian-wear', 'cotton', 'pod', 'printrove'],
    vendor_sku: 'PR-KURT-FPR-01', stock: 300, isFeatured: true
  },
  {
    name: 'Yoga / Athletic Shorts — Custom Print',
    category: 'Activewear',
    price: 699, costPrice: 300,
    description: 'Moisture-wicking 4-way stretch athletic shorts. All-over sublimation print. Elastic waistband. Unisex.',
    images: [
      'https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80',
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80'
    ],
    tags: ['shorts', 'activewear', 'yoga', 'athletic', 'pod', 'printrove'],
    vendor_sku: 'PR-SHRT-ATH-01', stock: 400
  },
  {
    name: 'Sublimation Jogger Track Pants',
    category: 'Activewear',
    price: 999, costPrice: 450,
    description: '4-way stretch all-over print joggers. Two side pockets, elastic waistband with drawstring tie. Unisex.',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
    ],
    tags: ['joggers', 'activewear', 'track-pants', 'sublimation', 'pod', 'printrove'],
    vendor_sku: 'PR-JOG-UNI-01', stock: 400
  },
  {
    name: 'Custom Laptop Sleeve — 13-inch',
    category: 'Accessories',
    price: 699, costPrice: 280,
    description: 'Neoprene sleeve for 13" laptops. Full-color custom print. Padded interior, smooth zip closure.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'
    ],
    tags: ['laptop-sleeve', 'accessories', 'custom', 'pod', 'printrove'],
    vendor_sku: 'PR-LSLEEVE-13-01', stock: 300
  },
  {
    name: 'Premium Printed Cushion Cover — 16x16',
    category: 'Home Decor',
    price: 449, costPrice: 170,
    description: 'Satin/polyester cushion cover 16x16 inches. Vibrant all-over sublimation print. Hidden zip closure. Exclusive prints.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'
    ],
    tags: ['cushion-cover', 'home-decor', 'printed', 'pod', 'printrove'],
    vendor_sku: 'PR-CUSH-1616-01', stock: 500
  },
  {
    name: 'Custom Print Baby Onesie',
    category: 'Kids Wear',
    price: 499, costPrice: 200,
    description: 'Soft organic cotton baby onesie 0-12 months. Custom DTG chest print, snap closures, tagless label.',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80',
      'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800&q=80'
    ],
    tags: ['kids', 'baby', 'onesie', 'organic', 'pod', 'printrove'],
    vendor_sku: 'PR-ONES-BBS-01', stock: 400
  },
];

async function getSupplierId(vendorId, client) {
  const r = await client.query(`SELECT id FROM suppliers WHERE type=$1 OR name ILIKE $2 LIMIT 1`, [vendorId, vendorId]);
  return r.rows[0]?.id || null;
}

async function insertProduct(prod, vendorId, supplierId, client) {
  const slug = slugify(prod.name) + '-' + vendorId;
  const sku = prod.vendor_sku;
  const supplierProductId = vendorId + '_' + sku;

  // Check if already exists
  const exists = await client.query(`SELECT id FROM products WHERE sku=$1`, [sku]);
  if (exists.rows.length > 0) {
    console.log(`  SKIP (exists): ${prod.name}`);
    return false;
  }

  await client.query(`
    INSERT INTO products (
      id, name, slug, description, price, "costPrice", sku, stock,
      images, category, tags, "supplierId", "supplierProductId",
      vendor_id, vendor_sku, "isActive", "isFeatured", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13, $14, true, $15, NOW(), NOW()
    )
  `, [
    prod.name,
    slug,
    prod.description,
    prod.price,
    prod.costPrice,
    sku,
    prod.stock,
    prod.images,
    prod.category,
    prod.tags,
    supplierId,
    supplierProductId,
    vendorId,
    prod.vendor_sku,
    prod.isFeatured || false
  ]);
  console.log(`  ✓ ${prod.name} (₹${prod.price})`);
  return true;
}

async function main() {
  const client = await pool.connect();
  try {
    console.log('\n=== CHECKING SUPPLIERS TABLE ===');
    const suppliers = await client.query(`SELECT id, name, type, "isActive" FROM suppliers ORDER BY name`);
    console.log('Suppliers found:', suppliers.rows.length);
    suppliers.rows.forEach(s => console.log(`  ${s.name} | type: ${s.type} | active: ${s.isActive}`));

    // Get or create supplier IDs
    let qikinkSupId = await getSupplierId('qikink', client);
    let printroveSupId = await getSupplierId('printrove', client);

    if (!qikinkSupId) {
      console.log('\nCreating Qikink supplier...');
      const r = await client.query(`
        INSERT INTO suppliers (id, name, type, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'Qikink', 'qikink', true, NOW(), NOW())
        RETURNING id
      `);
      qikinkSupId = r.rows[0].id;
      console.log('Created Qikink supplier:', qikinkSupId);
    } else {
      console.log('Qikink supplier:', qikinkSupId);
    }

    if (!printroveSupId) {
      console.log('\nCreating Printrove supplier...');
      const r = await client.query(`
        INSERT INTO suppliers (id, name, type, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'Printrove', 'printrove', true, NOW(), NOW())
        RETURNING id
      `);
      printroveSupId = r.rows[0].id;
      console.log('Created Printrove supplier:', printroveSupId);
    } else {
      console.log('Printrove supplier:', printroveSupId);
    }

    console.log('\n=== SEEDING QIKINK PRODUCTS ===');
    let qAdded = 0;
    for (const p of QIKINK_PRODUCTS) {
      const ok = await insertProduct(p, 'qikink', qikinkSupId, client);
      if (ok) qAdded++;
    }

    console.log('\n=== SEEDING PRINTROVE PRODUCTS ===');
    let pAdded = 0;
    for (const p of PRINTROVE_PRODUCTS) {
      const ok = await insertProduct(p, 'printrove', printroveSupId, client);
      if (ok) pAdded++;
    }

    console.log('\n=== DONE ===');
    console.log(`Qikink: ${qAdded}/${QIKINK_PRODUCTS.length} products added`);
    console.log(`Printrove: ${pAdded}/${PRINTROVE_PRODUCTS.length} products added`);

    const total = await client.query(`SELECT COUNT(*) FROM products WHERE "isActive"=true`);
    console.log(`Total active products in DB: ${total.rows[0].count}`);

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
