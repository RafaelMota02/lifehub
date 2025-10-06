// Note service for API interactions
import axios from 'axios';

// Use Railway API for both development and production
const API_URL = `https://lifehub-production.up.railway.app/api/notes`;

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get all notes for current user
export const getNotes = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (noteData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, noteData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating note', error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, noteData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/${noteId}`, noteData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting note', error);
    throw error;
  }
};
