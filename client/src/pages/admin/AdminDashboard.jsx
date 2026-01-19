import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [clients, setClients] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showRestaurantModal, setShowRestaurantModal] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);

    // Forms
    const [clientForm, setClientForm] = useState({ name: '', username: '', password: '' });
    const [restaurantForm, setRestaurantForm] = useState({ name: '', address: '' });

    useEffect(() => {
        fetchClients();
        fetchRestaurants();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await API.get('/admin/clients');
            setClients(res.data);
        } catch (error) {
            console.error("Error fetching clients", error);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const res = await API.get('/admin/restaurants'); // Needs backend route modification to allow admin to get all
            // Wait, I implemented getAllRestaurants in restaurantController for Admin?
            // Yes: router.get('/', admin, getAllRestaurants); at /api/restaurants
            // So: API.get('/restaurants')
            const resRest = await API.get('/restaurants');
            setRestaurants(resRest.data);
        } catch (error) {
            console.error("Error fetching restaurants", error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await API.put(`/admin/clients/${id}/status`, { isActive: !currentStatus });
            setClients(clients.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/create-client', clientForm);
            toast.success("Client created successfully");
            setShowClientModal(false);
            setClientForm({ name: '', username: '', password: '' });
            fetchClients();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create client");
        }
    };

    const openRestaurantModal = (clientId) => {
        setSelectedClientId(clientId);
        setShowRestaurantModal(true);
    }

    const handleCreateRestaurant = async (e) => {
        e.preventDefault();
        try {
            await API.post('/restaurants', { ...restaurantForm, ownerId: selectedClientId });
            toast.success("Restaurant assigned successfully");
            setShowRestaurantModal(false);
            setRestaurantForm({ name: '', address: '' });
            fetchRestaurants();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign restaurant");
        }
    }

    const getClientRestaurant = (clientId) => {
        return restaurants.filter(r => r.ownerId?._id === clientId || r.ownerId === clientId);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Client Management</h1>
                <button
                    onClick={() => setShowClientModal(true)}
                    className="bg-[#2d3436] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
                >
                    + Add Client
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Client Name</th>
                            <th className="p-4 font-semibold text-gray-600">Username</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Restaurant</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => {
                            const clientRestaurants = getClientRestaurant(client._id);
                            return (
                                <tr key={client._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{client.name}</td>
                                    <td className="p-4">{client.username}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${client.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {client.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {clientRestaurants.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {clientRestaurants.map(r => (
                                                    <span key={r._id} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">
                                                        {r.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openRestaurantModal(client._id)}
                                                className="text-xs bg-gray-800 text-white px-2 py-1 rounded"
                                            >
                                                + Assign Restaurant
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleStatus(client._id, client.isActive)}
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            Toggle Status
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Client Modal */}
            {showClientModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Client</h2>
                        <form onSubmit={handleCreateClient} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Business Name</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={clientForm.name}
                                    onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Username</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={clientForm.username}
                                    onChange={e => setClientForm({ ...clientForm, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full border p-2 rounded-lg"
                                    value={clientForm.password}
                                    onChange={e => setClientForm({ ...clientForm, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowClientModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252]"
                                >
                                    Create Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Restaurant Modal */}
            {showRestaurantModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Assign Restaurant</h2>
                        <form onSubmit={handleCreateRestaurant} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Restaurant Name</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={restaurantForm.name}
                                    onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={restaurantForm.address}
                                    onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRestaurantModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252]"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
