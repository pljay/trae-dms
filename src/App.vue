<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/auth'
  import BottomNav from './components/BottomNav.vue'
  import TopBar from './components/TopBar.vue'
  import { initializeAppData } from './utils/init'

  const title = ref('')
  const authStore = useAuthStore()
  const router = useRouter()

  // 使用 try-catch 处理异步初始化，避免白屏
  const initAppData = async () => {
    try {
        // 初始化其他应用数据
        await initializeAppData(router)
    } catch (error) {
      console.error('Failed to initialize app data:', error)
      // 初始化失败不影响应用启动
    }
  }
  // 获取当前路由
  const route = useRoute()



  // 使用计算属性从路由meta中获取显示设置
  const showTopBar = computed(() => (route.meta as any).showTopBar !== false)
  const showBottomBar = computed(() => (route.meta as any).showBottomBar === true)
  
  // 计算页面类型
  const pageType = computed(() => {
    if (route.path === '/login') return 'login-page'
    if (route.path === '/home') return 'home-page'
    if (route.path.includes('/inbound-list/') || route.path.includes('/outbound-operate-list/')) return 'detail-page'
    return 'normal-page'
  })

  // 监听登录状态变化，登录后初始化数据
  watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
      initAppData()
    }
  })
</script>

<template>
  <div class="page-container" :class="pageType">
    <TopBar v-if="showTopBar" :title="title" />
    <main class="view">
      <router-view />
    </main>
    <BottomNav v-if="showBottomBar" />
  </div>
</template>
