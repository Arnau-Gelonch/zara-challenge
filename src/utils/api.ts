import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers['x-api-key'] = import.meta.env.VITE_API_KEY;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
