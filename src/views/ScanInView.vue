<template>
  <div class="scan-in-container">
    <!-- 扫描按钮 -->
    <div class="scan-section">
      <var-card shadow="hover" class="scan-card">
        <div class="scan-button-container">
          <var-button
            type="primary"
            size="large"
            :icon="'camera'"
            @click="goToScan"
          >
            {{ $t('scanIn.cameraScan') }}
          </var-button>
          
          <!-- 手动输入区域 -->
          <div class="manual-input-section">
            <var-input
              v-model="manualInput"
              :placeholder="$t('scanIn.manualInput')"
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
            <span>{{ $t('scanIn.scanSuccess') }}</span>
          </div>
        </template>
        <div class="result-info">
          <div class="result-item">
            <label>{{ $t('scanIn.trackNo') }}:</label>
            <span>{{ scanResult.trackNo }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('scanIn.channel') }}:</label>
            <span>{{ scanResult.channel }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('scanIn.country') }}:</label>
            <span>{{ scanResult.country }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('packageRecords.table.weight') }}:</label>
            <span>{{ scanResult.weight }} kg</span>
          </div>
          <div class="result-item">
            <label>{{ $t('packageRecords.table.dimensions') }}:</label>
            <span>{{ scanResult.length }}x{{ scanResult.width }}x{{ scanResult.height }} cm</span>
          </div>
        </div>
      </var-card>

      <!-- 拦截状态-->
      <var-card shadow="hover" class="result-card intercept" v-else-if="scanStatus === 'intercept' && scanResult">
        <template #title>
          <div class="card-header">
            <var-icon name="warning" class="status-icon intercept-icon" />
            <span>{{ $t('scanIn.intercepted') }}</span>
          </div>
        </template>
        <div class="result-info">
          <div class="result-item">
            <label>{{ $t('scanIn.trackNo') }}:</label>
            <span>{{ scanResult.trackNo }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('scanIn.channel') }}:</label>
            <span>{{ scanResult.channel }}</span>
          </div>
          <div class="result-item">
            <label>{{ $t('scanIn.country') }}:</label>
            <span>{{ scanResult.country }}</span>
          </div>
          <div class="result-item intercept-message">
            <label>{{ $t('scanIn.interceptMessage') }}:</label>
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </var-card>

      <!-- 失败状态-->
      <var-card shadow="hover" class="result-card error" v-else-if="scanStatus === 'error'">
        <template #title>
          <div class="card-header">
            <var-icon name="close-circle" class="status-icon error-icon" />
            <span>{{ $t('scanIn.scanFailed') }}</span>
          </div>
        </template>
        <div class="result-info">
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
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { Snackbar } from '@varlet/ui'
  import { usePackageStore } from '@/stores/package'
  import { Package } from '@/types'
  import voiceNotification from '@/utils/voiceNotification'
  import { useTitleStore } from '@/stores/title'

  const { t } = useI18n()
  const router = useRouter()
  const packageStore = usePackageStore()
  const scanResult = ref<Package | null>(null)
  const scanStatus = ref<'success' | 'error' | 'intercept' | null>(null)
  const errorMessage = ref<string>('')
  const manualInput = ref<string>('')
  const titleStore = useTitleStore()
  titleStore.setTitle('scanIn.title')

  // 跳转到独立扫描页面
  const goToScan = () => {
    router.push({
      name: 'scan',
      query: {
        from: 'scan-in',
        callback: 'handleScan'
      }
    })
  }

  // 处理扫描结果
  const handleScan = async (code: string) => {
    console.log('扫描到条码:', code)

    // 调用入库方法
    const result = await packageStore.scanIn(code)
    console.log('入库结果:', result)
    if (result) {
      scanResult.value = result
      scanStatus.value = 'success'
      Snackbar({
        type: 'success',
        content: t('scanIn.scanSuccess'),
        duration: 2000
      })
      // 播放扫描成功语音
      voiceNotification.speakScanSuccess()
    } else if (result === null && packageStore.scanError) {
      // 模拟拦截情况
      scanResult.value = packageStore.scanError.pkg
      scanStatus.value = 'intercept'
      errorMessage.value = packageStore.scanError.message
      Snackbar({
        type: 'warning',
        content: t('scanIn.intercepted'),
        duration: 2000
      })
      // 播放拦截语音
      voiceNotification.speakIntercepted()
    } else {
      scanStatus.value = 'error'
      errorMessage.value = t('scanIn.scanFailed')
      Snackbar({
        type: 'error',
        content: t('scanIn.scanFailed'),
        duration: 2000
      })
      // 播放扫描失败语音
      voiceNotification.speakScanFailed()
    }

    // 3秒后清空结果
    setTimeout(() => {
      scanResult.value = null
      scanStatus.value = null
      errorMessage.value = ''
    }, 3000)
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
</script>

<style scoped lang="css">
  .scan-in-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .scan-section {
    margin-bottom: 30px;
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

  .result-section {
    margin-bottom: 40px;
  }

  .result-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .result-card.success {
    border-top: 4px solid #4CAF50;
  }

  .result-card.intercept {
    border-top: 4px solid #FFC107;
  }

  .result-card.error {
    border-top: 4px solid #f44336;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .status-icon {
    font-size: 1.5rem;
  }

  .success-icon {
    color: #4CAF50;
  }

  .intercept-icon {
    color: #FFC107;
  }

  .error-icon {
    color: #f44336;
  }

  .result-info {
    padding: 20px;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 1rem;
  }

  .result-item label {
    font-weight: 600;
    color: #333;
    min-width: 120px;
  }

  .result-item span {
    color: #666;
    flex: 1;
  }

  .intercept-message span {
    color: #FFC107;
    font-weight: 500;
  }

  .error-message span {
    color: #f44336;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .scan-in-container {
      padding: 15px;
    }

    .result-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }

    .result-item label {
      min-width: auto;
    }
  }
</style>
