// Finance service for API interactions
import axios from 'axios';

// Use localhost for development, Railway for production
const API_URL = import.meta.env.PROD
  ? `https://lifehub-production.up.railway.app/api/finances`
  : `http://localhost:5000/api/finances`;

// DEBUG: Log environment and URL
console.log('🔧 Finance Service - URL:', API_URL);

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get all finances for current user
export const getFinances = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching finances', error);
    throw error;
  }
};

// Create a new finance entry
export const createFinance = async (financeData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, financeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating finance entry', error);
    throw error;
  }
};

// Update a finance entry
export const updateFinance = async (financeId, financeData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/${financeId}`, financeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating finance entry', error);
    throw error;
  }
};

// Delete a finance entry
export const deleteFinance = async (financeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/${financeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting finance entry', error);
    throw error;
  }
};
