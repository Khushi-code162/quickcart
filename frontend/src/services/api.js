import axios from 'axios';

//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://quickkart-ynra.onrender.com/api'


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login or register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// -------- AUTH APIs --------
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// -------- PRODUCT APIs --------
export const getProductsApi = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// -------- CART APIs --------
export const getCartApi = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCartApi = async ({ productId, quantity = 1 }) => {
  const response = await api.post('/cart/add', { productId, quantity });
  return response.data;
};

export const removeFromCartApi = async (productId) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

// -------- ORDER APIs --------
export const placeOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrdersApi = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderByIdApi = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatusApi = async (id, status, note = '') => {
  const response = await api.patch(`/orders/${id}/status`, { status, note });
  return response.data;
};

export default api;
