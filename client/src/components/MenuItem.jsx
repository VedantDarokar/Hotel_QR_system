import React from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const MenuItem = ({ item }) => {
    const { addToCart, cart, removeFromCart } = useCart();

    // Find if item is in cart to show quantity
    const cartItem = cart.find(c => c._id === item._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const imageUrl = item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : 'https://placehold.co/150';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 flex gap-3 sm:gap-4 border border-gray-100"
        >
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{item.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">{item.description || 'Delicious food item'}</p>
                <div className="mt-2 text-[#ff6b6b] font-bold text-base sm:text-lg">₹{item.price}</div>
            </div>
            <div className="flex flex-col items-center justify-between min-w-[90px] sm:min-w-[100px]">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-2"
                />

                {quantity === 0 ? (
                    <button
                        onClick={() => addToCart(item)}
                        className="w-full py-1.5 sm:py-2 px-3 bg-[#ff6b6b] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#ff5252] active:scale-95 transition-all shadow-sm"
                    >
                        ADD
                    </button>
                ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-[#ff6b6b] text-white rounded-lg px-1.5 sm:px-2 py-1">
                        <button onClick={() => removeFromCart(item._id)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold hover:bg-white/20 rounded transition-colors">-</button>
                        <span className="font-bold text-sm sm:text-base min-w-[20px] text-center">{quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold hover:bg-white/20 rounded transition-colors">+</button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MenuItem;
