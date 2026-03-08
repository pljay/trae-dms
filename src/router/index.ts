import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import i18n from '@/i18n'

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
       titleKey: 'loginView.title',
       showTopBar: true,
       showBottomBar: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'homeView.title',
      showTopBar: true,
      showBottomBar: false
    }
  },
  {
    path: '/inbound-operate',
    name: 'inbound-operate',
    component: () => import('../views/InboundOperateView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'inboundOperateView.title',
      showTopBar: true,
      showBottomBar: true
    }
  },
  {
    path: '/package-list',
    name: 'package-list',
    component: () => import('../views/PackageListView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'packageListView.title',
      showTopBar: true,
      showBottomBar: true
    }
  },
  {
    path: '/inbound-list',
    name: 'inbound-list',
    component: () => import('../views/InboundBatchListView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'inboundBatchListView.title',
      showTopBar: true,
      showBottomBar: true
    } 
  },
  {
    path: '/inbound-list/:id',
    name: 'inbound-list-detail',
    component: () => import('../views/InboundBatchDetailView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'inboundBatchDetailView.title',
      showTopBar: true,
      showBottomBar: false
    }   
  },
  // 出库批次列表
  {
    path: '/outbound-list',
    name: 'outbound-list',
    component: () => import('../views/OutboundBatchListView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'outboundBatchListView.title',
      showTopBar: true,
      showBottomBar: true
    } 
  },
  // 出库操作列表
  {
    path: '/outbound-operate-list',
    name: 'outbound-operate-list',
    component: () => import('../views/OutboundOperateListView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'outboundOperateListView.title',
      showTopBar: true,
      showBottomBar: true
    } 
  },
  // 出库操作详情
  {
    path: '/outbound-operate-list/:id',
    name: 'outbound-operate-detail',
    component: () => import('../views/OutboundOperateDetailView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'outboundOperateDetailView.title',
      showTopBar: true,
      showBottomBar: false
    }
  },
  //语音设置
  {
    path: '/voice-setting',
    name: 'voice-setting',
    component: () => import('../views/VoiceSettingView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'voiceSettingView.title',
      showTopBar: true,
      showBottomBar: true
    }   
  },
  {
    path: '/scan',
    name: 'scan',
    component: () => import('../views/ScanView.vue'),
    meta: { 
      requiresAuth: true,
      titleKey: 'scanView.title',
      showTopBar: true,
      showBottomBar: false
    }   
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  try {
    // 延迟导入useAuthStore，避免在初始化时访问localStorage
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta.requiresAuth as boolean
    
    // 使用titleKey动态获取标题
    if (to.meta.titleKey) {
      document.title = i18n.global.t(to.meta.titleKey as string)
    }
    
    if (requiresAuth && !isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } catch (error) {
    console.error('Router guard error:', error)
    // 出错时默认允许访问，避免应用崩溃
    next()
  }
})

export default router