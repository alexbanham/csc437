// src/api/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://abanham.csse.dev/',
});

// Add an interceptor to attach the Authorization header if a token exists.
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
