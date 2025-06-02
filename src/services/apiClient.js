import axios from 'axios';

const apiClient = axios.create({
  // localhost:3001 es el puerto donde corre el backend real
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
  r => r,
  e => {
    console.error('API error →', e.response?.status ?? 'sin-status', e.message);
    return Promise.reject(e);
  }
);

export default apiClient;