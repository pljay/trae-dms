import { MockMethod } from 'vite-plugin-mock'
import { faker } from '@faker-js/faker'

// 出库批次状态枚举
const OutboundStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

// 渠道列表，更真实的渠道名称
const channels = ['USPS', 'UPS', 'DHL', 'FedEx', 'EMS', 'SF Express', 'YTO Express', 'ZTO Express', 'Aramex', 'DPEX']

// 生成随机出库批次号
const generateBatchSerialNumber = () => {
  const year = new Date().getFullYear()
  // 使用faker生成更真实的批次号，格式如 OB20261234
  const random = faker.string.numeric({ length: 4, exclude: ['0'] })
  return `OB${year}${random}`
}

// 模拟出库批次数据
const mockOutboundBatches = Array.from({ length: 15 }, (_, i) => {
  // 随机生成状态
  const status = faker.helpers.arrayElement(Object.values(OutboundStatus))
  
  // 生成创建时间，过去30天内
  const createdAt = faker.date.past({ refDate: new Date() })
  
  // 生成更新时间，根据状态决定
  const updatedAt = status === OutboundStatus.COMPLETED 
    ? faker.date.between({ from: createdAt, to: new Date() })
    : createdAt
  
  // 生成数量，根据状态决定范围
  const quantity = faker.number.int({
    min: status === OutboundStatus.COMPLETED ? 50 : 10,
    max: status === OutboundStatus.COMPLETED ? 200 : 100
  })
  
  return {
    id: i + 1,
    serialNumber: generateBatchSerialNumber(),
    channel: faker.helpers.arrayElement(channels),
    quantity,
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  }
})

// 统一响应格式
const responseHandler = (data: any, message = 'success', code = 200) => {
  return {
    code,
    message,
    data
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

export default [
  // 获取所有出库批次（支持分页和搜索）
  {
    url: '/api/outbound/batches',
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
        filtered = filtered.filter(item => item.channel === query.channel)
      }
      
      // 分页
      const result = paginate(filtered, Number(query.page || 1), Number(query.pageSize || 10))
      
      return responseHandler(result)
    }
  },
  
  // 根据流水号获取出库批次
  {
    url: '/api/outbound/batches/:serialNumber',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { serialNumber } = params
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404)
      }
      
      return responseHandler(batch)
    }
  },
  
  // 创建新的出库批次
  {
    url: '/api/outbound/batches',
    method: 'post',
    response: (config: any) => {
      const { body } = config
      if (!body || !body.channel) {
        return responseHandler(null, '缺少必填参数', 400)
      }
      
      // 检查批次号是否已存在
      if (body.serialNumber) {
        const existingBatch = mockOutboundBatches.find(item => item.serialNumber === body.serialNumber)
        if (existingBatch) {
          return responseHandler(null, '批次号已存在', 409)
        }
      }
      
      const newBatch = {
        id: mockOutboundBatches.length + 1,
        serialNumber: body.serialNumber || generateBatchSerialNumber(),
        channel: body.channel,
        quantity: 0,
        status: OutboundStatus.IN_PROGRESS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockOutboundBatches.unshift(newBatch)
      return responseHandler(newBatch, '创建成功')
    }
  },
  
  // 更新出库批次数量
  {
    url: '/api/outbound/batches/:serialNumber/quantity',
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
    url: '/api/outbound/batches/:serialNumber/complete',
    method: 'put',
    response: (config: any) => {
      const { params = {} } = config
      const { serialNumber } = params
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404)
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
    url: '/api/outbound/batches/:serialNumber/channel',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { serialNumber } = params
      const { channel } = body
      
      if (!channel) {
        return responseHandler(null, '缺少渠道参数', 400)
      }
      
      const batch = mockOutboundBatches.find(item => item.serialNumber === serialNumber)
      if (!batch) {
        return responseHandler(null, '出库批次不存在', 404)
      }
      
      batch.channel = channel
      batch.updatedAt = new Date().toISOString()
      
      return responseHandler(batch, '渠道更新成功')
    }
  }
] as MockMethod[]
