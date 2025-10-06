// Finance service for API interactions
import axios from 'axios';

// Ensure production builds have API URL set
if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is required in production");
}

const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/finances`
  : '/api/finances';

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
