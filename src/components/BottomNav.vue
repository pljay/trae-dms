<template>
  <var-bottom-navigation v-model:active="active" :fixed="true" :safe-area="true" :border="true" >
    <var-bottom-navigation-item
      name="inbound-operate"
      :label="$t('inboundOperateView.title')"
      icon="barcode-scan"
      @click="navigate('/inbound-operate')"
    />

    <var-bottom-navigation-item
      name="package-list"
      :label="$t('packageListView.title')"
      icon="format-list-checkbox"
      @click="navigate('/package-list')"
    />
    <var-bottom-navigation-item
      name="inbound-list"
      :label="$t('inboundBatchListView.title')"
      icon="format-list-checkbox"
      @click="navigate('/inbound-list')"
    />
    <var-bottom-navigation-item
      name="outbound-operate-list"
      :label="$t('outboundOperateListView.title')"
      icon="upload-outline"
      @click="navigate('/outbound-operate-list')"
    />
    <var-bottom-navigation-item
      name="outbound-list"
      :label="$t('outboundBatchListView.title')"
      icon="format-list-checkbox"
      @click="navigate('/outbound-list')"
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
:deep(.var-bottom-navigation) {
  height: auto;
  min-height: 56px;
  display: flex;
  justify-content: space-around;
}

:deep(.var-bottom-navigation-item) {
  padding: 8px 2px; /* 进一步减少内边距 */
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.var-bottom-navigation-item__icon) {
  font-size: 18px; /* 进一步减小图标大小 */
  margin-bottom: 4px;
}

:deep(.var-bottom-navigation-item__label) {
  font-size: 10px; /* 进一步减小字体大小 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60px; /* 进一步限制最大宽度 */
  text-align: center;
  line-height: 1.2;
}
</style>
