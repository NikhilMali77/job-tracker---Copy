// src/api.js
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  // The proxy in vite.config.js will handle redirecting this
  baseURL: import.meta.env.VITE_API_URL,
});

/*
  This is a 'request interceptor'.
  It runs BEFORE every single request is sent.
  It checks if we have a token in localStorage, and if so,
  it adds it to the 'Authorization' header.
  This is how our 'protect' middleware in the backend works.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;