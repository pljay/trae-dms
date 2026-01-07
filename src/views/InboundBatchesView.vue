<template>
  <div class="inbound-batches-container">
    <TopBar title="入库批次" />
    <div class="content">
      <!-- 搜索框 -->
      <div class="search-section">
        <var-input v-model="searchKeyword" :placeholder="t('common.searchPlaceholder')" :delay="300" @search="handleSearch">
          <template #append-icon>
            <var-button type="primary" @click="handleSearch" :disabled="!searchKeyword.trim()">
              {{ $t('common.search') }}
            </var-button>
          </template>
        </var-input>
      </div>
      <!-- 状态筛选 -->
      <var-tabs color="var(--color-primary)" active-color="var(--color-on-primary)" inactive-color="var(--color-on-info)"
      v-model:active="activeTab" :safe-area="true">
        <var-tab name="pending">待入库</var-tab>
        <var-tab name="in_progress">入库中</var-tab>
      </var-tabs>
      <var-tabs-items v-model:active="activeTab" :can-swipe="false">
        <var-tab-item name="pending">
          <var-list>
            <var-cell v-for="batch in filteredBatchesByStatus('pending')" :key="batch.id" class="batch-item"
              @click="navigateToBatchDetail(batch.id)">
              <div class="cell-content">
                <div class="batch-title">
                  <div class="batch-number">{{ batch.batchNumber }}</div>
                  <var-button text outline type="warning" size="mini">待入库</var-button>
                </div>
                <div class="batch-info">
                  <div class="batch-progress">
                    <div class="progress-text">
                      入库进度: {{ batch.inboundQuantity }}/{{ batch.expectedQuantity }}
                    </div>
                    <var-progress :percentage="getInboundProgress(batch)" :color="getProgressColor(batch)" :height="6"
                      class="progress-bar" />
                  </div>
                  <div class="batch-date">
                    创建时间: {{ formatDate(batch.createdAt) }}
                  </div>
                </div>
              </div>
            </var-cell>
          </var-list>
        </var-tab-item>
        <var-tab-item name="in_progress">
          <var-list>
            <var-cell v-for="batch in filteredBatchesByStatus('in_progress')" :key="batch.id" class="batch-item"
              @click="navigateToBatchDetail(batch.id)">
              <div class="cell-content">
                <div class="batch-title">
                  <div class="batch-number">{{ batch.batchNumber }}</div>
                  <var-button text outline type="primary" size="mini">入库中</var-button>
                </div>
                <div class="batch-info">
                  <div class="batch-progress">
                    <div class="progress-text">
                      入库进度: {{ batch.inboundQuantity }}/{{ batch.expectedQuantity }}
                    </div>
                    <var-progress :percentage="getInboundProgress(batch)" :color="getProgressColor(batch)" :height="6"
                      class="progress-bar" />
                  </div>
                  <div class="batch-date">
                    创建时间: {{ formatDate(batch.createdAt) }}
                  </div>
                </div>
              </div>
            </var-cell>
          </var-list>
        </var-tab-item>
      </var-tabs-items>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import TopBar from '@/components/TopBar.vue'
  import { useInboundBatchStore } from '@/stores/inbound'
  import { formatDate as formatDateUtil } from '@/utils/dateFormat'
  import { InboundStatus } from '@/types'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const inboundBatchStore = useInboundBatchStore()
  const router = useRouter()

  // 搜索关键词
  const searchKeyword = ref('')
  // 激活的标签页
  const activeTab = ref('pending')

  // 筛选后的批次列表
  const filteredBatches = () => {
    let batches = inboundBatchStore.allBatches
    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      batches = batches.filter(batch =>
        batch.batchNumber.toLowerCase().includes(keyword)
      )
    }

    return batches
  }

  // 根据状态筛选批次
  const filteredBatchesByStatus = (status: string) => {
    let batches = filteredBatches()
    switch (status) {
      case 'pending':
        batches = batches.filter(batch => batch.status === InboundStatus.PENDING)
        break
      case 'in_progress':
        batches = batches.filter(batch => batch.status === InboundStatus.IN_PROGRESS)
        break
    }
    return batches
  }

  // 处理搜索
  const handleSearch = () => {
    console.log('Searching for:', searchKeyword.value)
  }

  // 导航到批次详情页
  const navigateToBatchDetail = (id: string | number) => {
    router.push(`/inbound-batches/${id}`)
  }


  // 获取入库进度百分比
  const getInboundProgress = (batch: any) => {
    return inboundBatchStore.getInboundProgress(batch)
  }

  // 获取进度条颜色
  const getProgressColor = (batch: any) => {
    const progress = getInboundProgress(batch)
    if (progress === 100) return '#4CAF50'
    if (progress >= 50) return '#2196F3'
    if (progress >= 25) return '#FFC107'
    return '#FF5252'
  }

  // 格式化日期
  const formatDate = (date?: string | Date) => {
    // 将字符串转换为Date对象，确保dateObj不是undefined
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDateUtil(dateObj || new Date())
  }

  // 页面加载时初始化数据
  onMounted(async () => {
    await inboundBatchStore.initData()
  })
</script>

<style scoped>
  .inbound-batches-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .search-section {
    margin-bottom: 16px;
  }

  .status-tabs {
    margin-bottom: 16px;
  }

  .batch-list {
    margin-bottom: 16px;
  }

  .cell-content {
    width: 100%;
  }

  .batch-item {
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
  }

  .batch-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .batch-number {
    font-weight: 600;
    font-size: 16px;
  }

  .status-tag {
    font-size: 12px;
  }

  .batch-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .batch-progress {
    width: 100%;
  }

  .progress-text {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .progress-bar {
    width: 100%;
  }

  .batch-date {
    font-size: 12px;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
</style>
