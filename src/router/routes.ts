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
    path: '/eventos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/eventos',
        component: () => import('pages/Evento/ListarEventos.vue'),
        name: 'Listar Eventos',
      },
    ],
  },
  {
    path: '/eventos/adicionar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/eventos/adicionar',
        component: () => import('pages/Evento/AdicionarEvento.vue'),
        name: 'Adicionar Evento',
      },
    ],
  },
  {
    path: '/eventos/editar/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/eventos/editar/:id',
        component: () => import('pages/Evento/EditarEvento.vue'),
        name: 'Editar Evento',
      },
    ],
  },
  {
    path: '/eventos/visualizar/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/eventos/visualizar/:id',
        component: () => import('pages/Evento/VisualizarEvento.vue'),
        name: 'Visualizar Evento',
      },
    ],
  },
  {
    path: '/produtos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/produtos',
        component: () => import('pages/Produtos/ListarProdutos.vue'),
        name: 'Listar Produtos',
      },
    ],
  },
  {
    path: '/produtos/adicionar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/produtos/adicionar',
        component: () => import('pages/Produtos/AdicionarProduto.vue'),
        name: 'Adicionar Produto',
      },
    ],
  },
  // {
  //   path: '/produtos/editar/:id',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     {
  //       path: '/produtos/editar/:id',
  //       component: () => import('pages/Produtos/EditarProduto.vue'),
  //       name: 'Editar Produto',
  //     },
  //   ],
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
