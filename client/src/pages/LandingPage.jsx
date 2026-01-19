import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaQrcode, FaUtensils, FaChartLine, FaMobileAlt, FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FaQrcode className="text-4xl" />,
            title: "QR Code Menus",
            description: "Contactless digital menus accessible via QR codes on each table"
        },
        {
            icon: <FaMobileAlt className="text-4xl" />,
            title: "Mobile Ordering",
            description: "Customers can browse menu and place orders directly from their phones"
        },
        {
            icon: <FaChartLine className="text-4xl" />,
            title: "Real-time Updates",
            description: "Live order tracking and kitchen management with instant notifications"
        },
        {
            icon: <FaUtensils className="text-4xl" />,
            title: "Menu Management",
            description: "Easy-to-use dashboard for managing menu items, categories, and pricing"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-2xl font-bold"
                        >
                            <FaUtensils className="text-[#ff6b6b]" />
                            <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] bg-clip-text text-transparent">
                                RestroQR
                            </span>
                        </motion.div>
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/login')}
                            className="bg-[#ff6b6b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#ff5252] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Login
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Transform Your Restaurant with
                            <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] bg-clip-text text-transparent"> Digital QR Menus</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Streamline your restaurant operations with contactless ordering, real-time kitchen updates, and seamless customer experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="group bg-[#ff6b6b] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ff5252] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Get Started
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                className="bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-gray-200"
                            >
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-lg flex items-center justify-center">
                                            <FaQrcode className="text-white text-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#4ecdc4] to-[#44a3a0] rounded-lg flex items-center justify-center">
                                            <FaUtensils className="text-white text-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                            <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#f7b731] to-[#f79f1f] rounded-lg flex items-center justify-center">
                                            <FaChartLine className="text-white text-2xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                                            <div className="h-2 bg-gray-100 rounded w-2/5"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Powerful Features for Modern Restaurants
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to digitize your restaurant and enhance customer experience
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="text-[#ff6b6b] mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Restaurant?
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join hundreds of restaurants already using RestroQR to streamline operations and delight customers
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-[#ff6b6b] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            Start Free Trial
                            <FaArrowRight />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 text-2xl font-bold mb-4 md:mb-0">
                            <FaUtensils className="text-[#ff6b6b]" />
                            <span>RestroQR</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2026 RestroQR. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
