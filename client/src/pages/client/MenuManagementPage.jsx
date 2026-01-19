import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaImage } from 'react-icons/fa';

const MenuManagementPage = () => {
    const [restaurantId, setRestaurantId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', categoryId: '', image: null });
    const [newCategory, setNewCategory] = useState('');
    const [activeTab, setActiveTab] = useState('items'); // items or categories
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    const fetchMyRestaurant = async () => {
        try {
            const res = await API.get('/restaurants/my-restaurants');
            if (res.data.length > 0) {
                setRestaurantId(res.data[0]._id);
                fetchData(res.data[0]._id);
            } else {
                // Handle no restaurant case
                setRestaurantId(null);
            }
        } catch (error) {
            console.error("No restaurant found", error);
        }
    };

    const fetchData = async (id) => {
        try {
            const [catsRes, itemsRes] = await Promise.all([
                API.get(`/categories/${id}`),
                API.get(`/menu-items/${id}`)
            ]);
            setCategories(catsRes.data);
            setMenuItems(itemsRes.data);
            if (catsRes.data.length > 0) {
                setNewItem(prev => ({ ...prev, categoryId: catsRes.data[0]._id }));
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await API.post('/categories', { name: newCategory, restaurantId });
            toast.success("Category added");
            setNewCategory('');
            fetchData(restaurantId);
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('description', newItem.description);
        formData.append('categoryId', newItem.categoryId);
        formData.append('restaurantId', restaurantId);
        if (newItem.image) {
            formData.append('image', newItem.image);
        }

        try {
            await API.post('/menu-items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Browser sets boundary automatically usually, but axios helps
            });
            toast.success("Item added");
            setNewItem({ name: '', price: '', description: '', categoryId: categories[0]?._id || '', image: null });
            fetchData(restaurantId);
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await API.delete(`/menu-items/${id}`);
            toast.success("Item deleted");
            setMenuItems(menuItems.filter(i => i._id !== id));
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    if (!restaurantId) return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-700">No Restaurant Assigned</h2>
            <p className="text-gray-500">Please contact the administrator to assign a restaurant to your account.</p>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

            <div className="flex gap-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`px-4 py-2 border-b-2 ${activeTab === 'items' ? 'border-[#ff6b6b] text-[#ff6b6b] font-bold' : 'border-transparent text-gray-500'}`}
                >
                    Menu Items
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 border-b-2 ${activeTab === 'categories' ? 'border-[#ff6b6b] text-[#ff6b6b] font-bold' : 'border-transparent text-gray-500'}`}
                >
                    Categories
                </button>
            </div>

            {activeTab === 'categories' && (
                <div className="max-w-md">
                    <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                        <input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New Category Name"
                            className="flex-1 border p-2 rounded-lg"
                            required
                        />
                        <button type="submit" className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg">Add</button>
                    </form>
                    <ul className="bg-white rounded-xl shadow-sm divide-y">
                        {categories.map(cat => (
                            <li key={cat._id} className="p-4 flex justify-between">
                                <span>{cat.name}</span>
                                {/* Delete category not implemented yet to avoid orphaned items complexity for this MVP */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'items' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Add Item Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                        <h2 className="font-bold mb-4">Add New Item</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <input
                                placeholder="Item Name"
                                className="w-full border p-2 rounded-lg"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="w-1/2 border p-2 rounded-lg"
                                    value={newItem.price}
                                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-1/2 border p-2 rounded-lg"
                                    value={newItem.categoryId}
                                    onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                placeholder="Description"
                                className="w-full border p-2 rounded-lg"
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Item Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewItem({ ...newItem, image: e.target.files[0] })}
                                    className="w-full text-sm"
                                />
                            </div>
                            <button type="submit" className="w-full bg-[#ff6b6b] text-white py-2 rounded-lg hover:bg-[#ff5252]">Add Item</button>
                        </form>
                    </div>

                    {/* Items List */}
                    <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                        {menuItems.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm flex gap-3 relative group">
                                <img
                                    src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : 'https://placehold.co/100'}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                />
                                <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p className="text-[#ff6b6b] font-medium">₹{item.price}</p>
                                    <p className="text-xs text-gray-400 mt-1">{categories.find(c => c._id === item.categoryId)?.name}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteItem(item._id)}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagementPage;
