<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-section">
      <var-input v-model="searchKeyword" :placeholder="t('common.placeholder.batchNo')" :delay="300"
        @search="handleSearch">
        <template #append-icon>
          <var-button type="primary" @click="handleSearch" >
            {{ $t('common.search.title') }}
          </var-button>
        </template>
      </var-input>
    </div>
    <!-- 批次列表 -->
    <div :style="'height:' + listScrollerHeight + '; overflow-y: scroll;'">
      <var-list v-model:loading="loading" :finished="finished" @load="loadMore">
        <var-cell v-for="batch in batches" :key="batch.id" class="batch-item" :border="true" :border-offset="5"
          :ripple="true" @click="navigateToBatchDetail(batch.id)">
          <div class="cell-content">
            <div class="batch-title">
              <div class="batch-number">{{ batch.batchNumber || batch.no }}|{{ batch.serialNumber }}</div>
              <var-button text outline :type="getStatusType(batch.inboundStatus)" size="mini">{{
                getStatusText(batch.inboundStatus) }}</var-button>
            </div>
            <div class="batch-info">
              <!-- 入仓进度 -->
              <div class="batch-progress">
                <div class="progress-text">
                  {{ $t('inboundBatchListView.inboundProgress') }}: {{ batch.inboundQuantity }}/{{
                    batch.expectedQuantity }}
                </div>
                <var-progress :value="getInboundProgress(batch)" :color="getInboundProgressColor(batch)" :height="6"
                  class="progress-bar" />
              </div>
              <!-- 出仓进度 暂时不展示 -->
              <!-- <div class="batch-progress">
                <div class="progress-text">
                  {{ $t('inboundBatchListView.outboundProgress') }}: {{ getOutboundQuantity(batch) }}/{{
                    batch.expectedQuantity }}
                </div>
                <var-progress :value="getOutboundProgress(batch)" :color="getOutboundProgressColor(batch)" :height="6"
                  class="progress-bar" />
              </div>
              <div class="batch-date">
                {{ $t('inboundBatchListView.labels.createdAt') }} {{ formatDate(batch.createTime) }}
              </div> -->
            </div>
          </div>
        </var-cell>
      </var-list>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useInboundBatchStore } from '@/stores/inbound'
  import { usePackageStore } from '@/stores/package'

  import { useI18n } from 'vue-i18n'
  import { useTitleStore } from '@/stores/title'
  import { InboundBatch, InboundStatus } from '@/types'
  import { calculateRemainHeight } from '@/utils/calculateHeight'
  const { t } = useI18n()

  const inboundBatchStore = useInboundBatchStore()
  const packageStore = usePackageStore()
  const router = useRouter()
  const titleStore = useTitleStore()
  titleStore.setTitle('inboundBatchListView.title')

  // 搜索关键词
  const searchKeyword = ref('')

  // 组件内部状态管理数据
  const batches = ref<InboundBatch[]>([])

  // 分页加载相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
  const loading = ref(false)
  const finished = ref(false)
  const listScrollerHeight = ref('500px')



  // 加载初始数据
  const loadInitialData = async () => {
    batches.value = []
    currentPage.value = 1
    hasMore.value = true
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  // 加载更多数据
  const loadMore = async () => {
    if (inboundBatchStore.loading || !hasMore.value) return

    currentPage.value++
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }


  const loadData = async (currentPage: number,searchKeyword?: string) => {
    batches.value = []
    hasMore.value = true
    const params: Record<string, any> = { column: 'createTime', order: 'desc' ,status:'!3'}
    // 添加搜索参数
    if (searchKeyword) {
      params.no = '*' + searchKeyword + '*'
    }
    try {
      const response = await inboundBatchStore.fetchBatches(currentPage, pageSize.value, params)
      if (currentPage === 1) {
        // 第一页数据，直接替换
        batches.value = response.records
      } else {
        // 加载更多数据，追加
        batches.value = [...batches.value, ...response.records]
      }

      hasMore.value = currentPage < response.pages
      loading.value = false
      finished.value = !hasMore.value
    } catch (error) {
      console.error('Failed to load initial data:', error)
      hasMore.value = false
      loading.value = false
      finished.value = true
    }

  }

  // 处理搜索
  const handleSearch = async () => {
    if (searchKeyword.value) {
      batches.value = []
      currentPage.value = 1
      hasMore.value = true
      try {
        await loadData(currentPage.value, searchKeyword.value)
      } catch (error) {
        console.error('Failed to search:', error)
      }
    } else {
      await loadInitialData()
    }
  }

  // 导航到批次详情页
  const navigateToBatchDetail = (id: string | number) => {
    router.push(`/inbound-list/${id}`)
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
    // 计算列表自适应高度
  const calculateListHeight = () => {
    const height = calculateRemainHeight(['.search-section'])
    listScrollerHeight.value = height + 'px'
  }
  // 监听窗口大小变化
  const handleResize = () => {
    calculateListHeight()
  }
  // 页面加载时初始化数据
  onMounted(async () => {
    await packageStore.loadPackageStats()
    await loadInitialData()
        // 计算表格初始高度
    nextTick(() => {
      calculateListHeight()

      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize)
    })
  })
  onUnmounted(() => {
    // 移除窗口大小变化监听
    window.removeEventListener('resize', handleResize)
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