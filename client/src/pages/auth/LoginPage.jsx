import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));

            toast.success(`Welcome back, ${res.data.name}!`);

            if (res.data.role === 'admin') {
                navigate('/dashboard/admin');
            } else if (res.data.role === 'client') {
                navigate('/dashboard/client/orders');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Login</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">Access your restaurant dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#ff6b6b] text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-[#ff5252] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
