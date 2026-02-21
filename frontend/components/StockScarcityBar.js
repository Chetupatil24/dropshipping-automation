import { useState, useEffect } from 'react';

export default function StockScarcityBar({ initialStock = 12 }) {
    const [stockLeft, setStockLeft] = useState(initialStock);

    useEffect(() => {
        // Determine random stock based on initial, or generate if not provided
        const randomStock = initialStock || Math.floor(Math.random() * 15) + 3;
        setStockLeft(randomStock);
    }, [initialStock]);

    const percentage = Math.max(5, (stockLeft / 50) * 100); // Assume max 50 for progress bar scale

    const isVeryLow = stockLeft <= 5;
    const colorClass = isVeryLow
        ? 'from-red-500 to-orange-500' // Red/Orange for very low stock
        : 'from-amber-400 to-orange-500'; // Amber for normal urgency

    return (
        <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-red-600 flex items-center gap-1.5 text-sm">
                    🔥 High Demand!
                </span>
                <span className="text-sm font-extrabold text-gray-900">
                    Only <span className={isVeryLow ? 'text-red-600' : 'text-orange-500'}>{stockLeft}</span> items left in stock
                </span>
            </div>

            {/* Progress Bar Background */}
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                {/* Progress Bar Fill with Pulsing Animation for low stock */}
                <div
                    className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out relative ${isVeryLow ? 'animate-pulse' : ''}`}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Order now to secure your item before it sells out!
            </p>
        </div>
    );
}
