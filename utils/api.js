import axios from 'axios';

// Buat instance axios
const api = axios.create({
 baseURL: "http://localhost:8000/api",
   headers: {
Authorization: `Bearer 1|gRTmH7CvpDe3ZMaFcEvMIsvFzCssocpbQJv2yusT70f25fbf `,
  'Content-Type': 'application/json',
  withCredentials: true,
},
  
});

// // Tambahkan interceptor untuk menempelkan token ke setiap request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // atau hardcode sementara buat testing
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
