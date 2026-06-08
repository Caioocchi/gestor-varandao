import { boot } from 'quasar/wrappers';
import axios from 'axios';

const urlAPI = 'https://gestor-varandao-api-production-01ef.up.railway.app';
// const urlAPI = 'https://gestor-varandao-api.onrender.com';
// const urlAPI = 'http://localhost:3000';

const api = axios.create({
  baseURL: urlAPI,
});

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
