// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',          // mantém só /api por causa do proxy
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicRoutes = ['/login', '/register'];
      const currentPath = window.location.pathname;

      if (!publicRoutes.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
