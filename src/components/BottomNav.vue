<template>
  <var-bottom-navigation v-model:active="active" :fixed="true" :safe-area="true" :border="true" >
    <var-bottom-navigation-item
      name="scan-in"
      :label="$t('scanIn.title')"
      icon="barcode-scan"
      @click="navigate('/scan-in')"
    />

    <var-bottom-navigation-item
      name="package-records"
      :label="$t('packageRecords.title')"
      icon="format-list-checkbox"
      @click="navigate('/package-records')"
    />
    <var-bottom-navigation-item
      name="inbound-batches"
      :label="$t('inboundBatches.title')"
      icon="format-list-checkbox"
      @click="navigate('/inbound-batches')"
    />
    <var-bottom-navigation-item
      name="scan-out"
      :label="$t('scanOut.title')"
      icon="upload-outline"
      @click="navigate('/scan-out')"
    />
    <var-bottom-navigation-item
      name="outbound-records"
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
const active = ref(route.path.replace('/', ''))  



const navigate = (path: string) => {
  router.push(path)
}

// 监听路由变化，更新当前激活的导航
onMounted(() => {
  router.afterEach((to) => {
    active.value = to.path.replace('/', '')
  })
})
</script>

<style scoped lang="css">
:deep(.var-bottom-navigation-item__label) {
  font-size: 12px; /* 减小字体大小 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px; /* 限制最大宽度 */
}

:deep(.var-bottom-navigation) {
  height: auto;
  min-height: 56px;
}

:deep(.var-bottom-navigation-item) {
  padding: 8px 4px; /* 调整内边距 */
  flex: 1;
  min-width: 0;
}

:deep(.var-bottom-navigation-item__icon) {
  font-size: 20px; /* 调整图标大小 */
}
</style>
