import { boot } from 'quasar/wrappers';
import axios from 'axios';

const urlAPIProd = 'https://gestor-varandao-api.onrender.com';
// const urlAPIdesenv = 'http://localhost:3000';

const api = axios.create({
  baseURL: urlAPIProd,
});

console.log('API URL:', import.meta.env.VITE_URL_API);
console.log('API URL PROD:', import.meta.env.VITE_URL_API_PROD);
console.log('BASE URL:', api.defaults.baseURL);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
