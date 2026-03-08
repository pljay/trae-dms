import apiClient from './axios'
import type { OutboundBatch, BatchChannel, PaginationResponse } from '../types'

// 获取所有出库批次
export const getAllOutboundBatches = async (
  pageNo?: number,
  pageSize?: number,
  params?: Record<string, any>
): Promise<PaginationResponse<OutboundBatch>> => {
  return await apiClient.get('/dms/outbound/batch/list', {
    params: { pageNo, pageSize, ...params }
  })
}

//获取批次详情
export const getOutboundBatchById = async (batchId: string): Promise<OutboundBatch> => {
  return await apiClient.get(`/dms/outbound/batch`, {
    params: { id: batchId }
  })
}

// 创建出库批次
export const createOutboundBatch = async (batchNo: string, channelId: string): Promise<OutboundBatch> => {
  //更改为form-data格式
  const formData = new FormData()
  formData.append('batchNo', batchNo)
  formData.append('channelId', channelId)

  return await apiClient.post('/dms/outbound/batch', formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 完成出库批次
export const completeOutboundBatch = async (batchId: string): Promise<OutboundBatch> => {
  //表单数据
  const formData = new FormData()
  formData.append('batchId', batchId)

  return await apiClient.post(`/dms/outbound/complete`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取批次渠道进度
export const getOutboundBatchChannels = async (id: string | number): Promise<BatchChannel[]> => {
  return await apiClient.get(`/dms/outbound/parcel/groupByChannel`, {
    params: { batchId: id }
  })
}

