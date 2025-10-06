// Task service for API interactions
import axios from 'axios';

// Use Railway API for both development and production
const API_URL = `https://lifehub-production.up.railway.app/api/tasks`;

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get all tasks for current user
export const getTasks = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting task', error);
    throw error;
  }
};
