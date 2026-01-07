import apiClient from './axios'
import type { Package, PackageStatus, PaginationResponse } from '../types'

// 获取所有包裹记录
export const getAllPackages = async (
  page?: number,
  pageSize?: number,
  trackNo?: string,
  status?: PackageStatus
): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/packages', {
    params: { page, pageSize, trackNo, status }
  })
}

// 根据跟踪号获取包裹
export const getPackageByTrackNo = async (trackNo: string | number): Promise<Package> => {
  return await apiClient.get(`/packages/${trackNo}`)
}

// 创建包裹记录
export const createPackage = async (data: Omit<Package, 'createdAt' | 'updatedAt'>): Promise<Package> => {
  return await apiClient.post('/packages', data)
}

// 更新包裹状态
export const updatePackageStatus = async (
  trackNo: string,
  status: PackageStatus
): Promise<Package> => {
  return await apiClient.put(`/packages/${trackNo}/status`, {
    status
  })
}

// 更新包裹信息
export const updatePackage = async (
  trackNo: string,
  data: Partial<Omit<Package, 'trackNo' | 'createdAt' | 'updatedAt'>>
): Promise<Package> => {
  return await apiClient.put(`/packages/${trackNo}`, data)
}

// 扫描入库
export const scanInPackage = async (trackNo: string): Promise<Package> => {
  return await apiClient.post(`/packages/${trackNo}/scan-in`)
}

// 扫描出库
export const scanOutPackage = async (
  trackNo: string,
  batchSerialNumber: string
): Promise<Package> => {
  return await apiClient.post(`/packages/${trackNo}/scan-out`, {
    batchSerialNumber
  })
}

// 根据状态筛选包裹
export const getPackagesByStatus = async (status: PackageStatus): Promise<PaginationResponse<Package>> => {
  return await apiClient.get('/packages/filter', {
    params: { status }
  })
}