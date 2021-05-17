import axios from 'axios'
import { getToken } from './auth';

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_LOCAL_URL
});

api.interceptors.request.use(async config => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});