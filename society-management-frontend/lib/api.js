import axios from 'axios';

// 1. API instance bana with baseURL
const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',  // tera backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Har request mein token bhej (agar hai to)  // config = request ka packet 

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

// 3. Response handle kar(response interceptor)
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url); // debug
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


/*
Axios config object contains reques
information like URL, 
method, headers, baseURL, and data.
 It represents the configuration of the HTTP request before it is sent.
*/


/*

c
Fetch kya hai?

Fetch browser ka built-in function hai.

Example:

fetch('/api/users')
Axios kya hai?

Axios external library hai jo HTTP requests easy bana deti hai.

Install karna padta:
manual token attach error handling in fetch but axios me sab krdega vo
npm install axios

no josn parsing required Fetch
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));
Axios
axios.get('/api/users')
  .then(res => console.log(res.data));

Axios me .json() nahi likhna padta.



To res me sirf data nahi aata — ek poora response object aata hai.

Axios Response Structure:
{
  data: ...,        // Backend se actual data
  status: 200,      // Status code
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
}

Axios automatically JSON format me data bhejta hai.

*/






