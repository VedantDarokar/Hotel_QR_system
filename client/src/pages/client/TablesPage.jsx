import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';
import { FaQrcode, FaPrint, FaTrash } from 'react-icons/fa';

const TablesPage = () => {
    const [restaurantId, setRestaurantId] = useState(null);
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    const fetchMyRestaurant = async () => {
        try {
            const res = await API.get('/restaurants/my-restaurants');
            if (res.data.length > 0) {
                setRestaurantId(res.data[0]._id);
                fetchTables(res.data[0]._id);
            }
        } catch (error) {
            console.error("No restaurant", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTables = async (id) => {
        try {
            const res = await API.get(`/tables/${id}`);
            setTables(res.data);
        } catch (error) {
            console.error("Error fetching tables", error);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tables', { restaurantId, tableNumber });
            toast.success("Table added");
            setTableNumber('');
            fetchTables(restaurantId);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add table");
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm("Delete this table? functionality will be lost for this QR code.")) return;
        try {
            await API.delete(`/tables/${id}`);
            toast.success("Table deleted");
            setTables(tables.filter(t => t._id !== id));
        } catch (error) {
            toast.error("Failed to delete table");
        }
    };

    const handlePrint = (qrCode, number) => {
        const win = window.open('', '', 'height=600,width=800');
        win.document.write('<html><head><title>Print QR</title></head><body style="text-align:center; padding-top: 50px;">');
        win.document.write(`<h1>Table ${number}</h1>`);
        win.document.write(`<img src="${qrCode}" style="width: 300px; height: 300px;" />`);
        win.document.write('<p>Scan to view menu</p>');
        win.document.write('</body></html>');
        win.document.close();
        win.print();
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
            <h1 className="text-2xl font-bold mb-6">Tables & QR Codes</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Add Table */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="font-bold mb-4">Add New Table</h2>
                        <form onSubmit={handleAddTable} className="flex gap-2">
                            <input
                                type="number"
                                value={tableNumber}
                                onChange={e => setTableNumber(e.target.value)}
                                placeholder="Table Number"
                                className="flex-1 border p-2 rounded-lg"
                                required
                            />
                            <button type="submit" className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg hover:bg-[#ff5252]">Add</button>
                        </form>
                    </div>
                </div>

                {/* Tables List */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <div key={table._id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center group relative">
                            <span className="font-bold text-lg mb-2">Table {table.tableNumber}</span>
                            <img src={table.qrCode} alt="QR" className="w-32 h-32 mb-2" />

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handlePrint(table.qrCode, table.tableNumber)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                    title="Print QR"
                                >
                                    <FaPrint />
                                </button>
                                <button
                                    onClick={() => handleDeleteTable(table._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Table"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tables.length === 0 && (
                        <p className="text-gray-400 col-span-full text-center py-10">No tables created yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TablesPage;
