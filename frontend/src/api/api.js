import axios from 'axios';

const isProduction = import.meta.env.PROD;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? '/api/v1' : 'http://127.0.0.1:5000/api/v1'),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
