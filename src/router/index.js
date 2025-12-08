// ...existing code...
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from 'src/pages/LoginPage.vue'
import RegisterPage from 'src/pages/RegisterPage.vue'
import HomePage from 'src/pages/IndexPage.vue'
import { auth } from 'src/firebase/index' // Import Firebase Auth
// { changed code }
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const db = getFirestore()

const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/', component: LoginPage },
      { path: '/login', component: LoginPage },
      { path: '/register', component: RegisterPage },
    ],
    meta: { requiresAuth: false },
  },

  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/home', component: HomePage }],
    meta: { requiresAuth: true },
  },

  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/users' },
      { path: 'users', component: () => import('src/pages/admin/UsersPage.vue') },
      { path: 'clientreports', component: () => import('src/pages/admin/ReportsPage.vue') },
    ],
  },
  // ...existing code...
]

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
})

// Helper: wait for Firebase Auth to initialize and return current user (or null)
const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// ✅ Navigation Guard to Protect Routes and access authenticated user info
router.beforeEach(async (to, from, next) => {
  try {
    const user = await waitForAuth() // ensures auth state is ready (works across refresh)

    // Example: log user info for condition checks
    if (user) {
      console.log('Authenticated user:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      })
    } else {
      console.log('No authenticated user')
    }

    // If route requires authentication and no user => redirect to login
    if (to.meta.requiresAuth && !user) {
      return next('/')
    }

    // { changed code }
    // Check admin role from Firestore 'users' collection instead of ID token claims
    if (to.meta.requiresAdmin) {
      if (!user) return next('/')
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.exists() ? userDoc.data() : null
        const isAdmin = userData?.role === 'admin'

        if (!isAdmin) {
          // Authenticated but not admin -> redirect to home
          return next('/home')
        }
      } catch (err) {
        console.error('Failed to read user role from Firestore:', err)
        return next('/')
      }
    }

    // If user is authenticated and trying to access auth pages, redirect to home
    if ((to.path === '/' || to.path === '/login' || to.path === '/register') && user) {
      return next('/home')
    }

    next()
  } catch (err) {
    console.error('Router guard error:', err)
    next()
  }
})

export default router
