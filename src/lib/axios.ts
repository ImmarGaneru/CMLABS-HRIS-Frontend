import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = "10|zXSC4Rka5Sz4baLuW6l5u5ysfGrxajr5XRdgQKp9daf4fe7a";
            // const token = localStorage.getItem("token") || '4|ZJrIgRl7tu7ewPOvExRjZmOnCbUDY4nxBPextfZA148d6b91';
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        console.log("Request sent:", config);
        return config;
    },
    (error: AxiosError) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else {
            console.error("Network error:", error.message);
        }
        return Promise.reject(error);
    }
)
export default api;