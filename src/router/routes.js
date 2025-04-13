const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'laporan', component: () => import('pages/LaporanList.vue') },
      { path: 'laporan/create', component: () => import('pages/LaporanCreate.vue') },
      { path: 'laporan/:id', component: () => import('pages/LaporanDetail.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
