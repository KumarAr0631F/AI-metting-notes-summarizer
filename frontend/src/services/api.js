// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://ai-metting-notes-summarizer-backend.onrender.com/api/summary';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getSummary = async (filename) => {
  // If you have a separate summary endpoint, use it here
  const res = await axios.post(`${BASE_URL}/summarize`, { filename });
  return res.data;
};
