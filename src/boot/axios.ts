import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API || '',
});

console.log(import.meta.env.VITE_URL_API);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
