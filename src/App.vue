<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import BottomNav from './components/BottomNav.vue'
import TopBar from './components/TopBar.vue'
import { initializeAppData } from './utils/init'

const title = ref('')
const authStore = useAuthStore()

// 使用 try-catch 处理异步初始化，避免白屏
const initAppData = async () => {
  try {
    // 只有已登录的用户才初始化数据
    if (authStore.isAuthenticated) {
      await initializeAppData()
    }
  } catch (error) {
    console.error('Failed to initialize app data:', error)
    // 初始化失败不影响应用启动
  }
}

// 在组件挂载后执行初始化
onMounted(() => {
  initAppData()
})

// 获取当前路由
const route = useRoute()



// 判断是否为登录页
const isLoginPage = ref(route.path === '/login' || route.path === '/')

// 监听路由变化
watch(() => route.path, (newPath) => {
  isLoginPage.value = newPath === '/login'
  console.log(isLoginPage.value);
})

// 监听登录状态变化，登录后初始化数据
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    initAppData()
  }
})
</script>

<template>
  <div class="page-container" :class="{ 'login-page': isLoginPage }">
    <TopBar :title="title" />
    <router-view />
    <BottomNav v-if="!isLoginPage" />
  </div>
</template>

<style scoped>

  router-view {
    flex: 1;
    overflow-y: auto;
  }
</style>
