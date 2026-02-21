import { useState, useEffect } from 'react';

const MOCK_PURCHASES = [
    { name: 'Rahul from Mumbai', product: 'Premium Hoodie', time: '2 minutes ago' },
    { name: 'Priya from Delhi', product: 'Wireless Earbuds', time: '5 minutes ago' },
    { name: 'Amit from Bangalore', product: 'Smart Watch', time: '12 minutes ago' },
    { name: 'Sneha from Pune', product: 'Running Shoes', time: 'Just now' },
    { name: 'Vikram from Hyderabad', product: 'Graphic T-Shirt', time: '1 hour ago' },
];

export default function LiveSalesPopup() {
    const [currentPurchase, setCurrentPurchase] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showRandomPopup = () => {
            // Pick a random purchase
            const randomPurchase = MOCK_PURCHASES[Math.floor(Math.random() * MOCK_PURCHASES.length)];
            setCurrentPurchase(randomPurchase);
            setIsVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Initial delay before first popup
        const initialTimer = setTimeout(() => {
            showRandomPopup();
        }, 10000); // Wait 10 seconds initially

        // Repeat every 20-40 seconds
        const intervalTimer = setInterval(() => {
            showRandomPopup();
        }, Math.floor(Math.random() * 20000) + 20000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalTimer);
        };
    }, []);

    if (!currentPurchase) return null;

    return (
        <div
            className={`fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 pr-12 relative overflow-hidden group hover:scale-105 transition-transform max-w-xs">
                {/* Decorative Side Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-teal-500"></div>

                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    🛍️
                </div>

                <div>
                    <p className="text-sm text-gray-800">
                        <span className="font-bold text-blue-600">{currentPurchase.name}</span> purchased
                    </p>
                    <p className="font-extrabold text-gray-900 line-clamp-1">{currentPurchase.product}</p>
                    <p className="text-xs text-teal-600 font-medium mt-0.5">{currentPurchase.time}</p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
