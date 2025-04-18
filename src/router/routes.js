import { useAuthStore } from 'stores/auth-store';

const authGuard = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      { 
        path: '', 
        component: () => import('pages/LaporanList.vue') 
      },
      { 
        path: 'create', 
        component: () => import('pages/LaporanCreate.vue') 
      },
      { 
        path: ':id', 
        component: () => import('pages/LaporanDetail.vue') 
      },
      {
        path: 'users',
        component: () => import('pages/UserList.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
