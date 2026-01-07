import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scan-in',
    name: 'scan-in',
    component: () => import('../views/ScanInView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/package-records',
    name: 'package-records',
    component: () => import('../views/PackageRecordsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scan-out',
    name: 'scan-out',
    component: () => import('../views/ScanOutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scan-operation',
    name: 'scan-operation',
    component: () => import('../views/ScanOperationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/outbound-records',
    name: 'outbound-records',
    component: () => import('../views/OutboundRecordsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inbound-records',
    name: 'inbound-records',
    component: () => import('../views/InboundRecordsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inbound-batches',
    name: 'inbound-batches',
    component: () => import('../views/InboundBatchesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inbound-batches/:id',
    name: 'inbound-batch-detail',
    component: () => import('../views/InboundBatchDetailView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router