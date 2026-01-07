import { MockMethod } from 'vite-plugin-mock'
import { faker } from '@faker-js/faker'
import console from 'node:console'

// 包裹状态枚举
const PackageStatus = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  PENDING: 'pending'
}

// 渠道列表
const channels = ['USPS', 'UPS', 'DHL', 'FedEx', 'EMS', 'SF Express', 'YTO Express', 'ZTO Express']

// 国家列表
const countries = ['China', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Canada', 'Australia', 'South Korea', 'Singapore']

// 生成随机跟踪号
const generateTrackNo = () => {
  // 使用faker生成更真实的跟踪号，格式如 TT123456789012
  return `TT${faker.string.numeric({ length: 12, exclude: ['0'] })}
`
}

// 生成随机批次号
const generateBatchSerialNumber = () => {
  const year = new Date().getFullYear()
  const random = faker.string.numeric({ length: 4, exclude: ['0'] })
  return `OB${year}${random}`
}

// 模拟包裹数据
const mockPackages = Array.from({ length: 50 }, (_, i) => {
  // 随机生成状态
  const status = faker.helpers.arrayElement(Object.values(PackageStatus))
  
  // 生成创建时间，过去30天内
  const createdAt = faker.date.past({ refDate: new Date()})
  
  // 生成扫描时间，根据状态决定
  const scanInAt = faker.date.between({ from: createdAt, to: new Date() })
  const scanOutAt = status === PackageStatus.OUT_OF_STOCK 
    ? faker.date.between({ from: scanInAt, to: new Date() })
    : null
  
  // 只有出库状态才有批次号
  const batchSerialNumber = scanOutAt ? generateBatchSerialNumber() : null
  
  return {
    id: i + 1,
    trackNo: generateTrackNo(),
    status,
    weight: faker.number.float({ min: 0.5, max: 20.5, fractionDigits: 2 }), // 0.5kg - 20.5kg, 保留两位小数
    length: faker.number.float({ min: 10, max: 60, fractionDigits: 1 }), // 10cm - 60cm, 保留一位小数
    width: faker.number.float({ min: 5, max: 45, fractionDigits: 1 }), // 5cm - 45cm, 保留一位小数
    height: faker.number.float({ min: 3, max: 33, fractionDigits: 1 }), // 3cm - 33cm, 保留一位小数
    channel: faker.helpers.arrayElement(channels),
    country: faker.helpers.arrayElement(countries),
    scanInAt: scanInAt.toISOString(),
    scanOutAt: scanOutAt?.toISOString() || null,
    batchSerialNumber,
    createdAt: createdAt.toISOString(),
    updatedAt: scanOutAt?.toISOString() || scanInAt.toISOString()
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
  // 获取所有包裹记录（支持分页和搜索）
  {
    url: '/api/packages',
    method: 'get',
    response: ({ query }: { query: { page?: string, pageSize?: string, trackNo?: string, status?: string } }) => {
      const { page = '1', pageSize = '10', trackNo, status } = query
      let filtered = [...mockPackages]
      
      // 按跟踪号搜索
      if (trackNo) {
        filtered = filtered.filter(item => item.trackNo.includes(String(trackNo)))
      }
      
      // 按状态筛选
      if (status) {
        filtered = filtered.filter(item => item.status === String(status))
      }
      
      // 分页
      const result = paginate(filtered, Number(page), Number(pageSize))
      
      return responseHandler(result)
    }
  },
  
  // 根据跟踪号获取包裹
  {
    url: '/api/packages/:trackNo',
    method: 'get',
    response: (config: any) => {
      const { params = {} } = config
      const { trackNo } = params
      const pkg = mockPackages.find(item => item.trackNo === trackNo)
      
      if (!pkg) {
        return responseHandler(null, '包裹不存在', 404)
      }
      
      return responseHandler(pkg)
    }
  },
  
  // 创建包裹记录
  {
    url: '/api/packages',
    method: 'post',
    response: (config: any) => {
      const { body } = config
      if (!body || !body.trackNo || !body.weight || !body.length || !body.width || !body.height || !body.channel || !body.country) {
        return responseHandler(null, '缺少必填参数', 400)
      }
      
      // 检查跟踪号是否已存在
      const existingPkg = mockPackages.find(item => item.trackNo === body.trackNo)
      if (existingPkg) {
        return responseHandler(null, '跟踪号已存在', 409)
      }
      
      // 生成当前时间
      const now = new Date().toISOString()
      
      // 根据业务逻辑确定状态：如果有scanOutAt则为出库状态，否则为入库状态
      let status = body.status || PackageStatus.IN_STOCK
      if (body.scanOutAt) {
        status = PackageStatus.OUT_OF_STOCK
      } else if (!body.scanInAt) {
        // 如果没有提供scanInAt，默认使用当前时间
        body.scanInAt = now
      }
      
      const newPackage = {
        id: mockPackages.length + 1,
        ...body,
        status,
        scanInAt: body.scanInAt || now,
        scanOutAt: body.scanOutAt || null,
        batchSerialNumber: body.batchSerialNumber || null,
        createdAt: now,
        updatedAt: now
      }
      
      mockPackages.unshift(newPackage)
      return responseHandler(newPackage, '创建成功')
    }
  },
  
  // 更新包裹状态
  {
    url: '/api/packages/:trackNo/status',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { trackNo } = params
      const { status } = body
      
      if (!status || !Object.values(PackageStatus).includes(status)) {
        return responseHandler(null, '无效的状态值', 400)
      }
      
      const pkg = mockPackages.find(item => item.trackNo === trackNo)
      if (!pkg) {
        return responseHandler(null, '包裹不存在', 404)
      }
      
      pkg.status = status
      pkg.updatedAt = new Date().toISOString()
      
      return responseHandler(pkg, '状态更新成功')
    }
  },
  
  // 扫描入库
  {
    url: '/api/packages/:trackNo/scan-in',
    method: 'post',
    response: (config: any) => {
      console.log("扫描入库请求",config)
      const { query = {trackNo:String} } = config
      const { trackNo } = query
      console.log("扫描入库",trackNo)
      let pkg = mockPackages.find(item => item.trackNo === trackNo)
      const now = new Date().toISOString()
      
      if (pkg) {
        pkg.status = PackageStatus.IN_STOCK
        pkg.scanInAt = now
        pkg.updatedAt = now
      } else {
        // 创建新包裹，使用faker生成更真实的数据
        const newPackage = {
          id: mockPackages.length + 1,
          trackNo:trackNo,
          status: PackageStatus.IN_STOCK,
          scanInAt: now,
          scanOutAt: null,
          batchSerialNumber: null,
          weight: faker.number.float({ min: 0.5, max: 20.5, fractionDigits: 2 }),
          length: faker.number.float({ min: 10, max: 60, fractionDigits: 1 }),
          width: faker.number.float({ min: 5, max: 45, fractionDigits: 1 }),
          height: faker.number.float({ min: 3, max: 33, fractionDigits: 1 }),
          channel: faker.helpers.arrayElement(channels),
          country: faker.helpers.arrayElement(countries),
          createdAt: now,
          updatedAt: now
        }
        
        mockPackages.unshift(newPackage)
        pkg = newPackage
      }
      
      return responseHandler(pkg, '扫描入库成功')
    }
  },
  
  // 扫描出库
  {
    url: '/api/packages/:trackNo/scan-out',
    method: 'post',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { trackNo } = params
      const { batchSerialNumber } = body
      
      if (!batchSerialNumber) {
        return responseHandler(null, '缺少批次号', 400)
      }
      
      const pkg = mockPackages.find(item => item.trackNo === trackNo)
      if (!pkg) {
        return responseHandler(null, '包裹不存在', 404)
      }
      
      if (pkg.status !== PackageStatus.IN_STOCK) {
        return responseHandler(null, '包裹不在库存中', 400)
      }
      
      pkg.status = PackageStatus.OUT_OF_STOCK
      pkg.scanOutAt = new Date().toISOString()
      pkg.batchSerialNumber = batchSerialNumber
      pkg.updatedAt = new Date().toISOString()
      
      return responseHandler(pkg, '扫描出库成功')
    }
  },
  
  // 根据状态筛选包裹（旧接口兼容）
  {
    url: '/api/packages/filter',
    method: 'get',
    response: ({ query }: { query: { status?: string } }) => {
      const { status } = query
      if (!status) {
        return responseHandler(mockPackages)
      }
      
      const filtered = mockPackages.filter(item => item.status === String(status))
      return responseHandler(filtered)
    }
  }
] as MockMethod[]
