import { useState } from 'react';
import { useStore } from '../lib/store';
import { toast } from 'react-hot-toast';

export default function ProductBundles({ mainProduct }) {
    const { addToCart } = useStore();

    // Mock related products (in reality, fetch these based on mainProduct category/tags)
    const bundleItems = [
        {
            id: 'bundle1',
            name: 'Premium Display Case',
            price: 499,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
        },
        {
            id: 'bundle2',
            name: 'Extended Warranty (1 Year)',
            price: 299,
            image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=500&q=80',
        }
    ];

    const [selectedItems, setSelectedItems] = useState([mainProduct.id, ...bundleItems.map(item => item.id)]);

    const toggleItem = (id) => {
        // Keep main product always selected for the bundle add
        if (id === mainProduct.id) return;

        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const calculateTotal = () => {
        let total = mainProduct.price;
        bundleItems.forEach(item => {
            if (selectedItems.includes(item.id)) {
                total += item.price;
            }
        });
        return total;
    };

    const handleAddBundleToCart = () => {
        // Add main product
        addToCart(mainProduct, 1);

        // Add selected bundle items
        bundleItems.forEach(item => {
            if (selectedItems.includes(item.id)) {
                addToCart(item, 1);
            }
        });

        toast.success('Bundle added to cart! 🛍️');
    };

    return (
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 border-b border-gray-100">
                <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                    <span>🎁</span> Frequently Bought Together
                </h3>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">

                    {/* Main Product Image (Small) */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            {mainProduct.image ? (
                                <img src={mainProduct.image} alt={mainProduct.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                            )}
                        </div>
                    </div>

                    <div className="text-gray-300 text-3xl font-light">+</div>

                    {/* Bundle Item 1 Image */}
                    <div className={`relative group transition-opacity ${!selectedItems.includes(bundleItems[0].id) ? 'opacity-40 grayscale' : ''}`}>
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer" onClick={() => toggleItem(bundleItems[0].id)}>
                            <img src={bundleItems[0].image} alt={bundleItems[0].name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-gray-300 text-3xl font-light">+</div>

                    {/* Bundle Item 2 Image */}
                    <div className={`relative group transition-opacity ${!selectedItems.includes(bundleItems[1].id) ? 'opacity-40 grayscale' : ''}`}>
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer" onClick={() => toggleItem(bundleItems[1].id)}>
                            <img src={bundleItems[1].image} alt={bundleItems[1].name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>

                {/* Total and Add Button */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="text-gray-500 text-sm font-medium">Bundle Total:</span>
                        <div className="text-3xl font-black text-gray-900 flex items-baseline gap-2">
                            ₹{calculateTotal()}
                            <span className="text-sm font-bold text-teal-600">Save 15%</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddBundleToCart}
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-full font-bold hover:from-teal-600 hover:to-blue-600 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2"
                    >
                        Add {selectedItems.length} Items to Cart
                    </button>
                </div>

                {/* Checkboxes List */}
                <div className="mt-6 space-y-3">
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input type="checkbox" checked readOnly className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                        <span className="font-bold text-gray-900">This item:</span>
                        <span className="text-gray-700">{mainProduct.name}</span>
                        <span className="font-bold text-gray-900 ml-auto">₹{mainProduct.price}</span>
                    </label>

                    {bundleItems.map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                            />
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-bold text-gray-900 ml-auto">₹{item.price}</span>
                        </label>
                    ))}
                </div>

            </div>
        </div>
    );
}
