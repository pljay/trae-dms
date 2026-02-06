<template>
  <div class="view-content">
    <div
      :style="{ height: calculateViewHeight() + 'px', overflowY: 'auto', border: '1px solid #eee', padding: '5x' }">
      <!-- 批次基本信息 -->
      <var-card class="batch-info-card">
        <div class="batch-info">
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.batchNo') }}</span>
            <span class="value">{{ currentBatch?.batchNumber || currentBatch?.no }}|{{ currentBatch?.serialNumber
            }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.createdAt') }}</span>
            <span class="value">{{ formatDate(currentBatch?.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.inboundProgress') }}</span>
            <div class="progress-section">
              <div class="progress-text">
                <span>{{ currentBatch?.inboundQuantity }}/{{ currentBatch?.expectedQuantity }}</span>
                <span class="progress-percentage">({{ getInboundProgress(currentBatch) }}%)</span>
              </div>
              <var-progress :value="getInboundProgress(currentBatch)" :color="getInboundProgressColor(currentBatch)"
                :height="8" class="progress-bar" />
            </div>
          </div>
          <!-- <div class="info-row">
            <span class="label">{{ $t('inboundBatches.outboundProgress') }}</span>
            <div class="progress-section">
              <div class="progress-text">
                <span>{{ getOutboundQuantity(currentBatch) }}/{{ currentBatch?.expectedQuantity }}</span>
                <span class="progress-percentage">({{ getOutboundProgress(currentBatch) }}%)</span>
              </div>
              <var-progress
                :value="getOutboundProgress(currentBatch)"
                :color="getOutboundProgressColor(currentBatch)"
                :height="8"
                class="progress-bar"
              />
            </div>
          </div> -->
        </div>
      </var-card>
      <!-- 扫描入库 -->
      <!-- 扫描按钮 -->
      <div class="scanner-section">
        <var-card shadow="hover" class="scan-card">
          <div class="scan-button-container">
            <var-button type="primary" size="large" :icon="'camera'" @click="goToScanHandler">
              {{ $t('scanOut.step3.scan') }}
            </var-button>

            <!-- 手动输入区域 -->
            <div class="manual-input-section">
              <var-input v-model="manualInput" :placeholder="$t('scanIn.manualInput')" @keyup.enter="handleManualInput"
                size="normal" clearable>
              </var-input>
              <var-button type="success" size="large" @click="handleManualInput" :disabled="!manualInput.trim()">
                {{ $t('common.confirm') }}
              </var-button>
            </div>
          </div>
        </var-card>
      </div>
      <!-- 渠道进度 -->
      <var-card class="channels-card">
        <div class="card-header">
          <div class="card-title">
            <var-icon name="format-list-bulleted" />
            <span>{{ $t('inboundBatches.channelProgress') }}</span>
          </div>
        </div>
        <div v-if="batchChannels.length > 0" class="channels-list">
          <div v-for="channel in batchChannels" :key="channel.channelCode" class="channel-item">
            <var-card shadow="hover" class="channel-card" @click="handleChannelClick(channel)"
              :style="selectedChannel === channel.channelId ? 'border: 2px solid var(--color-primary)' : ''">
              <div class="channel-info">
                <div class="channel-header">
                  <div class="channel-name">{{ channel.channelCode }}</div>
                </div>
                <!-- 入仓进度 -->
                <div class="channel-progress-item">
                  <div class="channel-progress-text">
                    <span class="progress-label">{{ $t('inboundBatches.inboundProgress') }}:</span>
                    <span>{{ channel.inboundQuantity }}/{{ channel.expectQuantity }}</span>
                    <span class="progress-percentage">({{ getChannelProgress(channel) }}%)</span>
                  </div>
                  <var-progress :value="getChannelProgress(channel)" :color="getChannelInboundProgressColor(channel)"
                    :height="6" class="channel-progress-bar" />
                </div>
                <!-- 出仓进度 -->
                <!-- <div class="channel-progress-item">
                  <div class="channel-progress-text">
                    <span class="progress-label">{{ $t('inboundBatches.outboundProgress') }}:</span>
                    <span>{{ getChannelOutboundQuantity(channel) }}/{{ channel.expectedQuantity }}</span>
                    <span class="progress-percentage">({{ getChannelOutboundProgress(channel) }}%)</span>
                  </div>
                  <var-progress
                    :value="getChannelOutboundProgress(channel)"
                    :color="getChannelOutboundProgressColor(channel)"
                    :height="6"
                    class="channel-progress-bar"
                  />
                </div> -->
              </div>
            </var-card>
          </div>
        </div>
        <div v-else class="empty-state">
          <var-empty :description="$t('inboundBatches.noChannelInfo')" />
        </div>
      </var-card>

      <!-- 包裹记录 -->
      <var-card class="packages-card">
        <div class="card-header">
          <div class="card-title">
            <var-icon name="package-variant" />
            <span>{{ $t('inboundBatches.packageRecords') }}</span>
          </div>
          <!-- 取消筛选按钮 -->
          <var-button v-if="selectedChannel" text outline type="warning" size="small" @click="cancelChannelFilter">
            {{ $t('common.cancel') }} {{ selectedChannelCode }}
          </var-button>
        </div>
        <div style="height: 80vh; overflow-y: scroll;">
          <var-list v-model:loading="loading" :finished="finished" @load="loadMore">
            <var-cell v-for="pkg in filteredPackages" :key="pkg.id" class="package-item">
              <div class="cell-content">
                <div class="package-title">
                  <div class="track-no">{{ pkg.no }}</div>
                  <var-chip :type="getPackageStatusTagType(pkg.status)" class="package-status-tag">
                    {{ getPackageStatusText(pkg.status) }}
                  </var-chip>
                </div>
                <div class="package-info">
                  <div class="package-details">
                    <span class="detail-item">
                      <var-icon name="weight-kilogram" size="14" />
                      {{ pkg.weight }}kg
                    </span>
                    <span class="detail-item">
                      <var-icon name="package-variant" size="14" />
                      {{ pkg.length }}x{{ pkg.width }}x{{ pkg.height }}cm
                    </span>
                    <span class="detail-item">
                      <var-icon name="truck-delivery" size="14" />
                      {{ getPackageChannelName(pkg) }}
                    </span>
                  </div>
                  <div class="package-date">
                    {{ formatDate(pkg.createdAt) }}
                  </div>
                </div>
              </div>
            </var-cell>
          </var-list>
        </div>
      </var-card>
    </div>
  </div>>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useTitleStore } from '@/stores/title'
  import { useInboundBatchStore } from '@/stores/inbound'
  import { usePackageStore } from '@/stores/package'
  import { useChannelStore } from '@/stores/channel'
  import { formatDate as formatDateUtil } from '@/utils/dateFormat'
  import { PackageStatus } from '@/types'
  import { calculateViewHeight } from '@/utils/calculateHeight'
  import { useScan } from '@/composables/useScan'

  const { t } = useI18n()
  const {goToScan, handleScanIn} = useScan()

  const inboundBatchStore = useInboundBatchStore()
  const packageStore = usePackageStore()
  const channelStore = useChannelStore()
  const route = useRoute()
  const titleStore = useTitleStore()
  titleStore.setTitle('inboundBatches.batchDetail')
  const loading = ref(false)
  const finished = ref(false)
  const manualInput = ref<string>('')

  // 扫描相关变量
  const scanResult = ref('')
  const scanSuccess = ref(false)

  // 获取批次ID
  const batchId = computed(() => route.params.id as string)

  // 获取当前批次信息
  const currentBatch = computed(() => inboundBatchStore.currentBatch)
  // 获取渠道进度信息
  const batchChannels = computed(() => inboundBatchStore.batchChannels)
  // 包裹数据状态管理
  const packages = ref<Array<any>>([])

  // 分页加载相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
  const packagesListRef = ref<HTMLElement | null>(null)

  // 加载初始数据
  const loadInitialData = async () => {
    packages.value = []
    currentPage.value = 1
    hasMore.value = true
    try {
      await loadPackages()
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  // 加载更多数据
  const loadMore = async () => {
    if (packageStore.loading || !hasMore.value) return
    currentPage.value++
    try {
      await loadPackages()
    } catch (error) {
      console.error('Failed to load more data:', error)
      // 加载失败时回滚页码
      currentPage.value--
    }
  }

  const loadPackages = async () => {
    const params: Record<string, any> = { batchId: batchId.value }
    if (selectedChannel.value) {
      params.channelId = selectedChannel.value
      params.column = "createTime"
      params.order = "desc"
    }
    const response = await packageStore.fetchInboundPackages(currentPage.value, pageSize.value, params)
    console.log('response', response)
    response.records.forEach(pkg => {
      // 如果是状态字段是字符串类型 进行转换状态为枚举类型 如果不是字符串类型 保持原始值
      if (typeof pkg.status === 'string') {
        switch (pkg.status) {
          case "1":
            pkg.status = PackageStatus.PENDING
            break
          case "3":
            pkg.status = PackageStatus.IN_STOCK
            break
          default:
            break
        }
      }
    })

    if (currentPage.value === 1) {
      // 第一页数据，直接替换
      packages.value = response.records
    } else {
      // 加载更多数据，追加
      packages.value = [...packages.value, ...response.records]
    }

    hasMore.value = currentPage.value < response.pages
    loading.value = false
    finished.value = !hasMore.value
  }


  // 滚动事件处理
  const handleScroll = () => {
    if (!packagesListRef.value) return

    const { scrollTop, clientHeight, scrollHeight } = packagesListRef.value
    const scrollThreshold = scrollHeight - clientHeight - 100

    if (scrollTop >= scrollThreshold) {
      loadMore()
    }
  }

  // 返回上一页
  // const handleBack = () => {
  //   router.push('/inbound-batches')
  // }



  // 获取入库进度百分比
  const getInboundProgress = (batch: any) => {
    if (!batch) return 0
    return inboundBatchStore.getInboundProgress(batch)
  }

  // 统一的进度条颜色渲染函数
  const getProgressColor = (progress: number, type: 'inbound' | 'outbound' = 'inbound') => {
    // 根据进度值返回不同颜色，使用现代渐变色彩方案
    if (progress >= 90) return type === 'inbound' ? '#4CAF50' : '#8BC34A' // 深绿/浅绿
    if (progress >= 70) return type === 'inbound' ? '#2196F3' : '#64B5F6' // 深蓝/浅蓝
    if (progress >= 50) return type === 'inbound' ? '#FF9800' : '#FFB74D' // 深橙/浅橙
    if (progress >= 30) return type === 'inbound' ? '#FFC107' : '#FFD54F' // 深黄/浅黄
    return type === 'inbound' ? '#FF5252' : '#FF8A80' // 深红/浅红
  }





  // 获取入仓进度条颜色（使用统一函数）
  const getInboundProgressColor = (batch: any) => {
    const progress = getInboundProgress(batch)
    return getProgressColor(progress, 'inbound')
  }



  // 获取渠道入仓进度百分比，使用store中的getter
  const getChannelProgress = (channel: any) => {
    if (!channel) return 0
    return inboundBatchStore.getChannelProgress(channel)
  }

  // 获取渠道入仓进度条颜色（使用统一函数）
  const getChannelInboundProgressColor = (channel: any) => {
    const progress = getChannelProgress(channel)
    return getProgressColor(progress, 'inbound')
  }





  // 渠道过滤状态
  const selectedChannel = ref<string | null>(null)

  // 获取选中渠道的名称
  const selectedChannelCode = computed(() => {
    if (!selectedChannel.value) return ''
    const channel = channelStore.getChannelById(selectedChannel.value)
    return channel?.code || channel?.name || selectedChannel.value
  })

  // 处理渠道点击
  const handleChannelClick = (channel: any) => {
    selectedChannel.value = channel.channelId
    loadInitialData()
  }

  // 取消渠道过滤
  const cancelChannelFilter = () => {
    selectedChannel.value = null
    loadInitialData()
  }

  // 跳转到独立扫描页面的处理函数
  const goToScanHandler = () => {
    goToScan('inbound-batch-detail', 'handleScanIn')
  }

  // 处理手动输入
  const handleManualInput = async () => {
    if (manualInput.value.trim()) {
      await handleScanIn(manualInput.value.trim(), batchId.value)
      manualInput.value = ''
    }
  }

  // 处理扫描结果（从扫描页面返回时调用）
  const handleScanResult = (result: boolean, message: string) => {
    scanSuccess.value = result
    scanResult.value = message

    // 3秒后清除扫描结果
    setTimeout(() => {
      scanResult.value = ''
    }, 3000)

    // 如果扫描成功，重新加载批次数据和包裹数据
    if (result) {
      inboundBatchStore.fetchBatchById(batchId.value)
      inboundBatchStore.fetchBatchChannels(batchId.value)
      loadInitialData()
    }
  }

  // 过滤后的包裹记录
  const filteredPackages = computed(() => {
    return packages.value
  })



  // 获取包裹状态标签类型
  const getPackageStatusTagType = (status?: PackageStatus) => {
    switch (status) {
      case PackageStatus.IN_STOCK:
        return 'success'
      case PackageStatus.PENDING:
        return 'warning'
      case PackageStatus.OUT_OF_STOCK:
        return 'default'
      default:
        return 'default'
    }
  }

  // 获取包裹状态文本
  const getPackageStatusText = (status?: PackageStatus) => {
    switch (status) {
      case PackageStatus.IN_STOCK:
        return t('status.package.inStock')
      case PackageStatus.PENDING:
        return t('status.package.pending')
      case PackageStatus.PENDING_INTERCEPT:
        return t('status.package.pendingIntercept')
      case PackageStatus.INTERCEPTED:
        return t('status.package.intercepted')
      case PackageStatus.OUT_OF_STOCK:
        return t('status.package.outOfStock')
      default:
        return t('status.package.unknown')
    }
  }

  // 获取包裹渠道名称
  const getPackageChannelName = (pkg: any) => {
    // 尝试从包裹对象中获取渠道ID
    const channelId = pkg.channel || pkg.channelId
    if (!channelId) return '未知'

    // 从渠道Store中获取渠道信息
    const channel = channelStore.getChannelById(channelId)
    if (channel) {
      return channel.code || channel.name || ""
    }

    // 如果找不到渠道信息，返回渠道ID
    return channelId
  }

  // 格式化日期
  const formatDate = (date?: string | Date) => {
    // 将字符串转换为Date对象，确保dateObj不是undefined
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDateUtil(dateObj || new Date())
  }

  // 页面加载时获取批次详情
  onMounted(async () => {
    inboundBatchStore.fetchBatchById(batchId.value)
    inboundBatchStore.fetchBatchChannels(batchId.value)
    // 加载包裹数据
    await loadInitialData()

    // 添加滚动事件监听
    if (packagesListRef.value) {
      packagesListRef.value.addEventListener('scroll', handleScroll)
    }

    // 检查是否有扫描结果（从扫描页面返回时）
    const scanSuccess = route.query.scanSuccess === 'true'
    const scanMessage = route.query.scanMessage as string
    if (scanMessage) {
      handleScanResult(scanSuccess, scanMessage)
    }
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    if (packagesListRef.value) {
      packagesListRef.value.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<style scoped>


  .content {
    width: 100%;
    /* background-color: black; */
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: calc(100vh - var(--app-bar-height) - var(--bottom-navigation-height));
  }

  .batch-info-card {
    margin-bottom: 0;
  }

  .batch-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label {
    font-weight: 500;
    min-width: 120px;
    /* 增加最小宽度以适应德文 */
    flex-shrink: 0;
    /* 防止压缩 */
    color: var(--text-secondary);
  }

  .value {
    flex: 1;
    color: var(--text-primary);
  }

  .status-tag {
    font-size: 12px;
  }

  .progress-section {
    flex: 1;
  }

  .progress-text {
    font-size: 14px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-primary);
  }

  .progress-percentage {
    font-weight: 500;
    color: var(--text-primary);
  }

  .progress-bar {
    width: 100%;
  }

  .channels-card,
  .packages-card {
    margin-bottom: 0;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 16px;
    color: var(--text-primary);
  }

  .channels-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .channel-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .channel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .channel-name {
    font-weight: 500;
    font-size: 16px;
    color: var(--text-primary);
  }

  .channel-progress-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .channel-progress-text {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
  }

  .progress-label {
    font-weight: 500;
    color: var(--text-secondary);
  }

  .progress-percentage {
    font-weight: 500;
    color: var(--text-primary);
  }

  .channel-progress-bar {
    width: 100%;
  }

    .scanner-section {
    margin-bottom: 30px;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .scan-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .scan-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    gap: 20px;
  }

  .scan-button-container :deep(.var-button) {
    min-height: 56px;
    min-width: 200px;
    font-size: 16px;
    font-weight: 500;
  }

  .manual-input-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .manual-input-section :deep(.var-input) {
    margin-bottom: 10px;
  }


  .packages-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 8px;
  }

  .cell-content {
    width: 100%;
  }

  .package-item {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background-color: var(--surface-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease;
  }

  .package-item:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .package-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .track-no {
    font-weight: 600;
    font-size: 16px;
    color: var(--text-primary);
  }

  .package-status-tag {
    font-size: 12px;
  }

  .package-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .package-details {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: var(--text-primary);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .package-date {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: var(--text-secondary);
  }

  .loading-more,
  .no-more {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 16px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  /* 扫描入库样式 */
  .scan-in-card {
    margin-bottom: 0;
  }

  .scan-in-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
  }

  .scan-button {
    min-width: 200px;
  }

  .scan-result {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    justify-content: center;
  }

  .scan-result.success {
    background-color: var(--color-success-light);
    color: var(--color-success);
  }

  .scan-result.error {
    background-color: var(--color-danger-light);
    color: var(--color-danger);
  }
</style>
