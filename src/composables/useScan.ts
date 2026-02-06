import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { Snackbar } from '@varlet/ui'
import { Capacitor } from '@capacitor/core'
import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning'
import { Torch } from '@capawesome/capacitor-torch'
import { BrowserMultiFormatReader } from '@zxing/library'
import { usePackageStore } from '@/stores/package'
import { useOutboundStore } from '@/stores/outbound'
import voiceNotification from '@/utils/voiceNotification'
import vibrationNotification from '@/utils/vibrationNotification'

// Web 平台条码扫描 polyfill
import "barcode-detector/polyfill"

/**
 * 扫描功能组合式函数
 * 提供条码扫描、摄像头控制、扫描结果处理等功能
 */
export function useScan() {
  // ===============================================
  // 依赖注入
  // ===============================================
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const packageStore = usePackageStore()
  const outboundStore = useOutboundStore()
  
  // ===============================================
  // 状态管理
  // ===============================================
  const scanCount = ref(0)
  const showManualInput = ref(false)
  const manualInput = ref('')
  const isScanning = ref(false)
  const isTorchEnabled = ref(false)
  const isTorchAvailable = ref(false)
  
  // 平台判断
  const isNativePlatform = Capacitor.isNativePlatform()
  
  // ===============================================
  // 扫描相关引用
  // ===============================================
  // 扫码监听器引用
  let barcodeListener: any = null
  
  // Web扫描相关变量
  const videoRef = ref<HTMLVideoElement | null>(null)
  let stream: MediaStream | null = null
  let scanning = false
  let barcodeReader: BrowserMultiFormatReader | null = null

  // ===============================================
  // 工具方法
  // ===============================================

  /**
   * 提高屏幕亮度
   * 注：移除了ScreenBrightness依赖，现为空实现
   */
  const increaseBrightness = async (): Promise<void> => {
    // 空实现
  }

  /**
   * 恢复原始屏幕亮度
   * 注：移除了ScreenBrightness依赖，现为空实现
   */
  const restoreBrightness = async (): Promise<void> => {
    // 空实现
  }

  // ===============================================
  // 手电筒控制
  // ===============================================

  /**
   * 检查手电筒可用性
   */
  const checkTorchAvailability = async (): Promise<void> => {
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

  /**
   * 切换手电筒状态
   */
  const toggleTorch = async (): Promise<void> => {
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

  /**
   * 关闭手电筒
   */
  const turnTorchOff = async (): Promise<void> => {
    if (Capacitor.getPlatform() === 'web') return
    
    try {
      await Torch.disable()
      isTorchEnabled.value = false
    } catch (error) {
      console.error('Failed to turn torch off:', error)
    }
  }

  // ===============================================
  // 浏览器兼容性检测
  // ===============================================

  /**
   * 浏览器摄像头支持信息
   */
  interface BrowserCameraSupportInfo {
    isHarmonyOS: boolean
    harmonyVersion: string | null
    isDesktop: boolean
    browserName: string
    browserVersion: string | null
    hasCameraSupport: boolean
    supportedMethod: string | null
  }

  /**
   * 检测浏览器类型和支持的摄像头API
   * @returns 浏览器摄像头支持信息
   */
  const detectBrowserCameraSupport = (): BrowserCameraSupportInfo => {
    // 检测是否为鸿蒙浏览器
    const userAgent = navigator.userAgent
    const isHarmonyOS = userAgent.includes('HarmonyOS') || 
                      userAgent.includes('OpenHarmony') || 
                      userAgent.includes('Harmony')
    
    // 尝试提取鸿蒙版本号
    let harmonyVersion: string | null = null
    const harmonyVersionMatch = userAgent.match(/HarmonyOS\/(\d+\.\d+)/) || 
                              userAgent.match(/OpenHarmony\/(\d+\.\d+)/)
    if (harmonyVersionMatch) {
      harmonyVersion = harmonyVersionMatch[1]
    }
    
    // 检测是否为桌面浏览器
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    // 检测浏览器名称和版本
    let browserName = 'Unknown'
    let browserVersion: string | null = null
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Chrome'
      const chromeMatch = userAgent.match(/Chrome\/(\d+\.\d+)/)
      if (chromeMatch) browserVersion = chromeMatch[1]
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox'
      const firefoxMatch = userAgent.match(/Firefox\/(\d+\.\d+)/)
      if (firefoxMatch) browserVersion = firefoxMatch[1]
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari'
      const safariMatch = userAgent.match(/Version\/(\d+\.\d+)/)
      if (safariMatch) browserVersion = safariMatch[1]
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge'
      const edgeMatch = userAgent.match(/Edg\/(\d+\.\d+)/)
      if (edgeMatch) browserVersion = edgeMatch[1]
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browserName = 'Internet Explorer'
      const ieMatch = userAgent.match(/MSIE (\d+\.\d+)/) || userAgent.match(/rv:(\d+\.\d+)/)
      if (ieMatch) browserVersion = ieMatch[1]
    }

    // 检测支持的摄像头API方法
    let supportedMethod: string | null = null
    
    // 简化检测逻辑，优先检查现代标准API
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      // 现代标准API
      supportedMethod = 'navigator.mediaDevices.getUserMedia'
    } else if (typeof (navigator as any).getUserMedia === 'function') {
      // 标准旧版API
      supportedMethod = 'navigator.getUserMedia'
    } else if (typeof (navigator as any).webkitGetUserMedia === 'function') {
      // WebKit旧版API
      supportedMethod = 'navigator.webkitGetUserMedia'
    } else if (typeof (navigator as any).mozGetUserMedia === 'function') {
      // Mozilla旧版API
      supportedMethod = 'navigator.mozGetUserMedia'
    } else if (typeof (navigator as any).msGetUserMedia === 'function') {
      // Microsoft旧版API
      supportedMethod = 'navigator.msGetUserMedia'
    }
    
    // 额外检查：确保navigator.mediaDevices存在且是对象
    if (!supportedMethod && navigator.mediaDevices && typeof navigator.mediaDevices === 'object') {
      console.log('navigator.mediaDevices exists but getUserMedia not found:', navigator.mediaDevices)
      // 尝试直接访问getUserMedia属性
      if (typeof navigator.mediaDevices.getUserMedia === 'function') {
        supportedMethod = 'navigator.mediaDevices.getUserMedia'
        console.log('Found getUserMedia on navigator.mediaDevices')
      }
    }
    
    return {
      isHarmonyOS,
      harmonyVersion,
      isDesktop,
      browserName,
      browserVersion,
      hasCameraSupport: supportedMethod !== null,
      supportedMethod
    }
  }

  // ===============================================
  // 摄像头媒体流获取
  // ===============================================

  /**
   * 获取摄像头媒体流
   * @returns 摄像头媒体流
   * @throws 当摄像头不可用或无权限时抛出错误
   */
  const getCameraStream = async (): Promise<MediaStream> => {
    // 检查浏览器是否支持摄像头功能
    const { hasCameraSupport } = detectBrowserCameraSupport()
    if (!hasCameraSupport) {
      throw new Error(`浏览器不支持摄像头功能。\n\n请检查以下几点：\n1. 您的浏览器是否支持摄像头访问（推荐使用Chrome、Edge、Firefox等现代浏览器）\n2. 您是否已授予摄像头访问权限\n3. 摄像头是否被其他应用占用\n4. 您的设备是否有可用的摄像头\n\n浏览器信息：${navigator.userAgent}`)
    }

    // 直接检查navigator.mediaDevices和getUserMedia
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      // 详细的错误信息，帮助用户排查问题
      const errorMessage = `浏览器不支持摄像头功能。\n\n请检查以下几点：\n1. 您的浏览器是否支持摄像头访问（推荐使用Chrome、Edge、Firefox等现代浏览器）\n2. 您是否已授予摄像头访问权限\n3. 摄像头是否被其他应用占用\n4. 您的设备是否有可用的摄像头\n\n浏览器信息：${navigator.userAgent}`
      throw new Error(errorMessage)
    }
    
    // 尝试使用现代标准API
    // 1. 尝试指定较低的分辨率以提高性能
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480, 
          frameRate: { ideal: 15, max: 30 } // 限制帧率以提高性能
        } 
      })
      return stream
    } catch (error) {
      // 2. 尝试前置摄像头
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment", // 优先使用后置摄像头
            width: 640, 
            height: 480,
            frameRate: { ideal: 15, max: 30 }
          } 
        })
        return stream
      } catch (error) {
        // 3. 尝试最简单的约束
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          return stream
        } catch (error) {
          throw error
        }
      }
    }
  }

  // ===============================================
  // Web端扫描
  // ===============================================

  /**
   * 启动Web端摄像头扫描
   */
  const startWebScan = async (): Promise<void> => {
    try {
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
            videoRef.value.pause()
          } catch (error) {
            // 静默处理错误
          }
        }
        // 清空视频源
        videoRef.value.srcObject = null
      }
      
      // 获取摄像头媒体流
      const mediaStream = await getCameraStream()
      
      // 保存流
      stream = mediaStream
      
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
        const timeout = setTimeout(() => resolve(), 5000)
        videoRef.value.onloadedmetadata = () => {
          clearTimeout(timeout)
          resolve()
        }
      })
      
      // 初始化条码阅读器，添加配置以提高识别率和性能
      barcodeReader = new BrowserMultiFormatReader()
      
      // 开始扫描
      scanning = true
      scanBarcode()
      
      Snackbar({ type: 'success', content: t('scan.cameraStarted') })
    } catch (error) {
      // 使用新的错误处理方法
      handleError(error, 'startWebScan')
      handleBack()
    }
  }

  /**
   * Web端扫描条码
   */
  const scanBarcode = async (): Promise<void> => {
    if (!scanning || !videoRef.value || !barcodeReader) return
    
    try {
      // 优化ZXing.js配置，提高识别率和性能
      // 1. 根据设备性能调整解码尝试次数
      const isMobile = navigator.userAgent.includes('Mobile')
      const maxAttempts = isMobile ? 2 : 3 // 移动端减少尝试次数以提高性能
      
      let result = null
      for (let attempt = 1; attempt <= maxAttempts && !result; attempt++) {
        try {
          result = await barcodeReader.decodeOnce(videoRef.value)
        } catch (attemptError) {
          // 静默处理解码失败，避免控制台日志过多
        }
      }
      
      if (result && result.getText()) {
        handleScanSuccess(result.getText())
      } else {
        // 继续扫描
        if (scanning) {
          // 根据设备性能调整扫描频率
          const scanInterval = isMobile ? 200 : 150 // 移动端降低扫描频率
          setTimeout(scanBarcode, scanInterval)
        }
      }
    } catch (error) {
      // 静默处理错误，避免控制台日志过多
      if (scanning) {
        setTimeout(scanBarcode, 200) // 错误后延长间隔，避免频繁错误
      }
    }
  }

  /**
   * 停止Web端扫描
   */
  const stopWebScan = async (): Promise<void> => {
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

  // ===============================================
  // 核心扫描功能
  // ===============================================

  /**
   * 请求摄像头权限
   * @returns 是否获得权限
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Capacitor.isNativePlatform()) {
      const { camera } = await BarcodeScanner.requestPermissions()
      if (camera !== 'granted') {
        handleError(new Error('Camera permission denied'), 'requestCameraPermission')
        return false
      }
    } else {
      // Web平台会在getUserMedia时自动请求权限
      // 权限检查会在getCameraStream中处理
    }
    return true
  }

  /**
   * 启动扫描
   */
  const startScan = async (): Promise<void> => {
    try {
      // 提高屏幕亮度
      await increaseBrightness()
      
      // 检查手电筒可用性
      await checkTorchAvailability()
      document.querySelector('scan-frame')?.classList.add('barcode-scanner-active')
      // 启动扫描
      isScanning.value = true

      // 请求摄像头权限
      const hasPermission = await requestCameraPermission()
      if (!hasPermission) {
        handleBack()
        return
      }

      if (Capacitor.isNativePlatform()) {
        // 在原生平台使用Capacitor MLKit条码扫描插件

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
        // 启动扫描 - 插件会在原生层面处理视频流
        await BarcodeScanner.startScan({
          formats: [BarcodeFormat.QrCode, BarcodeFormat.Code128, BarcodeFormat.Ean13],
          lensFacing: LensFacing.Back
        })
      } else {
        // 在Web平台使用Web API和ZXing.js
        await startWebScan()
      }
      
    } catch (error) {
      // 使用新的错误处理方法
      handleError(error, 'startScan')
      handleBack()
    }
  }

  /**
   * 停止扫描
   */
  const stopScan = async (): Promise<void> => {
    // 移除条码扫描激活状态
    document.querySelector('scan-frame')?.classList.remove('barcode-scanner-active')
    isScanning.value = false
    
    try {
      if (Capacitor.isNativePlatform()) {
        // 移除所有监听器
        if (barcodeListener) {
          await barcodeListener.remove()
          barcodeListener = null
        }
        
        // 停止扫描
        await BarcodeScanner.stopScan()
        
        // 关闭手电筒
        await turnTorchOff()
      } else {
        // 停止Web端扫描
        await stopWebScan()
      }
      
      // 恢复亮度
      await restoreBrightness()
    } catch (error) {
      console.error('Failed to stop scan:', error)
    }
  }

  // ===============================================
  // 扫描结果处理
  // ===============================================

  /**
   * 扫描场景处理策略接口
   */
  interface ScanScenarioStrategy {
    /**
     * 处理扫描成功的情况
     * @param code 扫描到的条码
     * @param params 额外参数
     * @returns 处理是否成功
     */
    handleSuccess: (code: string, params: Record<string, any>) => Promise<boolean>
    
    /**
     * 处理扫描失败的情况
     * @param error 错误信息
     * @param params 额外参数
     */
    handleError: (error: any, params: Record<string, any>) => void
  }

  /**
   * 扫描场景处理策略映射
   */
  const scanScenarioStrategies: Record<string, ScanScenarioStrategy> = {
    /**
     * 入库批次详情页扫描策略
     */
    'inbound-batch-detail': {
      handleSuccess: async (code: string, params: Record<string, any>) => {
        const { batchId } = params
        if (!batchId) return false
        
        // 调用扫描入库API
        await handleScanIn(code, batchId)
        
        // 返回扫描结果到入库批次详情页
        router.push({
          path: `/inbound-batches/${batchId}`,
          query: {
            scanSuccess: 'true',
            scanMessage: t('scanIn.scanSuccess')
          }
        })
        return true
      },
      handleError: (_error: any, params: Record<string, any>) => {
        const { batchId } = params
        if (!batchId) return
        
        // 返回错误信息到入库批次详情页
        router.push({
          path: `/inbound-batches/${batchId}`,
          query: {
            scanSuccess: 'false',
            scanMessage: t('common.error')
          }
        })
      }
    },
    
    /**
     * 出库操作页扫描策略
     */
    'scan-operation': {
      handleSuccess: async (code: string, params: Record<string, any>) => {
        const { batchId } = params
        if (!batchId) return false
        
        // 调用扫描出库API
        await handleScanOut(code, batchId)
        
        // 返回扫描结果到出库操作页
        router.push({
          path: `/scan-operation`,
          query: {
            batchId: batchId,
            scanSuccess: 'true',
            scanMessage: t('scanOut.scanSuccess')
          }
        })
        return true
      },
      handleError: (_error: any, params: Record<string, any>) => {
        const { batchId } = params
        if (!batchId) return
        
        // 返回错误信息到出库操作页
        router.push({
          path: `/scan-operation`,
          query: {
            batchId: batchId,
            scanSuccess: 'false',
            scanMessage: t('common.error')
          }
        })
      }
    },
    
    /**
     * 默认扫描策略（适用于一般场景）
     */
    'default': {
      handleSuccess: async (code: string, params: Record<string, any>) => {
        const { from, callback } = params
        
        if (from && callback) {
          // 使用会话存储传递结果
          sessionStorage.setItem('scanResult', code)
          router.push({ name: from as any })
        } else {
          // 直接返回上一页
          router.back()
        }
        return true
      },
      handleError: (_error: any, _params: Record<string, any>) => {
        // 直接返回上一页
        router.back()
      }
    }
  }

  /**
   * 扫描成功处理
   * @param code 扫描到的条码
   */
  const handleScanSuccess = async (code: string): Promise<void> => {
    stopScan()
    
    // 添加震动反馈（调整到页面跳转之前）
    vibrationNotification.vibrateSuccess()
    
    // 获取调用来源和回调信息
    const from = route.query.from as string
    const batchId = route.query.batchId as string
    const callback = route.query.callback as string
    
    // 准备参数
    const params = {
      from,
      batchId,
      code,
      callback
    }
    
    // 选择策略
    const strategy = scanScenarioStrategies[from] || scanScenarioStrategies['default']
    
    try {
      // 执行成功处理策略
      await strategy.handleSuccess(code, params)
      
      // 不再显示成功提示，因为策略中的接口请求已经会显示相应的通知
      // 这样可以避免与后端API返回的拦截、重复扫描、非预报包裹等错误信息造成混乱
    } catch (error) {
      console.error('扫描处理失败:', error)
      
      // 执行错误处理策略
      strategy.handleError(error, params)
      
      // 不再显示错误提示，因为策略中的接口请求已经会显示相应的通知
    }
  }

  /**
   * 扫描结果信息
   */
  interface ScanResult {
    success: boolean
    data: any
    status: 'success' | 'error' | 'warning'
    message?: string
  }

  /**
   * 处理扫描出库结果
   * @param code 扫描到的条码
   * @param batchId 批次ID
   * @returns 是否扫描成功
   */
  const handleScanOut = async (code: string, batchId: string): Promise<boolean> => {
    console.log('扫描到条码:', code)
    
    try {
      const success = await packageStore.scanOut(code, batchId)
      if (success) {
        scanCount.value++
        // 不再显示重复通知，因为 packageStore.scanOut 已经处理了通知
        return true
      } else {
        // 不再显示重复通知，因为 packageStore.scanOut 已经处理了通知
        return false
      }
    } catch (error) {
      // 不再显示重复通知，因为 packageStore.scanOut 已经处理了通知
      return false
    }
  }

  /**
   * 处理扫描入库结果
   * @param code 扫描到的条码
   * @param batchId 批次ID（可选）
   * @returns 扫描结果信息
   */
  const handleScanIn = async (code: string, batchId?: string): Promise<ScanResult> => {
    console.log('扫描到条码:', code)

    try {
      // 调用入库方法 - store会处理所有通知和语音
      const result = await packageStore.scanIn(code, batchId)
      console.log('入库结果:', result)
      if (result) {
        return {
          success: true,
          data: result,
          status: 'success'
        }
      }else{
        return {
          success: false,
          data: packageStore?.scanError?.pkg || null,
          status: (packageStore?.scanError?.type as 'error' | 'warning') || 'error',
          message: packageStore?.scanError?.message || t('scanIn.scanFailed')
        }
      }
    } catch (error) {
      // 不再显示重复通知，因为 packageStore.scanIn 已经处理了通知
      return {
          success: false,
          data: packageStore?.scanError?.pkg || null,
          status: (packageStore?.scanError?.type as 'error' | 'warning') || 'error',
          message: packageStore?.scanError?.message || t('scanIn.scanFailed')
        }
    }
  }

  // ===============================================
  // 错误处理
  // ===============================================

  /**
   * 错误类型枚举
   */
  enum ScanErrorType {
    CAMERA_PERMISSION_DENIED = 'camera_permission_denied',
    CAMERA_NOT_FOUND = 'camera_not_found',
    CAMERA_IN_USE = 'camera_in_use',
    CAMERA_NOT_SUPPORTED = 'camera_not_supported',
    SCAN_FAILED = 'scan_failed',
    NETWORK_ERROR = 'network_error',
    UNKNOWN_ERROR = 'unknown_error'
  }

  /**
   * 错误信息映射
   */
  const errorMessages: Record<ScanErrorType, string> = {
    [ScanErrorType.CAMERA_PERMISSION_DENIED]: t('scan.cameraPermissionDenied'),
    [ScanErrorType.CAMERA_NOT_FOUND]: t('scan.cameraNotFound'),
    [ScanErrorType.CAMERA_IN_USE]: t('scan.cameraInUse'),
    [ScanErrorType.CAMERA_NOT_SUPPORTED]: t('scan.cameraNotSupported'),
    [ScanErrorType.SCAN_FAILED]: t('scan.scanFailed'),
    [ScanErrorType.NETWORK_ERROR]: t('common.networkError'),
    [ScanErrorType.UNKNOWN_ERROR]: t('common.error')
  }

  /**
   * 错误详情接口
   */
  interface ScanErrorDetail {
    type: ScanErrorType
    message: string
    originalError?: any
  }

  /**
   * 解析错误信息，返回标准化的错误详情
   * @param error 原始错误信息
   * @returns 标准化的错误详情
   */
  const parseError = (error: any): ScanErrorDetail => {
    let errorMessage = t('common.error')
    let errorType = ScanErrorType.UNKNOWN_ERROR

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    // 根据错误信息判断错误类型
    if (errorMessage.includes('Permission denied') || 
        errorMessage.includes('NotAllowedError') || 
        errorMessage.includes('PERMISSION_DENIED')) {
      errorType = ScanErrorType.CAMERA_PERMISSION_DENIED
    } else if (errorMessage.includes('NotFoundError') || 
               errorMessage.includes('NO_DEVICES_FOUND')) {
      errorType = ScanErrorType.CAMERA_NOT_FOUND
    } else if (errorMessage.includes('NotReadableError') || 
               errorMessage.includes('DEVICE_IN_USE')) {
      errorType = ScanErrorType.CAMERA_IN_USE
    } else if (errorMessage.includes('NotSupportedError') || 
               errorMessage.includes('NOT_SUPPORTED') || 
               errorMessage.includes('does not support any camera API')) {
      errorType = ScanErrorType.CAMERA_NOT_SUPPORTED
    } else if (errorMessage.includes('Network') || 
               errorMessage.includes('network') || 
               errorMessage.includes('404') || 
               errorMessage.includes('500')) {
      errorType = ScanErrorType.NETWORK_ERROR
    }

    return {
      type: errorType,
      message: errorMessages[errorType] || errorMessage,
      originalError: error
    }
  }

  /**
   * 处理扫描错误的通用方法
   * @param error 错误信息
   * @param context 错误上下文信息
   * @param options 错误处理选项
   */
  const handleError = (error: any, context: string = 'unknown', options: { showNotification?: boolean, showSnackbar?: boolean, vibrate?: boolean } = {}): void => {
    // 默认选项
    const defaultOptions = {
      showNotification: true,
      showSnackbar: true,
      vibrate: true
    }
    
    const finalOptions = { ...defaultOptions, ...options }
    
    // 解析错误信息
    const errorDetail = parseError(error)
    
    // 记录详细错误日志
    console.error(`[Scan Error] [${context}] [${errorDetail.type}]:`, errorDetail.originalError)
    
    // 显示错误提示
    if (finalOptions.showSnackbar) {
      Snackbar({
        type: 'error',
        content: errorDetail.message,
        duration: 3000 // 延长错误提示显示时间
      })
    }
    
    // 播放错误语音提示
    if (finalOptions.showNotification) {
      voiceNotification.speakError()
    }
    
    // 添加错误震动反馈，比成功更强更长
    if (finalOptions.vibrate) {
      vibrationNotification.vibrateHeavy()
    }
  }

  /**
   * 处理扫描警告的通用方法
   * @param message 警告信息
   * @param context 警告上下文信息
   */
  const handleWarning = (message: string, context: string = 'unknown'): void => {
    console.warn(`[Scan Warning] [${context}]:`, message)
    
    Snackbar({
      type: 'warning',
      content: message,
      duration: 2000
    })
    voiceNotification.speakWarning()
    vibrationNotification.vibrateWarning()
  }

  /**
   * 处理扫描成功的通知方法
   * @param message 成功信息
   * @param context 成功上下文信息
   */
  const handleSuccessNotification = (message: string, context: string = 'unknown'): void => {
    console.log(`[Scan Success] [${context}]:`, message)
    
    Snackbar({
      type: 'success',
      content: message,
      duration: 1500
    })
    
    voiceNotification.speakSuccess()
    vibrationNotification.vibrateSuccess()
  }

  // ===============================================
  // 用户交互
  // ===============================================

  /**
   * 返回按钮处理
   */
  const handleBack = (): void => {
    stopScan()
    router.back()
  }

  /**
   * 相册选择处理
   * 注：Capacitor条码扫描插件不支持从相册扫描，需要额外集成图片选择和识别库
   */
  const handleAlbum = (): void => {
    Snackbar({ type: 'warning', content: t('scan.albumNotSupported') })
    // 添加警告震动反馈
    vibrationNotification.vibrateWarning()
  }

  /**
   * 手动输入处理
   */
  const handleManualInput = (): void => {
    showManualInput.value = true
  }

  /**
   * 手动输入提交处理
   */
  const handleManualInputSubmit = (): void => {
    if (manualInput.value.trim()) {
      handleScanSuccess(manualInput.value.trim())
      showManualInput.value = false
      manualInput.value = ''
    }
  }

  // ===============================================
  // 批次操作
  // ===============================================

  /**
   * 重置扫描计数
   */
  const resetScanCount = (): void => {
    scanCount.value = 0
  }

  /**
   * 完成出库/入库操作的通用方法
   * @param batchId 批次ID
   * @returns 是否操作成功
   */
  const completeOperation = async (batchId: string): Promise<boolean> => {
    if (scanCount.value === 0) {
      handleWarning(t('scanOut.step3.noScanned'), 'completeOperation')
      return false
    }
    
    try {
      const success = await outboundStore.completeBatch(batchId)
      if (success) {
        handleSuccessNotification(t('common.success'), 'completeOperation')
      } else {
        handleError(new Error(t('common.error')), 'completeOperation')
      }
      return success
    } catch (error) {
      handleError(error, 'completeOperation')
      return false
    }
  }

  /**
   * 跳转到独立扫描页面
   * @param from 来源页面
   * @param callback 回调函数名
   */
  const goToScan = (from: string, callback: string): void => {
    router.push({
      name: 'scan',
      query: {
        from,
        callback
      }
    })
  }

  // ===============================================
  // 返回值
  // ===============================================

  return {
    // 状态
    scanCount,
    showManualInput,
    manualInput,
    isScanning,
    isTorchEnabled,
    isTorchAvailable,
    isNativePlatform,
    videoRef,
    
    // 方法
    startScan,
    stopScan,
    handleScanSuccess,
    handleScanOut,
    handleScanIn,
    handleError,
    handleBack,
    handleAlbum,
    handleManualInput,
    handleManualInputSubmit,
    resetScanCount,
    completeOperation,
    toggleTorch,
    goToScan
  }
}
