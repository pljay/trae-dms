<template>
  <div class="barcode-scanner">
    <!-- 统一使用卡片布局，包括原生和Web端 -->
    <var-card shadow="hover">
      <!-- 摄像头预览（Web端） -->
      <div v-if="showCamera && isWebPlatform" class="scanner-container">
        <div class="web-scanner">
          <video ref="videoRef" class="scanner-video" autoplay playsinline></video>
          <canvas ref="canvasRef" class="scanner-canvas" style="display: none;"></canvas>
          <div class="scan-line"></div>
        </div>
      </div>
      
      <!-- 摄像头扫描（原生模式） -->
      
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
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { Capacitor } from '@capacitor/core'
import { BrowserMultiFormatReader } from '@zxing/library'

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

// 切换扫描模式
const toggleScannerMode = async () => {
  // 先停止当前扫描
  if (showCamera.value) {
    if (isWebPlatform.value) {
      stopWebScan()
    } else {
      await BarcodeScanner.stopScan()
    }
  }
  
  // 切换模式
  showCamera.value = !showCamera.value
  
  // 如果切换到摄像头模式，启动扫描
  if (showCamera.value) {
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
const stopWebScan = () => {
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

// 启动原生摄像头扫描
const startNativeScan = async () => {
  try {
    console.log('=== Barcode Scanner Debug ===')
    console.log('1. Starting native scan')
    console.log('1.1. showCamera value:', showCamera.value)
    console.log('1.2. isWebPlatform value:', isWebPlatform.value)
    
    // 先确保摄像头已停止
    console.log('1.5. Ensuring scanner is stopped')
    try {
      await BarcodeScanner.stopScan()
      console.log('1.6. Scanner stopped successfully')
    } catch (e) {
      console.log('1.7. Scanner was already stopped, error:', e)
    }
    
    // 确保背景已显示
    console.log('1.8. Ensuring background is shown')
    BarcodeScanner.showBackground()
    console.log('1.9. Background shown')
    
    // 请求摄像头权限
    console.log('2. Checking camera permissions')
    let permission = await BarcodeScanner.checkPermission()
    console.log('3. Initial permission status:', permission)
    console.log('3.1. permission.granted:', permission.granted)
    
    if (!permission.granted) {
      console.log('4. Requesting camera permissions')
      permission = await BarcodeScanner.checkPermission({ force: true })
      console.log('5. Permission after request:', permission)
      console.log('5.1. permission.granted:', permission.granted)
      
      if (!permission.granted) {
        console.log('6. Camera permission denied')
        Snackbar({ type: 'error', content: t('scanIn.cameraPermissionDenied') })
        emit('error', t('scanIn.cameraPermissionDenied'))
        showCamera.value = false
        return
      }
    }
    
    console.log('7. Camera permission granted')
    
    // 按照插件文档的要求：
    // 1. 准备摄像头
    // 2. 隐藏应用背景
    // 3. 添加 scanner-active 类到 body
    // 4. 启动扫描
    
    // 隐藏应用背景 - 这是关键，必须调用此方法才能显示摄像头画面
    console.log('10. Hiding background')
    BarcodeScanner.hideBackground()
    console.log('10.1. Background hidden')
    
    // 添加 scanner-active 类到 body，确保摄像头画面能够显示
    console.log('11. Adding scanner-active class to body')
    document.body.classList.add('scanner-active')
    console.log('11.1. scanner-active class added, body classes:', document.body.classList)
    console.log('11.2. Scanner-active class on body:', document.body.classList.contains('scanner-active'))
    
    // 确保根元素背景为透明
    console.log('12. Setting root background to transparent')
    const rootElement = document.documentElement
    rootElement.style.backgroundColor = 'transparent'
    console.log('12.1. Root background set to transparent, current:', rootElement.style.backgroundColor)
    
    // 确保body背景也为透明
    console.log('12.2. Setting body background to transparent')
    document.body.style.backgroundColor = 'transparent'
    console.log('12.3. Body background set to transparent, current:', document.body.style.backgroundColor)
    
    // 启动扫描 - 不设置特定尺寸，让插件自动匹配容器比例
    // 使用所有支持的条码格式，提高识别成功率
    console.log('13. Starting scan with all formats')
    console.log('13.1. BarcodeScanner instance:', BarcodeScanner)
    console.log('13.2. BarcodeScanner.startScan:', BarcodeScanner.startScan)
    
    try {
      // 启动扫描
      const result = await BarcodeScanner.startScan()
      
      console.log('14. Scan completed, result:', result)
      console.log('14.1. Result type:', typeof result)
      console.log('14.2. Result has content:', result && result.content)
      console.log('14.3. Result content:', result && result.content)
      console.log('14.4. Result:', JSON.stringify(result))
      
      // 扫描完成，处理结果
      if (result && result.content) {
        console.log('15. Scan result has content:', result.content)
        emit('scan', result.content.trim())
      } else {
        console.log('15. Scan result has no content, result:', result)
        // 扫描失败，可能是用户取消了扫描
        emit('error', t('scanIn.scanFailed'))
      }
    } catch (scanError: unknown) {
      console.error('15. Scan failed with error:', scanError)
      console.error('15.1. Scan error type:', typeof scanError)
      console.error('15.2. Scan error message:', (scanError as Error).message)
      console.error('15.3. Scan error stack:', (scanError as Error).stack)
      emit('error', t('scanIn.scanFailed'))
    }
  } catch (error: unknown) {
    console.error('=== Barcode Scanner Error ===', error)
    console.error('Error type:', typeof error)
    console.error('Error message:', (error as Error).message)
    console.error('Error stack:', (error as Error).stack)
    // 确保在错误情况下也能恢复UI
    try {
      console.log('Error recovery: Showing background')
      BarcodeScanner.showBackground()
      console.log('Error recovery: Removing scanner-active class')
      document.body.classList.remove('scanner-active')
      console.log('Error recovery: Restoring root background')
      document.documentElement.style.backgroundColor = ''
      console.log('Error recovery: Restoring body background')
      document.body.style.backgroundColor = ''
      console.log('Error recovery: Setting showCamera to false')
      showCamera.value = false
    } catch (e) {
      console.error('Failed to restore UI on error:', e)
    }
    emit('error', t('scanIn.cameraInitFailed'))
  } finally {
    console.log('16. Cleaning up resources')
    
    try {
      // 停止扫描
      console.log('17. Stopping scan')
      await BarcodeScanner.stopScan()
      console.log('17.1. Scan stopped successfully')
      
      // 显示应用背景
      console.log('18. Showing background')
      BarcodeScanner.showBackground()
      console.log('18.1. Background shown')
    } catch (stopError) {
      console.error('Failed to stop scan:', stopError)
    } finally {
      // 移除 scanner-active 类
      console.log('19. Removing scanner-active class from body')
      document.body.classList.remove('scanner-active')
      console.log('19.1. scanner-active class removed, body classes:', document.body.classList)
      
      // 恢复根元素背景
      console.log('20. Restoring root background')
      const rootElement = document.documentElement
      rootElement.style.backgroundColor = ''
      console.log('20.1. Root background restored, current:', rootElement.style.backgroundColor)
      
      // 恢复body背景
      console.log('20.2. Restoring body background')
      document.body.style.backgroundColor = ''
      console.log('20.3. Body background restored, current:', document.body.style.backgroundColor)
      
      // 扫描完成后返回手动输入模式
      console.log('21. Setting showCamera to false')
      showCamera.value = false
      console.log('21.1. showCamera set to false, current:', showCamera.value)
      
      // 显示扫描成功的提示
      console.log('22. Showing success message')
      // Snackbar({ type: 'success', content: t('scanIn.scanSuccess') })
      
      console.log('=== Barcode Scanner Debug End ===')
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

// 组件挂载时启动摄像头（如果需要）
onMounted(() => {
  if (props.autoStart) {
    toggleScannerMode()
  }
})

// 组件卸载前确保扫描已停止
onBeforeUnmount(async () => {
  if (isWebPlatform.value) {
    stopWebScan()
  } else {
    await BarcodeScanner.stopScan()
  }
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
  background-color: transparent;
  box-shadow: inset 0 0 0 2px var(--border-color);
}

/* 确保原生扫描时相关元素背景透明 */
body.scanner-active .scanner-container {
  background-color: transparent !important;
}

body.scanner-active .native-scan-hint {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* 原生扫描容器样式，保持与Web版相同的UI */
.native-scanner-container {
  /* 移除全屏样式，使用默认卡片布局 */
  display: none;
}

/* 原生扫描提示样式，保持与Web版相同的UI */
.native-scan-hint {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 8px;
  margin: 0 20px;
  z-index: 10;
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

/* 悬浮按钮容器 */
.floating-button-container {
  position: fixed;
  bottom:60px;
  right: 20px;
  z-index: 1000;
}

/* 确保悬浮按钮有足够的触摸目标大小 */
.floating-button-container :deep(.var-button) {
  min-height: 56px;
  min-width: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 原生扫描容器 */
.native-scanner-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  overflow: hidden;
}

/* 原生扫描提示 */
.native-scan-hint {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 8px;
  margin: 0 20px;
  z-index: 10;
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
