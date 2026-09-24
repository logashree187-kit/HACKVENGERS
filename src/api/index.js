import axios from 'axios';

// IMPORTANT: Base URL for your backend teammate.
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// --- MOCK DATA ---
const mockItems = [
  { _id: '1', title: 'Blue Water Bottle', type: 'Lost', category: 'Accessories', description: 'Milton bottle', location: 'Library', date: '2026-09-24', color: 'Blue', status: 'Pending' },
  { _id: '2', title: 'Apple Airpods', type: 'Found', category: 'Electronics', description: 'Airpods Pro in white case', location: 'Cafeteria', date: '2026-09-23', color: 'White', status: 'Available' }
];

const mockStats = { total: 2, lost: 1, found: 1, pending: 1, returned: 0 };

// --- API FUNCTIONS ---
export const getItems = async () => {
  // TODO: Uncomment when backend is ready
  // const { data } = await API.get('/items');
  // return data;
  return mockItems; // Mock
};

export const getItemById = async (id) => {
  // const { data } = await API.get(`/items/${id}`);
  // return data;
  return mockItems.find(i => i._id === id);
};

export const createItem = async (itemData) => {
  // const { data } = await API.post('/items', itemData);
  // return data;
  console.log("Mock Item Created:", itemData);
  return { success: true };
};

export const getMatches = async (itemId) => {
  // const { data } = await API.get(`/matches/${itemId}`);
  // return data;
  return [{ _id: '3', title: 'White Earbuds', matchPercentage: 85 }];
};

export const createClaim = async (claimData) => {
  // const { data } = await API.post('/claims', claimData);
  // return data;
  console.log("Mock Claim Created:", claimData);
  return { success: true };
};

// 👇 THIS IS THE FUNCTION IT WAS LOOKING FOR! 👇
export const getDashboardStats = async () => {
  // const { data } = await API.get('/dashboard');
  // return data;
  return mockStats;
};