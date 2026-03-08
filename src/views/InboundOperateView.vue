<template>
  <div>
    <!-- 扫描按钮 -->
    <div class="scan-section">
      <var-card shadow="hover" class="scan-card">
        <div class="scan-button-container">
          <var-button
            type="primary"
            size="large"
            :icon="'camera'"
            @click="goToScanHandler"
          >
            {{ $t('scan.camera') }}
          </var-button>
          
          <!-- 手动输入区域 -->
          <div class="manual-input-section">
            <var-input
              v-model="manualInput"
              :placeholder="$t('scan.manualInput')"
              @keyup.enter="handleManualInput"
              size="normal"
              clearable
            >
            </var-input>
            <var-button
              type="success"
              size="large"
              @click="handleManualInput"
              :disabled="!manualInput.trim()"
            >
              {{ $t('common.confirm') }}
            </var-button>
          </div>
        </div>
      </var-card>
    </div>

    <!-- 入库结果 -->
    <div v-if="scanStatus" class="result-section">
      <!-- 成功状态-->
      <var-card shadow="hover" class="result-card success" v-if="scanStatus === 'success' && scanResult">
        <template #title>
          <div class="card-header">
            <var-icon name="checkmark-circle" class="status-icon success-icon" />
            <span>{{ $t('inboundOperateView.scanSuccess') }}</span>
          </div>
        </template>
        <div class="result-info">
          <div class="result-item">
            <label>{{ $t('inboundOperateView.trackNo') }}:</label>
            <span>{{ scanResult.trackNo || scanResult.no }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('inboundOperateView.channel') }}:</label>
            <span>{{ scanResult.channelCode }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('inboundOperateView.quantity') }}:</label>
            <span>{{ scanResult.country }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('inboundOperateView.weight') }}:</label>
            <span>{{ scanResult.weight }} kg</span>
          </div>
          <div class="result-item">
            <label>{{ $t('inboundOperateView.dimensions') }}:</label>
            <span>{{ scanResult.length }}x{{ scanResult.width }}x{{ scanResult.height }} cm</span>
          </div>
        </div>
      </var-card>

      <!-- 警告状态-->
      <var-card shadow="hover" class="result-card warning" v-else-if="scanStatus === 'warning' && scanResult">
        <template #title>
          <div class="card-header">
            <var-icon name="warning" class="status-icon warn-icon" />
            <span>{{errorMessage }}</span>
          </div>
        </template>
        <div class="result-info">
          <div class="result-item">
            <label>{{ $t('inboundOperateView.trackNo') }}:</label>
            <span>{{ scanResult.trackNo || scanResult.no }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('inboundOperateView.status') }}:</label>
            <span>{{ scanResult.channelCode }}</span>
          </div>
          <div class="result-item warn-message">
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </var-card>

      <!-- 失败状态-->
      <var-card shadow="hover" class="result-card error" v-else-if="scanStatus === 'error'">
        <template #title>
          <div class="card-header">
            <var-icon name="close-circle" class="status-icon error-icon" />
            <span>{{ $t('inboundOperateView.scanFailed') }}</span>
          </div>
        </template>
        <div class="result-info">
          <div class="result-item">
            <label>{{ $t('inboundOperateView.trackNo') }}:</label>
            <span>{{ scanResult?.no }}</span>
          </div>
          <div class="result-item error-message">
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </var-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useTitleStore } from '@/stores/title'
  import { Package } from '@/types'
  import { useScan } from '@/composables/useScan'

  const scanResult = ref<Package | null>(null)
  const scanStatus = ref<'success' | 'error' | 'warning' | null>(null)
  const errorMessage = ref<string>('')
  const manualInput = ref<string>('')
  const titleStore = useTitleStore()
  titleStore.setTitle('inboundOperateView.title')


  // 使用扫描组合式函数
  const {
    goToScan,
    handleScanIn
  } = useScan()

  // 跳转到独立扫描页面的处理函数
  const goToScanHandler = () => {
    goToScan('inbound-operate', 'handleScan')
  }

  // 处理扫描结果
  const handleScan = async (code: string) => {
    clearScanResult()
    const result = await handleScanIn(code)
    console.log('Scan result:', result)
    if (result.success) {
      scanResult.value = result.data
      scanStatus.value = result.status
    } else {
      // 即使失败，也要保留扫描到的单号
      scanResult.value = {
        ...result.data,
        no: code
      } as Package
      scanStatus.value = result.status
      errorMessage.value = result.message || ''
    }
  }

  // 处理手动输入
  const handleManualInput = async () => {
    if (manualInput.value.trim()) {
      await handleScan(manualInput.value.trim())
      manualInput.value = ''
    }
  }

  // 检查会话存储中是否有扫描结果（从独立扫描页面返回）
  onMounted(() => {
    const scanResultFromStorage = sessionStorage.getItem('scanResult')
    if (scanResultFromStorage) {
      // 清除会话存储中的扫描结果
      sessionStorage.removeItem('scanResult')
      // 处理扫描结果
      handleScan(scanResultFromStorage)
    }
  })

  // 清空扫描结果
  const clearScanResult = () => {
    scanResult.value = null
    scanStatus.value = null
    errorMessage.value = ''
  }
</script>

<style scoped lang="css">

  .scan-section {
    margin-bottom: 40px;
  }

  .scan-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .scan-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 15px;
  }

  .scan-button-container :deep(.var-button) {
    min-height: 50px;
    min-width: 180px;
    font-size: 15px;
    font-weight: 500;
  }

  .manual-input-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .manual-input-section :deep(.var-input) {
    margin-bottom: 10px;
  }

  .result-section {
    margin-bottom: 30px;
  }

  .result-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    max-width: 100%;
    box-sizing: border-box;
  }

  .result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .result-card.success {
    border-top: 4px solid var(--success-color);
  }

  .result-card.warning {
    border-top: 4px solid var(--warning-color);
  }

  .result-card.error {
    border-top: 4px solid var(--error-color);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-primary);
    padding: 0 20px;
  }

  .status-icon {
    font-size: 1.3rem;
  }

  .success-icon {
    color: var(--success-color);
  }

  .warn-icon {
    color: var(--warning-color);
  }

  .error-icon {
    color: var(--error-color);
  }

  .result-info {
    padding: 15px 20px;
  }

  .result-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 0.95rem;
    flex-wrap: wrap;
  }

  .result-item label {
    font-weight: 600;
    color: var(--text-primary);
    min-width: 100px;
    flex-shrink: 0;
  }

  .result-item span {
    color: var(--text-secondary);
    flex: 1;
    word-break: break-word;
  }

  .warn-message span {
    color: var(--warning-color);
    font-weight: 500;
  }

  .error-message span {
    color: var(--error-color);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .scan-button-container {
      padding: 15px;
      gap: 10px;
    }

    .scan-button-container :deep(.var-button) {
      min-height: 48px;
      min-width: 160px;
      font-size: 14px;
    }

    .result-card {
      margin: 0 10px;
    }

    .card-header {
      font-size: 1rem;
      padding: 0 15px;
    }

    .status-icon {
      font-size: 1.2rem;
    }

    .result-info {
      padding: 12px 15px;
    }

    .result-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
      margin-bottom: 10px;
      font-size: 0.9rem;
    }

    .result-item label {
      min-width: auto;
      font-size: 0.85rem;
    }

    .result-item span {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .result-card {
      margin: 0 8px;
    }

    .card-header {
      font-size: 0.95rem;
    }

    .result-item {
      font-size: 0.85rem;
    }

    .result-item label {
      font-size: 0.8rem;
    }

    .result-item span {
      font-size: 0.8rem;
    }
  }
</style>
