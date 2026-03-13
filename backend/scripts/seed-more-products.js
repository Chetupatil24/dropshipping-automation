// seed-more-products.js — Expanded catalog: 60+ more products with multiple images
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');

const DB_URL = `postgresql://postgres.ccwnnradnszbwjfjfpvk:${encodeURIComponent('RoopaChetu@2026')}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`;
const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── QIKINK EXPANDED CATALOG ──────────────────────────────────────────────────
const QIKINK_MORE = [
  // ─ T-SHIRTS ─
  {
    name: 'Classic Round Neck T-Shirt — Red',
    category: 'T-Shirts', price: 499, costPrice: 230,
    description: 'Premium 180 GSM bio-washed cotton round neck tee in bold Red. Pre-shrunk, anti-pilling. Perfect for custom print.',
    images: [
      'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80',
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    ],
    tags: ['t-shirt','cotton','round-neck','red','pod','customizable'],
    vendor_sku: 'QK-RNTS-RED-02', stock: 999
  },
  {
    name: 'Classic Round Neck T-Shirt — Royal Blue',
    category: 'T-Shirts', price: 499, costPrice: 230,
    description: 'Premium 180 GSM bio-washed cotton in vibrant Royal Blue. Great base for DTG prints and custom designs.',
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    ],
    tags: ['t-shirt','cotton','round-neck','blue','pod','customizable'],
    vendor_sku: 'QK-RNTS-BLU-03', stock: 999
  },
  {
    name: 'V-Neck T-Shirt — White',
    category: 'T-Shirts', price: 549, costPrice: 250,
    description: '180 GSM bio-washed cotton V-neck tee. Flattering neckline, great for chest artwork and photo prints.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    ],
    tags: ['t-shirt','v-neck','cotton','white','pod'],
    vendor_sku: 'QK-VNTS-WHT-04', stock: 999, isFeatured: true
  },
  {
    name: 'Tie-Dye Round Neck T-Shirt',
    category: 'T-Shirts', price: 649, costPrice: 290,
    description: 'Trendy multi-color tie-dye base tee. Vibrant and ready for custom front print. 200 GSM cotton. Youth fav!',
    images: [
      'https://images.unsplash.com/photo-1602810317536-2b779725f02d?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1561052967-61fc91e48d79?w=800&q=80',
    ],
    tags: ['t-shirt','tie-dye','colorful','pod','trendy'],
    vendor_sku: 'QK-TDTS-05', stock: 500, isFeatured: true
  },
  {
    name: 'Henley Collar T-Shirt — Olive Green',
    category: 'T-Shirts', price: 599, costPrice: 270,
    description: '200 GSM cotton henley tee with 3-button placket. Olive green — classic earthy tone. DTG front print area.',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1614093302611-8efc4d1b2869?w=800&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
    ],
    tags: ['t-shirt','henley','olive','pod','premium'],
    vendor_sku: 'QK-HNLY-OLV-06', stock: 500
  },
  {
    name: 'Raglan Baseball T-Shirt — White/Navy',
    category: 'T-Shirts', price: 649, costPrice: 295,
    description: '3/4 sleeve raglan tee with contrasting white body and navy sleeves. Perfect for sports and casual custom prints.',
    images: [
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80',
    ],
    tags: ['t-shirt','raglan','baseball','3/4-sleeve','pod'],
    vendor_sku: 'QK-RAGL-WN-07', stock: 500
  },
  {
    name: 'Full Sleeve T-Shirt — Black',
    category: 'T-Shirts', price: 599, costPrice: 275,
    description: '180 GSM full-sleeve cotton tee in solid black. Slim fit, custom print on chest/full front. Unisex sizing.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80',
    ],
    tags: ['t-shirt','full-sleeve','black','pod','unisex'],
    vendor_sku: 'QK-FLSL-BLK-08', stock: 999
  },

  // ─ HOODIES & SWEATSHIRTS ─
  {
    name: 'Fleece Hoodie — Forest Green',
    category: 'Hoodies', price: 1299, costPrice: 600,
    description: '320 GSM fleece hoodie in rich Forest Green. Kangaroo pocket, drawstring hood. Perfect for winter custom prints.',
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80',
      'https://images.unsplash.com/photo-1572470754601-7fcff0497ed3?w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    ],
    tags: ['hoodie','fleece','green','winter','pod'],
    vendor_sku: 'QK-HOOK-GRN-09', stock: 400
  },
  {
    name: 'Fleece Hoodie — Off White',
    category: 'Hoodies', price: 1299, costPrice: 600,
    description: '320 GSM premium fleece hoodie in Off-White/Cream. Clean neutral tone — great canvas for minimalist designs.',
    images: [
      'https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80',
    ],
    tags: ['hoodie','fleece','cream','off-white','pod'],
    vendor_sku: 'QK-HOOK-OFW-10', stock: 400, isFeatured: true
  },
  {
    name: 'Crewneck Sweatshirt — Black',
    category: 'Hoodies', price: 999, costPrice: 460,
    description: '300 GSM fleece crewneck sweatshirt in Black. Ribbed cuffs and waistband. Large front print area.',
    images: [
      'https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80',
    ],
    tags: ['sweatshirt','crewneck','black','pod','winter'],
    vendor_sku: 'QK-CREW-BLK-11', stock: 500
  },

  // ─ MUGS & DRINKWARE ─
  {
    name: 'White Ceramic Mug — 450ml Large',
    category: 'Mugs', price: 399, costPrice: 155,
    description: 'Extra-large 450ml white ceramic mug. Full-color 360° sublimation print. Perfect morning coffee gift.',
    images: [
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80',
      'https://images.unsplash.com/photo-1516682940969-a5f60ba8ee4a?w=800&q=80',
      'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    ],
    tags: ['mug','ceramic','large','coffee','sublimation','pod'],
    vendor_sku: 'QK-MUG-450-12', stock: 999, isFeatured: true
  },
  {
    name: 'Black Inner Magic Mug',
    category: 'Mugs', price: 499, costPrice: 185,
    description: 'Magic mug with black inner coating. Custom art printed on outer surface. Heat-activated reveal effect.',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    ],
    tags: ['mug','magic','black','heat-reveal','pod','gift'],
    vendor_sku: 'QK-BMUG-13', stock: 500
  },
  {
    name: 'Stainless Steel Travel Mug — 400ml',
    category: 'Drinkware', price: 699, costPrice: 280,
    description: 'Double-walled stainless steel travel mug. Sublimation print. Keeps drinks hot 6hrs / cold 12hrs. Spill-proof lid.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80',
      'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',
    ],
    tags: ['travel-mug','stainless-steel','drinkware','sublimation','pod'],
    vendor_sku: 'QK-TRMUG-14', stock: 400
  },
  {
    name: 'Ceramic Beer Mug / Stein — 450ml',
    category: 'Drinkware', price: 449, costPrice: 175,
    description: 'Classic ceramic beer stein 450ml. Custom sublimation art on barrel surface. Great for gifting, parties.',
    images: [
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
      'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    tags: ['beer-mug','stein','ceramic','drinkware','pod','gift'],
    vendor_sku: 'QK-BMUG-STN-15', stock: 300
  },

  // ─ BAGS ─
  {
    name: 'Drawstring Gym Bag — Customizable',
    category: 'Bags', price: 299, costPrice: 110,
    description: 'Lightweight polyester drawstring bag. Full-color sublimation print. Great for gym, sports & outdoor use.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80',
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80',
    ],
    tags: ['bag','drawstring','gym','sports','sublimation','pod'],
    vendor_sku: 'QK-DRAW-GYM-16', stock: 500
  },
  {
    name: 'Jute Tote Bag — Custom Print',
    category: 'Bags', price: 449, costPrice: 180,
    description: 'Eco-friendly jute tote bag with cotton lining. Custom full-color print panel on front. Sustainable gifting.',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
      'https://images.unsplash.com/photo-1676655789428-44b7ba45ef2e?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    ],
    tags: ['tote','jute','eco','bag','custom','pod'],
    vendor_sku: 'QK-JUTE-TOT-17', stock: 400
  },

  // ─ ACCESSORIES ─
  {
    name: 'Custom Keychain — Acrylic Photo Print',
    category: 'Accessories', price: 199, costPrice: 65,
    description: 'Premium acrylic keychain with full-color custom print. 2.5 inch round. Strong metal clasp. Great gift item.',
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
      'https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
    ],
    tags: ['keychain','acrylic','custom','accessories','gift','pod'],
    vendor_sku: 'QK-KYCHN-18', stock: 999
  },
  {
    name: 'Custom Round Mouse Pad',
    category: 'Accessories', price: 349, costPrice: 130,
    description: 'Non-slip rubber base round mouse pad. Full-color sublimation print. 20cm diameter. Desk essential.',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    ],
    tags: ['mousepad','custom','desk','accessories','pod','sublimation'],
    vendor_sku: 'QK-MPAD-RND-19', stock: 500
  },
  {
    name: 'Sublimation Phone Case — iPhone 14',
    category: 'Accessories', price: 399, costPrice: 130,
    description: 'Premium sublimation phone case for iPhone 14. Full-color custom print, shock-absorbing TPU material.',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80',
    ],
    tags: ['phone-case','iphone14','sublimation','pod','accessories'],
    vendor_sku: 'QK-PHCS-IP14-20', stock: 500
  },
  {
    name: 'Sublimation Phone Case — Samsung Galaxy S24',
    category: 'Accessories', price: 399, costPrice: 130,
    description: 'Custom sublimation case for Samsung Galaxy S24. Full-color print, raised camera protection.',
    images: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
    ],
    tags: ['phone-case','samsung','s24','sublimation','pod','accessories'],
    vendor_sku: 'QK-PHCS-SG24-21', stock: 500
  },
  {
    name: 'Custom Printed Socks',
    category: 'Accessories', price: 299, costPrice: 110,
    description: 'Full-color all-over sublimation print socks. Comfortable polyester-spandex blend. Unisex sizes S/M/L.',
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
      'https://images.unsplash.com/photo-1614093302611-8efc4d1b2869?w=800&q=80',
      'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80',
    ],
    tags: ['socks','custom','sublimation','accessories','pod','unisex'],
    vendor_sku: 'QK-SOCKS-22', stock: 500
  },
  {
    name: 'Custom Embroidered Cap — White',
    category: 'Accessories', price: 699, costPrice: 290,
    description: '6-panel structured cap in White with custom embroidered logo/text on front. Adjustable closure.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80',
    ],
    tags: ['cap','hat','embroidery','white','accessories','pod'],
    vendor_sku: 'QK-CAP-WHT-23', stock: 300
  },
  {
    name: 'Custom Face Mask / Buff',
    category: 'Accessories', price: 199, costPrice: 70,
    description: 'Multi-use sublimation face mask / neck gaiter. Seamless tube design. Full-color 360° print. Sports & outdoor.',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1591023265534-5769d51aed83?w=800&q=80',
      'https://images.unsplash.com/photo-1596510914699-0c60c7c5a30f?w=800&q=80',
    ],
    tags: ['mask','face-mask','buff','accessories','pod','sports'],
    vendor_sku: 'QK-MASK-24', stock: 500
  },

  // ─ HOME DECOR ─
  {
    name: 'Custom Canvas Wall Art — A3',
    category: 'Home Decor', price: 1099, costPrice: 450,
    description: 'Gallery-quality stretched A3 canvas art print. 380 GSM cotton canvas, kiln-dried pine frame. Ready to hang.',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
    ],
    tags: ['canvas','wall-art','home-decor','A3','pod'],
    vendor_sku: 'QK-CVAS-A3-25', stock: 200, isFeatured: true
  },
  {
    name: 'Photo Frame Coaster Set (4-piece)',
    category: 'Home Decor', price: 549, costPrice: 210,
    description: 'Set of 4 ceramic sublimation coasters. Custom photo/design on each. Cork backing. Perfect gift set.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80',
    ],
    tags: ['coaster','set','home-decor','sublimation','pod','gift'],
    vendor_sku: 'QK-COST-SET4-26', stock: 300
  },
  {
    name: 'Custom Sublimation Cushion Cover — 12x12',
    category: 'Home Decor', price: 399, costPrice: 155,
    description: 'Vibrant sublimation cushion cover 12x12 inch. Satin polyester, hidden zip. Bold full-color art.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
    ],
    tags: ['cushion-cover','home-decor','sublimation','pod','12x12'],
    vendor_sku: 'QK-CUSH-1212-27', stock: 400
  },

  // ─ SPORTS / ACTIVEWEAR ─
  {
    name: 'Sublimation Sports Jersey — Round Neck',
    category: 'Activewear', price: 799, costPrice: 360,
    description: 'All-over sublimation print sports jersey. Moisture-wicking polyester. Crew neck. Team & custom printing.',
    images: [
      'https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80',
      'https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
      'https://images.unsplash.com/photo-1529932626930-ef42b2d73f62?w=800&q=80',
    ],
    tags: ['jersey','sports','sublimation','activewear','pod','team'],
    vendor_sku: 'QK-JRSY-RND-28', stock: 500
  },
  {
    name: 'Sublimation Sports Polo — All Over',
    category: 'Activewear', price: 899, costPrice: 400,
    description: 'All-over sublimation polo shirt. Moisture-wicking polyester. 3-button placket. Corporate & sports branding.',
    images: [
      'https://images.unsplash.com/photo-1625910513413-fc00c2f5cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1556906781-9a414e2a7735?w=800&q=80',
    ],
    tags: ['polo','sports','sublimation','activewear','pod','corporate'],
    vendor_sku: 'QK-POLO-AOF-29', stock: 400
  },
  {
    name: 'Custom Water Bottle — 750ml Steel',
    category: 'Drinkware', price: 649, costPrice: 250,
    description: '750ml wide-mouth stainless steel water bottle. Sublimation print. BPA-free. Perfect gym companion.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80',
      'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',
    ],
    tags: ['bottle','750ml','stainless-steel','gym','pod','drinkware'],
    vendor_sku: 'QK-BOTL-750-30', stock: 500, isFeatured: true
  },
];

// ─── PRINTROVE EXPANDED CATALOG ───────────────────────────────────────────────
const PRINTROVE_MORE = [
  // ─ T-SHIRTS ─
  {
    name: 'Round Neck T-Shirt — Black (Printrove)',
    category: 'T-Shirts', price: 599, costPrice: 275,
    description: 'Printrove 200 GSM combed cotton. Black — classic base for bold DTG front prints. Wrinkle-resistant finish.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1619414834804-d77f28c70a87?w=800&q=80',
      'https://images.unsplash.com/photo-1571745544682-143ea663cf2c?w=800&q=80',
    ],
    tags: ['t-shirt','black','printrove','pod','cotton','DTG'],
    vendor_sku: 'PR-RNTS-BLK-02', stock: 999, isFeatured: true
  },
  {
    name: 'Oversized Boxy T-Shirt — Beige (Printrove)',
    category: 'T-Shirts', price: 749, costPrice: 340,
    description: 'Trendy oversized boxy-cut tee in warm Beige. 220 GSM drop-shoulder. DTG large-format print canvas.',
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
      'https://images.unsplash.com/photo-1503341338985-95231b3b3a22?w=800&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
    ],
    tags: ['t-shirt','oversized','beige','printrove','boxy','streetwear'],
    vendor_sku: 'PR-OVTS-BEI-03', stock: 500, isFeatured: true
  },
  {
    name: 'Graphic Art T-Shirt — White Base (Printrove)',
    category: 'T-Shirts', price: 699, costPrice: 315,
    description: '200 GSM bio-washed white tee. Large front print canvas (A3-size print area). Perfect for art and illustrative designs.',
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
      'https://images.unsplash.com/photo-1561052967-61fc91e48d79?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    ],
    tags: ['t-shirt','graphic','white','printrove','art','DTG'],
    vendor_sku: 'PR-GRTS-WHT-04', stock: 999
  },
  {
    name: 'Women\'s Fitted T-Shirt — Lavender',
    category: 'Women\'s Wear', price: 649, costPrice: 295,
    description: 'Women\'s fitted crew-neck tee in soft Lavender. 190 GSM combed cotton. Flattering cut. DTG print-ready.',
    images: [
      'https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?w=800&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    tags: ['t-shirt','women','lavender','printrove','fitted','pod'],
    vendor_sku: 'PR-WMTS-LAV-05', stock: 500
  },
  {
    name: 'Crop Top T-Shirt — White (Printrove)',
    category: 'Women\'s Wear', price: 599, costPrice: 270,
    description: 'Women\'s crop-length tee. 190 GSM bio-washed white. Short belly-length fit. DTG custom chest print.',
    images: [
      'https://images.unsplash.com/photo-1508427953056-b00b71b2f18d?w=800&q=80',
      'https://images.unsplash.com/photo-1532453288672-3a17de65a2ef?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    ],
    tags: ['crop-top','women','white','printrove','pod'],
    vendor_sku: 'PR-CRPT-WHT-06', stock: 400, isFeatured: true
  },

  // ─ HOODIES ─
  {
    name: 'Fleece Hoodie — Stone Grey (Printrove)',
    category: 'Hoodies', price: 1399, costPrice: 650,
    description: 'Premium 340 GSM Printrove hoodie in Stone Grey. Soft brushed fleece interior, kangaroo pocket. DTG print.',
    images: [
      'https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80',
      'https://images.unsplash.com/photo-1620799940785-c2f0a9c0a7b7?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80',
    ],
    tags: ['hoodie','grey','printrove','premium','fleece','pod'],
    vendor_sku: 'PR-HOOK-GRY-07', stock: 400
  },
  {
    name: 'Zip-Up Hoodie — Maroon (Printrove)',
    category: 'Hoodies', price: 1599, costPrice: 740,
    description: 'Full-zip premium hoodie in deep Maroon. 340 GSM fleece, double-lined hood. Perfect for logo prints.',
    images: [
      'https://images.unsplash.com/photo-1613068687893-5e85b4638b56?w=800&q=80',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
      'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80',
    ],
    tags: ['hoodie','zip-up','maroon','winter','printrove','pod'],
    vendor_sku: 'PR-ZIPH-MAR-08', stock: 300
  },

  // ─ JACKETS / OUTERWEAR ─
  {
    name: 'Varsity Jacket — Black & White',
    category: 'Jackets', price: 2199, costPrice: 1000,
    description: 'Classic varsity jacket with wool body and leather sleeves in black/white combo. Custom embroidery + print.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&q=80',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80',
    ],
    tags: ['jacket','varsity','black','white','printrove','premium'],
    vendor_sku: 'PR-VARS-BW-09', stock: 150, isFeatured: true
  },
  {
    name: 'Windbreaker Jacket — All Over Print',
    category: 'Jackets', price: 1799, costPrice: 820,
    description: 'Lightweight windbreaker jacket with all-over sublimation print. Water-resistant nylon outer. Full zip front.',
    images: [
      'https://images.unsplash.com/photo-1617952739390-9a3c7e8a285c?w=800&q=80',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    ],
    tags: ['jacket','windbreaker','all-over-print','printrove','sublimation'],
    vendor_sku: 'PR-WIND-AOF-10', stock: 200
  },

  // ─ WOMEN'S WEAR ─
  {
    name: 'All-Over Print Leggings — Women\'s',
    category: 'Women\'s Wear', price: 999, costPrice: 450,
    description: 'High-waist all-over sublimation print leggings. 4-way stretch, opaque. XS to 3XL. Perfect for yoga & gym.',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80',
    ],
    tags: ['leggings','women','all-over-print','yoga','activewear','printrove'],
    vendor_sku: 'PR-LEGG-WM-11', stock: 500, isFeatured: true
  },
  {
    name: 'Printed Flare Dress — Women\'s',
    category: 'Women\'s Wear', price: 1399, costPrice: 620,
    description: 'Flowing sublimation flare dress. V-neck, all-over print on satin chiffon. Available S-3XL. Statement wear.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
      'https://images.unsplash.com/photo-1496217590130-a76b1e10b12d?w=800&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5218ees0fb?w=800&q=80',
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
    ],
    tags: ['dress','flare','women','sublimation','satin','printrove'],
    vendor_sku: 'PR-DRSS-FLR-12', stock: 250
  },
  {
    name: 'Sports Bra — Custom Sublimation',
    category: 'Women\'s Wear', price: 799, costPrice: 360,
    description: 'Medium-support sports bra with all-over sublimation print. Moisture-wicking, flattering racerback design.',
    images: [
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80',
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80',
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80',
    ],
    tags: ['sports-bra','women','sublimation','activewear','printrove'],
    vendor_sku: 'PR-SPBRA-13', stock: 400
  },

  // ─ KIDS WEAR ─
  {
    name: 'Kids T-Shirt — Round Neck Custom Print',
    category: 'Kids Wear', price: 449, costPrice: 175,
    description: 'Organic cotton kids round neck tee. DTG custom print. Sizes 4–14 years. Tagless, soft & safe for kids.',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80',
      'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    ],
    tags: ['kids','t-shirt','organic','DTG','pod','printrove'],
    vendor_sku: 'PR-KIDS-TS-14', stock: 500
  },
  {
    name: 'Kids Hoodie — Custom Print',
    category: 'Kids Wear', price: 899, costPrice: 400,
    description: 'Cozy fleece hoodie for kids. Soft kangaroo pocket, full DTG print on front. Sizes 4–12 years.',
    images: [
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800&q=80',
      'https://images.unsplash.com/photo-1637930839516-97c5b8afd72e?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    tags: ['kids','hoodie','fleece','pod','printrove'],
    vendor_sku: 'PR-KIDS-HOOK-15', stock: 300
  },

  // ─ ACTIVEWEAR ─
  {
    name: 'Sublimation Track Suit (Top + Pants)',
    category: 'Activewear', price: 1899, costPrice: 860,
    description: 'Matching all-over sublimation track suit set. Moisture-wicking polyester, 4-way stretch. Includes jacket + jogger.',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80',
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80',
    ],
    tags: ['tracksuit','activewear','sublimation','pod','printrove','set'],
    vendor_sku: 'PR-TSUIT-16', stock: 200, isFeatured: true
  },
  {
    name: 'Compression Tights — Men\'s Sublimation',
    category: 'Activewear', price: 899, costPrice: 400,
    description: 'Men\'s full-length compression tights. All-over sublimation print. Moisture-wicking with UPF 50+ protection.',
    images: [
      'https://images.unsplash.com/photo-1529131937069-87a34da6e4f3?w=800&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
      'https://images.unsplash.com/photo-1601836765819-3a8d2793a4ae?w=800&q=80',
    ],
    tags: ['compression','tights','men','sublimation','activewear','printrove'],
    vendor_sku: 'PR-COMP-MN-17', stock: 300
  },

  // ─ HOME DECOR ─
  {
    name: 'Photo Canvas Collage Print — 12x18',
    category: 'Home Decor', price: 1299, costPrice: 560,
    description: 'Large 12x18 inch custom canvas collage. Upload your photos. Kiln-dried solid wood frame. Ready to hang.',
    images: [
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    ],
    tags: ['canvas','home-decor','photo','collage','custom','printrove'],
    vendor_sku: 'PR-CVAS-1218-18', stock: 150, isFeatured: true
  },
  {
    name: 'Printed Wall Tapestry — 60x80 cm',
    category: 'Home Decor', price: 1099, costPrice: 470,
    description: 'Vibrant all-over sublimation print wall tapestry. 60x80 cm polyester. Lightweight, easy to hang.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    ],
    tags: ['tapestry','wall-art','home-decor','sublimation','printrove'],
    vendor_sku: 'PR-TAPST-6080-19', stock: 200
  },

  // ─ ACCESSORIES ─
  {
    name: 'Custom Tote Backpack — Drawstring',
    category: 'Bags', price: 549, costPrice: 220,
    description: 'Trendy drawstring backpack tote. All-over sublimation print. 15L capacity, reinforced shoulder straps.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80',
      'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=800&q=80',
    ],
    tags: ['backpack','tote','drawstring','printrove','bags','pod'],
    vendor_sku: 'PR-BKPK-DRW-20', stock: 400
  },
  {
    name: 'Custom Laptop Sleeve — 15-inch',
    category: 'Accessories', price: 799, costPrice: 320,
    description: 'Neoprene 15" laptop sleeve with full-color custom print. Padded interior, smooth YKK zip closure.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80',
    ],
    tags: ['laptop-sleeve','15-inch','accessories','custom','pod','printrove'],
    vendor_sku: 'PR-LSLEEVE-15-21', stock: 300
  },
  {
    name: 'Custom Sublimation Headband',
    category: 'Accessories', price: 199, costPrice: 70,
    description: 'Stretchy sublimation headband. All-over full-color print. Non-slip silicone grip. Sports & fashion wear.',
    images: [
      'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80',
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    ],
    tags: ['headband','accessories','sublimation','sports','pod','printrove'],
    vendor_sku: 'PR-HBAND-22', stock: 500
  },

  // ─ STATIONERY ─
  {
    name: 'A4 Hardcover Notebook — Custom Print',
    category: 'Stationery', price: 449, costPrice: 170,
    description: 'A4 premium hardcover notebook, 240 pages, custom full-color cover. Lay-flat binding. Ruled/blank options.',
    images: [
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
      'https://images.unsplash.com/photo-1467633557989-01e2a17a6a5c?w=800&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
    ],
    tags: ['notebook','A4','stationery','custom','pod','printrove'],
    vendor_sku: 'PR-NTBK-A4-23', stock: 300
  },
  {
    name: 'Pen Gift Box Set — Custom Printed',
    category: 'Stationery', price: 599, costPrice: 230,
    description: 'Premium metal pen set in custom-printed gift box. 2 pens + card slot. Corporate gifting, events, branding.',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80',
      'https://images.unsplash.com/photo-1609770231080-e321decbeec4?w=800&q=80',
    ],
    tags: ['pen','gift-set','stationery','corporate','custom','printrove'],
    vendor_sku: 'PR-PNST-GFT-24', stock: 200
  },
];

// ─── DB INSERT LOGIC ─────────────────────────────────────────────────────────
async function getSupplierId(vendorId, client) {
  const r = await client.query(`SELECT id FROM suppliers WHERE type=$1 OR name ILIKE $2 LIMIT 1`, [vendorId, vendorId]);
  return r.rows[0]?.id || null;
}

async function insertProduct(prod, vendorId, supplierId, client) {
  const slug = slugify(prod.name) + '-' + vendorId;
  const sku = prod.vendor_sku;
  const supplierProductId = vendorId + '_' + sku;

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
    prod.name, slug, prod.description, prod.price, prod.costPrice, sku, prod.stock,
    prod.images, prod.category, prod.tags,
    supplierId, supplierProductId, vendorId, prod.vendor_sku,
    prod.isFeatured || false,
  ]);
  console.log(`  ✓ ${prod.name} (₹${prod.price}) [${prod.images.length} images]`);
  return true;
}

async function main() {
  const client = await pool.connect();
  try {
    let qikinkId = await getSupplierId('qikink', client);
    let printroveId = await getSupplierId('printrove', client);

    if (!qikinkId) {
      const r = await client.query(`INSERT INTO suppliers (id,name,type,"isActive","createdAt","updatedAt") VALUES (gen_random_uuid(),'Qikink','qikink',true,NOW(),NOW()) RETURNING id`);
      qikinkId = r.rows[0].id;
    }
    if (!printroveId) {
      const r = await client.query(`INSERT INTO suppliers (id,name,type,"isActive","createdAt","updatedAt") VALUES (gen_random_uuid(),'Printrove','printrove',true,NOW(),NOW()) RETURNING id`);
      printroveId = r.rows[0].id;
    }

    console.log('\n=== SEEDING EXTRA QIKINK PRODUCTS ===');
    let qAdded = 0;
    for (const p of QIKINK_MORE) {
      const ok = await insertProduct(p, 'qikink', qikinkId, client);
      if (ok) qAdded++;
    }

    console.log('\n=== SEEDING EXTRA PRINTROVE PRODUCTS ===');
    let pAdded = 0;
    for (const p of PRINTROVE_MORE) {
      const ok = await insertProduct(p, 'printrove', printroveId, client);
      if (ok) pAdded++;
    }

    console.log('\n=== DONE ===');
    console.log(`Qikink: +${qAdded}/${QIKINK_MORE.length} added`);
    console.log(`Printrove: +${pAdded}/${PRINTROVE_MORE.length} added`);

    const total = await client.query(`SELECT COUNT(*) FROM products WHERE "isActive"=true`);
    const byVendor = await client.query(`SELECT vendor_id, COUNT(*) as count FROM products GROUP BY vendor_id ORDER BY vendor_id`);
    console.log('\nTotal active products:', total.rows[0].count);
    byVendor.rows.forEach(r => console.log(`  ${r.vendor_id}: ${r.count}`));

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
