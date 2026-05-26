import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      { path: '/', component: () => import('src/pages/Login/LoginPage.vue'), name: 'Login' },
    ],
  },
  {
    path: '/cadastrar',
    children: [
      {
        path: '/cadastrar',
        component: () => import('layouts/MainLayout.vue'),
        children: [
          {
            path: '/cadastrar',
            component: () => import('src/pages/Login/CadastrarUsuarioPage.vue'),
            name: 'Cadastrar Usuário',
          },
        ],
      },
    ],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/home', component: () => import('pages/HomePage.vue'), name: 'Home' }],
  },
  {
    path: '/freelas',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/freelas', component: () => import('pages/Freela/FreelaPage.vue'), name: 'Freelas' },
    ],
  },
  {
    path: '/freelas/adicionar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/freelas/adicionar',
        component: () => import('pages/Freela/AdicionarFreela.vue'),
        name: 'Adicionar Freela',
      },
    ],
  },
  {
    path: '/freelas/editar/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/freelas/editar/:id',
        component: () => import('pages/Freela/EditarFreela.vue'),
        name: 'Editar Freela',
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
