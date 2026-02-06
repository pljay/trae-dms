<template>
  <div class="view-content scan-operation-container">

    <!-- 返回按钮 -->
    <div class="back-section">
      <var-button @click="goBack" type="primary">{{ $t('common.back') }}</var-button>
    </div>

    <!-- 批次信息 -->
    <var-card shadow="hover" class="batch-info-card">
      <div class="batch-info">
        <div class="batch-item">
          <label>{{ $t('scanOut.step1.serialNumber') }}:</label>
          <span>{{ batchInfo.batchNo }}</span>
        </div>
        <div class="batch-item">
          <label>{{ $t('scanOut.step2.channel') }}:</label>
          <span>{{ batchInfo.channelCode }}</span>
        </div>
        <div class="batch-item">
          <label>{{ $t('scanOut.step3.scannedCount', { count: outboundCount }) }}:</label>
          <span>{{ outboundCount }}</span>
        </div>
      </div>
    </var-card>

    <!-- 扫描按钮 -->
    <div class="scanner-section">
      <var-card shadow="hover" class="scan-card">
        <div class="scan-button-container">
          <var-button type="primary" size="large" :icon="'camera'" @click="goToScan">
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

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <var-button @click="goBack">{{ $t('common.cancel') }}</var-button>
      <var-button type="success" @click="completeOutbound" :disabled="outboundCount === 0">
        {{ $t('scanOut.step3.complete') }}
      </var-button>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Snackbar } from '@varlet/ui'
  import { useScan } from '@/composables/useScan'
  import { useTitleStore } from '@/stores/title'
  import { useOutboundStore } from '@/stores/outbound'


  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const { scanCount: outboundCount, handleScanOut, completeOperation } = useScan()
  const manualInput = ref<string>('')
  const titleStore = useTitleStore()
  const outboundStore = useOutboundStore()
  titleStore.setTitle('scanOut.title')

  // 批次信息
  const batchInfo = reactive({
    batchId: '',
    batchNo: '',
    channelId: '',
    channelCode: '',
    quantity: 0
  })

  //加载批次详情
  const loadBatchById = async () => {
    try {
      const response = await outboundStore.getBatchById(batchInfo.batchId)
      console.log(response)
      batchInfo.batchNo = response?.serialNumber || ''
      batchInfo.channelCode = response?.channelCode || ''
      batchInfo.quantity = response?.quantity || 0
      console.log(batchInfo)
    } catch (error) {
      Snackbar({
        type: 'error',
        content: t('scanOut.loadBatchFailed'),
        duration: 2000
      })
    }
  }

  // 跳转到独立扫描页面
  const goToScan = () => {
    router.push({
      name: 'scan',
      query: {
        from: 'scan-operation',
        callback: 'handleScanOut',
        batchId: batchInfo.batchId
      }
    })
  }

  // 处理手动输入
  const handleManualInput = async () => {
    if (manualInput.value.trim()) {
      await handleScanOut(manualInput.value.trim(), batchInfo.batchId)
      manualInput.value = ''
    }
  }

  // 检查路由参数和会话存储中的扫描结果
  onMounted(async () => {
    const batchId = route.query.batchId as string
    if (batchId) {
      batchInfo.batchId = batchId
      try {
        await loadBatchById()
      } catch (error) {
        Snackbar({
          type: 'error',
          content: t('scanOut.batchNotFound'),
          duration: 2000
        })
        goBack()
      }
    } else {
      // 如果没有批次号参数，返回列表页    
      Snackbar({
        type: 'error',
        content: t('scanOut.batchNotFound'),
        duration: 2000
      })
      goBack()
    }
  })

  // 完成出库
  const completeOutbound = async () => {
    const success = await completeOperation(batchInfo.batchId)
    if (success) {
      // 返回列表页并刷新
      goBack()
    }
  };

  // 返回列表页
  const goBack = () => {
    router.push('/scan-out');
  };

</script>

<style scoped lang="css">
  .scan-operation-container {
    width: 100%;
    /* background-color: black; */
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: calc(100vh - var(--app-bar-height) - var(--bottom-navigation-height));
  }

  .page-title {
    text-align: center;
    color: #333;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .back-section {
    margin-bottom: 20px;
  }

  .batch-info-card {
    margin-bottom: 30px;
    border-radius: 12px;
    overflow: hidden;
  }

  .batch-info {
    padding: 20px;
  }

  .batch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .batch-item:last-child {
    border-bottom: none;
  }

  .batch-item label {
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }

  .batch-item span {
    font-weight: 600;
    color: #333;
    font-size: 14px;
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

  .action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: auto;
  }

  .action-buttons :deep(.var-button) {
    min-width: 120px;
    border-radius: 8px;
    font-weight: 500;
  }

  .action-buttons :deep(.var-button--success) {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    border: none;
  }

  .action-buttons :deep(.var-button--success:hover) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(56, 239, 125, 0.4);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .scan-operation-container {
      padding: 15px;
    }

    .page-title {
      font-size: 20px;
      padding: 12px;
    }

    .batch-info {
      padding: 15px;
    }

    .batch-item {
      padding: 10px 0;
    }

    .batch-item label,
    .batch-item span {
      font-size: 13px;
    }

    .scanner-section {
      padding: 15px;
    }

    .action-buttons {
      flex-direction: column;
      align-items: stretch;
    }

    .action-buttons :deep(.var-button) {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 18px;
      padding: 10px;
    }

    .batch-info {
      padding: 12px;
    }

    .batch-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }
</style>
