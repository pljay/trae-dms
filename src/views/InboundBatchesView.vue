<template>
  <div class="inbound-batches-container">
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
        <var-tab v-for="statusItem in statusTabs" :key="statusItem.value" :name="statusItem.value">
          {{ statusItem.label }}
        </var-tab>
      </var-tabs>
      <var-tabs-items v-model:active="activeTab" :can-swipe="false">
        <var-tab-item v-for="statusItem in statusTabs" :key="statusItem.value" :name="statusItem.value">
          <var-list>
            <var-cell v-for="batch in filteredBatchesByStatus(statusItem.value)" :key="batch.id" class="batch-item"
              @click="navigateToBatchDetail(batch.id)">
              <div class="cell-content">
                <div class="batch-title">
                  <div class="batch-number">{{ batch.batchNumber }}</div>
                  <var-button text outline :type="getStatusType(batch.status)" size="mini">{{ getStatusText(batch.status) }}</var-button>
                </div>
                <div class="batch-info">
                  <div class="batch-progress">
                    <div class="progress-text">
                      {{ $t('inboundBatches.inboundProgress') }}: {{ batch.inboundQuantity }}/{{ batch.expectedQuantity }}
                    </div>
                    <var-progress :percentage="getInboundProgress(batch)" :color="getProgressColor(batch)" :height="6"
                      class="progress-bar" />
                  </div>
                  <div class="batch-date">
                    {{ $t('inboundBatches.labels.createdAt') }} {{ formatDate(batch.createdAt) }}
                  </div>
                </div>
              </div>
            </var-cell>
            <!-- 空状态 -->
            <div v-if="filteredBatchesByStatus(statusItem.value).length === 0" class="empty-state">
              <span>{{ getEmptyStateMessage(statusItem.value) }}</span>
            </div>
          </var-list>
        </var-tab-item>
      </var-tabs-items>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useInboundBatchStore } from '@/stores/inbound'
  import { formatDate as formatDateUtil } from '@/utils/dateFormat'
  import { InboundStatus } from '@/types'
  import { useI18n } from 'vue-i18n'
  import { useTitleStore } from '@/stores/title'

  const { t } = useI18n()

  const inboundBatchStore = useInboundBatchStore()
  const router = useRouter()
  const titleStore = useTitleStore()
  titleStore.setTitle('inboundBatches.title')

  // 搜索关键词
  const searchKeyword = ref('')
  // 激活的标签页
  const activeTab = ref('pending')

  // 状态标签页配置
  const statusTabs = [
    { value: 'pending', label: t('inboundBatches.pendingBatches') },
    { value: 'in_progress', label: t('inboundBatches.inProgressBatches') },
    { value: 'completed', label: t('inboundBatches.completedBatches') },
    { value: 'outbound_in_progress', label: t('inboundBatches.outboundInProgressBatches') },
    { value: 'outbound_completed', label: t('inboundBatches.outboundCompletedBatches') }
  ]

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
      case 'completed':
        batches = batches.filter(batch => batch.status === InboundStatus.COMPLETED)
        break
      case 'outbound_in_progress':
        batches = batches.filter(batch => batch.status === InboundStatus.OUTBOUND_IN_PROGRESS)
        break
      case 'outbound_completed':
        batches = batches.filter(batch => batch.status === InboundStatus.OUTBOUND_COMPLETED)
        break
    }
    return batches
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case InboundStatus.PENDING:
        return t('status.inboundBatch.pending')
      case InboundStatus.IN_PROGRESS:
        return t('status.inboundBatch.inProgress')
      case InboundStatus.COMPLETED:
        return t('status.inboundBatch.completed')
      case InboundStatus.OUTBOUND_IN_PROGRESS:
        return t('status.inboundBatch.outboundInProgress')
      case InboundStatus.OUTBOUND_COMPLETED:
        return t('status.inboundBatch.outboundCompleted')
      default:
        return t('status.inboundBatch.unknown')
    }
  }

  // 获取状态标签类型
  const getStatusType = (status: string) => {
    switch (status) {
      case InboundStatus.PENDING:
        return 'warning'
      case InboundStatus.IN_PROGRESS:
        return 'primary'
      case InboundStatus.COMPLETED:
        return 'success'
      case InboundStatus.OUTBOUND_IN_PROGRESS:
        return 'info'
      case InboundStatus.OUTBOUND_COMPLETED:
        return 'default'
      default:
        return 'default'
    }
  }

  // 获取空状态提示信息
  const getEmptyStateMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return t('inboundBatches.noPendingBatches')
      case 'in_progress':
        return t('inboundBatches.noInProgressBatches')
      case 'completed':
        return t('inboundBatches.noCompletedBatches')
      case 'outbound_in_progress':
        return t('inboundBatches.noOutboundInProgressBatches')
      case 'outbound_completed':
        return t('inboundBatches.noOutboundCompletedBatches')
      default:
        return t('common.noData')
    }
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
