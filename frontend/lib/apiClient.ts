import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_URL || 'http://localhost:6000';

const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,           
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
