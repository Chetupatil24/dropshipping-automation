// seed-final-batch.js — Final batch to cross 200 products
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;
const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const QIKINK_FINAL = [
  { name: 'Classic Round Neck T-Shirt — Navy Blue',     category: 'T-Shirts',   price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-NVY-101', stock: 999,
    description: '180 GSM bio-washed cotton in classic Navy Blue. All-time bestseller tee for custom DTG prints.',
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    tags: ['t-shirt','navy','pod','qikink','cotton'] },
  { name: 'Classic Round Neck T-Shirt — Pink',          category: 'T-Shirts',   price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-PNK-102', stock: 999,
    description: '180 GSM bio-washed cotton in soft Pink. Pastel-friendly tone great for floral and cute prints.',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80','https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'],
    tags: ['t-shirt','pink','pastel','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Beige',         category: 'T-Shirts',   price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-BEI-103', stock: 999,
    description: '180 GSM cotton tee in warm Beige. Timeless neutral — ideal for earthy and aesthetic print styles.',
    images: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80','https://images.unsplash.com/photo-1503341338985-95231b3b3a22?w=800&q=80','https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80'],
    tags: ['t-shirt','beige','neutral','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Charcoal',      category: 'T-Shirts',   price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-CHR-104', stock: 999,
    description: '180 GSM bio-washed cotton in Charcoal. Dark neutral — excellent base for full-color or white prints.',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80','https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    tags: ['t-shirt','charcoal','dark','pod','qikink'] },
  { name: 'Half-Sleeve Linen Shirt — Customizable',     category: 'Shirts',     price: 899, costPrice: 400, vendor_sku: 'QK-LNSH-HS-105', stock: 300, isFeatured: true,
    description: 'Premium linen-cotton blend half-sleeve shirt. DTG chest-pocket or full-front print area. Casual smart.',
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80','https://images.unsplash.com/photo-1588280073597-3adf5d9f1f3e?w=800&q=80','https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80','https://images.unsplash.com/photo-1614093302611-8efc4d1b2869?w=800&q=80'],
    tags: ['shirt','linen','half-sleeve','pod','qikink','customizable'] },
  { name: 'Sublimation All-Over Jersey — Sleeveless',   category: 'Activewear', price: 699, costPrice: 300, vendor_sku: 'QK-JRSY-SLV-106', stock: 400,
    description: 'All-over sublimation sleeveless basketball/sports jersey. Moisture-wicking polyester mesh. Team ready.',
    images: ['https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80','https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80'],
    tags: ['jersey','sleeveless','basketball','activewear','pod','qikink'] },
  { name: 'Custom Pet T-Shirt (Small Dog)',               category: 'Accessories',price: 349, costPrice: 130, vendor_sku: 'QK-PETS-SM-107', stock: 300,
    description: 'Adorable custom-print pet t-shirt for small dogs. Soft stretchy cotton. DTG chest print.',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80','https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80','https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80'],
    tags: ['pet','dog','t-shirt','custom','accessories','pod','qikink'] },
  { name: 'Custom Canvas Bag — Large Shopper',            category: 'Bags',      price: 549, costPrice: 215, vendor_sku: 'QK-CVSB-LRG-108', stock: 400,
    description: '14oz heavy-duty canvas large shopper bag. Double stitched handles. Full-color front print panel.',
    images: ['https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80','https://images.unsplash.com/photo-1676655789428-44b7ba45ef2e?w=800&q=80'],
    tags: ['bag','canvas','large','shopper','pod','qikink'] },
  { name: 'Sublimation Yoga Mat Bag',                    category: 'Bags',      price: 699, costPrice: 280, vendor_sku: 'QK-YOGA-BAG-109', stock: 300,
    description: 'Sublimation-print yoga mat carrier bag. Adjustable strap, side pockets. Fits 24" L mat.',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80','https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80'],
    tags: ['yoga','bag','mat-bag','sublimation','pod','qikink'] },
  { name: 'Custom Car Air Freshener',                    category: 'Accessories',price: 199, costPrice: 70, vendor_sku: 'QK-AIRFR-110', stock: 999,
    description: 'Double-sided car air freshener in custom die-cut shape. Your photo or art. Includes hanging cord.',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['air-freshener','car','custom','accessories','gift','pod','qikink'] },
  { name: 'Custom Puzzle — A3 (216 Pieces)',              category: 'Gifts',     price: 999, costPrice: 390, vendor_sku: 'QK-JSAW-A3-111', stock: 200, isFeatured: true,
    description: 'Large A3 216-piece custom jigsaw puzzle. Your photo/art. Thick cardboard, premium print quality.',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['puzzle','jigsaw','A3','gift','custom','pod','qikink'] },
  { name: 'Custom Tote + Mug Bundle',                    category: 'Gifts',     price: 799, costPrice: 290, vendor_sku: 'QK-BNDL-TM-112', stock: 200, isFeatured: true,
    description: 'Value bundle: custom 325ml mug + canvas tote bag with matching print design. Perfect gifting.',
    images: ['https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80','https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
    tags: ['bundle','mug','tote','gift','pod','qikink'] },
  { name: 'Sublimation Neck Pillow — Travel',            category: 'Home Decor',price: 599, costPrice: 235, vendor_sku: 'QK-NPLW-TRV-113', stock: 300,
    description: 'Memory foam travel neck pillow with custom sublimation cover. Washable cover. Carry bag included.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    tags: ['neck-pillow','travel','home-decor','sublimation','pod','qikink'] },
  { name: 'Custom Fleece Blanket — 50x60in',             category: 'Home Decor',price: 1499, costPrice: 660, vendor_sku: 'QK-BLKT-FLCE-114', stock: 200, isFeatured: true,
    description: '50x60 inch custom fleece blanket. All-over sublimation print. Ultra-soft brushed fleece. Bed or sofa throw.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80'],
    tags: ['blanket','fleece','home-decor','sublimation','pod','qikink','throw'] },
];

const PRINTROVE_FINAL = [
  { name: 'Round Neck T-Shirt — Mustard (Printrove)',   category: 'T-Shirts',      price: 599, costPrice: 275, vendor_sku: 'PR-RNTS-MST-101', stock: 999,
    description: 'Printrove 200 GSM cotton in warm Mustard. Trendy autumn tone. DTG front print. Wrinkle-resistant.',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80','https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80'],
    tags: ['t-shirt','mustard','printrove','pod','cotton'] },
  { name: 'Round Neck T-Shirt — Olive Green (Printrove)',category: 'T-Shirts',     price: 599, costPrice: 275, vendor_sku: 'PR-RNTS-OLV-102', stock: 999,
    description: 'Printrove 200 GSM cotton in earthy Olive Green. Nature aesthetic. DTG ready.',
    images: ['https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80','https://images.unsplash.com/photo-1614093302611-8efc4d1b2869?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80'],
    tags: ['t-shirt','olive','printrove','pod'] },
  { name: 'Round Neck T-Shirt — Pink (Printrove)',       category: 'T-Shirts',     price: 599, costPrice: 275, vendor_sku: 'PR-RNTS-PNK-103', stock: 999,
    description: 'Printrove 200 GSM cotton in soft Pink. Pastel collection favorite. Full DTG chest print.',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80','https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'],
    tags: ['t-shirt','pink','printrove','pod'] },
  { name: 'Sublimation Jersey Shorts Set',               category: 'Activewear',   price: 1299, costPrice: 580, vendor_sku: 'PR-JSET-SHRT-104', stock: 300, isFeatured: true,
    description: 'Matching jersey + shorts sublimation set. Moisture-wicking polyester. All-over print. Team & casual.',
    images: ['https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80','https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80','https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80','https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80'],
    tags: ['jersey','shorts','set','activewear','sublimation','printrove'] },
  { name: 'Custom Face Gaiter / Neck Tube',              category: 'Accessories',  price: 249, costPrice: 90, vendor_sku: 'PR-GAIT-FCE-105', stock: 500,
    description: 'Multipurpose sublimation-print neck gaiter. Wear as face mask, headband, neck warmer. Full-color 360°.',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80','https://images.unsplash.com/photo-1591023265534-5769d51aed83?w=800&q=80','https://images.unsplash.com/photo-1596510914699-0c60c7c5a30f?w=800&q=80'],
    tags: ['gaiter','face-mask','neck-tube','accessories','pod','printrove'] },
  { name: 'Satin Hair Scrunchie Set — Printed (3-pack)', category: 'Accessories',  price: 299, costPrice: 110, vendor_sku: 'PR-SCRN-SET3-106', stock: 500,
    description: 'Set of 3 satin hair scrunchies with custom all-over sublimation print. Gentle on hair, firm hold.',
    images: ['https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80'],
    tags: ['scrunchie','satin','hair','accessories','custom','printrove'] },
  { name: 'Women\'s Printed Kimono / Sarong',            category: "Women's Wear", price: 1299, costPrice: 580, vendor_sku: 'PR-KIMO-PRT-107', stock: 200, isFeatured: true,
    description: 'Flowy all-over print kimono wrap. Lightweight georgette. Beach cover-up or casual layer. One-size.',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80','https://images.unsplash.com/photo-1496217590130-a76b1e10b12d?w=800&q=80','https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80'],
    tags: ['kimono','sarong','women','printed','printrove','pod'] },
  { name: 'Couple T-Shirt Set — His & Hers',             category: 'Gifts',        price: 1099, costPrice: 490, vendor_sku: 'PR-CPLE-SET-108', stock: 300, isFeatured: true,
    description: 'Matching couple t-shirt set. His+Hers custom DTG prints. 200 GSM cotton. Perfect anniversary gift.',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80'],
    tags: ['couple','set','t-shirt','gift','printrove','pod'] },
  { name: 'Family Portrait Custom Canvas',                category: 'Gifts',        price: 1699, costPrice: 760, vendor_sku: 'PR-FPRT-CVAS-109', stock: 150, isFeatured: true,
    description: 'Large custom canvas print for family portrait/photo. 16x20 inch gallery wrap. Ready to hang.',
    images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    tags: ['canvas','family','portrait','gift','printrove','home-decor'] },
  { name: 'Custom Fleece Throw Blanket — Printrove',     category: 'Home Decor',   price: 1699, costPrice: 760, vendor_sku: 'PR-FLCE-BLKT-110', stock: 200, isFeatured: true,
    description: 'Printrove 50x60in ultra-soft fleece throw blanket. All-over digital sublimation print. Plush & warm.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    tags: ['blanket','fleece','throw','home-decor','printrove','sublimation'] },
  { name: 'Table Runner — Custom Print (Printrove)',     category: 'Home Decor',   price: 899, costPrice: 390, vendor_sku: 'PR-TRUN-CTM-111', stock: 200,
    description: '14x72 inch custom sublimation table runner. Polyester satin. Vibrant full-color art. Dining & events.',
    images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80'],
    tags: ['table-runner','home-decor','custom','sublimation','printrove'] },
  { name: 'Custom Fridge Magnet Set (6-piece)',           category: 'Gifts',        price: 799, costPrice: 300, vendor_sku: 'PR-FMAG-SET6-112', stock: 400,
    description: 'Set of 6 custom sublimation fridge magnets in assorted shapes. Full-color print. Perfect souvenir gift.',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['magnet','fridge','set','gift','custom','printrove','pod'] },
];

// ─── DB INSERT ────────────────────────────────────────────────────────────────
async function getSupplierId(vendorId, client) {
  const r = await client.query(`SELECT id FROM suppliers WHERE type=$1 OR name ILIKE $2 LIMIT 1`, [vendorId, vendorId]);
  return r.rows[0]?.id || null;
}

async function insertProduct(prod, vendorId, supplierId, client) {
  const slug = slugify(prod.name) + '-' + vendorId;
  const sku  = prod.vendor_sku;
  const exists = await client.query(`SELECT id FROM products WHERE sku=$1`, [sku]);
  if (exists.rows.length > 0) { process.stdout.write('.'); return false; }
  await client.query(`
    INSERT INTO products (id,name,slug,description,price,"costPrice",sku,stock,
      images,category,tags,"supplierId","supplierProductId",
      vendor_id,vendor_sku,"isActive","isFeatured","createdAt","updatedAt")
    VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,$15,NOW(),NOW())
  `, [prod.name, slug, prod.description, prod.price, prod.costPrice, sku, prod.stock,
      prod.images, prod.category, prod.tags,
      supplierId, vendorId+'_'+sku, vendorId, prod.vendor_sku, prod.isFeatured||false]);
  process.stdout.write(`\n  ✓ ${prod.name} (₹${prod.price})`);
  return true;
}

async function main() {
  const client = await pool.connect();
  try {
    const qikinkId    = await getSupplierId('qikink', client);
    const printroveId = await getSupplierId('printrove', client);

    console.log('\n=== QIKINK FINAL BATCH ===');
    let qa = 0;
    for (const p of QIKINK_FINAL) { if (await insertProduct(p,'qikink',qikinkId,client)) qa++; }

    console.log('\n\n=== PRINTROVE FINAL BATCH ===');
    let pa = 0;
    for (const p of PRINTROVE_FINAL) { if (await insertProduct(p,'printrove',printroveId,client)) pa++; }

    console.log('\n\n=== DONE ===');
    console.log(`Qikink +${qa}, Printrove +${pa}`);
    const total    = await client.query(`SELECT COUNT(*) FROM products WHERE "isActive"=true`);
    const byVendor = await client.query(`SELECT vendor_id, COUNT(*) as count FROM products GROUP BY vendor_id ORDER BY vendor_id`);
    console.log('Total active products:', total.rows[0].count);
    byVendor.rows.forEach(r => console.log(`  ${r.vendor_id}: ${r.count}`));
  } finally { client.release(); await pool.end(); }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
