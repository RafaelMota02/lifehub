// Mood service for API interactions
import axios from 'axios';

// Use localhost for development, Railway for production
const API_URL = import.meta.env.PROD
  ? `https://lifehub-production.up.railway.app/api/moods`
  : `http://localhost:5000/api/moods`;

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get all mood entries for current user
export const getMoods = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching moods', error);
    throw error;
  }
};

// Create a new mood entry
export const createMood = async (moodData) => {
  try {
    const token = getAuthToken();
    // Map frontend field names to backend expectations
    const backendData = {
      user_id: moodData.user_id,
      mood_level: moodData.moodLevel,
      notes: moodData.notes
    };
    const response = await axios.post(API_URL, backendData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating mood entry', error);
    throw error;
  }
};

// Delete a mood entry
export const deleteMood = async (moodId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/${moodId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting mood entry', error);
    throw error;
  }
};
