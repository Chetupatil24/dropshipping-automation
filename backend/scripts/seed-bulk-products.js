// seed-bulk-products.js — Add 120+ more products to reach 200+ total
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;
const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── QIKINK BULK CATALOG (+60 products) ─────────────────────────────────────
const QIKINK_BULK = [
  // ── T-SHIRTS ──
  { name: 'Classic Round Neck T-Shirt — White (Kids)',        category: 'Kids Wear',    price: 349, costPrice: 140, vendor_sku: 'QK-RNTS-KIDS-WHT-31', stock: 999, isFeatured: false,
    description: '160 GSM soft cotton kids round-neck tee in White. DTG front print. Sizes 4–14 years. Tagless inner label.',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80','https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80','https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800&q=80'],
    tags: ['kids','t-shirt','white','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Yellow',              category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-YLW-32', stock: 999,
    description: 'Premium 180 GSM bio-washed cotton in bright Yellow. Eye-catching base for bold custom prints.',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80','https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80'],
    tags: ['t-shirt','yellow','pod','qikink','cotton'] },
  { name: 'Classic Round Neck T-Shirt — Maroon',              category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-MAR-33', stock: 999,
    description: 'Premium 180 GSM bio-washed cotton in deep Maroon. Rich earthy tone perfect for custom designs.',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    tags: ['t-shirt','maroon','pod','qikink','cotton'] },
  { name: 'Classic Round Neck T-Shirt — Bottle Green',        category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-BGN-34', stock: 999,
    description: '180 GSM cotton tee in Bottle Green. Popular earthy tone. Perfect canvas for white and light-ink prints.',
    images: ['https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80','https://images.unsplash.com/photo-1614093302611-8efc4d1b2869?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'],
    tags: ['t-shirt','green','bottle-green','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Lavender',            category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-LAV-35', stock: 999,
    description: '180 GSM bio-washed cotton in soft Lavender. Pastel aesthetic perfect for minimalist prints.',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80','https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80'],
    tags: ['t-shirt','lavender','pastel','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Orange',              category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-ORG-36', stock: 999,
    description: '180 GSM bio-washed cotton in vibrant Orange. Stand-out color for events, groups, and custom prints.',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80','https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'],
    tags: ['t-shirt','orange','pod','qikink'] },
  { name: 'Classic Round Neck T-Shirt — Grey Melange',        category: 'T-Shirts',     price: 499, costPrice: 230, vendor_sku: 'QK-RNTS-GRY-37', stock: 999,
    description: '180 GSM grey melange cotton. Heathered texture. Versatile neutral — suits any print design.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'],
    tags: ['t-shirt','grey','melange','pod','qikink'] },
  { name: 'V-Neck T-Shirt — Black',                           category: 'T-Shirts',     price: 549, costPrice: 250, vendor_sku: 'QK-VNTS-BLK-38', stock: 999,
    description: '180 GSM cotton V-neck in black. Sleek neckline, ideal for minimalist and bold chest prints alike.',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80','https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80'],
    tags: ['t-shirt','v-neck','black','pod','qikink'] },
  { name: 'Long Drop Hem T-Shirt — White',                    category: 'T-Shirts',     price: 699, costPrice: 315, vendor_sku: 'QK-DRPH-WHT-39', stock: 500, isFeatured: true,
    description: '220 GSM extended drop-hem tee. Trendy longline silhouette. Full-front A3+ print area.',
    images: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80','https://images.unsplash.com/photo-1503341338985-95231b3b3a22?w=800&q=80','https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    tags: ['t-shirt','drop-hem','longline','pod','qikink','trendy'] },
  { name: 'Muscle Fit Sleeveless Vest — Black',               category: 'Activewear',   price: 449, costPrice: 180, vendor_sku: 'QK-VEST-BLK-40', stock: 500,
    description: '180 GSM cotton sleeveless muscle vest. Deep armhole. DTG front print. Gym, sports & streetwear.',
    images: ['https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80','https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80'],
    tags: ['vest','sleeveless','muscle','activewear','pod','qikink'] },

  // ── HOODIES ──
  { name: 'Fleece Hoodie — Maroon',                           category: 'Hoodies',      price: 1299, costPrice: 600, vendor_sku: 'QK-HOOK-MAR-41', stock: 400,
    description: '320 GSM fleece-lined hoodie in deep Maroon. Kangaroo pocket, drawstring hood. Winter ready.',
    images: ['https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80','https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80','https://images.unsplash.com/photo-1572470754601-7fcff0497ed3?w=800&q=80'],
    tags: ['hoodie','maroon','fleece','pod','qikink'] },
  { name: 'Fleece Hoodie — Royal Blue',                       category: 'Hoodies',      price: 1299, costPrice: 600, vendor_sku: 'QK-HOOK-RBL-42', stock: 400,
    description: '320 GSM fleece hoodie in Royal Blue. Vibrant color — great for team, group and club prints.',
    images: ['https://images.unsplash.com/photo-1572470754601-7fcff0497ed3?w=800&q=80','https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
    tags: ['hoodie','royal-blue','fleece','pod','qikink'] },
  { name: 'Crewneck Sweatshirt — Grey Melange',               category: 'Hoodies',      price: 999,  costPrice: 460, vendor_sku: 'QK-CREW-GRY-43', stock: 500,
    description: '300 GSM grey melange fleece crewneck. Textured heather finish. Front print area 30x30cm.',
    images: ['https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80','https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80','https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80'],
    tags: ['sweatshirt','crewneck','grey','pod','qikink'] },
  { name: 'Crewneck Sweatshirt — White',                      category: 'Hoodies',      price: 999,  costPrice: 460, vendor_sku: 'QK-CREW-WHT-44', stock: 500, isFeatured: true,
    description: '300 GSM fleece crewneck in White. Clean minimal look. Perfect for bold graphics.',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80','https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80'],
    tags: ['sweatshirt','crewneck','white','pod','qikink'] },
  { name: 'Zip-Up Hoodie — Grey Melange',                     category: 'Hoodies',      price: 1499, costPrice: 690, vendor_sku: 'QK-ZIPH-GRY-45', stock: 400,
    description: 'Full-zip 320 GSM fleece hoodie in Grey Melange. Double-lined hood, 2 side pockets. Custom chest print.',
    images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80','https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80','https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80'],
    tags: ['hoodie','zip-up','grey','pod','qikink'] },

  // ── MUGS ──
  { name: 'Photo Print Ceramic Mug — 325ml',                  category: 'Mugs',         price: 349,  costPrice: 130, vendor_sku: 'QK-PMUG-325-46', stock: 999, isFeatured: true,
    description: 'Classic 325ml ceramic mug with full-wrap sublimation photo print. Perfect personalized gift.',
    images: ['https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80','https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80','https://images.unsplash.com/photo-1516682940969-a5f60ba8ee4a?w=800&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'],
    tags: ['mug','photo','ceramic','gift','pod','qikink'] },
  { name: 'Two-Tone Colored Rim Mug — 325ml',                 category: 'Mugs',         price: 399,  costPrice: 155, vendor_sku: 'QK-TRMUG-325-47', stock: 500,
    description: 'White ceramic mug with colored rim and handle. Available in multiple accent colors. Sublimation print.',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80','https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80','https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80'],
    tags: ['mug','two-tone','ceramic','pod','qikink'] },
  { name: 'Frosted Glass Beer Mug — 500ml',                   category: 'Drinkware',    price: 499,  costPrice: 195, vendor_sku: 'QK-GBEER-500-48', stock: 300,
    description: 'Premium frosted-glass beer mug 500ml. Vibrant sublimation print on frosted surface.',
    images: ['https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80','https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80','https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80'],
    tags: ['beer-mug','glass','drinkware','pod','qikink'] },
  { name: 'Insulated Tumbler — 500ml',                        category: 'Drinkware',    price: 799,  costPrice: 320, vendor_sku: 'QK-TUMB-500-49', stock: 400, isFeatured: true,
    description: 'Double-walled vacuum insulated tumbler. Keeps hot 8hr / cold 16hr. Stainless + sublimation wrap.',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80','https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80','https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80','https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80'],
    tags: ['tumbler','insulated','drinkware','pod','qikink'] },
  { name: 'Sipper Water Bottle — 1 Litre',                    category: 'Drinkware',    price: 699,  costPrice: 275, vendor_sku: 'QK-SIPP-1L-50', stock: 400,
    description: '1 litre stainless steel sipper bottle with flip straw lid. Full sublimation side wrap. BPA-free.',
    images: ['https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80','https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80','https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80'],
    tags: ['water-bottle','sipper','1-litre','pod','qikink'] },

  // ── BAGS ──
  { name: 'Laptop Backpack — Custom Print',                   category: 'Bags',         price: 1299, costPrice: 540, vendor_sku: 'QK-BKPK-LAPT-51', stock: 300, isFeatured: true,
    description: '15.6" laptop backpack with sublimation panel print. Multiple compartments, USB charging port, padded back.',
    images: ['https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80','https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
    tags: ['backpack','laptop-bag','bag','pod','qikink'] },
  { name: 'Foldable Shopping Bag — Eco',                      category: 'Bags',         price: 249,  costPrice: 90,  vendor_sku: 'QK-FOLD-ECO-52', stock: 500,
    description: 'Foldable eco tote that fits in your pocket. Sublimation print panel. 20L capacity. Reusable & durable.',
    images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80','https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80','https://images.unsplash.com/photo-1676655789428-44b7ba45ef2e?w=800&q=80'],
    tags: ['bag','foldable','eco','shopping','pod','qikink'] },
  { name: 'Messenger Shoulder Bag — Custom',                  category: 'Bags',         price: 999,  costPrice: 420, vendor_sku: 'QK-MESS-SHL-53', stock: 300,
    description: 'Canvas messenger / shoulder bag with sublimation front panel. Adjustable strap, magnetic flap closure.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80','https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80','https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80'],
    tags: ['messenger','shoulder-bag','canvas','pod','qikink'] },

  // ── ACCESSORIES ──
  { name: 'Photo Fridge Magnet — Custom Print',               category: 'Accessories',  price: 149,  costPrice: 50,  vendor_sku: 'QK-FMAG-01-54', stock: 999,
    description: 'Full-color custom sublimation fridge magnet. Round 5cm. Strong magnet backing. Perfect gifting.',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['magnet','fridge-magnet','custom','gift','pod','qikink'] },
  { name: 'Custom Sublimation Laptop Sticker Sheet',          category: 'Accessories',  price: 199,  costPrice: 70,  vendor_sku: 'QK-STCK-LPT-55', stock: 999,
    description: 'Pack of 6 custom stickers. Waterproof vinyl sublimation print. Die-cut to shape. For laptops, bottles & more.',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80','https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80','https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80'],
    tags: ['sticker','sheet','custom','accessories','pod','qikink'] },
  { name: 'Custom Wristband / Silicone Band',                 category: 'Accessories',  price: 149,  costPrice: 50,  vendor_sku: 'QK-WBAND-56', stock: 999,
    description: 'Custom embossed/debossed silicone wristband. Your text/logo. Great for events, fundraisers, teams.',
    images: ['https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80','https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80'],
    tags: ['wristband','silicone','event','accessories','pod','qikink'] },
  { name: 'Canvas Pencil Pouch — Custom Print',               category: 'Accessories',  price: 299,  costPrice: 110, vendor_sku: 'QK-PNCH-CAN-57', stock: 500,
    description: 'Canvas pencil/stationery pouch with custom print panel. Zip closure. School & office use.',
    images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'],
    tags: ['pouch','pencil-case','accessories','pod','qikink'] },
  { name: 'Custom Badge / Button Pin',                        category: 'Accessories',  price: 99,   costPrice: 30,  vendor_sku: 'QK-BADGE-58', stock: 999,
    description: 'Round 58mm button pin badge. Full-color custom sublimation print. Great for events, branding, fun.',
    images: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80'],
    tags: ['badge','pin','button','event','accessories','pod','qikink'] },
  { name: 'Custom Ear Plug (Boho Style)',                     category: 'Accessories',  price: 249,  costPrice: 90,  vendor_sku: 'QK-EARPLG-59', stock: 500,
    description: 'Boho-style sublimation double-sided acrylic earring studs. Lightweight. Custom artwork. Fashion accessories.',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80'],
    tags: ['earring','boho','accessories','custom','pod','qikink'] },
  { name: 'Custom Photo Pillow — 12x12',                      category: 'Home Decor',   price: 699,  costPrice: 270, vendor_sku: 'QK-PILW-1212-60', stock: 400, isFeatured: true,
    description: 'Soft-fill cushion pillow with custom sublimation print on cover. 12x12 inch. Gift-ready packaging.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80','https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80'],
    tags: ['pillow','cushion','home-decor','photo','pod','qikink'] },
  { name: 'Custom Doormat — Welcome Print',                   category: 'Home Decor',   price: 799,  costPrice: 320, vendor_sku: 'QK-DMAT-WLC-61', stock: 300,
    description: '45x75cm non-slip rubber-backed doormat with custom sublimation print. Durable nylon surface.',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    tags: ['doormat','home-decor','custom','sublimation','pod','qikink'] },
  { name: 'Custom Apron — Kitchen / BBQ',                     category: 'Home Decor',   price: 699,  costPrice: 270, vendor_sku: 'QK-APRN-KIT-62', stock: 300,
    description: 'Full-length kitchen/BBQ apron with custom sublimation print. Adjustable neck strap, waist ties.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'],
    tags: ['apron','kitchen','home-decor','custom','pod','qikink'] },

  // ── ACTIVEWEAR ──
  { name: 'Sublimation Cycling Jersey — Short Sleeve',        category: 'Activewear',   price: 999,  costPrice: 440, vendor_sku: 'QK-CJRSY-SS-63', stock: 300,
    description: 'All-over sublimation cycling jersey. Moisture-wicking micromesh. Race-fit, 3 back pockets, full-zip.',
    images: ['https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80','https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80'],
    tags: ['cycling','jersey','activewear','sublimation','pod','qikink'] },
  { name: 'Sublimation Running T-Shirt',                      category: 'Activewear',   price: 699,  costPrice: 300, vendor_sku: 'QK-RNTSH-64', stock: 400,
    description: 'Moisture-wicking, anti-odor running tee. All-over sublimation print. Reflective trim back panel.',
    images: ['https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80','https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80'],
    tags: ['running','t-shirt','activewear','sublimation','pod','qikink'] },
  { name: 'Compression Shorts — Custom Print',                category: 'Activewear',   price: 699,  costPrice: 295, vendor_sku: 'QK-CSHT-65', stock: 400,
    description: '4-way stretch compression shorts with all-over sublimation print. Moisture-wicking, non-transparent.',
    images: ['https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80','https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'],
    tags: ['shorts','compression','activewear','pod','qikink'] },

  // ── HOME DECOR ──
  { name: 'Framed Photo Print — A4',                          category: 'Home Decor',   price: 899,  costPrice: 360, vendor_sku: 'QK-FRMD-A4-66', stock: 200, isFeatured: true,
    description: 'A4 custom photo print in floating black frame. Includes hanging kit. Museum-quality giclee print.',
    images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    tags: ['photo-print','framed','home-decor','A4','pod','qikink'] },
  { name: 'Sublimation Placemat Set (4-piece)',                category: 'Home Decor',   price: 599,  costPrice: 230, vendor_sku: 'QK-PLCMT-SET4-67', stock: 300,
    description: 'Set of 4 custom sublimation placemats. 30x45cm each. Heat-resistant, wipe-clean surface. Full-color art.',
    images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    tags: ['placemat','set','home-decor','sublimation','pod','qikink'] },

  // ── STATIONERY ──
  { name: 'Custom Hardcover Diary — A5',                      category: 'Stationery',   price: 499,  costPrice: 190, vendor_sku: 'QK-DIAR-A5-68', stock: 300,
    description: 'A5 hardcover diary with custom cover print. Pen holder, elastic closure. 365-day dated pages.',
    images: ['https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80','https://images.unsplash.com/photo-1467633557989-01e2a17a6a5c?w=800&q=80','https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80'],
    tags: ['diary','stationery','hardcover','custom','pod','qikink'] },
  { name: 'Custom Desk Calendar — Table Top',                 category: 'Stationery',   price: 549,  costPrice: 210, vendor_sku: 'QK-DCAL-TBL-69', stock: 300,
    description: '12-month desktop calendar with custom sublimation print on each month. Spiral-bound, stand included.',
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80','https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80','https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80'],
    tags: ['calendar','desk','stationery','custom','pod','qikink'] },

  // ── PHOTO GIFTS ──
  { name: 'Custom Jigsaw Puzzle — A4 (120 Pieces)',           category: 'Gifts',        price: 699,  costPrice: 270, vendor_sku: 'QK-JSAW-A4-70', stock: 300, isFeatured: true,
    description: 'Custom A4 120-piece jigsaw puzzle with your photo/design. Thick cardboard. Gift box packaging.',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['puzzle','jigsaw','gift','custom','pod','qikink'] },
  { name: 'Custom Photo Mug Gift Set',                        category: 'Gifts',        price: 899,  costPrice: 360, vendor_sku: 'QK-MUGSET-GFT-71', stock: 200, isFeatured: true,
    description: 'Custom 325ml mug + spoon gift set. Sublimation print. Includes gift box and greeting card slot.',
    images: ['https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80','https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80','https://images.unsplash.com/photo-1516682940969-a5f60ba8ee4a?w=800&q=80'],
    tags: ['mug','gift-set','photo','pod','qikink'] },
  { name: 'Custom Photo Frame — 4x6 with Stand',             category: 'Gifts',        price: 499,  costPrice: 195, vendor_sku: 'QK-PFRAM-46-72', stock: 300,
    description: '4x6 inch custom sublimation photo frame. MDF with sublimation panel. Tabletop stand included.',
    images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    tags: ['photo-frame','gift','custom','pod','qikink'] },
  { name: 'Custom Printed Gift Hamper Box',                   category: 'Gifts',        price: 1299, costPrice: 520, vendor_sku: 'QK-HAMP-BOX-73', stock: 200,
    description: 'Curated custom gift hamper: mug + keychain + coaster + greeting card. All with personal sublimation print.',
    images: ['https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['hamper','gift-box','custom','pod','qikink'] },
];

// ─── PRINTROVE BULK CATALOG (+60 products) ────────────────────────────────────
const PRINTROVE_BULK = [
  // ── T-SHIRTS ──
  { name: 'Round Neck T-Shirt — Sky Blue (Printrove)',        category: 'T-Shirts',     price: 599,  costPrice: 275, vendor_sku: 'PR-RNTS-SKY-25', stock: 999,
    description: 'Printrove 200 GSM combed cotton in Sky Blue. Bright, airy color. Full DTG front print.',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80'],
    tags: ['t-shirt','sky-blue','printrove','pod','cotton'] },
  { name: 'Round Neck T-Shirt — Red (Printrove)',             category: 'T-Shirts',     price: 599,  costPrice: 275, vendor_sku: 'PR-RNTS-RED-26', stock: 999,
    description: 'Printrove 200 GSM combed cotton in bold Red. Bio-washed, anti-pilling. DTG large front print area.',
    images: ['https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80','https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'],
    tags: ['t-shirt','red','printrove','pod','cotton'] },
  { name: 'Round Neck T-Shirt — Maroon (Printrove)',          category: 'T-Shirts',     price: 599,  costPrice: 275, vendor_sku: 'PR-RNTS-MAR-27', stock: 999,
    description: 'Printrove cotton tee in deep Maroon. 200 GSM wrinkle-resistant. Perfect for bold white prints.',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80','https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80'],
    tags: ['t-shirt','maroon','printrove','pod'] },
  { name: 'Oversized T-Shirt — Black (Printrove)',            category: 'T-Shirts',     price: 749,  costPrice: 340, vendor_sku: 'PR-OVTS-BLK-28', stock: 500, isFeatured: true,
    description: 'Trendy oversized drop-shoulder tee in Black. 220 GSM heavy cotton. Large print canvas for bold designs.',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80','https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80','https://images.unsplash.com/photo-1571745544682-143ea663cf2c?w=800&q=80'],
    tags: ['t-shirt','oversized','black','printrove','streetwear'] },
  { name: 'Oversized T-Shirt — White (Printrove)',            category: 'T-Shirts',     price: 749,  costPrice: 340, vendor_sku: 'PR-OVTS-WHT-29', stock: 500, isFeatured: true,
    description: 'Trendy oversized drop-shoulder tee in White. Premium 220 GSM. Massive A3+ front print area.',
    images: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80','https://images.unsplash.com/photo-1503341338985-95231b3b3a22?w=800&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    tags: ['t-shirt','oversized','white','printrove','streetwear'] },
  { name: 'Premium Polo T-Shirt — Navy (Printrove)',          category: 'T-Shirts',     price: 849,  costPrice: 390, vendor_sku: 'PR-POLO-NVY-30', stock: 500,
    description: 'Pique cotton polo in Navy. 220 GSM. Custom embroidery or DTG chest print. Corporate & casual.',
    images: ['https://images.unsplash.com/photo-1625910513413-fc00c2f5cd64?w=800&q=80','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80'],
    tags: ['polo','navy','printrove','pod','corporate'] },
  { name: 'Premium Polo T-Shirt — White (Printrove)',         category: 'T-Shirts',     price: 849,  costPrice: 390, vendor_sku: 'PR-POLO-WHT-31', stock: 500,
    description: 'Pique cotton polo in White. 220 GSM. Clean professional look. Custom embroidery/DTG chest print.',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80','https://images.unsplash.com/photo-1625910513413-fc00c2f5cd64?w=800&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    tags: ['polo','white','printrove','pod','corporate'] },
  { name: 'Raglan Full Sleeve T-Shirt (Printrove)',           category: 'T-Shirts',     price: 699,  costPrice: 315, vendor_sku: 'PR-RAGL-FS-32', stock: 400,
    description: 'Printrove raglan full-sleeve tee. Contrasting body + sleeve colors. DTG front print area. Sporty.',
    images: ['https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    tags: ['t-shirt','raglan','full-sleeve','printrove','pod'] },

  // ── HOODIES ──
  { name: 'Fleece Hoodie — Navy Blue (Printrove)',            category: 'Hoodies',      price: 1399, costPrice: 650, vendor_sku: 'PR-HOOK-NVY-33', stock: 400,
    description: '340 GSM Printrove hoodie in Navy Blue. Ultra-soft fleece lining. Team and group orders welcome.',
    images: ['https://images.unsplash.com/photo-1572470754601-7fcff0497ed3?w=800&q=80','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80','https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80'],
    tags: ['hoodie','navy','printrove','fleece','pod'] },
  { name: 'Fleece Hoodie — Olive Green (Printrove)',          category: 'Hoodies',      price: 1399, costPrice: 650, vendor_sku: 'PR-HOOK-OLV-34', stock: 400,
    description: '340 GSM Printrove hoodie in earthy Olive Green. Nature-inspired aesthetic with front DTG print.',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80'],
    tags: ['hoodie','olive','printrove','fleece','pod'] },
  { name: 'Crewneck Sweatshirt (Printrove) — Off White',      category: 'Hoodies',      price: 1099, costPrice: 500, vendor_sku: 'PR-CREW-OW-35', stock: 500, isFeatured: true,
    description: 'Premium 330 GSM Printrove crewneck sweatshirt in cream/off-white. Brushed inner. DTG print.',
    images: ['https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80','https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80'],
    tags: ['sweatshirt','crewneck','off-white','printrove','pod'] },
  { name: 'Crewneck Sweatshirt (Printrove) — Black',          category: 'Hoodies',      price: 1099, costPrice: 500, vendor_sku: 'PR-CREW-BLK-36', stock: 500,
    description: 'Premium 330 GSM Printrove crewneck in Black. Brushed fleece inner. Bold graphic print ready.',
    images: ['https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80','https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80','https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80'],
    tags: ['sweatshirt','crewneck','black','printrove','pod'] },

  // ── JACKETS ──
  { name: 'Denim Jacket — All Over Print',                    category: 'Jackets',      price: 1999, costPrice: 920, vendor_sku: 'PR-DNJK-AOF-37', stock: 150, isFeatured: true,
    description: 'Classic denim-look jacket with all-over sublimation print on fabric. Button-front, chest pockets. Statement piece.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80','https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&q=80','https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80'],
    tags: ['jacket','denim','all-over-print','printrove','premium'] },
  { name: 'Reversible Puffer Jacket (Custom)',                category: 'Jackets',      price: 2499, costPrice: 1150, vendor_sku: 'PR-PUFF-REV-38', stock: 100, isFeatured: true,
    description: 'Reversible puffer jacket — custom print one side, solid color reverse. Warm fill. Zip closure.',
    images: ['https://images.unsplash.com/photo-1617952739390-9a3c7e8a285c?w=800&q=80','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80','https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80'],
    tags: ['jacket','puffer','reversible','printrove','premium','winter'] },

  // ── WOMEN'S WEAR ──
  { name: 'A-Line Printed Kurti — Blue Floral',               category: "Women's Wear", price: 1299, costPrice: 580, vendor_sku: 'PR-KURT-BLF-39', stock: 300,
    description: 'All-over digital print A-line cotton kurti. V-neck, 3/4 flared sleeve. Elegant Indian casual wear.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80','https://images.unsplash.com/photo-1496217590130-a76b1e10b12d?w=800&q=80'],
    tags: ['kurti','women','floral','blue','printrove','pod'] },
  { name: 'Palazzo Pants — Printed (Printrove)',              category: "Women's Wear", price: 999,  costPrice: 450, vendor_sku: 'PR-PALZ-PRT-40', stock: 300,
    description: 'Flowy printed palazzo pants. All-over digital print on georgette fabric. Elastic waist. Sizes S–3XL.',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80','https://images.unsplash.com/photo-1496217590130-a76b1e10b12d?w=800&q=80','https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80'],
    tags: ['palazzo','pants','women','printed','printrove','pod'] },
  { name: 'Maxi Dress — All Over Print',                      category: "Women's Wear", price: 1599, costPrice: 720, vendor_sku: 'PR-MAXI-AOF-41', stock: 200, isFeatured: true,
    description: 'Floor-length flowing maxi dress. All-over digital sublimation print. Spaghetti straps, A-line cut.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','https://images.unsplash.com/photo-1496216875430-7985c27c3534?w=800&q=80','https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80'],
    tags: ['maxi-dress','women','all-over-print','printrove','pod'] },
  { name: 'Crop Hoodie — Black (Printrove)',                  category: "Women's Wear", price: 1199, costPrice: 550, vendor_sku: 'PR-CRPH-BLK-42', stock: 400,
    description: 'Trendy women\'s crop hoodie in black. 300 GSM brushed fleece. Custom DTG front print. Y2K style.',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80','https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?w=800&q=80','https://images.unsplash.com/photo-1508427953056-b00b71b2f18d?w=800&q=80'],
    tags: ['hoodie','crop','black','women','printrove','pod'] },
  { name: 'Women\'s Off-Shoulder T-Shirt',                   category: "Women's Wear", price: 699,  costPrice: 315, vendor_sku: 'PR-OFSH-WM-43', stock: 400, isFeatured: true,
    description: 'Chic off-shoulder tee for women. 190 GSM cotton. Elasticated neckline. DTG shoulder-to-chest print.',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80','https://images.unsplash.com/photo-1532453288672-3a17de65a2ef?w=800&q=80','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
    tags: ['off-shoulder','women','t-shirt','printrove','pod'] },
  { name: 'High-Waist Shorts — Women\'s Sublimation',        category: "Women's Wear", price: 799,  costPrice: 360, vendor_sku: 'PR-HWSHT-WM-44', stock: 400,
    description: 'High-waist all-over sublimation print shorts. 4-way stretch. XS to 3XL. Casual and active wear.',
    images: ['https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80','https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80','https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80'],
    tags: ['shorts','women','high-waist','sublimation','printrove','pod'] },

  // ── KIDS WEAR ──
  { name: 'Kids Jogger Set — Top + Pants (Printrove)',        category: 'Kids Wear',    price: 999,  costPrice: 450, vendor_sku: 'PR-KIDS-JOG-45', stock: 300,
    description: 'Matching DTG print kids jogger set. Soft 240 GSM fleece. Sizes 4–12 years. Cozy and playful.',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80','https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800&q=80','https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80'],
    tags: ['kids','jogger-set','printrove','pod','matching'] },
  { name: 'Kids Onesie / Romper — DTG Print',                category: 'Kids Wear',    price: 599,  costPrice: 265, vendor_sku: 'PR-KIDS-ROM-46', stock: 400,
    description: 'Organic cotton romper/onesie for babies. DTG custom chest print. Snap closures. 3–18 months.',
    images: ['https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800&q=80','https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80','https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80'],
    tags: ['kids','romper','onesie','baby','printrove','pod'] },
  { name: 'Kids Cap — Custom Embroidery',                    category: 'Kids Wear',    price: 499,  costPrice: 200, vendor_sku: 'PR-KIDS-CAP-47', stock: 300,
    description: '5-panel kids cap. Custom embroidered design on front. Adjustable velcro strap. Ages 2–8.',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80','https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80','https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80'],
    tags: ['kids','cap','embroidery','printrove','pod'] },

  // ── ACTIVEWEAR ──
  { name: 'Women\'s Yoga Set — Leggings + Sports Bra',       category: 'Activewear',   price: 1699, costPrice: 770, vendor_sku: 'PR-YOGA-SET-48', stock: 300, isFeatured: true,
    description: 'Matching all-over sublimation yoga set. High-waist leggings + medium support sports bra. Moisture-wicking.',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80','https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80','https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80','https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80'],
    tags: ['yoga','set','women','activewear','sublimation','printrove'] },
  { name: 'Men\'s Gym Vest — Custom Sublimation',           category: 'Activewear',   price: 699,  costPrice: 310, vendor_sku: 'PR-GYMV-MN-49', stock: 400,
    description: 'All-over sublimation gym muscle vest for men. Moisture-wicking polyester. Deep armhole. Sizes S–3XL.',
    images: ['https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80','https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80'],
    tags: ['gym-vest','men','activewear','sublimation','printrove','pod'] },
  { name: 'Sublimation Polo Sports Shirt — Men\'s',         category: 'Activewear',   price: 999,  costPrice: 450, vendor_sku: 'PR-SPOLO-MN-50', stock: 400,
    description: 'All-over sublimation sports polo. Dry-fit moisture management. 3-button placket. Team orders welcome.',
    images: ['https://images.unsplash.com/photo-1625910513413-fc00c2f5cd64?w=800&q=80','https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80','https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80'],
    tags: ['polo','sports','men','sublimation','activewear','printrove'] },

  // ── HOME DECOR ──
  { name: 'Printed Bed Runner — Custom',                     category: 'Home Decor',   price: 1199, costPrice: 530, vendor_sku: 'PR-BRUN-CTM-51', stock: 150,
    description: 'Luxurious bed runner with all-over sublimation print. 60x200cm. Soft polyester satin. Hotel-style accent.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    tags: ['bed-runner','home-decor','custom','sublimation','printrove'] },
  { name: 'Custom Printed Pillow Cover Set (2-piece)',       category: 'Home Decor',   price: 799,  costPrice: 340, vendor_sku: 'PR-PLWSET-2-52', stock: 300,
    description: 'Set of 2 satin cushion covers. All-over sublimation print. 16x16 inch each. Hidden zip closure.',
    images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    tags: ['pillow-cover','set','home-decor','sublimation','printrove'] },
  { name: 'Printed Curtain Panel — 44x84 inch',             category: 'Home Decor',   price: 1499, costPrice: 660, vendor_sku: 'PR-CRTN-PNL-53', stock: 150, isFeatured: true,
    description: 'Single custom-print window panel. All-over digital print on sheer satin. 44x84 inch. Rod pocket top.',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80','https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    tags: ['curtain','panel','home-decor','custom','printrove','window'] },
  { name: 'Custom Canvas Tote + Canvas Art Gift Set',        category: 'Gifts',        price: 1499, costPrice: 660, vendor_sku: 'PR-GSET-CART-54', stock: 200, isFeatured: true,
    description: 'Premium gift set: custom tote bag + small canvas print. Matching art. Perfect birthday/anniversary gift.',
    images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80','https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
    tags: ['gift-set','tote','canvas','printrove','pod','gift'] },

  // ── STATIONERY ──
  { name: 'Custom Spiral Notebook — A5',                     category: 'Stationery',   price: 399,  costPrice: 150, vendor_sku: 'PR-SPNB-A5-55', stock: 300,
    description: 'A5 spiral-bound notebook. Custom cover print. 200 ruled pages. Smooth writing paper.',
    images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80','https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80','https://images.unsplash.com/photo-1467633557989-01e2a17a6a5c?w=800&q=80'],
    tags: ['notebook','spiral','A5','stationery','custom','printrove'] },
  { name: 'Custom Printed Pen — Metal Ballpoint',            category: 'Stationery',   price: 249,  costPrice: 90,  vendor_sku: 'PR-PNMTL-56', stock: 500,
    description: 'Sleek metal ballpoint pen. Custom laser-engraved or printed logo/name. Smooth ink, gift box ready.',
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80','https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80','https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80'],
    tags: ['pen','metal','stationery','custom','corporate','printrove'] },
  { name: 'Custom Sticky Note Pad Set',                      category: 'Stationery',   price: 299,  costPrice: 110, vendor_sku: 'PR-STKY-PAD-57', stock: 400,
    description: 'Custom-printed sticky note pad set (3 sizes). Full-color cover print. 50 sheets each pad.',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80','https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80','https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80'],
    tags: ['sticky-note','pad','stationery','custom','printrove'] },
  { name: 'Custom Bookmark Set (5-piece)',                   category: 'Stationery',   price: 199,  costPrice: 70,  vendor_sku: 'PR-BKMK-SET5-58', stock: 500,
    description: 'Set of 5 double-sided laminated bookmarks. Full-color sublimation print. Custom art. Reader\'s gift.',
    images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80','https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80','https://images.unsplash.com/photo-1467633557989-01e2a17a6a5c?w=800&q=80'],
    tags: ['bookmark','set','stationery','custom','printrove','gift'] },

  // ── GIFTS ──
  { name: 'Custom Photo Mug — Printrove 350ml',              category: 'Gifts',        price: 549,  costPrice: 215, vendor_sku: 'PR-PMUG-350-59', stock: 999, isFeatured: true,
    description: 'Printrove 350ml ceramic mug with full-wrap custom photo/art print. Dishwasher safe. Best seller gift.',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80','https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80','https://images.unsplash.com/photo-1516682940969-a5f60ba8ee4a?w=800&q=80','https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80'],
    tags: ['mug','photo','gift','ceramic','printrove','pod'] },
  { name: 'Custom Photo Cushion — 16x16 (Printrove)',        category: 'Gifts',        price: 799,  costPrice: 340, vendor_sku: 'PR-PCUSH-1616-60', stock: 300, isFeatured: true,
    description: 'Printrove 16x16 soft-fill cushion with custom photo/art sublimation panel. Perfect gift for all occasions.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'],
    tags: ['cushion','photo','gift','printrove','pod'] },
  { name: 'Corporate Gift Hamper — Premium Set',             category: 'Gifts',        price: 2499, costPrice: 1100, vendor_sku: 'PR-CORP-HAMP-61', stock: 100, isFeatured: true,
    description: 'Premium corporate gift hamper: custom mug, pen, notebook and keychain. All with logo branding. Gift box.',
    images: ['https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80','https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80','https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'],
    tags: ['hamper','corporate','gift-set','premium','printrove','pod'] },
];

// ─── DB INSERT ───────────────────────────────────────────────────────────────
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
  process.stdout.write(`\n  ✓ ${prod.name} (₹${prod.price}) [${prod.images.length} imgs]`);
  return true;
}

async function main() {
  const client = await pool.connect();
  try {
    let qikinkId    = await getSupplierId('qikink', client);
    let printroveId = await getSupplierId('printrove', client);

    if (!qikinkId) {
      const r = await client.query(`INSERT INTO suppliers (id,name,type,"isActive","createdAt","updatedAt") VALUES (gen_random_uuid(),'Qikink','qikink',true,NOW(),NOW()) RETURNING id`);
      qikinkId = r.rows[0].id;
    }
    if (!printroveId) {
      const r = await client.query(`INSERT INTO suppliers (id,name,type,"isActive","createdAt","updatedAt") VALUES (gen_random_uuid(),'Printrove','printrove',true,NOW(),NOW()) RETURNING id`);
      printroveId = r.rows[0].id;
    }

    console.log('\n=== SEEDING QIKINK BULK (+43) ===');
    let qa = 0;
    for (const p of QIKINK_BULK) { const ok = await insertProduct(p,'qikink',qikinkId,client); if(ok) qa++; }

    console.log('\n\n=== SEEDING PRINTROVE BULK (+37) ===');
    let pa = 0;
    for (const p of PRINTROVE_BULK) { const ok = await insertProduct(p,'printrove',printroveId,client); if(ok) pa++; }

    console.log('\n\n=== DONE ===');
    console.log(`Qikink: +${qa}/${QIKINK_BULK.length}`);
    console.log(`Printrove: +${pa}/${PRINTROVE_BULK.length}`);

    const total    = await client.query(`SELECT COUNT(*) FROM products WHERE "isActive"=true`);
    const byVendor = await client.query(`SELECT vendor_id, COUNT(*) as count FROM products GROUP BY vendor_id ORDER BY vendor_id`);
    console.log('\nTotal active products:', total.rows[0].count);
    byVendor.rows.forEach(r => console.log(`  ${r.vendor_id}: ${r.count}`));
  } finally { client.release(); await pool.end(); }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
