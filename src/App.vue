<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { usePackageStore } from './stores/package'
import { useOutboundStore } from './stores/outbound'

import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import TopBar from './components/TopBar.vue'

const title = ref('')
// 初始化数据
const packageStore = usePackageStore()
const outboundStore = useOutboundStore()

// 使用 try-catch 处理异步初始化，避免白屏
const initAppData = async () => {
  try {
    // 并行初始化数据，提高性能
    await Promise.all([
      packageStore.initData(),
      outboundStore.initData()
    ])
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
</script>

<template>
  <div class="page-container" :class="{ 'login-page': isLoginPage }">
    <TopBar :title="title" />  
    <router-view />
    <BottomNav v-if="!isLoginPage" />
  </div>
</template>

<style scoped>

</style>
