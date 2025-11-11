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

axiosInstance.interceptors.response.use(
  response => {
    const convertHttpToHttps = <T>(obj: T): T => {
      if (typeof obj === 'string' && obj.startsWith('http://')) {
        return obj.replace('http://', 'https://') as T;
      }
      if (Array.isArray(obj)) {
        return obj.map(convertHttpToHttps) as T;
      }
      if (obj && typeof obj === 'object') {
        const newObj: Record<string, unknown> = {};
        for (const key in obj) {
          newObj[key] = convertHttpToHttps(obj[key]);
        }
        return newObj as T;
      }
      return obj;
    };

    if (response.data) {
      response.data = convertHttpToHttps(response.data);
    }

    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
