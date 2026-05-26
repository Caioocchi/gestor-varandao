import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gestor-varandao-api.onrender.com',
});

console.log('API URL:', import.meta.env.VITE_URL_API);
console.log('BASE URL:', api.defaults.baseURL);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
