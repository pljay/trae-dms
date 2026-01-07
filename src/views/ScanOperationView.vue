<template>
  <div class="scan-operation-container">
    <h1 class="page-title">{{ $t('scanOut.title') }}</h1>
    
    <!-- 返回按钮 -->
    <div class="back-section">
      <var-button @click="goBack" type="primary">{{ $t('common.back') }}</var-button>
    </div>
    
    <!-- 批次信息 -->
    <var-card shadow="hover" class="batch-info-card">
      <div class="batch-info">
        <div class="batch-item">
          <label>{{ $t('scanOut.step1.serialNumber') }}:</label>
          <span>{{ batchInfo.serialNumber }}</span>
        </div>
        <div class="batch-item">
          <label>{{ $t('scanOut.step2.channel') }}:</label>
          <span>{{ batchInfo.channel }}</span>
        </div>
        <div class="batch-item">
          <label>{{ $t('scanOut.step3.scannedCount', { count: outboundCount }) }}:</label>
          <span>{{ outboundCount }}</span>
        </div>
      </div>
    </var-card>
    
    <!-- 扫描组件 -->
    <div class="scanner-section">
      <BarcodeScanner 
        :title="$t('scanOut.step3.scan')" 
        :autoStart="false"
        @scan="(code) => handleScan(code, batchInfo.serialNumber)" 
        @error="handleError" 
      />
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
import {  reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { useOutboundStore } from '@/stores/outbound'
import BarcodeScanner from '@/components/BarcodeScanner.vue'
import { useScan } from '@/composables/useScan'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const outboundStore = useOutboundStore()
const { scanCount: outboundCount, handleScan, handleError, completeOperation } = useScan()

// 批次信息
const batchInfo = reactive({
  serialNumber: '',
  channel: ''
})

// 验证批次号是否存�?
const verifyBatchNumber = (serialNumber: string) => {
  const batch = outboundStore.getBatchBySerialNumber(serialNumber)
  if (batch) {
    batchInfo.serialNumber = serialNumber
    batchInfo.channel = batch.channel
    // 初始化已扫描数量
    outboundCount.value = batch.quantity
    return true
  }
  return false
}

// 检查路由参�?
onMounted(() => {
  const batchNumber = route.query.batchNumber as string
  if (batchNumber) {
    if (!verifyBatchNumber(batchNumber)) {
      Snackbar({
        type: 'error',
        content: t('scanOut.batchNotFound'),
        duration: 2000
      })
      router.push('/scan-out')
    } 
  } else {
    // 如果没有批次号参数，返回列表�?    
    Snackbar({
      type: 'error',
      content: t('scanOut.batchNotFound'),
      duration: 2000
    })
    router.push('/scan-out')
  }
})

// 完成出库
const completeOutbound = async () => {
  const success = await completeOperation(batchInfo.serialNumber)
  if (success) {
    // 返回列表页并刷新
    router.push('/scan-out');
  }
};

// 返回列表页
const goBack = () => {
  router.push('/scan-out');
};

</script>

<style scoped lang="css">
.scan-operation-container {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
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
