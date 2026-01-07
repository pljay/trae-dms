// 导出 API 客户端
import apiClient from './axios'
export { apiClient }

export type { ApiResponse } from './axios'

// 导出出库批次相关 API
export * from './outbound'

// 导出包裹相关 API
export * from './package'