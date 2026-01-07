import { MockMethod } from 'vite-plugin-mock'
import { faker } from '@faker-js/faker'

// 入库批次状态枚举
const InboundStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

// 渠道列表
const channels = ['USPS', 'UPS', 'DHL', 'FedEx', 'EMS', 'SF Express', 'YTO Express', 'ZTO Express', 'Aramex', 'DPEX']

// 生成随机入库批次号
const generateBatchNumber = () => {
  const year = new Date().getFullYear()
  // 使用faker生成更真实的批次号，格式如 IB20261234
  const random = faker.string.numeric({ length: 4, exclude: ['0'] })
  return `IB${year}${random}`
}

// 模拟入库批次数据
const mockInboundBatches = Array.from({ length: 20 }, (_, i) => {
  // 随机生成状态
  const status = faker.helpers.arrayElement(Object.values(InboundStatus))

  // 生成创建时间，过去30天内
  const createdAt = faker.date.past({ refDate: new Date() })

  // 生成更新时间，根据状态决定
  const updatedAt = status === InboundStatus.COMPLETED
    ? faker.date.between({ from: createdAt, to: new Date() })
    : createdAt

  // 生成预计数量
  const expectedQuantity = faker.number.int({ min: 20, max: 250 })

  // 生成入库数量，根据状态决定
  const inboundQuantity = status === InboundStatus.COMPLETED
    ? expectedQuantity
    : status === InboundStatus.IN_PROGRESS
      ? faker.number.int({ min: 1, max: expectedQuantity - 1 })
      : 0

  return {
    id: faker.number.int({ min: 2000, max: 3000 }),
    batchNumber: generateBatchNumber(),
    expectedQuantity,
    inboundQuantity,
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  }
})

// 模拟渠道进度数据
const mockChannelProgress = (batch: any) => {
  // 随机生成2-5个渠道
  const channelCount = faker.number.int({ min: 2, max: 5 })
  const selectedChannels = faker.helpers.arrayElements(channels, channelCount)

  return selectedChannels.map(channel => {
    // 根据批次状态生成渠道的预计和入库数量
    const channelExpectedQuantity = faker.number.int({ min: 5, max: Math.floor(batch.expectedQuantity / channelCount) + 10 })
    const channelInboundQuantity = batch.status === InboundStatus.COMPLETED
      ? channelExpectedQuantity
      : batch.status === InboundStatus.IN_PROGRESS
        ? faker.number.int({ min: 0, max: channelExpectedQuantity })
        : 0

    return {
      channel,
      expectedQuantity: channelExpectedQuantity,
      inboundQuantity: channelInboundQuantity
    }
  })
}

// 模拟包裹数据
const mockPackages = (batch: any) => {
  // 根据入库数量生成对应数量的包裹
  const packageCount = batch.inboundQuantity

  return Array.from({ length: packageCount }, (_, i) => {
    // 生成随机跟踪号
    const trackNo = `TT${faker.string.numeric({ length: 12, exclude: ['0'] })}`

    return {
      id: `pkg-${batch.id}-${i + 1}`,
      trackNo,
      weight: faker.number.float({ min: 0.5, max: 20.5, fractionDigits: 2 }),
      length: faker.number.float({ min: 10, max: 60, fractionDigits: 1 }),
      width: faker.number.float({ min: 5, max: 45, fractionDigits: 1 }),
      height: faker.number.float({ min: 3, max: 33, fractionDigits: 1 }),
      status: 'in_stock',
      channel: faker.helpers.arrayElement(channels),
      country: faker.helpers.arrayElement(['China', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Canada']),
      scanInAt: faker.date.between({ from: new Date(batch.createdAt), to: new Date() }).toISOString(),
      scanOutAt: null,
      batchSerialNumber: batch.batchNumber,
      createdAt: faker.date.between({ from: new Date(batch.createdAt), to: new Date() }).toISOString(),
      updatedAt: faker.date.between({ from: new Date(batch.createdAt), to: new Date() }).toISOString()
    }
  })
}

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
  // 获取所有入库批次
  {
    url: '/api/inbound-batches',
    method: 'get',
    response: ({ query }: { query: { batchNumber?: string, status?: string } }) => {
      const { batchNumber, status } = query
      let filtered = [...mockInboundBatches]

      // 按批次号搜索
      if (batchNumber) {
        filtered = filtered.filter(item => item.batchNumber.includes(String(batchNumber)))
      }

      // 按状态筛选
      if (status) {
        filtered = filtered.filter(item => item.status === String(status))
      }

      // 不分页 分页
      // const result = paginate(filtered, Number(page), Number(pageSize))

      return responseHandler(filtered)
    }
  },

  // 根据ID获取入库批次
  {
    url: '/api/inbound-batches/:id',
    method: 'get',
    response: (config: any) => {
      console.log('config', config)
      const { query = {} } = config
      const { id } = query
      console.log('config', id)
      console.log('item.id', mockInboundBatches)
      const batch = mockInboundBatches.find(item => item.id == id)

      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404)
      }

      return responseHandler(batch)
    }
  },

  // 根据批次号获取入库批次
  {
    url: '/api/inbound-batches/number/:batchNumber',
    method: 'get',
    response: (config: any) => {
      const { query = {} } = config
      const { batchNumber } = query
      const batch = mockInboundBatches.find(item => item.batchNumber === batchNumber)

      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404)
      }

      return responseHandler(batch)
    }
  },

  // 更新入库数量
  {
    url: '/api/inbound-batches/:id/quantity',
    method: 'put',
    response: (config: any) => {
      const { query = {}, body = {} } = config
      const { id } = query
      const { inboundQuantity } = body

      if (inboundQuantity === undefined || isNaN(Number(inboundQuantity))) {
        return responseHandler(null, '无效的数量值', 400)
      }

      const batch = mockInboundBatches.find(item => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404)
      }

      const quantity = Number(inboundQuantity)
      batch.inboundQuantity = Math.max(0, Math.min(quantity, batch.expectedQuantity))

      // 根据入库数量更新状态
      if (batch.inboundQuantity === 0) {
        batch.status = InboundStatus.PENDING
      } else if (batch.inboundQuantity === batch.expectedQuantity) {
        batch.status = InboundStatus.COMPLETED
      } else {
        batch.status = InboundStatus.IN_PROGRESS
      }

      batch.updatedAt = new Date().toISOString()

      return responseHandler(batch, '数量更新成功')
    }
  },

  // 获取入库批次渠道进度
  {
    url: '/api/inbound-batches/:id/channels',
    method: 'get',
    response: (config: any) => {
      const { query = {} } = config
      const { id } = query
      const batch = mockInboundBatches.find(item => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404)
      }

      // 生成渠道进度数据
      const channelProgress = mockChannelProgress(batch)
      return responseHandler(channelProgress)
    }
  },

  // 获取入库批次的包裹记录
  {
    url: '/api/inbound-batches/:id/packages',
    method: 'get',
    response: (config: any) => {
      const {  query = {} } = config
      const { id, page = '1', pageSize = '10' } = query

      const batch = mockInboundBatches.find(item => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404)
      }

      // 生成包裹数据
      const packages = mockPackages(batch)
      console.log('packages', packages)
      // 分页
      const result = paginate(packages, Number(page), Number(pageSize))

      return responseHandler(result)
    }
  }
] as MockMethod[]
