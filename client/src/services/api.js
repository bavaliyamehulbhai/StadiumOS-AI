import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // This allows sending cookies (JWT) with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response Interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to handle token expiry / unauthenticated state can be added here
      // e.g., redirect to login or trigger a global logout event
    }
    return Promise.reject(error);
  }
);

export default api;
