import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItems = async (params = {}) => {
  try {
    const response = await API.get('/items', { params });
    // Handles { success: true, items: [...] } or { success: true, data: [...] } or array
    return response.data?.items || response.data?.data || response.data || [];
  } catch (error) {
    console.error('API getItems error:', error.response?.data || error.message);
    throw error;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await API.get(`/items/${id}`);
    // Handles { success: true, item: {...} } or { success: true, data: {...} } or direct object
    return response.data?.item || response.data?.data || response.data;
  } catch (error) {
    console.error(`API getItemById (${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const createItem = async (data) => {
  try {
    const response = await API.post('/items', data);
    // Handles { success: true, item: {...} } or { success: true, data: {...} } or direct object
    return response.data?.item || response.data?.data || response.data;
  } catch (error) {
    console.error('API createItem error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateItem = async (id, data) => {
  try {
    const response = await API.put(`/items/${id}`, data);
    return response.data?.item || response.data?.data || response.data;
  } catch (error) {
    console.error(`API updateItem (${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const getClaims = async () => {
  try {
    const response = await API.get('/claims');
    return response.data?.claims || response.data?.data || response.data || [];
  } catch (error) {
    console.error('API getClaims error:', error.response?.data || error.message);
    throw error;
  }
};

export const createClaim = async (data) => {
  try {
    const response = await API.post('/claims', data);
    return response.data?.claim || response.data?.data || response.data;
  } catch (error) {
    console.error('API createClaim error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateClaim = async (id, data) => {
  try {
    const response = await API.put(`/claims/${id}`, data);
    return response.data?.claim || response.data?.data || response.data;
  } catch (error) {
    console.error(`API updateClaim (${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const getMatches = async (itemId) => {
  try {
    const response = await API.get(`/matches/${itemId}`);
    return response.data?.matches || response.data?.data || response.data || [];
  } catch (error) {
    console.error(`API getMatches (${itemId}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await API.get('/dashboard');
    return response.data?.data || response.data?.stats || response.data;
  } catch (error) {
    console.error('API getDashboardStats error:', error.response?.data || error.message);
    throw error;
  }
};

export default API;