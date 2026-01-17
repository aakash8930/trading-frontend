// frontend/src/services/api.ts

import axios from 'axios';

// 1. Determine the Backend URL automatically
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// REPLACE 'your-backend-name' below after you deploy to Render in the next step
export const API_BASE_URL = isLocal 
  ? 'http://localhost:5001' 
  : 'https://trading-backend-e3vd.onrender.com'; 

// 2. Create an Axios instance (Optional, but makes fetching easier)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;