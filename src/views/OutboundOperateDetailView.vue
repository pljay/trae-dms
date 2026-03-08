<template>
  <div class="outbound-detail-container">
    <!-- 主要内容区域 -->
    <div class="content-area">
      <!-- 批次信息 -->
      <var-card shadow="hover" class="batch-info-card">
        <div class="batch-info">
          <div class="batch-item">
            <span>{{ currentBatch?.serialNumber }}</span>
          </div>
          <div class="batch-item">
            <label>{{ $t('outboundOperateDetailView.scannedCount') }}:</label>
            <span>{{ outboundCount }}</span>
          </div>
        </div>
      </var-card>
      <!-- 渠道进度 -->
      <var-card shadow="hover" class="channel-progress-card">
        <div class="channel-progress">
          <div v-for="channel in batchChannels" :key="channel.channelId" class="channel-item">
            <span>{{ channel.channelCode }}</span>
            <span>{{ channel.actualQuantity }}</span>
          </div>
        </div>
      </var-card>

      <!-- 扫描按钮 -->
      <var-card shadow="hover" class="scan-section">
        <div class="scan-content">
          <var-button type="primary" size="large" :icon="'camera'" @click="goToScan" class="scan-button">
            {{ $t('scan.camera') }}
          </var-button>
          <!-- 手动输入区域 -->
          <div class="manual-input-area">
            <var-input v-model="manualInput" :placeholder="$t('scan.manualInput')" @keyup.enter="handleManualInput"
              size="normal" clearable class="manual-input">
            </var-input>
            <var-button type="success" size="large" @click="handleManualInput" :disabled="!manualInput.trim()"
              class="confirm-button">
              {{ $t('common.confirm') }}
            </var-button>
          </div>
        </div>
      </var-card>

      <!-- 扫描结果显示 -->

      <var-card v-if="scanResult"
        :class="['scan-result-section', scanStatus === 'success' ? 'scan-result-card' : 'scan-result-card error']"
        shadow="hover">
        <div class="scan-result-content">
          <div class="scan-result-title">
            {{ scanStatus === 'success' ? $t('scan.message.scanSuccess') : $t('scan.message.scanFailed') }}
          </div>
          <div class="scan-result-barcode">
            {{ $t('scan.barcode') }}: {{ scanResult.no }}
          </div>
          <div v-if="errorMessage" class="scan-result-error">
            {{ $t('scan.errorReason') }}: {{ errorMessage }}
          </div>
        </div>
      </var-card>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <var-button type="success" @click="completeOutbound" :disabled="outboundCount === 0"
        class="action-button complete-button">
        {{ $t('outboundOperateDetailView.complete') }}
      </var-button>
    </div>
  </div>
</template>



<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Snackbar, Dialog } from '@varlet/ui'
  import { useScan } from '@/composables/useScan'
  import { useTitleStore } from '@/stores/title'
  import { useOutboundStore } from '@/stores/outbound'
  import { Package } from '@/types'


  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const { scanCount: outboundCount, handleScanOut, completeOperation } = useScan()
  const manualInput = ref<string>('')
  const titleStore = useTitleStore()
  const outboundStore = useOutboundStore()
  titleStore.setTitle('outboundOperateDetailView.title')
  // 获取渠道进度信息
  const currentBatch = computed(() => outboundStore.currentBatch)
  // 获取渠道进度信息
  const batchChannels = computed(() => outboundStore.batchChannels)

  // 扫描结果相关变量
  const scanResult = ref<Package | null>(null)
  const scanStatus = ref<'success' | 'error' | 'warning' | null>(null)
  const errorMessage = ref<string>('')

  // 获取批次ID
  const batchId = computed(() => route.params.id as string)

  // 批次信息
  const batchInfo = reactive({
    batchId: batchId.value,
    batchNo: '',
    channelId: '',
    channelCode: '',
    quantity: 0
  })

  // 跳转到独立扫描页面
  const goToScan = () => {
    router.push({
      name: 'scan',
      query: {
        from: 'outbound-operate-detail',
        callback: 'handleScanOut',
        batchId: batchInfo.batchId
      }
    })
  }

  // 处理手动输入
  const handleManualInput = async () => {
    if (manualInput.value.trim()) {
      await handleScan(manualInput.value.trim(), batchInfo.batchId)
      manualInput.value = ''
    }
  }



  // 处理扫描结果
  const handleScan = async (code: string, batchId: string) => {
    clearScanResult()
    const result = await handleScanOut(code, batchId)
    if (result.success) {
      // 先加载批次数据和渠道进度
      await outboundStore.getBatchById(batchId)
      await outboundStore.getOutboundBatchChannels(batchId)
    } 
      // 即使失败，也要保留扫描到的单号
      scanResult.value = {
        ...result.data,
        no: code
      } as Package
      scanStatus.value = result.status
      errorMessage.value = result.message || ''
    
  }

  // 检查路由参数和会话存储中的扫描结果
  onMounted(async () => {
    if (batchInfo.batchId) {
      try {
        await outboundStore.getBatchById(batchInfo.batchId)
        await outboundStore.getOutboundBatchChannels(batchInfo.batchId)
        outboundCount.value = currentBatch.value?.pieces || 0
      } catch (error) {
        Snackbar({
          type: 'error',
          content: t('outboundOperateDetailView.batchNotFound'),
          duration: 2000
        })
        goBack()
      }
    } else {
      // 如果没有批次号参数，返回列表页    
      Snackbar({
        type: 'error',
        content: t('outboundOperateDetailView.batchNotFound'),
        duration: 2000
      })
      goBack()
    }
  })

  // 完成出库
  const completeOutbound = async () => {
    Dialog({
      title: t('common.confirm'),
      message: t('outboundOperateDetailView.confirmComplate'),
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      onConfirm: async () => {
        const success = await completeOperation(batchInfo.batchId)
        if (success) {
          // 返回列表页并刷新
          goBack()
        }
      }
    })
  };

  // 返回列表页
  const goBack = () => {
    router.push('/outbound-operate-list');
  };

  // 清空扫描结果
  const clearScanResult = () => {
    scanResult.value = null
    scanStatus.value = null
    errorMessage.value = ''
  }

</script>
<style scoped lang="css">
  .outbound-detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    box-sizing: border-box;
  }

  /* 批次信息样式 */
  .batch-info-card {
    margin-bottom: 16px;
  }

  .batch-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 16px;
    width: 100%;
  }

  .batch-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    flex: 1;
    min-width: 0;
  }

  .batch-item label {
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .batch-item span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .channel-progress-card {
    margin-bottom: 16px;
  }

  .channel-progress {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .channel-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .channel-item label {
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .channel-item span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    /* .batch-info {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
   */
    /* .batch-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  } */

    .batch-item label {
      font-size: 12px;
    }

    .batch-item span {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .batch-item label {
      font-size: 11px;
    }

    .batch-item span {
      font-size: 11px;
    }
  }

  /* 扫描按钮样式 */
  .scan-section {
    margin-bottom: 16px;
  }

  .scan-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .scan-button {
    width: 100%;
    max-width: 300px;
    font-size: 16px;
    padding: 12px 0;
  }

  .manual-input-area {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .manual-input {
    flex: 1;
    min-width: 0;
  }

  .confirm-button {
    flex-shrink: 0;
  }

  /* 扫描结果样式 */
  .scan-result-section {
    margin-bottom: 16px;
  }

  .scan-result-card {
    border-top: 4px solid var(--success-color);
  }

  .scan-result-card.error {
    border-top-color: var(--error-color);
  }

  .scan-result-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .scan-result-title {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  .scan-result-barcode {
    font-size: 14px;
    text-align: center;
  }

  .scan-result-error {
    font-size: 14px;
    color: var(--error-color);
    text-align: center;
    word-break: break-word;
  }

  /* 操作按钮样式 */
  .action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    box-sizing: border-box;
    /* background-color: var(--surface-color); */
    border-top: 1px solid var(--border-color);
    /* box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); */
  }

  .action-button {
    flex: 1;
    font-size: 16px;
    padding: 10px 0;
  }

  @media (max-width: 768px) {
    /* .batch-info {
    flex-direction: column;
    align-items: stretch;
  } */

    /* .batch-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
  } */

    .batch-item label {
      margin-bottom: 0;
    }

    .manual-input-area {
      flex-direction: column;
      align-items: stretch;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
    }
  }
</style>