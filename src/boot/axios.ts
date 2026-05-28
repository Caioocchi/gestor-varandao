import { boot } from 'quasar/wrappers';
import axios from 'axios';

const urlAPI = 'https://gestor-varandao-api.onrender.com';
// const urlAPI = 'http://localhost:3000';

const api = axios.create({
  baseURL: urlAPI,
});

console.log('API URL:', import.meta.env.VITE_URL_API);
console.log('API URL PROD:', import.meta.env.VITE_URL_API_PROD);
console.log('BASE URL:', api.defaults.baseURL);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
