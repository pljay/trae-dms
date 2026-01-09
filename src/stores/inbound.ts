import { defineStore } from 'pinia'
import { InboundBatch, InboundBatchChannel, InboundStatus } from '../types'
import { 
  getAllInboundBatches, 
  getInboundBatchById, 
  getInboundBatchChannels,
  getInboundBatchPackages
} from '../api/inbound'
import { Snackbar } from '@varlet/ui'
import i18n from '@/i18n'

export const useInboundBatchStore = defineStore('inboundBatch', {
  state: () => ({
    batches: [] as InboundBatch[],
    currentBatch: null as InboundBatch | null,
    batchChannels: [] as InboundBatchChannel[],
    batchPackages: [] as any[],
    loading: false
  }),
  
  getters: {
    allBatches: (state) => state.batches,
    completedBatches: (state) => state.batches.filter(batch => batch.status === InboundStatus.COMPLETED),
    inProgressBatches: (state) => state.batches.filter(batch => batch.status === InboundStatus.IN_PROGRESS),
    pendingBatches: (state) => state.batches.filter(batch => batch.status === InboundStatus.PENDING)
  },
  
  actions: {
    // 初始化数据 - 从API获取所有入库批次
    async initData() {
      this.loading = true
      try {
        const batches = await getAllInboundBatches()
        console.log('Fetched inbound batches:', batches)
        this.batches = batches
      } catch (error) {
        console.error('Failed to fetch inbound batches:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
      } finally {
        this.loading = false
      }
    },
    
    // 获取入库批次详情
    async fetchBatchById(id: string) {
      
      this.loading = true
      try {
        const batch = await getInboundBatchById(id)
        this.currentBatch = batch
      } catch (error) {
        console.error('Failed to fetch inbound batch:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
      } finally {
        this.loading = false
      }
    },
    
    // 获取入库批次渠道进度
    async fetchBatchChannels(id: string) {
      this.loading = true
      try {
        const channels = await getInboundBatchChannels(id)
        this.batchChannels = channels
      } catch (error) {
        console.error('Failed to fetch batch channels:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
      } finally {
        this.loading = false
      }
      
      // 同时获取包裹记录
      this.fetchBatchPackages(id)
    },
    
    // 获取入库批次包裹记录
    async fetchBatchPackages(id: string) {
      try {
        const packages = await getInboundBatchPackages(id)
        this.batchPackages = packages
      } catch (error) {
        console.error('Failed to fetch batch packages:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
      }
    },
    
    // 获取入库进度百分比
    getInboundProgress(batch: InboundBatch): number {
      if (batch.expectedQuantity === 0) return 0
      return Math.round((batch.inboundQuantity / batch.expectedQuantity) * 100)
    },
    
    // 获取渠道入库进度百分比
    getChannelProgress(channel: InboundBatchChannel): number {
      if (channel.expectedQuantity === 0) return 0
      return Math.round((channel.inboundQuantity / channel.expectedQuantity) * 100)
    }
  }
})
