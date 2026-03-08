import { faker } from '@faker-js/faker'
import { InboundBatch, Package, OutboundBatch, InboundStatus, PackageStatus, OutboundStatus, ChannelEnum } from '../types/index'

// 生成模拟入库批次数据
export const mockInboundBatches: InboundBatch[] = Array.from({ length: 10 }, (_, index) => ({
  id: `batch_${index + 1}`,
  batchNumber: `IB${faker.number.int({ min: 1000, max: 9999 })}`,
  expectedQuantity: faker.number.int({ min: 10, max: 100 }),
  inboundQuantity: faker.number.int({ min: 0, max: 100 }),
  outboundQuantity: faker.number.int({ min: 0, max: 100 }),
  status: InboundStatus.COMPLETED,
  inboundStatus: InboundStatus.COMPLETED,
  createTime: faker.date.past().toISOString(),
  updateTime: faker.date.recent().toISOString()
}))

// 生成模拟包裹数据
export const mockPackages: Package[] = Array.from({ length: 100 }, (_, index) => ({
  id: `pkg_${index + 1}`,
  trackNo: `TRK${faker.number.int({ min: 1000000, max: 9999999 })}`,
  no: `PKG${faker.number.int({ min: 1000000, max: 9999999 })}`,
  status: PackageStatus.IN_STOCK,
  channelId: `channel_${faker.number.int({ min: 1, max: 5 })}`,
  channelCode: `CH${faker.number.int({ min: 100, max: 999 })}`,
  country: faker.location.country(),
  inboundBatchId: `batch_${faker.number.int({ min: 1, max: 10 })}`,
  weight: faker.number.float({ min: 0.1, max: 10 }),
  length: faker.number.int({ min: 1, max: 50 }),
  width: faker.number.int({ min: 1, max: 50 }),
  height: faker.number.int({ min: 1, max: 50 }),
  createTime: faker.date.past().toISOString()
}))

// 生成模拟出库批次数据
export const mockOutboundBatches: OutboundBatch[] = Array.from({ length: 10 }, (_, index) => ({
  id: `outbound_batch_${index + 1}`,
  serialNumber: `OB${faker.number.int({ min: 1000, max: 9999 })}`,
  batchNo: `BT${faker.number.int({ min: 1000, max: 9999 })}`,
  channelId: `channel_${faker.number.int({ min: 1, max: 5 })}`,
  channel: ChannelEnum.USPS,
  expectedQuantity: faker.number.int({ min: 10, max: 100 }),
  outboundQuantity: faker.number.int({ min: 0, max: 100 }),
  quantity: faker.number.int({ min: 10, max: 100 }),
  pieces: faker.number.int({ min: 10, max: 100 }),
  status: OutboundStatus.IN_PROGRESS,
  createTime: faker.date.past().toISOString(),
  updateTime: faker.date.recent().toISOString()
}))
