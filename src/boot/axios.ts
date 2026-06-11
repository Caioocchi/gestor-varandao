import { boot } from 'quasar/wrappers';
import axios from 'axios';

const urlAPI = 'https://gestor-varandao-api-production-01ef.up.railway.app';
// const urlAPI = 'http://localhost:3000';

const api = axios.create({
  baseURL: urlAPI,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  },
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
