import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001', // Use environment variable if available
  //baseURL: 'http://http://13.236.135.130/:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
