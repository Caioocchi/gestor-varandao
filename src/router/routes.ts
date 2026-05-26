import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [{ path: '/', component: () => import('pages/LoginPage.vue'), name: 'Login' }],
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
