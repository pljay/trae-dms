import { MockMethod } from 'vite-plugin-mock'
// 引入数据类型，确保类型安全
import { InboundBatch, Package as PackageType, InboundStatus, PackageStatus, ErrorCode } from '../types/index'
// 导入全局模拟数据
import { mockInboundBatches, mockPackages } from './global'

// 模拟渠道进度数据 - 根据实际包裹计算
const mockChannelProgress = (batch: InboundBatch) => {
  // 统计每个渠道的包裹数量
  const channelStats = new Map<string, { expected: number; inbound: number }>()
  
  // 从所有包裹中筛选出属于当前批次的包裹
  const batchPackages = mockPackages.filter((pkg: PackageType) => pkg.inboundBatchId === batch.id)
  
  // 遍历批次的所有包裹，统计每个渠道的预计和入库数量
  batchPackages.forEach((pkg: PackageType) => {
    const channel = pkg.channelCode
    if (channel) {
      const stats = channelStats.get(channel) || { expected: 0, inbound: 0 }
      
      // 所有批次的包裹都是预计的，所以每个包裹都计入预计数量
      stats.expected += 1
      
      // 只有已入库或已出库状态的包裹计入入仓数量
      if (pkg.status === PackageStatus.IN_STOCK || pkg.status === PackageStatus.OUT_OF_STOCK) {
        stats.inbound += 1
      }
      
      channelStats.set(channel, stats)
    }
  })
  
  // 转换为预期的格式
  return Array.from(channelStats.entries()).map(([channel, stats]) => ({
    channel,
    expectedQuantity: stats.expected,
    inboundQuantity: stats.inbound
  }))
}

// 统一响应格式
const responseHandler = (data: any, message = 'success', code = 200, errorCode?: number) => {
  return {
    code,
    message,
    data,
    errorCode
  }
}



// Export the mock data for sharing with other mock files
export { mockInboundBatches }

export default [
  // 获取所有入库批次
  {
    url: '/oll-boot/api/dms/inbound/batch',
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

      return responseHandler(filtered)
    }
  },

  // 根据ID获取入库批次
  {
    url: '/oll-boot/api/dms/inbound/batch/:id',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { id } = params
      const batch = mockInboundBatches.find((item: InboundBatch) => item.id == id)

      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
      }

      return responseHandler(batch)
    }
  },

  // 根据批次号获取入库批次
  {
    url: '/oll-boot/api/dms/inbound/batch/:batchNumber',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { batchNumber } = params
      const batch = mockInboundBatches.find((item: InboundBatch) => item.batchNumber === batchNumber)

      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
      }

      return responseHandler(batch)
    }
  },

  // 更新入库批次状态
  {
    url: '/oll-boot/api/dms/inbound-batches/:id/status',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { id } = params
      const { status } = body

      if (!status) {
        return responseHandler(null, '缺少状态参数', 400, ErrorCode.INVALID_PARAMS)
      }

      const batch = mockInboundBatches.find((item: InboundBatch) => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
      }

      batch.status = status
      batch.updatedAt = new Date().toISOString()

      return responseHandler(batch, '状态更新成功')
    }
  },

  // 更新入库数量
  {
    url: '/oll-boot/api/inbound-batches/:id/quantity',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { id } = params
      const { inboundQuantity } = body

      if (inboundQuantity === undefined || isNaN(Number(inboundQuantity))) {
        return responseHandler(null, '无效的数量值', 400, ErrorCode.INVALID_PARAMS)
      }

      const batch = mockInboundBatches.find((item: InboundBatch) => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
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
    url: '/oll-boot/api/inbound-batches/:id/channels',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { id } = params
      const batch = mockInboundBatches.find((item: InboundBatch) => item.id == id)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
      }

      // 生成渠道进度数据
      const channelProgress = mockChannelProgress(batch)
      return responseHandler(channelProgress)
    }
  },

  // 获取入库批次的包裹记录
  {
    url: '/oll-boot/api/inbound-batches/:id/packages',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { id } = params

      // 将ID转换为数字类型进行匹配
      const idNum = Number(id)
      const batch = mockInboundBatches.find(item => item.id === idNum)
      if (!batch) {
        return responseHandler(null, '入库批次不存在', 404, ErrorCode.NOT_FOUND)
      }

      // 从所有包裹中筛选出属于当前批次的包裹
      const packages = mockPackages.filter(pkg => pkg.inboundBatchId === batch.id)
      
      return responseHandler(packages)
    }
  }
] as MockMethod[]
