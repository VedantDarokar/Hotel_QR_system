import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import socket from '../../api/socket';
import { toast } from 'react-toastify';

const ClientOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        // First get restaurant ID for this client
        const fetchMyRestaurant = async () => {
            try {
                const res = await API.get('/restaurants/my-restaurants');
                if (res.data.length > 0) {
                    setRestaurantId(res.data[0]._id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("No restaurant found", error);
                setLoading(false);
            }
        }
        fetchMyRestaurant();
    }, []);

    useEffect(() => {
        if (!restaurantId) return;

        // Join Room
        socket.emit('join_restaurant', restaurantId);

        // Fetch initial orders
        const fetchOrders = async () => {
            try {
                const res = await API.get(`/orders/${restaurantId}`);
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Socket Listener for New Orders
        socket.on('new_order', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            toast.info(`New Order from Table ${newOrder.tableId?.tableNumber || '?'}`);
        });

        // Socket Listener for Status Updates (if updated from another device)
        // We could listen to specific order updates if we joined their rooms, 
        // but for the "Orders View", we might just want to trust our own actions or listen to a general event.
        // For simplicity, we just handle local optimistic updates or refetch. 
        // We could emit 'restaurant_order_update' if we wanted perfect sync across multiple admin devices.

        return () => {
            socket.off('new_order');
        };
    }, [restaurantId]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}`, { status: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8">Loading Restaurant Data...</div>;
    if (!restaurantId) return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-700">No Restaurant Assigned</h2>
            <p className="text-gray-500">Please contact the administrator to assign a restaurant to your account.</p>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Live Orders</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map(order => (
                    <div key={order._id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${order.status === 'pending' ? 'border-yellow-400' :
                        order.status === 'preparing' ? 'border-blue-400' :
                            order.status === 'ready' ? 'border-green-400' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg">Table {order.tableId?.tableNumber || '?'}</h3>
                                <div className="text-xs text-gray-500">#{order._id.slice(-4)} • {new Date(order.createdAt).toLocaleTimeString()}</div>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-xs rounded uppercase font-bold">{order.status}</span>
                        </div>

                        <div className="border-t border-b py-2 my-2 text-sm space-y-1">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{item.quantity} x {item.menuItemId?.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="font-bold">Total: ₹{order.total}</div>
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button onClick={() => updateStatus(order._id, 'preparing')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">Accept</button>
                                )}
                                {order.status === 'preparing' && (
                                    <button onClick={() => updateStatus(order._id, 'ready')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">Ready</button>
                                )}
                                {order.status === 'ready' && (
                                    <button onClick={() => updateStatus(order._id, 'completed')} className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors">Complete</button>
                                )}
                                {order.status === 'completed' && (
                                    <button onClick={() => window.open(`http://localhost:5000/api/orders/${order._id}/bill-pdf`, '_blank')} className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors">Bill</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-400">No active orders</div>
                )}
            </div>
        </div>
    );
};

export default ClientOrdersPage;
