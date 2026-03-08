import { defineStore } from 'pinia'
import { InboundBatch, BatchChannel, InboundStatus } from '../types'
import {
  getAllInboundBatches,
  getInboundBatchById,
  getInboundBatchChannels
} from '../api/inbound'
import { useChannelStore } from '../stores/channel'
import { Snackbar } from '@varlet/ui'
import i18n from '@/i18n'
const channelStore = useChannelStore()

export const useInboundBatchStore = defineStore('inboundBatch', {
  state: () => ({
    currentBatch: null as InboundBatch | null,
    batchChannels: [] as BatchChannel[],
    loading: false
  }),

  getters: {
    // 获取入库进度百分比
    getInboundProgress: () => (batch: InboundBatch) => {
      if (batch.expectedQuantity === 0) return 0
      return Math.round((batch.inboundQuantity / batch.expectedQuantity) * 100)
    },

    // 获取出库进度百分比
    getOutboundProgress: () => (batch: InboundBatch) => {
      if (!batch || batch.expectedQuantity === 0) return 0
      return Math.min(100, Math.round((batch.outboundQuantity / batch.expectedQuantity) * 100))
    },

    // 获取渠道入仓进度百分比，基于实际包裹数据
    getChannelInboundProgress: () => (channel: any) => {
      if (!channel || channel.expectedQuantity === 0) return 0
      return Math.min(100, Math.round((channel.inboundQuantity / channel.expectedQuantity) * 100))
    },

    // 获取渠道出仓进度百分比，基于实际包裹数据
    getChannelOutboundProgress: () => (channel: any) => {
      if (!channel || channel.expectedQuantity === 0) return 0
      return Math.round((channel.outboundQuantity / channel.expectedQuantity) * 100)
    }
  },

  actions: {
    // 获取所有入库批次
    async fetchBatches(page: number, pageSize: number,  params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getAllInboundBatches(page, pageSize,  params)
        response.records.forEach(batch => {
           switch (batch.status) {
             case '1':
               batch.inboundStatus = InboundStatus.PENDING
               break
             case '2':
               batch.inboundStatus = InboundStatus.IN_PROGRESS
               break
             case '3':
               batch.inboundStatus = InboundStatus.COMPLETED
               break
             default:
               break
           }
        })
        return response
      } catch (error) {
        console.error('Failed to fetch inbound batches:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
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
        channels.forEach(channel => {
          const channelInfo = channelStore.getChannelById(channel.channelId)
          channel.channelCode = channelInfo?.code || channelInfo?.name||""
        })
        this.batchChannels = channels
      } catch (error) {
        console.error('Failed to fetch batch channels:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
      } finally {
        this.loading = false
      }
    },

    // 获取渠道入库进度百分比
    getChannelProgress(channel: BatchChannel): number {
      if (channel.expectQuantity === 0) return 0
      return Math.min(100, Math.round((channel.actualQuantity / channel.expectQuantity) * 100))
    }
  }
})
