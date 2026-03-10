import { useState, useEffect } from 'react';

const PRODUCTS = [
  'Silk Wrap Dress', 'Gold Hoop Earrings', 'Minimalist Tote Bag',
  'Pearl Necklace Set', 'Knit Oversized Hoodie', 'White Sneakers',
  'Oud Perfume 50ml', 'Embroidered Kurta Set', 'Leather Wallet',
];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Surat'];
const NAMES = ['Rahul S.', 'Priya K.', 'Ankit M.', 'Sneha R.', 'Vikram P.', 'Anjali D.', 'Rohan B.', 'Pooja N.', 'Arjun S.', 'Kavya T.'];
const TIMES = ['Just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago', '1 hour ago'];

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function LiveSalesPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setPopup({ name: random(NAMES), city: random(CITIES), product: random(PRODUCTS), time: random(TIMES) });
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    };
    const initial = setTimeout(show, 6000);
    const interval = setInterval(show, 18000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!popup) return null;

  return (
    <div
      className="fixed bottom-24 left-4 z-50 transition-all duration-500 max-w-xs"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(120px)', opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(65,105,225,0.1)' }}>
          <span className="material-symbols-outlined text-base select-none" style={{ color: '#4169e1' }}>shopping_bag</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-slate-900 truncate">{popup.name} from {popup.city}</p>
          <p className="text-xs text-slate-500 truncate">bought <span className="font-bold text-slate-800">{popup.product}</span></p>
          <p className="text-[10px] text-slate-400 mt-0.5">{popup.time}</p>
        </div>
        <button onClick={() => setVisible(false)} className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors ml-1">
          <span className="material-symbols-outlined text-sm select-none">close</span>
        </button>
      </div>
    </div>
  );
}
