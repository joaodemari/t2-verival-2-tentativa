import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
});

http.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("/")) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
