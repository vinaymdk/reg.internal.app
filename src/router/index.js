// import { defineRouter } from '#q-app/wrappers'
// import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
// import routes from './routes'

// /*
//  * If not building with SSR mode, you can
//  * directly export the Router instantiation;
//  *
//  * The function below can be async too; either use
//  * async/await or return a Promise which resolves
//  * with the Router instance.
//  */

//   export default defineRouter(function (/* { store, ssrContext } */) {
//     const createHistory = process.env.SERVER
//       ? createMemoryHistory
//       : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

//     const Router = createRouter({
//       scrollBehavior: () => ({ left: 0, top: 0 }),
//       routes,

//       // Leave this as is and make changes in quasar.conf.js instead!
//       // quasar.conf.js -> build -> vueRouterMode
//       // quasar.conf.js -> build -> publicPath
//       history: createHistory(process.env.VUE_ROUTER_BASE)
//     })

//     return Router

// });

import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "src/pages/LoginPage.vue";
import RegisterPage from "src/pages/RegisterPage.vue";
import HomePage from "src/pages/IndexPage.vue";
import { auth } from "src/firebase/index"; // Import Firebase Auth

const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: "/", component: LoginPage },
      { path: "/login", component: LoginPage },
      { path: "/register", component: RegisterPage },
    ],
    meta: { requiresAuth: false}
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: "/home", component: HomePage }
    ],
    meta: { requiresAuth: true}
   }
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,

});

// ✅ Navigation Guard to Protect Routes
router.beforeEach((to, from, next) => {
  const user = auth.currentUser; // Get the current user
  if (to.meta.requiresAuth && !user) {
    console.log("Not authenticated, redirecting to /login");
    next("/"); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

export default router;
