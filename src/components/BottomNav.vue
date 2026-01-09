<template>
  <var-bottom-navigation v-model:active="activeNav" :fixed="true" :safe-area="true" :border="true" >
    <var-bottom-navigation-item
      value="/scan-in"
      :label="$t('scanIn.title')"
      icon="barcode-scan"
      @click="navigate('/scan-in')"
    />

    <var-bottom-navigation-item
      value="/inbound-records"
      :label="$t('inboundRecords.title')"
      icon="format-list-checkbox"
      @click="navigate('/inbound-records')"
    />
    <var-bottom-navigation-item
      value="/inbound-batches"
      :label="$t('inboundBatches.title')"
      icon="format-list-checkbox"
      @click="navigate('/inbound-batches')"
    />
    <var-bottom-navigation-item
      value="/scan-out"
      :label="$t('scanOut.title')"
      icon="upload-outline"
      @click="navigate('/scan-out')"
    />
    <var-bottom-navigation-item
      value="/outbound-records"
      :label="$t('outboundRecords.title')"
      icon="format-list-checkbox"
      @click="navigate('/outbound-records')"
    />
  </var-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeNav = ref(0)
const active = ref(route.path)  



const navigate = (path: string) => {
  router.push(path)
}

// 监听路由变化，更新当前激活的导航
onMounted(() => {
  router.afterEach((to) => {
    active.value = to.path
  })
})
</script>

<style scoped lang="css">
</style>
