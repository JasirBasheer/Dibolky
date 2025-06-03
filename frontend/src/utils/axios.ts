import axios from 'axios';

const customAxios = axios.create({
    baseURL: 'http://localhost:5050',
    withCredentials:true
  });

export default customAxios;