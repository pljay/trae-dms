import apiClient from './axios'
import type { InboundBatch, BatchChannel, PaginationResponse } from '../types'

// 获取所有入库批次
export const getAllInboundBatches = async (
  pageNo?: number,
  pageSize?: number,
  params?: Record<string, any>
): Promise<PaginationResponse<InboundBatch>> => {
  return await apiClient.get('/dms/inbound/batch/list', {
    params: { pageNo, pageSize, ...params }
  })
}


// 根据ID获取入库批次
export const getInboundBatchById = async (id: string | number): Promise<InboundBatch> => {
  return await apiClient.get(`/dms/inbound/batch`, {
    params: { id: id }
  })
}


// 获取入库批次渠道进度
export const getInboundBatchChannels = async (id: string | number): Promise<BatchChannel[]> => {
  return await apiClient.get(`/dms/inbound/parcel/groupByChannel`, {
    params: { batchId: id }
  })
}

