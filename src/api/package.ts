import apiClient from './axios'
import type { PackageStatsCount, Package, PaginationResponse } from '../types'

//获取仓库中所有包裹件数 库中包裹的状态为 已入库 已拦截 待处理
export const getPackageCount = async (): Promise<PackageStatsCount> => {
  return await apiClient.get('/dms/into/parcel/count')
}

//获取预报包裹列表
export const getInboundPackages = async (
  pageNo?: number,
  pageSize?: number,
  params?: Record<string, any>
): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/dms/parcel/inbound', {
    params: { ...params, pageNo, pageSize }
  })
}

//获取拦截包裹列表（待拦截 已拦截）
export const getInterceptePackages = async (
  pageNo?: number,
  pageSize?: number,
  params?: Record<string, any>
): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/dms/parcel/intercept', {
    params: { ...params, pageNo, pageSize }
  })
}

//获取待处理包裹列表（待处理）
export const getHoldPackages = async (
  pageNo?: number,
  pageSize?: number,
  params?: Record<string, any>

): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/dms/parcel/hold', {
    params: { ...params, pageNo, pageSize }
  })
}

// 获取所有包裹记录(已入库)
export const getIntoPackages = async (
  pageNo?: number,
  pageSize?: number,
  //查询参数应该 使用{} 可以支持多种查询条件（泛型）
  params?: Record<string, any>
): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/dms/parcel/into', {
    params: { ...params, pageNo, pageSize }
  })
}

// 扫描入库
export const scanInPackage = async (trackNo: string, batchId?: string): Promise<Package> => {
  // 使用表单方式提交参数
  const formData = new FormData()
  formData.append('no', trackNo)
  if(batchId){
    formData.append('batchId', batchId)
  }
  return await apiClient.post(`/dms/inbound/pre/scan`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 扫描出库
export const scanOutPackage = async (
  trackNo: string,
  batchId: string
): Promise<PaginationResponse<Package>> => {
  return await apiClient.post(`/dms/outbound/scan`, {
    trackNo,
    batchId
  })
}


//根据出库批次ID获取包裹列表
export const getPackageByOutboundBatchId = async (
  batchId: string,
  page?: number,
  pageSize?: number,
): Promise<PaginationResponse<Package>> => {
  return await apiClient.get(`/dms/outbound/parcel`, {
    params: { page, pageSize },
    data: {
      batchId: batchId
    }
  })
}



