import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../api/api';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
    const { cart, addToCart, removeFromCart, cartTotal, restaurantId, tableId, clearCart } = useCart();
    const navigate = useNavigate();
    const [isOrdering, setIsOrdering] = useState(false);

    // Derive simple tableId string if it's not set correctly, or just use what's in context
    // Context should have it from MenuPage.

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setIsOrdering(true);

        const orderData = {
            restaurantId,
            tableId,
            items: cart.map(item => ({
                menuItemId: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            total: cartTotal
        };

        try {
            const res = await placeOrder(orderData);
            // Success
            clearCart();
            navigate(`/order-status/${res.data._id}`);
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsOrdering(false);
        }
    };

    if (!restaurantId) {
        return <div className="p-10 text-center">Session lost. Please scan QR code again.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 sm:p-5 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaArrowLeft className="text-lg sm:text-xl" />
                </button>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Your Cart</h1>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                    <div className="text-center mt-20 text-gray-400">
                        <p className="text-base sm:text-lg">Your cart is empty</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 text-[#ff6b6b] font-bold text-base sm:text-lg hover:underline"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                        {cart.map(item => (
                            <div key={item._id} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm flex justify-between items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{item.name}</h3>
                                    <div className="text-[#ff6b6b] font-medium text-sm sm:text-base">₹{item.price * item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-lg px-2 py-1">
                                    <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded transition-colors">-</button>
                                    <span className="font-bold w-6 text-center text-base sm:text-lg">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-[#ff6b6b] hover:bg-red-50 rounded transition-colors">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bill Details */}
            {cart.length > 0 && (
                <div className="bg-white p-5 sm:p-6 md:p-8 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="space-y-2 sm:space-y-3 mb-6 max-w-3xl mx-auto">
                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                            <span>Item Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                            <span>Taxes (5%)</span>
                            <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base sm:text-lg md:text-xl border-t pt-2 mt-2">
                            <span>Grand Total</span>
                            <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isOrdering}
                        className="w-full max-w-3xl mx-auto bg-[#ff6b6b] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:bg-[#ff5252] hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                        {isOrdering ? 'Placing Order...' : 'Confirm Order'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
