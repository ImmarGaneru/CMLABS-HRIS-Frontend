// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // base URL backend kamu
  // tambahkan header Authorization jika perlu
  
});

export default api;
