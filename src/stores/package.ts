import { defineStore } from 'pinia'
import { Package, PackageStatus, ErrorCode, PackageStatsCount } from '../types'
import { getIntoPackages, getInboundPackages, getInterceptePackages, getHoldPackages, scanInPackage, scanOutPackage, getPackageCount } from '../api/package'
import { useChannelStore } from '../stores/channel'
import { Snackbar } from '@varlet/ui'
import i18n from '@/i18n'
import voiceNotification from '@/utils/voiceNotification'
import vibrationNotification from '@/utils/vibrationNotification'

export const usePackageStore = defineStore('package', {
  state: () => ({
    scanError: null as { pkg: Package; message: string, type: 'warning' | 'error' } | null,
    loading: false,
    packageStats: null as PackageStatsCount | null
  }),

  getters: {
    inStockCount: (state) => state.packageStats?.intoCount || 0,
    pendingInterceptedCount: (state) => state.packageStats?.pendingInterceptedCount || 0,
    holdingCount: (state) => state.packageStats?.holdingCount || 0,
    inboundCount: (state) => state.packageStats?.inboundCount || 0
  },

  actions: {
    // 加载包裹统计数据
    async loadPackageStats() {
      try {
        const stats = await getPackageCount()
        this.packageStats = stats
      } catch (error) {
        console.error('Failed to load package stats:', error)
      }
    },

    //获取预报包裹列表

    // 获取已预报包裹列表
    async fetchInboundPackages(page: number = 1, pageSize: number = 20, params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getInboundPackages(page, pageSize, params)
        const channelStore = useChannelStore()
        response.records.forEach(pkg => {
          const channelInfo = channelStore.getChannelById(pkg?.channelId || "")
          pkg.channelCode = channelInfo?.code || channelInfo?.name || ""
        })
        return response
      } catch (error) {
        console.error('Failed to fetch inbound packages:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取待拦截包裹列表
    async fetchInterceptePackages(page: number = 1, pageSize: number = 20, params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getInterceptePackages(page, pageSize, params)
        return response
      } catch (error) {
        console.error('Failed to fetch intercepte packages:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取待处理包裹列表
    async fetchHoldPackages(page: number = 1, pageSize: number = 20, params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getHoldPackages(page, pageSize, params)
        return response
      } catch (error) {
        console.error('Failed to fetch hold packages:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取所有库内包裹记录（支持分页和查询条件）
    async fetchIntoPackages(page: number = 1, pageSize: number = 20, params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getIntoPackages(page, pageSize, params)
        return response
      } catch (error) {
        console.error('Failed to fetch into packages:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 显示扫描成功通知
    showScanSuccessNotification(): void {
      Snackbar({ type: 'success', content: i18n.global.t('scan.message.scanSuccess') })
      voiceNotification.speakScanSuccess()
      // 添加成功震动反馈
      vibrationNotification.vibrateSuccess()
    },

    // 处理扫描错误
    handleScanInError(error: any): void {
      const errorCode = error?.data?.code || error?.code
      const pkg = (error?.data || error || {}) as Package
      switch (errorCode) {
        case ErrorCode.NOT_FORECAST:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.notForecast') || '非预报包裹，直接拦截', type: 'error' }
          break
        case ErrorCode.DUPLICATE_INBOUND:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.duplicateInbound') || '已入库状态，重复入库', type: 'warning' }
          break
        case ErrorCode.PENDING_INTERCEPT:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.intercept') || '拦截', type: 'warning' }
          break
        case ErrorCode.DUPLICATE_INTERCEPTED:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.duplicateIntercepted') || '重复拦截', type: 'warning' }
          break
        case ErrorCode.NOT_IN_BATCH:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.notInBatch') || '不在批次内', type: 'warning' }
          break
        case ErrorCode.INVALID_PARAMS:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.invalidParams') || '参数无效', type: 'warning' }
          break
        case ErrorCode.INVALID_STATUS:
          this.scanError = { pkg: pkg, message: i18n.global.t(this.getStatusText(pkg.status)) + i18n.global.t('scan.message.invalidStatus') || '包裹不存在', type: 'warning' }
          break
        default:
          this.scanError = { pkg: pkg as Package, message: i18n.global.t('scan.message.scanFailed') || '扫描失败', type: 'error' }
          break
      }
      Snackbar({ type: this.scanError.type, content: this.scanError.message, duration: 2000 })
      voiceNotification.speakText(this.scanError.message)
      // 添加震动反馈，错误状态比成功更强更长
      if (this.scanError.type === 'error') {
        vibrationNotification.vibrateError()
      } else {
        vibrationNotification.vibrateWarning()
      }
    },

    // 处理被拦截的包裹
    handleInterceptedPackage(): void {
      Snackbar({ type: 'warning', content: i18n.global.t('scan.message.intercept') || '拦截' })
      voiceNotification.speakIntercepted()
      // 添加警告震动反馈
      vibrationNotification.vibrateWarning()
    },


    // 入库 - 调用API
    async scanIn(trackNo: string, batchId?: string): Promise<Package | null> {
      this.scanError = null
      this.loading = true
      try {
        const channelStore = useChannelStore()

        const response = await scanInPackage(trackNo, batchId)
        const channelInfo = channelStore.getChannelById(response?.channelId || "")
        response.channelCode = channelInfo?.code || channelInfo?.name || ""
        console.log('Scanned package:', response)
        this.showScanSuccessNotification()
        return response
      } catch (error: any) {
        console.error('Failed to scan in package:', error)
        if (error?.data?.code || error?.code) {
          this.handleScanInError(error)
        }
        return null
      } finally {
        this.loading = false
      }
    },

    // 显示出库成功通知
    showScanOutSuccessNotification(): void {
      Snackbar({ type: 'success', content: i18n.global.t('scan.message.scanSuccess') || '扫描成功' })
      voiceNotification.speakScanSuccess()
      // 添加成功震动反馈
      vibrationNotification.vibrateSuccess()
    },

    // 处理出库错误
    handleScanOutError(error: any): void {
      const errorCode = error?.data?.code || error?.code
      const pkg = (error?.data || error || {}) as Package
      switch (errorCode) {
        case ErrorCode.DUPLICATE_OUTBOUND:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.duplicateOutbound') || '已出库状态，重复出库', type: 'warning' }
          break
        case ErrorCode.NOT_INBOUND:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.notInbound') || '未入库禁止出库', type: 'warning' }
          break
        case ErrorCode.CHANNEL_ERROR_OUTBOUND:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.channelErrorOutbound') || '渠道错误，禁止出库', type: 'warning' }
          break
        case ErrorCode.INVALID_PARAMS:
          this.scanError = { pkg: pkg, message: i18n.global.t('scan.message.invalidParams') || '参数无效', type: 'warning' }
          break
        case ErrorCode.INVALID_STATUS:
          this.scanError = { pkg: pkg, message: i18n.global.t(this.getStatusText(pkg.status)) + i18n.global.t('scan.message.invalidStatus') || '包裹不存在', type: 'warning' }
          break
        default:
          this.scanError = { pkg: pkg as Package, message: i18n.global.t('scan.message.scanFailed') || '扫描失败', type: 'error' }
          break
      }

      Snackbar({ type: this.scanError.type, content: this.scanError.message, duration: 2000 })
      voiceNotification.speakText(this.scanError.message)
      // 添加震动反馈，错误状态比成功更强更长
      if (this.scanError.type === 'error') {
        vibrationNotification.vibrateError()
      } else {
        vibrationNotification.vibrateWarning()
      }
    },

    // 出库 - 调用API
    async scanOut(trackNo: string, batchId: string): Promise<Package | null> {
      this.loading = true
      try {
        const response = await scanOutPackage(trackNo, batchId)
        console.log('Scanned package:', response)
        this.showScanOutSuccessNotification()
        return response
      } catch (error) {
        this.handleScanOutError(error)
        return null
      } finally {
        this.loading = false
      }
    },

    // 获取状态文本
    getStatusText(status: string): string {
      switch (status) {
        case PackageStatus.IN_STOCK:
          return i18n.global.t('status.package.inStock')
        case PackageStatus.PENDING:
          return i18n.global.t('status.package.pending')
        case PackageStatus.PENDING_INTERCEPT:
          return i18n.global.t('status.package.pendingIntercept')
        case PackageStatus.INTERCEPTED:
          return i18n.global.t('status.package.intercepted')
        case PackageStatus.OUT_OF_STOCK:
          return i18n.global.t('status.package.outOfStock')
        default:
          return i18n.global.t('status.package.unknown')
      }
    }
  },
})
