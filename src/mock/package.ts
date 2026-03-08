import { MockMethod } from 'vite-plugin-mock'
import { mockPackages } from './global'
import { PackageStatus, ErrorCode } from '../types/index'

const responseHandler = (data: any, message = 'success', code = 200) => {
  return {
    code,
    data,
    message
  }
}

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
  // 获取仓库中所有件数（已入库、已拦截、待处理）
  {
    url: '/oll-boot/api/dms/into/parcel/count',
    method: 'get',
    response: () => {
      const intoCount = mockPackages.filter(item => item.status === PackageStatus.IN_STOCK).length
      const interceptedCount = mockPackages.filter(item => item.status === PackageStatus.INTERCEPTED).length
      const holdCount = mockPackages.filter(item => item.status === PackageStatus.PENDING).length
      const totalCount = intoCount + interceptedCount + holdCount
      
      return responseHandler({
        intoCount,
        interceptedCount,
        holdCount,
        totalCount
      })
    }
  },
  
  // 获取待拦截包裹列表
  {
    url: '/oll-boot/api/dms/parcel/hold',
    method: 'get',
    response: ({ query, body }: { query: { page?: string, pageSize?: string }, body?: Record<string, any> }) => {
      const { page = '1', pageSize = '10' } = query
      let filtered = [...mockPackages]
      
      filtered = filtered.filter(item => item.status === PackageStatus.PENDING_INTERCEPT || item.status === PackageStatus.INTERCEPTED)
      
      if (body?.trackNo) {
        filtered = filtered.filter(item => item.trackNo.includes(String(body.trackNo)))
      }
      
      const result = paginate(filtered, Number(page), Number(pageSize))
      return responseHandler(result)
    }
  },
  
  // 获取所有包裹记录（支持分页和查询条件）
  {
    url: '/oll-boot/api/dms/parcel',
    method: 'get',
    response: ({ query, body }: { query: { page?: string, pageSize?: string }, body?: Record<string, any> }) => {
      const { page = '1', pageSize = '10' } = query
      let filtered = [...mockPackages]
      
      if (body?.trackNo) {
        filtered = filtered.filter(item => item.trackNo.includes(String(body.trackNo)))
      }
      
      if (body?.status) {
        filtered = filtered.filter(item => item.status === String(body.status))
      }
      
      if (body?.inboundBatchId) {
        filtered = filtered.filter(item => item.inboundBatchId === Number(body.inboundBatchId))
      }
      
      const result = paginate(filtered, Number(page), Number(pageSize))
      return responseHandler(result)
    }
  },
  
  // 根据跟踪号获取包裹
  {
    url: '/oll-boot/api/dms/parcel/:trackNo',
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
    url: '/oll-boot/api/dms/parcel',
    method: 'post',
    response: (config: any) => {
      const { body = {} } = config
      const newPackage = {
        ...body,
        id: mockPackages.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockPackages.unshift(newPackage)
      return responseHandler(newPackage, '创建成功')
    }
  },
  
  // 更新包裹状态
  {
    url: '/oll-boot/api/dms/parcel/:trackNo/status',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { trackNo } = params
      const { status } = body
      
      if (!status || !Object.values(PackageStatus).includes(status as PackageStatus)) {
        return responseHandler(null, '无效的状态值', 400)
      }
      
      const pkg = mockPackages.find(item => item.trackNo === trackNo)
      if (!pkg) {
        return responseHandler(null, '包裹不存在', 404)
      }
      
      pkg.status = status as PackageStatus

      
      return responseHandler(pkg, '状态更新成功')
    }
  },
  
  // 更新包裹信息
  {
    url: '/oll-boot/api/dms/parcel/:trackNo',
    method: 'put',
    response: (config: any) => {
      const { params = {}, body = {} } = config
      const { trackNo } = params
      
      const pkg = mockPackages.find(item => item.trackNo === trackNo)
      if (!pkg) {
        return responseHandler(null, '包裹不存在', 404)
      }
      
      Object.assign(pkg, body)

      
      return responseHandler(pkg, '更新成功')
    }
  },
  
  // 扫描入库
  {
    url: '/oll-boot/api/dms/inbopund/pre/scan',
    method: 'post',
    response: (config: any) => {
      const { body = {} } = config
      const { trackNo } = body
      
      if (!trackNo) {
        return responseHandler(null, '缺少包裹跟踪号', 400)
      }
      
      let pkg = mockPackages.find(item => item.trackNo === trackNo)
      const now = new Date().toISOString()
      
      if (!pkg) {
        return responseHandler(null, '非预报包裹，直接拦截', ErrorCode.NOT_FORECAST)
      }
      
      switch (pkg.status) {
        case PackageStatus.PENDING:
          pkg.status = PackageStatus.IN_STOCK
          pkg.scanInAt = now

          return responseHandler(pkg, '扫描入库成功', 200)
        case PackageStatus.IN_STOCK:
          return responseHandler(pkg, '已入库状态，重复入库', ErrorCode.DUPLICATE_INBOUND)
        case PackageStatus.PENDING_INTERCEPT:
          pkg.status = PackageStatus.INTERCEPTED

          return responseHandler(pkg, '拦截', ErrorCode.PENDING_INTERCEPT)
        case PackageStatus.INTERCEPTED:
          return responseHandler(pkg, '重复拦截', ErrorCode.DUPLICATE_INTERCEPTED)
        default:
          return responseHandler(pkg, `包裹当前状态为${pkg.status}，无法入库`, ErrorCode.INVALID_STATUS)
      }
    }
  },
  
  // 扫描出库
  {
    url: '/oll-boot/api/dms/outbound/scan',
    method: 'post',
    response: (config: any) => {
      const { body = {} } = config
      const { trackNo, batchId } = body
      
      if (!batchId) {
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
      pkg.outboundBatchId = batchId

      
      return responseHandler(pkg, '扫描出库成功')
    }
  }
] as MockMethod[]
