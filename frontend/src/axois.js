import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// token automatically attach karega har request mein (agar login ho chuka hai)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;