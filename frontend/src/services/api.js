import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('Using API URL:', API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Table endpoints
const getTables = () => api.get('/tables');
const getTable = (id) => api.get(`/tables/${id}`);
const createTable = (tableData) => api.post('/tables', tableData);
const updateTable = (id, tableData) => api.put(`/tables/${id}`, tableData);
const deleteTable = (id) => api.delete(`/tables/${id}`);

// Order endpoints
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
export const updateOrder = (id, orderData) => api.put(`/orders/${id}`, orderData);
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);

// Update order status
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });
// Dashboard endpoints
export const getDashboardMetrics = () => api.get('/dashboard/metrics');
export const getRevenueChartData = (period) => api.get(`/dashboard/revenue-chart?period=${period}`);
export const getOrderSummary = (period) => api.get(`/dashboard/order-summary?period=${period}`);
export const getChefOrders = () => api.get('/dashboard/chef-orders');
export const assignOrderToChef = (orderId) => api.post('/dashboard/assign-chef', { orderId });

// menu item endpoints
export const getMenuItems = (category) => api.get(`/menu-items?category=${category}`);
export const createMenuItem = (itemData) => api.post('/menu-items', itemData);
export const updateMenuItem = (id, itemData) => api.put(`/menu-items/${id}`, itemData);
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`);


export default api;
export {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
};
