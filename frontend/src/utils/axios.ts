import axios from 'axios';

const customAxios = axios.create({
    baseURL: process.env.VITE_BACKEND || 'http://localhost:5050',
    withCredentials:true
  });

export default customAxios;