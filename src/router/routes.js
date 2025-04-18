const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LaporanList.vue') },
      { path: 'create', component: () => import('pages/LaporanCreate.vue') },
      { path: ':id', component: () => import('pages/LaporanDetail.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
