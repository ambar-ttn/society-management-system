import axios from 'axios';

// 1. API instance bana with baseURL
const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

//config = object of request
//request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response handler(response interceptor)
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url); // debugging
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // 401 (unauthorized) - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default API;






