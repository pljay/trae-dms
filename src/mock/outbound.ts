import { MockMethod } from 'vite-plugin-mock'
import { faker } from '@faker-js/faker'
// 引入数据类型，确保类型安全
import { OutboundStatus, ErrorCode } from '../types/index'
// 导入全局模拟数据
import { mockOutboundBatches } from './global'

// 统一响应格式
const responseHandler = (data: any, message = 'success', code = 200, errorCode?: number) => {
  return {
    code,
    message,
    data,
    errorCode
  }
}

// 分页处理
const paginate = (data: any[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    list: data.slice(start, end),
    total: data.length,
    page,
    pageSize
  }
}

// 生成随机出库批次号
const generateBatchSerialNumber = () => {
  const year = new Date().getFullYear()
  // 使用faker生成更真实的批次号，格式如 OB20261234
  const random = faker.string.numeric({ length: 4, exclude: ['0'] })
  return `OB${year}${random}`
}

export { mockOutboundBatches, generateBatchSerialNumber }

export default [
  // 获取所有出库批次（支持分页和搜索）
  {
    url: '/oll-boot/api/dms/outbound/batch',
    method: 'get',
    response: ({ query }: { query: { page?: number, pageSize?: number, serialNumber?: string, status?: string, channel?: string } }) => {

      let filtered = [...mockOutboundBatches]
      
      // 按批次号搜索
      if (query.serialNumber) {
        filtered = filtered.filter(item => item.serialNumber.includes(String(query.serialNumber)))
      }
      
      // 按状态筛选
      if (query.status) {
        filtered = filtered.filter(item => item.status === query.status)
      }
      
      // 按渠道筛选
      if (query.channel) {
        filtered = filtered.filter(item => item.channelId === query.channel)
      }
      
      // 分页
      const result = paginate(filtered, Number(query.page || 1), Number(query.pageSize || 10))
      
      return responseHandler(result)
    }
  },
  
  // 根据流水号获取出库批次
  {
    url: '/oll-boot/api/dms/outbound/batch/:serialNumber',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { serialNumber } = params
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404, ErrorCode.NOT_FOUND)
      }
      
      return responseHandler(batch)
    }
  },
  
  // 创建出库批次
  {
    url: '/oll-boot/api/dms/outbound/batch',
    method: 'post',
    response: (config: any) => {
      const { body } = config
      if (!body || !body.channel) {
        return responseHandler(null, '缺少必填参数', 400, ErrorCode.INVALID_PARAMS)
      }
      
      // 检查批次号是否已存在
      if (body.serialNumber) {
        const existingBatch = mockOutboundBatches.find(item => item.serialNumber === body.serialNumber)
        if (existingBatch) {
          return responseHandler(null, '批次号已存在', 409, ErrorCode.INVALID_PARAMS)
        }
      }
      
      const newBatch = {
        id: (mockOutboundBatches.length + 1).toString(),
        serialNumber: body.serialNumber || generateBatchSerialNumber(),
        channelId: body.channel,
        quantity: 0,
        pieces: 0,
        status: OutboundStatus.IN_PROGRESS,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockOutboundBatches.unshift(newBatch)
      return responseHandler(newBatch, '创建成功')
    }
  },
  
  // 更新出库批次数量
  {
    url: '/oll-boot/api/dms/outbound/batch/:serialNumber/quantity',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { serialNumber } = params
      const { increment } = body
      
      if (increment === undefined || isNaN(Number(increment))) {
        return responseHandler(null, '无效的增量值', 400)
      }
      
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404)
      }
      
      batch.quantity = Math.max(0, batch.quantity + Number(increment))
      batch.updatedAt = new Date().toISOString()
      
      return responseHandler(batch, '数量更新成功')
    }
  },
  
  // 完成出库批次
  {
    url: '/oll-boot/api/dms/outbound/batch/:serialNumber/complete',
    method: 'put',
    response: (config: any) => {
      const { params = {} } = config
      const { serialNumber } = params
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404, ErrorCode.NOT_FOUND)
      }
      
      if (batch.status === OutboundStatus.COMPLETED) {
        return responseHandler(batch, '该批次已完成', 200)
      }
      
      batch.status = OutboundStatus.COMPLETED
      batch.updatedAt = new Date().toISOString()
      
      return responseHandler(batch, '批次完成成功')
    }
  },
  
  // 更新出库批次渠道
  {
    url: '/oll-boot/api/dms/outbound/batch/:serialNumber/channel',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { serialNumber } = params
      const { channel } = body
      
      if (!channel) {
        return responseHandler(null, '缺少渠道参数', 400, ErrorCode.INVALID_PARAMS)
      }
      
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404, ErrorCode.NOT_FOUND)
      }
      
      batch.channelId = channel
      batch.updatedAt = new Date().toISOString()
      
      return responseHandler(batch, '渠道更新成功')
    }
  }
] as MockMethod[]
