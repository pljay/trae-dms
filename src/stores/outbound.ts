import { defineStore } from 'pinia'
import { OutboundBatch } from '../types'
import {
  getAllOutboundBatches,
  createOutboundBatch,
  getOutboundBatchById,
  completeOutboundBatch,
} from '@/api/outbound'

import { useChannelStore } from './channel'

import { Snackbar } from '@varlet/ui'
import i18n from '@/i18n'

export const useOutboundStore = defineStore('outbound', {
  state: () => ({
    loading: false
  }),

  getters: {
    // 获取出库批次
    getBatchBySerialNumber: () => (serialNumber: string, batches: OutboundBatch[]) => {
      return batches.find(batch => batch.serialNumber === serialNumber)
    }
  },

  actions: {
    // 获取所有出库批次
    async fetchBatches(page: number, pageSize: number, params?: Record<string, any>) {
      this.loading = true
      try {
        const response = await getAllOutboundBatches(page, pageSize, params)
        return response
      } catch (error) {
        console.error('Failed to fetch outbound batches:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      } finally {
        this.loading = false
      }
    },
    // 获取出库批次详情
    async getBatchById(batchId: string): Promise<OutboundBatch | null> {
      try {
        const response = await getOutboundBatchById(batchId)
        const channel = useChannelStore().getChannelById(response?.channelId || '')
        response.channelCode = channel?.code || ''
        console.log(response)
        return response
      } catch (error) {
        console.error('Failed to fetch outbound batch by ID:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        throw error
      }
    },

    // 创建新的出库批次 - 调用API
    async createBatch(batchNo: string, channelId: string): Promise<OutboundBatch | null> {
      try {
        const newBatch = await createOutboundBatch(batchNo, channelId)
        Snackbar({ type: 'success', content: i18n.global.t('common.success') })
        return newBatch
      } catch (error) {
        console.error('Failed to create outbound batch:', error)
        Snackbar({ type: 'error', content: i18n.global.t('common.error') })
        return null
      }
    },

    // 完成出库批次 - 调用API
    async completeBatch(batchNo: string): Promise<boolean> {
      try {
        await completeOutboundBatch(batchNo)
        Snackbar({ type: 'success', content: i18n.global.t('common.success') })
        return true
      } catch (error) {
        console.error('Failed to complete batch:', error)
        Snackbar({ type: 'error', content: i18n.global.t('common.error') })
        return false
      }
    }
  }
})
