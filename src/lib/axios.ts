import axios from 'axios';

const token = "25|6khdGzDHUFUxe32MUsp3nZDpO1nIg5GFZ86PcPu70353be70";
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
});
export default api;