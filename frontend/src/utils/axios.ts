import axios from 'axios';

const customAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND || 'http://localhost:5050',
    withCredentials:true
  });

export default customAxios;