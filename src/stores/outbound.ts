import { defineStore } from 'pinia'
import { OutboundBatch, OutboundStatus} from '../types'
import { 
  getAllOutboundBatches, 
  createOutboundBatch, 
  updateOutboundBatchQuantity, 
  completeOutboundBatch, 
  updateOutboundBatchChannel
} from '../api/outbound'
import { Snackbar } from '@varlet/ui'

export const useOutboundStore = defineStore('outbound', {
  state: () => ({
    batches: [] as OutboundBatch[],
    loading: false,
    total: 0,
    page: 1,
    pageSize: 10
  }),
  
  getters: {
    completedBatches: (state) => state.batches.filter(batch => batch.status === OutboundStatus.COMPLETED),
    inProgressBatches: (state) => state.batches.filter(batch => batch.status === OutboundStatus.IN_PROGRESS),
    getAllBatches: (state) => state.batches
  },
  
  actions: {
    // 初始化数据 - 从API获取所有出库批次
    async initData() {
      this.loading = true
      try {
        const response = await getAllOutboundBatches()
        this.batches = response.list
        this.total = response.total
      } catch (error) {
        console.error('Failed to fetch outbound batches:', error)
        Snackbar({ type: 'error', content: '获取出库批次失败' })
      } finally {
        this.loading = false
      }
    },
    
    // 创建新的出库批次 - 调用API
    async createBatch(channel: string = '', serialNumber?: string): Promise<OutboundBatch | null> {
      try {
        const newBatch = await createOutboundBatch(channel, serialNumber)
        this.batches.unshift(newBatch)
        this.total++
        Snackbar({ type: 'success', content: '创建出库批次成功' })
        return newBatch
      } catch (error) {
        console.error('Failed to create outbound batch:', error)
        Snackbar({ type: 'error', content: '创建出库批次失败' })
        return null
      }
    },
    
    // 更新出库批次数量 - 调用API
    async updateBatchQuantity(serialNumber: string, increment: number = 1): Promise<boolean> {
      try {
        const updatedBatch = await updateOutboundBatchQuantity(serialNumber, increment)
        const batchIndex = this.batches.findIndex(batch => batch.serialNumber === serialNumber)
        if (batchIndex !== -1) {
          this.batches[batchIndex] = updatedBatch
        }
        return true
      } catch (error) {
        console.error('Failed to update batch quantity:', error)
        Snackbar({ type: 'error', content: '更新批次数量失败' })
        return false
      }
    },
    
    // 完成出库批次 - 调用API
    async completeBatch(serialNumber: string): Promise<boolean> {
      try {
        const updatedBatch = await completeOutboundBatch(serialNumber)
        const batchIndex = this.batches.findIndex(batch => batch.serialNumber === serialNumber)
        if (batchIndex !== -1) {
          this.batches[batchIndex] = updatedBatch
        }
        Snackbar({ type: 'success', content: '完成出库批次成功' })
        return true
      } catch (error) {
        console.error('Failed to complete batch:', error)
        Snackbar({ type: 'error', content: '完成出库批次失败' })
        return false
      }
    },
    
    // 更新出库批次渠道 - 调用API
    async updateBatchChannel(serialNumber: string, channel: string): Promise<boolean> {
      try {
        const updatedBatch = await updateOutboundBatchChannel(serialNumber, channel)
        const batchIndex = this.batches.findIndex(batch => batch.serialNumber === serialNumber)
        if (batchIndex !== -1) {
          this.batches[batchIndex] = updatedBatch
        }
        Snackbar({ type: 'success', content: '更新出库渠道成功' })
        return true
      } catch (error) {
        console.error('Failed to update batch channel:', error)
        Snackbar({ type: 'error', content: '更新出库渠道失败' })
        return false
      }
    },
    
    // 获取出库批次
    getBatchBySerialNumber(serialNumber: string): OutboundBatch | undefined {
      return this.batches.find(batch => batch.serialNumber === serialNumber)
    },
    
    // 分页获取出库批次
    async fetchBatches(page: number, pageSize: number, serialNumber?: string, status?: OutboundStatus, channel?: string) {
      this.loading = true
      try {
        const response = await getAllOutboundBatches(page, pageSize, serialNumber, status, channel)
        this.batches = response.list
        this.total = response.total
        this.page = page
        this.pageSize = pageSize
      } catch (error) {
        console.error('Failed to fetch outbound batches:', error)
        Snackbar({ type: 'error', content: '获取出库批次失败' })
      } finally {
        this.loading = false
      }
    }
  }
})