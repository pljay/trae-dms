import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import i18n from '@/i18n'
const { t } = i18n.global
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { 
       requiresAuth: false,
       title: t('login.title')
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('home.title')
    }
  },
  {
    path: '/scan-in',
    name: 'scan-in',
    component: () => import('../views/ScanInView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('scanIn.title')
    }
  },
  {
    path: '/package-records',
    name: 'package-records',
    component: () => import('../views/PackageRecordsView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('packageRecords.title')
    }
  },
  {
    path: '/scan-out',
    name: 'scan-out',
    component: () => import('../views/ScanOutView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('scanOut.title')
    } 
  },
  {
    path: '/scan-operation',
    name: 'scan-operation',
    component: () => import('../views/ScanOperationView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('scanOperation.title')
    }
  },
  {
    path: '/outbound-records',
    name: 'outbound-records',
    component: () => import('../views/OutboundRecordsView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('outboundRecords.title')
    } 
  },
  {
    path: '/inbound-batches',
    name: 'inbound-batches',
    component: () => import('../views/InboundBatchesView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('inboundBatches.title')
    } 
  },
  {
    path: '/inbound-batches/:id',
    name: 'inbound-batch-detail',
    component: () => import('../views/InboundBatchDetailView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('inboundBatchDetail.title')
    }   
  },
  //语音设置
  {
    path: '/voice-setting',
    name: 'voice-setting',
    component: () => import('../views/VoiceSettingView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('voiceSetting.title')
    }   
  },
  {
    path: '/scan',
    name: 'scan',
    component: () => import('../views/ScanView.vue'),
    meta: { 
      requiresAuth: true,
      title: t('scan.title')
    }   
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth as boolean
  document.title = to.meta.title as string
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router