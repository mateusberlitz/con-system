import axios from 'axios'
import { getToken } from './auth';
import { getApiUrl } from './tenantApi';

console.log(getApiUrl());

export const api = axios.create({
    baseURL: getApiUrl()
});

api.interceptors.request.use(async config => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    //config.headers.accept

    return config;
});