import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle, FaUtensils, FaQrcode, FaClipboardList } from 'react-icons/fa';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 lg:w-72 bg-[#2d3436] text-white hidden md:flex flex-col">
                <div className="p-5 lg:p-6 text-xl lg:text-2xl font-bold text-[#ff6b6b] flex items-center gap-2">
                    <FaUtensils />
                    <span>RestroQR</span>
                </div>

                <nav className="flex-1 px-3 lg:px-4 space-y-2 mt-4">
                    {user.role === 'admin' ? (
                        <>
                            <Link to="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm lg:text-base">
                                <FaUserCircle className="text-lg lg:text-xl" /> Clients
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Client Links */}
                            <Link to="/dashboard/client/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm lg:text-base">
                                <FaClipboardList className="text-lg lg:text-xl" /> Orders
                            </Link>
                            <Link to="/dashboard/client/menu" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm lg:text-base">
                                <FaUtensils className="text-lg lg:text-xl" /> Menu Management
                            </Link>
                            <Link to="/dashboard/client/tables" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm lg:text-base">
                                <FaQrcode className="text-lg lg:text-xl" /> Tables & QR
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-sm lg:text-base">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm lg:text-base"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around p-3 z-50">
                {user.role === 'admin' ? (
                    <Link to="/dashboard/admin" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#ff6b6b] transition-colors">
                        <FaUserCircle className="text-xl sm:text-2xl" />
                        <span className="text-xs">Clients</span>
                    </Link>
                ) : (
                    <>
                        <Link to="/dashboard/client/orders" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#ff6b6b] transition-colors">
                            <FaClipboardList className="text-xl sm:text-2xl" />
                            <span className="text-xs">Orders</span>
                        </Link>
                        <Link to="/dashboard/client/menu" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#ff6b6b] transition-colors">
                            <FaUtensils className="text-xl sm:text-2xl" />
                            <span className="text-xs">Menu</span>
                        </Link>
                        <Link to="/dashboard/client/tables" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#ff6b6b] transition-colors">
                            <FaQrcode className="text-xl sm:text-2xl" />
                            <span className="text-xs">Tables</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
                <header className="bg-white shadow-sm p-4 sm:p-5 flex md:hidden justify-between items-center">
                    <span className="font-bold text-base sm:text-lg">RestroQR</span>
                    <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaSignOutAlt className="text-lg sm:text-xl" />
                    </button>
                </header>
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
