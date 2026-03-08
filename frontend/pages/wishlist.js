import Head from 'next/head';
import Link from 'next/link';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';

const toINR = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.45);
const toMRP = (usd) => Math.round(parseFloat(usd || 0) * 83 * 1.9);

export default function WishlistPage() {
  const { wishlist = [], removeFromWishlist, addToCart, getCartCount } = useStore();
  const cartCount = getCartCount();

  const handleMoveToCart = (item) => {
    addToCart(item);
    if (removeFromWishlist) removeFromWishlist(item.id);
    toast.success('Moved to cart!');
  };

  return (
    <>
      <Head><title>Wishlist | RUTHAN</title></Head>
      <div className="min-h-screen bg-background-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <nav className="hidden md:flex gap-6 text-sm font-semibold">
              <Link href="/products" className="hover:text-primary transition-colors text-slate-700">Shop</Link>
            </nav>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary no-underline">RUTHAN</Link>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative no-underline">
                <span className="material-symbols-outlined text-slate-700 hover:text-primary transition-colors select-none">shopping_bag</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-3xl text-primary select-none fill-1">favorite</span>
            <h1 className="text-3xl font-extrabold">My Wishlist <span className="text-slate-400 font-medium text-xl">({wishlist.length})</span></h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-7xl text-slate-300 mb-6 select-none">favorite</span>
              <h2 className="text-2xl font-bold text-slate-700 mb-3">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-8">Save items you love to your wishlist.</p>
              <Link href="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition no-underline">Discover Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => {
                const img = Array.isArray(item.images) ? item.images[0] : (item.imageUrl || item.image || '');
                const price = toINR(item.price);
                const mrp = toMRP(item.price);
                const disc = Math.round((1 - price / mrp) * 100);
                return (
                  <div key={item.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                      <img src={img || 'https://placehold.co/300x400?text=No+Image'} alt={item.name} className="product-image w-full h-full object-cover transition-transform duration-500" onError={e => { e.target.src='https://placehold.co/300x400?text=No+Image'; }} />
                      {disc > 5 && <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full tracking-widest">-{disc}%</span>}
                      <button onClick={() => removeFromWishlist && (removeFromWishlist(item.id), toast.success('Removed from wishlist'))} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-sm text-red-500 fill-1 select-none">favorite</span>
                      </button>
                      <div className="quick-add absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 transition-all duration-200">
                        <button onClick={() => handleMoveToCart(item)} className="w-full py-2.5 rounded-xl text-white text-xs font-extrabold tracking-wide shadow-lg" style={{ backgroundColor: '#4169e1' }}>
                          Move to Cart
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <Link href={`/products/${item.slug || item.id}`} className="no-underline">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">₹{price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                      </div>
                      <button onClick={() => handleMoveToCart(item)} className="mt-3 w-full py-2 rounded-lg text-white text-xs font-bold transition hover:opacity-90" style={{ backgroundColor: '#4169e1' }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-4 py-3 z-50">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/products" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">search</span><span className="text-[10px] font-bold">Shop</span></Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-primary no-underline"><span className="material-symbols-outlined select-none fill-1">favorite</span><span className="text-[10px] font-bold">Wishlist</span></Link>
          <Link href="/orders" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">package</span><span className="text-[10px] font-bold">Orders</span></Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 text-slate-400 no-underline"><span className="material-symbols-outlined select-none">person</span><span className="text-[10px] font-bold">Profile</span></Link>
        </nav>
      </div>
    </>
  );
}
