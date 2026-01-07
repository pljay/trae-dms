<template>
  <div class="barcode-scanner">
    <var-card shadow="hover">
      <!-- 摄像头扫描区域 -->
      <div class="scanner-container" v-if="showCamera">
        <video ref="videoRef" class="scanner-video" autoplay playsinline></video>
        <canvas ref="canvasRef" class="scanner-canvas" style="display: none;"></canvas>
        <!-- 扫描线效果 -->
        <div class="scan-line"></div>
      </div>
      
      <!-- 手动输入区域 -->
      <div class="input-container" v-else>
        <var-input
          v-model="manualInput"
          :placeholder="$t('scanIn.manualInput')"
          @keyup.enter="handleManualInput"
          size="normal"
          clearable
        >
        </var-input>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <var-button
          type="primary"
          @click="toggleScannerMode"
          size="normal"
        >
          {{ showCamera ? $t('scanIn.manualInput') : $t('scanIn.cameraScan') }}
        </var-button>
      </div>
    </var-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { BrowserMultiFormatReader } from '@zxing/library'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  autoStart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  scan: [code: string]
  error: [message: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const showCamera = ref(props.autoStart)
const manualInput = ref('')
let stream: MediaStream | null = null
let scanning = false
let barcodeReader: BrowserMultiFormatReader | null = null

// 切换扫描模式
const toggleScannerMode = async () => {
  // 无论切换到哪种模式，先确保摄像头已停止
  if (stream || scanning) {
    stopCamera()
  }
  
  // 切换模式
  showCamera.value = !showCamera.value
  
  // 如果切换到摄像头模式，重新启动摄像头
  if (showCamera.value) {
    // 增加延迟时间，确保DOM已完全更新
    await new Promise(resolve => setTimeout(resolve, 300))
    startCamera()
  }
}

// 启动摄像头
const startCamera = async () => {
  // 多次检查确保视频元素可用
  let attempts = 0
  const maxAttempts = 5
  const checkInterval = 100
  
  while (!videoRef.value && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, checkInterval))
    attempts++
  }
  
  if (!videoRef.value) {
    console.error('Video element not available after multiple attempts')
    Snackbar({ type: 'error', content: t('scanIn.cameraInitFailed') })
    emit('error', t('scanIn.cameraInitFailed'))
    showCamera.value = false
    return
  }
  
  try {
    // 检查浏览器是否支持getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(t('scanIn.cameraNotSupported'))
    }
    
    // 确保之前的流已经关闭
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }
    
    // 请求摄像头权限
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    
    // 设置视频源
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    
    // 等待视频加载完成
    await new Promise<void>((resolve) => {
      if (!videoRef.value) {
        resolve()
        return
      }
      videoRef.value.onloadedmetadata = () => resolve()
      // 添加超时保护
      const timeout = setTimeout(() => resolve(), 3000)
      videoRef.value.onloadedmetadata = () => {
        clearTimeout(timeout)
        resolve()
      }
    })
    
    // 初始化条码阅读器
    barcodeReader = new BrowserMultiFormatReader()
    
    // 开始扫描
    setTimeout(() => {
      scanning = true
      scanBarcode()
    }, 1000)
    
    Snackbar({ type: 'success', content: t('scanIn.cameraStarted') })
  } catch (error) {
    console.error('Camera error:', error)
    let errorMsg = t('common.error')
    if (error instanceof Error) {
      errorMsg = error.message
    } else if (typeof error === 'string') {
      errorMsg = error
    }
    // 显示友好的错误信息
    if (errorMsg.includes('Permission denied') || errorMsg.includes('NotAllowedError')) {
      errorMsg = t('scanIn.cameraPermissionDenied')
    } else if (errorMsg.includes('NotFoundError')) {
      errorMsg = t('scanIn.cameraNotFound')
    } else if (errorMsg.includes('NotReadableError')) {
      errorMsg = t('scanIn.cameraInUse')
    }
    Snackbar({ type: 'error', content: errorMsg })
    emit('error', errorMsg)
    // 切换回手动输入模式
    showCamera.value = false
  }
}

// 停止摄像头
const stopCamera = () => {
  scanning = false
  
  // 停止扫描循环
  if (barcodeReader) {
    barcodeReader.reset()
    barcodeReader = null
  }
  
  // 停止视频流
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  
  // 清空视频源
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

// 扫描条码
const scanBarcode = async () => {
  if (!scanning || !videoRef.value || !barcodeReader) return
  
  try {
    // 使用ZXing.js识别条码
    const result = await barcodeReader.decodeFromVideoElement(videoRef.value)
    if (result && result.getText()) {
      console.log('识别到条码:', result.getText())
      emit('scan', result.getText())
      Snackbar({ type: 'success', content: t('scanIn.scanSuccess') })
      stopCamera()
      showCamera.value = false
    } else {
      // 继续扫描
      if (scanning) {
        requestAnimationFrame(scanBarcode)
      }
    }
  } catch (error) {
    // 识别失败，继续扫描
    if (scanning) {
      requestAnimationFrame(scanBarcode)
    }
  }
}

// 手动输入处理
const handleManualInput = () => {
  if (!manualInput.value.trim()) {
    Snackbar({ type: 'warning', content: t('scanIn.pleaseInputBarcode') })
    return
  }
  
  emit('scan', manualInput.value.trim())
  Snackbar({ type: 'success', content: t('scanIn.scanSuccess') })
  manualInput.value = ''
}

// 组件挂载时启动摄像头
onMounted(() => {
  if (props.autoStart) {
    startCamera()
  }
})

// 组件卸载前停止摄像头
onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped lang="css">
.barcode-scanner {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  font-weight: 500;
}

.scanner-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  background-color: #000;
  box-shadow: inset 0 0 0 2px var(--border-color);
}

.scanner-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  animation: scanLine 2s infinite linear;
  box-shadow: 0 0 10px 2px #00ff00;
  z-index: 1;
}

@keyframes scanLine {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}

.input-container {
  margin-bottom: 20px;
}

/* 确保输入框有足够的触摸目标大小 */
.input-container :deep(.var-input) {
  height: var(--input-height);
}

.input-container :deep(.var-button) {
  height: var(--button-height);
}

.action-buttons {
  display: flex;
  justify-content: center;
}

/* 确保按钮有足够的触摸目标大小 */
.action-buttons :deep(.var-button) {
  min-height: var(--button-height);
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: var(--breakpoint-tablet)) {
  .barcode-scanner {
    padding: 0 10px;
  }
  
  .scanner-container {
    padding-top: 100%; /* 1:1 aspect ratio on mobile for better scanning experience */
    margin-bottom: 15px;
  }
  
  .input-container {
    margin-bottom: 15px;
  }
}

/* 小屏设备适配 */
@media (max-width: var(--breakpoint-mobile)) {
  .barcode-scanner {
    padding: 0 8px;
  }
  
  .action-buttons :deep(.var-button) {
    width: 100%;
  }
}
</style>
