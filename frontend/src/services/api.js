import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // You can attach tokens here later
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized)
    return Promise.reject(error);
  }
);

export const authAPI = {
  registerUser: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  verifyOtp: async (userId, otp) => {
    const response = await api.post('/api/auth/verify-otp', { userId, otp });
    return response.data;
  },
  resendOtp: async (userId) => {
    const response = await api.post('/api/auth/resend-otp', { userId });
    return response.data;
  }
};

export default api;
