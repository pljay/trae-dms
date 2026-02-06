<template>
    <div class="view-content">
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
      <!-- 批次列表 -->
    <div class="table-container" ref="listContainer">
      <var-list>
        <var-cell v-for="batch in filteredBatches" :key="batch.id" class="batch-item" :border="true" :border-offset="5" :ripple="true"
          @click="navigateToBatchDetail(batch.id)">
          <div class="cell-content">
            <div class="batch-title">
              <div class="batch-number">{{ batch.batchNumber||batch.no}}|{{batch.serialNumber }}</div>
               <var-button text outline :type="getStatusType(batch.inboundStatus)" size="mini">{{ getStatusText(batch.inboundStatus) }}</var-button>
            </div>
            <div class="batch-info">
              <!-- 入仓进度 -->
              <div class="batch-progress">
                <div class="progress-text">
                  {{ $t('inboundBatches.inboundProgress') }}: {{ batch.inboundQuantity }}/{{ batch.expectedQuantity }}
                </div>
                <var-progress :value="getInboundProgress(batch)" :color="getInboundProgressColor(batch)" :height="6"
                  class="progress-bar" />
              </div>
              <!-- 出仓进度 -->
              <div class="batch-progress">
                <div class="progress-text">
                  {{ $t('inboundBatches.outboundProgress') }}: {{ getOutboundQuantity(batch) }}/{{ batch.expectedQuantity }}
                </div>
                <var-progress :value="getOutboundProgress(batch)" :color="getOutboundProgressColor(batch)" :height="6"
                  class="progress-bar" />
              </div>
              <div class="batch-date">
                {{ $t('inboundBatches.labels.createdAt') }} {{ formatDate(batch.createdAt) }}
              </div>
            </div>
          </div>
        </var-cell>

        <!-- 加载更多指示器 -->
        <div v-if="hasMore" class="loading-more">
          <var-loading type="circle"></var-loading>
          <span>{{ $t('common.loading') }}</span>
        </div>

        <!-- 没有更多数据 -->
        <div v-else-if="filteredBatches.length > 0" class="no-more">
          <span>{{ $t('common.noMoreData') }}</span>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredBatches.length === 0" class="empty-state">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-list>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useInboundBatchStore } from '@/stores/inbound'
  import { usePackageStore } from '@/stores/package'
  import { formatDate as formatDateUtil } from '@/utils/dateFormat'
  import { useI18n } from 'vue-i18n'
  import { useTitleStore } from '@/stores/title'
  import { InboundBatch, InboundStatus } from '@/types'

  const { t } = useI18n()

  const inboundBatchStore = useInboundBatchStore()
  const packageStore = usePackageStore()
  const router = useRouter()
  const titleStore = useTitleStore()
  titleStore.setTitle('inboundBatches.title')

  // 搜索关键词
  const searchKeyword = ref('')

  // 组件内部状态管理数据
  const batches = ref<InboundBatch[]>([])

  // 分页加载相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
  const listContainer = ref<HTMLElement | null>(null)

  // 筛选后的批次列表
  const filteredBatches = computed(() => {
    let result = batches.value
    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(batch =>
        batch.batchNumber.toLowerCase().includes(keyword)
      )
    }

    return result
  })

  // 加载初始数据
  const loadInitialData = async () => {
    batches.value = []
    currentPage.value = 1
    hasMore.value = true

    try {
      const response = await inboundBatchStore.fetchBatches(currentPage.value, pageSize.value)
      batches.value = response.records
      hasMore.value = response.records.length >= pageSize.value
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  // 加载更多数据
  const loadMore = async () => {
    if (inboundBatchStore.loading || !hasMore.value) return

    currentPage.value++
    try {
      const response = await inboundBatchStore.fetchBatches(currentPage.value, pageSize.value)
      batches.value = [...batches.value, ...response.records]
      hasMore.value = response.records.length >= pageSize.value
    } catch (error) {
      console.error('Failed to load more data:', error)
      currentPage.value--
    }
  }

  // 滚动事件处理
  const handleScroll = () => {
    if (!listContainer.value) return

    const { scrollTop, clientHeight, scrollHeight } = listContainer.value
    const scrollThreshold = scrollHeight - clientHeight - 100

    if (scrollTop >= scrollThreshold) {
      loadMore()
    }
  }

  // 处理搜索
  const handleSearch = async () => {
    if (searchKeyword.value) {
      batches.value = []
      currentPage.value = 1
      hasMore.value = true

      try {
        const response = await inboundBatchStore.fetchBatches(currentPage.value, pageSize.value)
        batches.value = response.records
        hasMore.value = response.records.length >= pageSize.value
      } catch (error) {
        console.error('Failed to search:', error)
      }
    } else {
      await loadInitialData()
    }
  }

  // 导航到批次详情页
  const navigateToBatchDetail = (id: string | number) => {
    router.push(`/inbound-batches/${id}`)
  }

  // 获取入库进度百分比
  const getInboundProgress = (batch: InboundBatch) => {
    return inboundBatchStore.getInboundProgress(batch)
  }

  // 获取入仓进度条颜色
  const getInboundProgressColor = (batch: InboundBatch) => {
    const progress = getInboundProgress(batch)
    if (progress === 100) return '#4CAF50'
    if (progress >= 50) return '#2196F3'
    if (progress >= 25) return '#FFC107'
    return '#FF5252'
  }

  // 计算出仓数量，基于实际包裹数据
  const getOutboundQuantity = (_batch: InboundBatch) => {
    // 从组件本地状态获取当前批次的包裹
    // 注意：这里只能获取当前页面加载的包裹
    // 实际应用中可能需要通过API获取完整数据
    return 0
  }

  // 计算出仓进度百分比
  const getOutboundProgress = (batch: InboundBatch) => {
    if (batch.expectedQuantity === 0) return 0
    const outboundQuantity = getOutboundQuantity(batch)
    return Math.round((outboundQuantity / batch.expectedQuantity) * 100)
  }

  // 获取出仓进度条颜色
  const getOutboundProgressColor = (batch: InboundBatch) => {
    const progress = getOutboundProgress(batch)
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

    // 获取状态标签类
  const getStatusType = (status: string) => {
    switch (status) {
      case InboundStatus.PENDING:
        return 'info'
      case InboundStatus.IN_PROGRESS:
        return 'primary'
      case InboundStatus.COMPLETED:
        return 'success'
      default:
        return 'default'
    }
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
      default:
        return t('status.inboundBatch.unknown')
    }
  }

  // 页面加载时初始化数据
  onMounted(async () => {
    await packageStore.loadPackageStats()
    await loadInitialData()

    // 添加滚动事件监听
    if (listContainer.value) {
      listContainer.value.addEventListener('scroll', handleScroll)
    }
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    if (listContainer.value) {
      listContainer.value.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<style scoped>


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
    border-radius: 12px;
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

  .loading-more,
  .no-more,
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #999;
    gap: 8px;
  }

  .no-more {
    color: #666;
  }

  .empty-state {
    min-height: 200px;
  }
</style>