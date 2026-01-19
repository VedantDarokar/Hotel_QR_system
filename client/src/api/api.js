import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add interceptor for token if needed, but for customer flow it's not needed basically.
// For admin/client(owner), we will need detailed interceptors later.
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

// Menu & Restaurant Public APIs
export const fetchRestaurantMenu = (restaurantId) => API.get(`/menu-items/${restaurantId}`);
export const fetchCategories = (restaurantId) => API.get(`/categories/${restaurantId}`);
export const placeOrder = (orderData) => API.post('/orders', orderData);
export const fetchOrder = (orderId) => API.get(`/orders/${orderId}/bill`);

// Admin/Client APIs (Placeholders for now, will implement as we build those dashboards)
export const login = (formData) => API.post('/auth/login', formData);

export default API;
