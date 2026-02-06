<template>
  <div class="barcode-scanner" :class="{ 'camera-active': showCamera && !isWebPlatform }">
    <!-- 原生扫描模式 -->
    <div v-if="showCamera && !isWebPlatform" class="scanner-wrapper">
      <!-- 摄像头预览容器（全屏） -->
      <div class="camera-preview-container"></div>
      
      <!-- 扫描覆盖层（居中显示扫描框） -->
      <div class="scan-overlay">
        <!-- 扫描框 -->
        <div class="scan-frame">
          <!-- 扫描线 -->
          <div class="scan-line"></div>
          <!-- 扫描提示文字 -->
          <div class="scan-hint">{{ $t('scanIn.pointCamera') }}</div>
          <!-- 四角边框 -->
          <div class="scan-corner top-left"></div>
          <div class="scan-corner top-right"></div>
          <div class="scan-corner bottom-left"></div>
          <div class="scan-corner bottom-right"></div>
        </div>
      </div>
    </div>
    
    <!-- Web扫描和手动输入使用卡片布局 -->
    <var-card shadow="hover" v-if="!showCamera || isWebPlatform">
      <!-- 摄像头预览（Web端） -->
      <div v-if="showCamera && isWebPlatform" class="scanner-container">
        <div class="web-scanner">
          <video ref="videoRef" class="scanner-video" autoplay playsinline></video>
          <canvas ref="canvasRef" class="scanner-canvas" style="display: none;"></canvas>
          <div class="scan-line"></div>
        </div>
      </div>
      
      <!-- 手动输入区域 -->
      <div v-else class="input-container">
        <var-input
          v-model="manualInput"
          :placeholder="$t('scanIn.manualInput')"
          @keyup.enter="handleManualInput"
          size="normal"
          clearable
        >
        </var-input>
      </div>
    </var-card>
    
    <!-- 悬浮按钮 -->
    <div class="floating-button-container">
      <var-button
        type="primary"
        :color="showCamera ? '#ff6b6b' : '#4ecdc4'"
        :icon="showCamera ? 'edit' : 'camera'"
        @click="toggleScannerMode"
        round
        size="large"
        :elevation="4"
      >
        {{ showCamera ? $t('scanIn.manualInput') : $t('scanIn.cameraScan') }}
      </var-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { BarcodeScanner, LensFacing, Resolution } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
import { BrowserMultiFormatReader } from '@zxing/library'
import vibrationNotification from '@/utils/vibrationNotification'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  autoStart: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  scan: [code: string]
  error: [message: string]
}>()

// 检查是否为Web平台
const isWebPlatform = computed(() => Capacitor.getPlatform() === 'web')

const showCamera = ref(false)
const manualInput = ref('')

// Web扫描相关变量
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null
let scanning = false
let barcodeReader: BrowserMultiFormatReader | null = null

// 原生扫描相关变量
const scanListeners = ref<any[]>([])

// 空函数，保持接口一致
const increaseBrightness = async () => {
  // 移除了ScreenBrightness依赖，此函数变为空实现
}

// 空函数，保持接口一致
const restoreBrightness = async () => {
  // 移除了ScreenBrightness依赖，此函数变为空实现
}

// 切换扫描模式
const toggleScannerMode = async () => {
  // 先停止当前扫描
  if (showCamera.value) {
    if (isWebPlatform.value) {
      stopWebScan()
    } else {
      await stopNativeScan()
    }
  }
  
  // 切换模式
  showCamera.value = !showCamera.value
  
  // 如果切换到摄像头模式，启动扫描
  if (showCamera.value) {
    // 提高亮度
    await increaseBrightness()
    if (isWebPlatform.value) {
      startWebScan()
    } else {
      await startNativeScan()
    }
  }
}

// 启动Web端摄像头扫描
const startWebScan = async () => {
  try {
    // 请求摄像头权限
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(t('scanIn.cameraNotSupported'))
    }
    
    // 确保之前的流已经关闭
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }
    
    // 确保视频元素已经停止
    if (videoRef.value) {
      // 检查视频是否正在播放，如果是则暂停
      if (!videoRef.value.paused) {
        try {
          await videoRef.value.pause()
        } catch (error) {
          console.error('Failed to pause video:', error)
        }
      }
      // 清空视频源
      videoRef.value.srcObject = null
    }
    
    // 请求摄像头权限
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
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
    scanning = true
    scanBarcode()
    
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
    showCamera.value = false
  }
}

// Web端扫描条码
const scanBarcode = async () => {
  if (!scanning || !videoRef.value || !barcodeReader) return
  
  try {
    // 使用ZXing.js识别条码 - 注意：decodeFromVideoElement是一次性的，需要手动循环
    const result = await barcodeReader.decodeFromVideoElement(videoRef.value)
    if (result && result.getText()) {
      console.log('Web端识别到条码:', result.getText())
      // 添加震动反馈
      vibrationNotification.vibrateSuccess()
      emit('scan', result.getText())
      Snackbar({ type: 'success', content: t('scanIn.scanSuccess') })
      stopWebScan()
      showCamera.value = false
    } else {
      // 继续扫描
      if (scanning) {
        setTimeout(scanBarcode, 100) // 使用setTimeout代替requestAnimationFrame，避免阻塞UI
      }
    }
  } catch (error) {
    // 识别失败，继续扫描
    if (scanning) {
      setTimeout(scanBarcode, 100) // 使用setTimeout代替requestAnimationFrame，避免阻塞UI
    }
  }
}

// 停止Web端扫描
const stopWebScan = async () => {
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
  
  // 恢复亮度
  await restoreBrightness()
}

// 启动原生摄像头扫描
const startNativeScan = async () => {
  try {
    // 请求摄像头权限
    const { camera } = await BarcodeScanner.requestPermissions()
    
    if (camera !== 'granted') {
      Snackbar({ type: 'error', content: t('scanIn.cameraPermissionDenied') })
      showCamera.value = false
      return
    }
    
    // 添加 scanner-active 类到 body，确保摄像头画面能够显示
    document.body.classList.add('scanner-active')
    
    // 添加条码扫描监听器
    const barcodeListener = await BarcodeScanner.addListener('barcodesScanned', (event) => {
      if (event.barcodes && event.barcodes.length > 0) {
        // 检查每个条码是否在扫描框内
        for (const barcode of event.barcodes) {
          if (isBarcodeInScanFrame(barcode)) {
            // 优先使用rawValue，如果没有则使用displayValue
            const barcodeValue = barcode.rawValue || barcode.displayValue
            if (barcodeValue) {
              // 添加震动反馈
              vibrationNotification.vibrateSuccess()
              
              emit('scan', barcodeValue.trim())
              Snackbar({ type: 'success', content: t('scanIn.scanSuccess') })
              stopNativeScan()
              return
            }
          }
        }
      }
    })
    
    // 添加错误监听器
    const errorListener = await BarcodeScanner.addListener('scanError', (event) => {
      console.error('扫描错误:', event.message)
      emit('error', t('scanIn.scanFailed'))
      stopNativeScan()
    })
    
    // 启动扫描 - 使用自定义扫描模式，而不是Google Barcode Scanner的现成界面
    await BarcodeScanner.startScan({
      lensFacing: 'BACK' as LensFacing,
      resolution: Resolution['1280x720']
    })
    
    // 存储监听器引用，以便稍后移除
    scanListeners.value = [barcodeListener, errorListener]
    
    Snackbar({ type: 'success', content: t('scanIn.cameraStarted') })
  } catch (error: unknown) {
    console.error('启动扫描失败:', error)
    // 确保在错误情况下也能恢复UI
    stopNativeScan()
    emit('error', t('scanIn.cameraInitFailed'))
  }
}

// 停止原生扫描
const stopNativeScan = async () => {
  try {
    // 停止扫描
    await BarcodeScanner.stopScan()
    
    // 移除所有监听器
    if (scanListeners.value.length > 0) {
      for (const listener of scanListeners.value) {
        await listener.remove()
      }
      scanListeners.value = []
    }
    
    // 恢复亮度
    await restoreBrightness()
  } catch (error) {
    console.error('停止扫描失败:', error)
  } finally {
    // 移除 scanner-active 类
    document.body.classList.remove('scanner-active')
    
    // 扫描完成后返回手动输入模式
    showCamera.value = false
  }
}

// 检查条码是否在扫描框内
const isBarcodeInScanFrame = (barcode: any): boolean => {
  // 如果没有角点信息，默认认为条码在扫描框内
  if (!barcode.cornerPoints) {
    return true
  }
  
  // 获取扫描框的位置和大小
  const scanFrameElement = document.querySelector('.scan-frame')
  if (!scanFrameElement) {
    return true
  }
  
  // 获取扫描框的边界
  const frameRect = scanFrameElement.getBoundingClientRect()
  const frameLeft = frameRect.left
  const frameTop = frameRect.top
  const frameRight = frameRect.right
  const frameBottom = frameRect.bottom
  
  // 获取屏幕尺寸
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  // 检查条码的所有角点是否在扫描框内
  // 注意：cornerPoints坐标是基于摄像头画面的，需要转换为屏幕坐标
  for (const point of barcode.cornerPoints) {
    // 将摄像头坐标转换为屏幕坐标
    // 假设摄像头画面是全屏的，需要根据实际情况调整
    const screenX = (point[0] / screenWidth) * screenWidth
    const screenY = (point[1] / screenHeight) * screenHeight
    
    // 检查点是否在扫描框内
    if (screenX < frameLeft || screenX > frameRight || screenY < frameTop || screenY > frameBottom) {
      // 只要有一个角点不在扫描框内，就认为条码不在扫描框内
      return false
    }
  }
  
  // 所有角点都在扫描框内，认为条码在扫描框内
  return true
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

// 组件挂载时启动摄像头（如果需要）
onMounted(() => {
  if (props.autoStart) {
    toggleScannerMode()
  }
})

// 组件卸载前确保扫描已停止
onBeforeUnmount(async () => {
  if (isWebPlatform.value) {
    await stopWebScan()
  } else {
    await stopNativeScan()
  }
})
</script>

<style scoped lang="css">
.barcode-scanner {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  font-weight: 500;
}

/* 扫描器容器 */
.scanner-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1; /* 确保导航栏可以显示在上方 */
}

/* 摄像头预览容器 */
.camera-preview-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 扫描覆盖层 */
.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  /* 使用矩形遮罩，更准确地显示扫描区域 */
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.7) 30%);
}

/* 扫描框 */
.scan-frame {
  position: relative;
  width: 280px;
  height: 280px;
  background-color: transparent;
  border-radius: 12px;
  overflow: hidden;
  pointer-events: none;
  margin: auto;
  z-index: 3;
}

/* 摄像头激活时的样式 */
.barcode-scanner.camera-active {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  animation: scanLine 2s infinite linear;
  box-shadow: 0 0 15px 3px #00ff00;
  z-index: 2;
}

@keyframes scanLine {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}

/* 扫描提示文字 */
.scan-hint {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  animation: pulse 1.5s infinite;
  z-index: 2;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

/* 四角边框 */
.scan-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #00ff00;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  animation: cornerFlash 2s infinite alternate;
}

@keyframes cornerFlash {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.scan-corner.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
  border-radius: 5px 0 0 0;
}

.scan-corner.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 5px 0 0;
}

.scan-corner.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 5px;
}

.scan-corner.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 5px 0;
}

/* Web扫描容器 */
.scanner-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  background-color: transparent;
  box-shadow: inset 0 0 0 2px var(--border-color);
}


.scanner-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.3) contrast(1.1);
}

.scanner-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.input-container {
  margin-bottom: 20px;
}

/* 确保输入框有足够的触摸目标大小 */
.input-container :deep(.var-input) {
  height: var(--input-height);
}

/* 悬浮按钮容器 */
.floating-button-container {
  position: fixed;
  bottom: 60px;
  right: 20px;
  z-index: 1000;
  pointer-events: auto; /* 确保按钮可以点击 */
}

/* 确保悬浮按钮有足够的触摸目标大小 */
.floating-button-container :deep(.var-button) {
  min-height: 56px;
  min-width: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.floating-button-container :deep(.var-button):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  
  .scan-frame {
    width: 85%;
  }
}

/* 小屏设备适配 */
@media (max-width: var(--breakpoint-mobile)) {
  .barcode-scanner {
    padding: 0 8px;
  }
  
  .scan-frame {
    width: 90%;
  }
  
  .floating-button-container {
    bottom: 40px;
    right: 15px;
  }
  
  .floating-button-container :deep(.var-button) {
    min-height: 52px;
    min-width: 52px;
    font-size: 14px;
  }
}
</style>
