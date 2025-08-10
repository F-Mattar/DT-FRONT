// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // URL do backend FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;