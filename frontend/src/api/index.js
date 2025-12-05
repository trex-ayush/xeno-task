import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

export const syncAPI = {
    trigger: () => api.post('/sync/trigger'),
    getLogs: () => api.get('/sync/logs'),
};

export const analyticsAPI = {
    getOverview: () => api.get('/analytics/overview'),
    getOrdersByDate: (params) => api.get('/analytics/orders', { params }),
    getTopCustomers: (limit = 5) => api.get('/analytics/top-customers', { params: { limit } }),
    getRevenueTrend: (period = 'daily') => api.get('/analytics/revenue-trend', { params: { period } }),
    getTopProducts: (limit = 5) => api.get('/analytics/top-products', { params: { limit } }),
    getOrderStatus: () => api.get('/analytics/order-status'),
};

export const tenantAPI = {
    getStatus: () => api.get('/tenants/status'),
};

export default api;