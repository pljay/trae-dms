import apiClient from './axios'
import type { InboundBatch, InboundBatchChannel, InboundStatus } from '../types'

// 获取所有入库批次
export const getAllInboundBatches = async (): Promise<InboundBatch[]> => {
  return await apiClient.get('/inbound-batches')
}

// 根据ID获取入库批次
export const getInboundBatchById = async (id: string | number): Promise<InboundBatch> => {
  return await apiClient.get(`/inbound-batches/${id}`)
}

// 根据批次号获取入库批次
export const getInboundBatchByNumber = async (batchNumber: string): Promise<InboundBatch> => {
  return await apiClient.get(`/inbound-batches/number/${batchNumber}`)
}

// 更新入库批次状态
export const updateInboundBatchStatus = async (
  id: string | number,
  status: InboundStatus
): Promise<InboundBatch> => {
  return await apiClient.put(`/inbound-batches/${id}/status`, {
    status
  })
}

// 更新入库数量
export const updateInboundBatchQuantity = async (
  id: string | number,
  quantity: number
): Promise<InboundBatch> => {
  return await apiClient.put(`/inbound-batches/${id}/quantity`, {
    inboundQuantity: quantity
  })
}

// 获取入库批次渠道进度
export const getInboundBatchChannels = async (id: string | number): Promise<InboundBatchChannel[]> => {
  return await apiClient.get(`/inbound-batches/${id}/channels`)
}

// 获取入库批次的包裹记录
export const getInboundBatchPackages = async (id: string | number): Promise<any[]> => {
  return await apiClient.get(`/inbound-batches/${id}/packages`)
}
