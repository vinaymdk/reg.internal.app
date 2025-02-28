const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/LoginLanding.vue') },
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

// const routes = [
//  {
//   path: '/',
//   component: () => import('layouts/AuthLayout.vue'),
//   children: [
//    { path: '/', redirect: '/login' },
//    { path: 'login', component: () => import('src/pages/LoginPage.vue') },
//    { path: 'register', component: () => import('src/pages/RegisterPage.vue') },
//   ],
//   meta: { auth: false}
//  }, {
//   path: '/home',
//   component: () => import('layouts/MainLayout.vue'),
//   children: [
//    { path: '/home', component: () => import('pages/IndexPage.vue') },
//   ],
//   meta: { auth: true }
//  }, {
//   path: '/:catchAll(.*)*',
//   component: () => import('pages/ErrorNotFound.vue')
//  }
// ]

// export default routes