import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'HTTP';
    const url = error.config?.url || 'unknown-url';
    const status = error.response?.status || 'sin respuesta';
    const detail = error.response?.data?.detail || error.message;

    console.error(`[API] ${method} ${url} fallo (${status}):`, detail);
    return Promise.reject(error);
  },
);

export default api;
