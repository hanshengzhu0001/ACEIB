import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, hideFooter: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false, hideFooter: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/matching',
      name: 'matching',
      component: () => import('@/views/MatchingView.vue'),
      meta: { requiresAuth: true, roles: ['student'] },
    },
    {
      path: '/pairings',
      name: 'pairings',
      component: () => import('@/views/PairingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chat/:roomId?',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mediation',
      name: 'mediation',
      component: () => import('@/views/MediationView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/UserManagement.vue'),
        },
        {
          path: 'pairings',
          name: 'admin-pairings',
          component: () => import('@/views/admin/PairingManagement.vue'),
        },
        {
          path: 'mediation',
          name: 'admin-mediation',
          component: () => import('@/views/admin/MediationManagement.vue'),
        },
        {
          path: 'analytics',
          name: 'admin-analytics',
          component: () => import('@/views/admin/AnalyticsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  // Check role-based access
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    next({ name: 'dashboard' })
    return
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresAuth === false && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
