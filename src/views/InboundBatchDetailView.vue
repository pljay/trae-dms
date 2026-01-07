<template>
  <div class="inbound-batch-detail">
    <TopBar :title="$t('inboundBatches.batchDetail')" @back="handleBack" />
    <div class="content">
      <!-- 批次基本信息 -->
      <var-card class="batch-info-card">
        <div class="batch-info">
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.batchNo') }}</span>
            <span class="value">{{ currentBatch?.batchNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.status') }}</span>
            <var-tag
              :type="getStatusTagType(currentBatch?.status)"
              class="status-tag"
            >
              {{ getStatusText(currentBatch?.status) }}
            </var-tag>
          </div>
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.createdAt') }}</span>
            <span class="value">{{ formatDate(currentBatch?.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ $t('inboundBatches.labels.inboundProgress') }}</span>
            <div class="progress-section">
              <div class="progress-text">
                {{ currentBatch?.inboundQuantity }}/{{ currentBatch?.expectedQuantity }}
                ({{ getInboundProgress(currentBatch) }}%)
              </div>
              <var-progress
                :percentage="getInboundProgress(currentBatch)"
                :color="getProgressColor(currentBatch)"
                :height="8"
                class="progress-bar"
              />
            </div>
          </div>
        </div>
      </var-card>

      <!-- 渠道进度 -->
      <var-card class="channels-card">
        <div class="card-header">
          <div class="card-title">
            <var-icon name="format-list-bulleted" />
            <span>{{ $t('inboundBatches.channelProgress') }}</span>
          </div>
        </div>
        
        <div v-if="batchChannels.length > 0" class="channels-list">
          <div v-for="channel in batchChannels" :key="channel.channel" class="channel-item">
            <var-card shadow="hover" class="channel-card">
              <div class="channel-info">
                <div class="channel-header">
                  <div class="channel-name">{{ channel.channel }}</div>
                  <div class="channel-progress-text">
                    {{ channel.inboundQuantity }}/{{ channel.expectedQuantity }}
                    ({{ getChannelProgress(channel) }}%)
                  </div>
                </div>
                <var-progress
                  :percentage="getChannelProgress(channel)"
                  :color="getChannelProgressColor(channel)"
                  :height="6"
                  class="channel-progress-bar"
                />
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
        </div>
        
        <div v-if="batchPackages.length > 0" class="packages-list">
          <var-list>
            <var-cell
              v-for="pkg in batchPackages"
              :key="pkg.id"
              class="package-item"
            >
              <div class="cell-content">
                <div class="package-title">
                  <div class="track-no">{{ pkg.trackNo }}</div>
                  <var-tag
                    :type="getPackageStatusTagType(pkg.status)"
                    class="package-status-tag"
                  >
                    {{ getPackageStatusText(pkg.status) }}
                  </var-tag>
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
                  </div>
                  <div class="package-date">
                    {{ formatDate(pkg.createdAt) }}
                  </div>
                </div>
              </div>
            </var-cell>
          </var-list>
        </div>
        <div v-else class="empty-state">
          <var-empty :description="$t('inboundBatches.noPackageRecords')" />
        </div>
      </var-card>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TopBar from '@/components/TopBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useInboundBatchStore } from '@/stores/inbound'
import { formatDate as formatDateUtil } from '@/utils/dateFormat'
import { InboundStatus, PackageStatus } from '@/types'

const { t } = useI18n()

const inboundBatchStore = useInboundBatchStore()
const router = useRouter()
const route = useRoute()

// 获取批次ID
const batchId = computed(() => route.params.id as string)

// 获取当前批次信息
const currentBatch = computed(() => inboundBatchStore.currentBatch)
// 获取渠道进度信息
const batchChannels = computed(() => inboundBatchStore.batchChannels)
// 获取包裹记录
const batchPackages = computed(() => inboundBatchStore.batchPackages)

// 返回上一页
const handleBack = () => {
  router.push('/inbound-batches')
}

// 获取状态标签类型
const getStatusTagType = (status?: InboundStatus) => {
  switch (status) {
    case InboundStatus.PENDING:
      return 'warning'
    case InboundStatus.IN_PROGRESS:
      return 'primary'
    case InboundStatus.COMPLETED:
      return 'success'
    default:
      return 'default'
  }
}

// 获取状态文本
const getStatusText = (status?: InboundStatus) => {
  switch (status) {
    case InboundStatus.PENDING:
      return t('status.notInbound')
    case InboundStatus.IN_PROGRESS:
      return t('status.inProgress')
    case InboundStatus.COMPLETED:
      return t('status.completed')
    default:
      return t('status.unknown')
  }
}

// 获取入库进度百分比
const getInboundProgress = (batch: any) => {
  if (!batch) return 0
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

// 获取渠道进度百分比
const getChannelProgress = (channel: any) => {
  if (!channel) return 0
  return inboundBatchStore.getChannelProgress(channel)
}

// 获取渠道进度条颜色
const getChannelProgressColor = (channel: any) => {
  const progress = getChannelProgress(channel)
  if (progress === 100) return '#4CAF50'
  if (progress >= 50) return '#2196F3'
  if (progress >= 25) return '#FFC107'
  return '#FF5252'
}

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
      return t('status.inStock')
    case PackageStatus.PENDING:
      return t('status.pending')
    case PackageStatus.OUT_OF_STOCK:
      return t('status.outOfStock')
    default:
      return t('status.unknown')
  }
}

// 格式化日期
const formatDate = (date?: string | Date) => {
  // 将字符串转换为Date对象，确保dateObj不是undefined
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDateUtil(dateObj || new Date())
}

// 页面加载时获取批次详情
onMounted(() => {
  inboundBatchStore.fetchBatchById(batchId.value)
  inboundBatchStore.fetchBatchChannels(batchId.value)
})
</script>

<style scoped>
.inbound-batch-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content {
  padding: 16px;
}

.batch-info-card {
  margin-bottom: 16px;
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
  color: #666;
  width: 80px;
}

.value {
  flex: 1;
  color: #333;
}

.status-tag {
  font-size: 12px;
}

.progress-section {
  flex: 1;
}

.progress-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.progress-bar {
  width: 100%;
}

.channels-card,
.packages-card {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.channel-card {
  padding: 12px;
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.channel-progress-text {
  font-size: 14px;
  color: #666;
}

.channel-progress-bar {
  width: 100%;
}

.packages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cell-content {
  width: 100%;
}

.package-item {
  border-radius: 8px;
  overflow: hidden;
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
  color: #333;
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
  color: #666;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.package-date {
  font-size: 12px;
  color: #999;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>
