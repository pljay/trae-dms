<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePackageStore } from './stores/package'
import { useOutboundStore } from './stores/outbound'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import TopBar from './components/TopBar.vue'

// 初始化数据
const packageStore = usePackageStore()
const outboundStore = useOutboundStore()
packageStore.initData()
outboundStore.initData()

// 获取当前路由
const route = useRoute()

// 判断是否为登录页
const isLoginPage = ref(route.path === '/login')

// 监听路由变化
watch(() => route.path, (newPath) => {
  isLoginPage.value = newPath === '/login'
})
</script>

<template>
  <div class="page-container" :class="{ 'login-page': isLoginPage }">
    <TopBar v-if="!isLoginPage" />
    <router-view />
    <BottomNav v-if="!isLoginPage" />
  </div>
</template>

<style scoped>
</style>
