import apiClient from './axios'
import type { OutboundBatch, OutboundStatus, PaginationResponse } from '../types'

// 获取所有出库批次
export const getAllOutboundBatches = async (
  page?: number,
  pageSize?: number,
  serialNumber?: string,
  status?: OutboundStatus,
  channel?: string
): Promise<PaginationResponse<OutboundBatch>> => {
  return await apiClient.get('/outbound/batches', {
    params: { page, pageSize, serialNumber, status, channel }
  })
}

// 根据流水号获取出库批次
export const getOutboundBatchBySerialNumber = async (serialNumber: string | number): Promise<OutboundBatch> => {
  return await apiClient.get(`/outbound/batches/${serialNumber}`)
}

// 创建出库批次
export const createOutboundBatch = async (channel: string, serialNumber?: string): Promise<OutboundBatch> => {
  return await apiClient.post('/outbound/batches', { channel, serialNumber })
}

// 更新出库批次数量
export const updateOutboundBatchQuantity = async (
  serialNumber: string | number,
  increment: number = 1
): Promise<OutboundBatch> => {
  return await apiClient.put(`/outbound/batches/${serialNumber}/quantity`, {
    increment
  })
}

// 完成出库批次
export const completeOutboundBatch = async (serialNumber: string | number): Promise<OutboundBatch> => {
  return await apiClient.put(`/outbound/batches/${serialNumber}/complete`)
}

// 更新出库批次渠道
export const updateOutboundBatchChannel = async (
  serialNumber: string | number,
  channel: string
): Promise<OutboundBatch> => {
  return await apiClient.put(`/outbound/batches/${serialNumber}/channel`, {
    channel
  })
}
