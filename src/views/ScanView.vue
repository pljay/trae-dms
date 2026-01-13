<template>
  <div class="scan-view">
    <!-- 扫描区域（微信风格） -->
    <div class="scan-area barcode-scanner-active">
      <!-- 扫描框 -->
      <div class="scan-frame">
        <!-- 扫描线 -->
        <div class="scan-line"></div>
        <!-- 四角边框 -->
        <div class="scan-corner top-left"></div>
        <div class="scan-corner top-right"></div>
        <div class="scan-corner bottom-left"></div>
        <div class="scan-corner bottom-right"></div>
      </div>
      
      <!-- 扫描提示文字 -->
      <div class="scan-hint">{{ $t('scan.pointCamera') }}</div>
      
      <!-- 辅助功能提示 -->
      <div class="scan-help">{{ $t('scan.help') }}</div>
      
      <!-- 手电筒控制 -->
      <div class="torch-control" @click="toggleTorch">
        <div class="torch-icon">{{ isTorchEnabled ? 'flash_on' : 'flash_off' }}</div>
        <div class="torch-text">{{ isTorchEnabled ? $t('scan.lightOff') : $t('scan.lightOn') }}</div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="scan-footer">
      <div class="footer-item" @click="handleAlbum">
        <div class="footer-icon">image</div>
        <div class="footer-text">{{ $t('scan.album') }}</div>
      </div>
      <div class="footer-item" @click="handleManualInput">
        <div class="footer-icon">edit</div>
        <div class="footer-text">{{ $t('scan.manualInput') }}</div>
      </div>
    </div>
    
    <!-- 手动输入弹窗 -->
    <var-dialog v-model:show="showManualInput" :title="$t('scan.manualInput')" width="80%">
      <var-input
        v-model="manualInput"
        :placeholder="$t('scan.enterCode')"
        @keyup.enter="handleManualInputSubmit"
        autofocus
      ></var-input>
      <template #actions>
        <var-button text @click="showManualInput = false">{{ $t('common.cancel') }}</var-button>
        <var-button type="primary" @click="handleManualInputSubmit">{{ $t('common.confirm') }}</var-button>
      </template>
    </var-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { useTitleStore } from '@/stores/title'
import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
import { Torch } from '@capawesome/capacitor-torch'

// Web 平台条码扫描 polyfill
import "barcode-detector/polyfill"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const titleStore = useTitleStore()
titleStore.setTitle('scan.title')

// 状态管理
const showManualInput = ref(false)
const manualInput = ref('')
const isScanning = ref(false)
const isTorchEnabled = ref(false)
const isTorchAvailable = ref(false)

// Web 平台视频元素
const videoElement = ref<HTMLVideoElement | null>(null)

// 扫码监听器引用
let barcodeListener: any = null

// 提高屏幕亮度 - 移除了ScreenBrightness依赖，变为空实现
const increaseBrightness = async () => {
  // 空实现
}

// 恢复原始屏幕亮度 - 移除了ScreenBrightness依赖，变为空实现
const restoreBrightness = async () => {
  // 空实现
}

// 检查手电筒可用性
const checkTorchAvailability = async () => {
  if (Capacitor.getPlatform() === 'web') {
    isTorchAvailable.value = false
    return
  }
  
  try {
    const { available } = await Torch.isAvailable()
    isTorchAvailable.value = available
  } catch (error) {
    console.error('Failed to check torch availability:', error)
    isTorchAvailable.value = false
  }
}

// 切换手电筒
const toggleTorch = async () => {
  if (Capacitor.getPlatform() === 'web' || !isTorchAvailable.value) {
    return
  }
  
  try {
    await Torch.toggle()
    const { enabled } = await Torch.isEnabled()
    isTorchEnabled.value = enabled
  } catch (error) {
    console.error('Failed to toggle torch:', error)
  }
}

// 关闭手电筒
const turnTorchOff = async () => {
  if (Capacitor.getPlatform() === 'web') return
  
  try {
    await Torch.disable()
    isTorchEnabled.value = false
  } catch (error) {
    console.error('Failed to turn torch off:', error)
  }
}

// 启动扫描
const startScan = async () => {
  try {
    // 请求摄像头权限
    const { camera } = await BarcodeScanner.requestPermissions()
    
    if (camera !== 'granted') {
      Snackbar({ type: 'error', content: t('scan.cameraPermissionDenied') })
      handleBack()
      return
    }
    
    // 提高屏幕亮度
    await increaseBrightness()
    
    // 检查手电筒可用性
    await checkTorchAvailability()
    
    // 启动扫描
    isScanning.value = true
    
    // 添加条码扫描监听器
    barcodeListener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async (event) => {
        console.log('Barcodes scanned:', event.barcodes)
        if (event.barcodes && event.barcodes.length > 0) {
          const barcode = event.barcodes[0]
          if (barcode.rawValue) {
            handleScanSuccess(barcode.rawValue)
          }
        }
      }
    )
    
    // 为所有平台创建视频元素（修复Android黑屏问题）
    // 创建视频元素
    const video = document.createElement('video')
    video.style.top = '0'
    video.style.left = '0'
    video.style.width = '100%'
    video.style.height = '100%'
    video.style.objectFit = 'cover'
    video.setAttribute('playsinline', 'true')
    video.setAttribute('muted', 'true')
    video.setAttribute('autoplay', 'true') // 确保自动播放
    video.autoplay = true
    video.playsInline = true
    video.muted = true
    video.style.position = 'absolute'
    video.style.zIndex = '0'
    videoElement.value = video
    
    // 添加到扫描区域
    const scanArea = document.querySelector('.scan-frame')
    if (scanArea) {
      scanArea.appendChild(video)
    }
    
    // 启动扫描
    await BarcodeScanner.startScan({
      formats: [BarcodeFormat.QrCode, BarcodeFormat.Code128, BarcodeFormat.Ean13],
      lensFacing: LensFacing.Back
    })
  } catch (error) {
    console.error('Scan error:', error)
    Snackbar({ type: 'error', content: t('scan.scanFailed') })
    handleBack()
  }
}

// 停止扫描
const stopScan = async () => {
  isScanning.value = false
  try {
    // 移除所有监听器
    if (barcodeListener) {
      await barcodeListener.remove()
      barcodeListener = null
    }
    
    // 停止扫描
    await BarcodeScanner.stopScan()
    
    // 关闭手电筒
    await turnTorchOff()
    
    // 恢复亮度
    await restoreBrightness()
    
    // Web 平台：清理视频元素
    if (Capacitor.getPlatform() === 'web' && videoElement.value) {
      // 移除视频元素
      if (videoElement.value.parentNode) {
        videoElement.value.parentNode.removeChild(videoElement.value)
      }
      videoElement.value = null
    }
  } catch (error) {
    console.error('Failed to stop scan:', error)
  }
}

// 扫描成功处理
const handleScanSuccess = (code: string) => {
  stopScan()
  
  // 获取调用来源和回调信息
  const from = route.query.from as string
  const callback = route.query.callback as string
  
  // 传递扫描结果
  if (from && callback) {
    // 使用会话存储传递结果
    sessionStorage.setItem('scanResult', code)
    router.push({ name: from as any })
  } else {
    // 直接返回上一页
    router.back()
  }
  
  Snackbar({ type: 'success', content: t('scan.scanSuccess') })
}

// 返回按钮处理
const handleBack = () => {
  stopScan()
  router.back()
}

// 相册选择
const handleAlbum = () => {
  Snackbar({ type: 'warning', content: t('scan.albumNotSupported') })
  // 注意：Capacitor条码扫描插件不支持从相册扫描，需要额外集成图片选择和识别库
}

// 手动输入
const handleManualInput = () => {
  showManualInput.value = true
}

// 手动输入提交
const handleManualInputSubmit = () => {
  if (manualInput.value.trim()) {
    handleScanSuccess(manualInput.value.trim())
    showManualInput.value = false
    manualInput.value = ''
  }
}

// 组件挂载时启动扫描
onMounted(async () => {
  document.body.classList.add('barcode-scanner-active')
  await startScan()
})

// 组件卸载前停止扫描
onBeforeUnmount(async () => {
  await stopScan()
  document.body.classList.remove('barcode-scanner-active')
})
</script>

<style scoped lang="css">
.scan-view {
  width: 100%;
  background-color: black;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  min-height: calc(100vh - var(--app-bar-height) - var(--bottom-navigation-height));
}

/* 扫描区域 */
.scan-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 18vh
}

/* 扫描框 - 微信风格 */
.scan-frame {
  position: relative;
  width: min(80vw, 80vh, 320px);
  aspect-ratio: 1;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* 扫描线 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #07c160, transparent);
  animation: scanLine 1s infinite linear;
  box-shadow: 0 0 10px 2px #07c160;
  z-index: 2;
  border-radius: 1.5px;
}

@keyframes scanLine {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

/* 四角边框 - 微信风格 */
.scan-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid #07c160;
  z-index: 3;
  box-shadow: 0 0 8px rgba(7, 193, 96, 0.8);
}

.scan-corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.scan-corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.scan-corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.scan-corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

/* 扫描提示文字 */
.scan-hint {
  color: white;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

/* 辅助功能提示 */
.scan-help {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* 底部操作栏 */
.scan-footer {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  z-index: 10;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  min-width: 80px;
}

.footer-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.footer-item:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.footer-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.footer-item:hover .footer-icon {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.footer-text {
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 4px;
}

/* 适配不同屏幕尺寸 */
@media (max-width: 480px) {
  .scan-frame {
    width: min(85vw, 85vh, 100%);
  }
  
  .footer-item {
    min-width: 70px;
    padding: 12px 8px;
  }
  
  .footer-icon {
    font-size: 28px;
    width: 40px;
    height: 40px;
  }
  
  .footer-text {
    font-size: 13px;
  }
}

/* 横屏模式适配 */
@media (orientation: landscape) {
  .scan-area {
    flex-direction: row;
    gap: 20px;
  }
  
  .scan-frame {
    width: min(70vw, 70vh, 300px);
  }
  
  .scan-footer {
    padding: 15px 0;
    padding-bottom: env(safe-area-inset-bottom, 15px);
  }
  
  .footer-item {
    min-width: 75px;
    padding: 12px;
  }
  
  .footer-icon {
    font-size: 26px;
    width: 40px;
    height: 40px;
  }
  
  .footer-text {
    font-size: 12px;
  }
}

/* 大屏幕适配 */
@media (min-width: 768px) {
  .scan-frame {
    width: min(60vw, 60vh, 400px);
  }
  
  .scan-hint {
    font-size: 18px;
  }
  
  .scan-help {
    font-size: 16px;
  }
  
  .footer-item {
    min-width: 100px;
    padding: 18px;
  }
  
  .footer-icon {
    font-size: 36px;
    width: 56px;
    height: 56px;
  }
  
  .footer-text {
    font-size: 16px;
  }
}


</style>