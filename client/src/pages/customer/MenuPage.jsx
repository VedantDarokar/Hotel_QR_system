import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantMenu, fetchCategories } from '../../api/api';
import MenuItem from '../../components/MenuItem';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUtensils } from 'react-icons/fa';

const MenuPage = () => {
    const { restaurantId, tableId } = useParams();
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const { setRestaurantId, setTableId, cartCount, cartTotal } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        setRestaurantId(restaurantId);
        setTableId(tableId);

        const loadData = async () => {
            try {
                const [catsRes, itemsRes] = await Promise.all([
                    fetchCategories(restaurantId),
                    fetchRestaurantMenu(restaurantId)
                ]);
                setCategories(catsRes.data);
                setMenuItems(itemsRes.data);
            } catch (error) {
                console.error("Failed to load menu data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [restaurantId, tableId, setRestaurantId, setTableId]);

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.categoryId === activeCategory);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#ff6b6b]">Loading Menu...</div>;

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-800">
                        <FaUtensils className="text-[#ff6b6b] text-base sm:text-lg md:text-xl" />
                        <span>Menu</span>
                    </h1>
                    <div className="text-xs sm:text-sm text-gray-500">Table: {tableId?.slice(-4)}</div>
                </div>

                {/* Categories - Horizontal Scroll */}
                <div className="flex overflow-x-auto px-4 sm:px-6 pb-3 gap-2 hide-scrollbar">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all'
                            ? 'bg-[#ff6b6b] text-white'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        All Items
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveCategory(cat._id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat._id
                                ? 'bg-[#ff6b6b] text-white'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* Menu Items */}
            <main className="container mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    <AnimatePresence mode='wait'>
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <MenuItem key={item._id} item={item} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 mt-10">No items available in this category.</div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Floating Cart Button */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:max-w-md z-50"
                    >
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full bg-[#2d3436] text-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-between"
                        >
                            <div className="flex flex-col items-start px-2">
                                <span className="text-xs text-gray-400">{cartCount} ITEMS</span>
                                <span className="font-bold text-lg sm:text-xl">₹{cartTotal}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-base sm:text-lg px-2">
                                View Cart <FaShoppingCart />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuPage;
