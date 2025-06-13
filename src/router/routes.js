import { useAuthStore } from 'stores/auth-store';

const authGuard = async (to, from, next) => {
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
        component: () => import('pages/LoginPage.vue'),
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore();
          if (authStore.isAuthenticated) {
            next('/');
          } else {
            next();
          }
        }
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
        name: 'create-laporan',
        component: () => import('pages/LaporanCreate.vue')
      },
      {
        path: ':id',
        name: 'view-laporan',
        component: () => import('pages/LaporanDetail.vue'),
        props: true
      },
      {
        path: 'edit/:id',
        name: 'edit-laporan',
        component: () => import('pages/LaporanCreate.vue'),
        props: { isEdit: true }
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
