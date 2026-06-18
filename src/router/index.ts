import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  };

  const hasValidToken = () => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');

    if (!token || !expiry) {
      return false;
    }

    const expiryTime = Number(expiry);
    if (Number.isNaN(expiryTime) || Date.now() > expiryTime) {
      clearAuth();
      return false;
    }

    return true;
  };

  Router.beforeEach((to) => {
    const publicPages = ['Login', 'Cadastrar Usuário'];
    const tokenValid = hasValidToken();

    if (publicPages.includes(String(to.name))) {
      if (tokenValid) {
        return { path: '/home' };
      }
      return true;
    }

    if (!tokenValid) {
      return { path: '/' };
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]!));
          if (payload && payload.role === 'padrao') {
            const allowedNames = [
              'Arquivos e Mensagens',
              'Arquivos Salvos',
              'Mensagens WhatsApp',
              'Lista de Compras',
              'Listar Eventos',
              'Visualizar Evento',
              'Editar Evento',
              'Home',
              'Perfil',
              'Alterar Senha',
            ];
            if (!allowedNames.includes(String(to.name))) {
              return { path: '/eventos' };
            }
          }
        } else {
          clearAuth();
          return { path: '/' };
        }
      } catch (e) {
        console.error('Error parsing token payload', e);
        clearAuth();
        return { path: '/' };
      }
    }

    return true;
  });

  return Router;
});
