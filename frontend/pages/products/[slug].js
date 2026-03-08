import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { productsAPI } from '../../lib/api';
import { useStore } from '../../lib/store';
import { toast } from 'react-hot-toast';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);
const toMRP = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.9);

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart, getCartCount } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const cartCount = getCartCount();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        let res;
        try { res = await productsAPI.getBySlug(slug); }
        catch { res = await productsAPI.getById(slug); }
        setProduct(res.data.product || res.data);
        // load related
        const rel = await productsAPI.getAll({ limit: 4 });
        setRelated(rel.data.products || []);
      } catch (e) { console.error(e); toast.error('Product not found'); router.push('/products'); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );
  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl || product.image || 'https://placehold.co/600x800?text=No+Image'];
  const price = toINR(product.price);
  const mrp = toMRP(product.price);
  const disc = Math.round((1 - price / mrp) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };
  const handleBuyNow = () => { handleAddToCart(); router.push('/checkout'); };

  return (
    <>
      <Head><title>{product.name} | RUTHAN</title></Head>
      <div className="bg-background-light min-h-screen text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <nav className="hidden md:flex gap-6 text-sm font-semibold">
              <Link href="/products?category=Lady" className="hover:text-primary transition-colors text-slate-700">Women</Link>
              <Link href="/products?category=Jewelry" className="hover:text-primary transition-colors text-slate-700">Jewelry</Link>
              <Link href="/products" className="hover:text-primary transition-colors text-slate-700">All</Link>
            </nav>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary no-underline">RUTHAN</Link>
            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="no-underline hidden sm:block"><span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">favorite</span></Link>
              <Link href="/cart" className="relative no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            {product.category && <>
              <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
            </>}
            <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
            <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100">
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://placehold.co/600x800?text=No+Image'; }} />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.slice(0, 5).map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}>
                      <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://placehold.co/100x100?text=+'; }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-5 flex flex-col gap-7">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  {disc > 5 && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded">-{disc}% OFF</span>}
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-sm fill-1 select-none">star</span>)}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">(Reviews)</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">{product.name}</h1>
                {product.category && <p className="text-slate-500 font-medium text-sm mb-4">{product.category}</p>}
                <div className="flex items-baseline gap-4 mt-4">
                  <span className="text-3xl font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-lg text-slate-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                  {disc > 5 && <span className="text-sm font-bold text-green-600">Save ₹{(mrp - price).toLocaleString('en-IN')}</span>}
                </div>
              </section>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(65,105,225,0.04)', borderColor: 'rgba(65,105,225,0.15)' }}>
                  <span className="material-symbols-outlined text-primary select-none">local_shipping</span>
                  <div><p className="text-xs font-bold text-primary uppercase">Free Delivery</p><p className="text-[11px] text-slate-500">On orders above ₹999</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.15)' }}>
                  <span className="material-symbols-outlined text-emerald-600 select-none">verified_user</span>
                  <div><p className="text-xs font-bold text-emerald-600 uppercase">Authentic</p><p className="text-[11px] text-slate-500">100% Genuine Product</p></div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm font-bold mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center font-bold hover:border-primary transition-colors text-lg">-</button>
                  <span className="text-lg font-bold w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center font-bold hover:border-primary transition-colors text-lg">+</button>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button onClick={handleAddToCart} className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 text-white" style={{ backgroundColor: '#4169e1' }}>
                  <span className="material-symbols-outlined select-none">shopping_cart</span> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all">
                  Buy Now
                </button>
                <div className="flex items-center justify-center gap-6 py-1">
                  <div className="flex items-center gap-1 text-slate-500 text-xs"><span className="material-symbols-outlined text-sm select-none">local_shipping</span> Free Shipping ₹999+</div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs"><span className="material-symbols-outlined text-sm select-none">replay</span> Easy Returns</div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <details className="group border-b border-slate-200" open>
                  <summary className="flex justify-between items-center py-4 cursor-pointer font-bold text-slate-900 list-none">
                    Description
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 select-none">expand_more</span>
                  </summary>
                  <div className="pb-5 text-slate-600 text-sm leading-relaxed">{product.description}</div>
                </details>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-slate-200 pt-14">
              <h3 className="text-2xl font-extrabold mb-8">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.slice(0, 4).map((p) => {
                  const rPrice = toINR(p.price);
                  const rImg = Array.isArray(p.images) ? p.images[0] : (p.imageUrl || p.image || '');
                  return (
                    <Link key={p.id} href={`/products/${p.slug || p.id}`} className="group cursor-pointer no-underline">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white mb-3">
                        <img src={rImg || 'https://placehold.co/300x400?text=No+Image'} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={e => { e.target.src = 'https://placehold.co/300x400?text=No+Image'; }} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">{p.name}</h4>
                      <p className="font-bold text-slate-900 text-sm">₹{rPrice.toLocaleString('en-IN')}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">favorite</span><span className="text-[10px] font-bold">Wishlist</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">package</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
