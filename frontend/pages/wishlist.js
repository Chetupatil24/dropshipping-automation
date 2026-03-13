import Head from 'next/head';
import Link from 'next/link';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BottomNav from '../components/BottomNav';

const toINR = (price) => Math.round(parseFloat(price || 0));

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

        <Navbar />

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
                return (
                  <div key={item.id} className="product-card group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                      <img src={img || 'https://placehold.co/300x400?text=No+Image'} alt={item.name} className="product-image w-full h-full object-cover transition-transform duration-500" onError={e => { e.target.src='https://placehold.co/300x400?text=No+Image'; }} />
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


        <SiteFooter />
        <BottomNav />
      </div>
    </>
  );
}
