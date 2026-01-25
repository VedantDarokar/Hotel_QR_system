import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../../api/api';
import socket from '../../api/socket';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaFire, FaTimesCircle } from 'react-icons/fa';

const OrderStatusPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrder = async () => {
            try {
                const res = await fetchOrder(orderId);
                setOrder(res.data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };

        getOrder();

        // Socket logic
        socket.emit('join_order', orderId);

        socket.on('order_status', (status) => {
            setOrder(prev => ({ ...prev, status }));
        });

        return () => {
            socket.off('order_status');
        };

    }, [orderId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FaClock className="text-3xl sm:text-4xl md:text-5xl text-yellow-500" />;
            case 'preparing': return <FaFire className="text-3xl sm:text-4xl md:text-5xl text-orange-500" />;
            case 'ready': return <FaCheckCircle className="text-3xl sm:text-4xl md:text-5xl text-green-500" />;
            case 'completed': return <FaCheckCircle className="text-3xl sm:text-4xl md:text-5xl text-blue-500" />;
            case 'cancelled': return <FaTimesCircle className="text-3xl sm:text-4xl md:text-5xl text-red-500" />;
            default: return <FaClock className="text-3xl sm:text-4xl md:text-5xl text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return "Order Received";
            case 'preparing': return "In Kitchen";
            case 'ready': return "Ready to Serve";
            case 'completed': return "Completed";
            case 'cancelled': return "Cancelled";
            default: return status;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center"
            >
                <div className="mb-6 flex justify-center">
                    {getStatusIcon(order.status)}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{getStatusText(order.status)}</h1>
                <p className="text-sm sm:text-base text-gray-500 mb-6">Order #{orderId.slice(-6)}</p>

                <div className="border-t pt-6 text-left">
                    <h3 className="font-bold text-base sm:text-lg mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm sm:text-base">
                                <span>{item.quantity} x {item.menuItemId?.name || 'Item'}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-base sm:text-lg md:text-xl">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>

                {/* Bill Actions */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_URL}/orders/${order._id}/bill-pdf`, '_blank')}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base font-medium hover:shadow-md"
                    >
                        Download / Print Bill
                    </button>
                </div>
            </motion.div>

            <p className="mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm text-center px-4">Please keep this screen open for updates.</p>
        </div>
    );
};

export default OrderStatusPage;
