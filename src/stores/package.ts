import { defineStore } from 'pinia'
import { Package, PackageStatus} from '../types'
import { 
  getAllPackages, 
  scanInPackage, 
  scanOutPackage,
  getPackagesByStatus
} from '../api/package'
import { Snackbar } from '@varlet/ui'

export const usePackageStore = defineStore('package', {
  state: () => ({
    packages: [] as Package[],
    scanError: null as { pkg: Package; message: string } | null,
    loading: false,
    total: 0,
    page: 1,
    pageSize: 10
  }),
  
  getters: {
    inStockPackages: (state) => state.packages.filter(pkg => pkg.status === PackageStatus.IN_STOCK),
    pendingPackages: (state) => state.packages.filter(pkg => pkg.status === PackageStatus.PENDING),
    outOfStockPackages: (state) => state.packages.filter(pkg => pkg.status === PackageStatus.OUT_OF_STOCK),
    getAllPackages: (state) => state.packages
  },
  
  actions: {
    // 初始化数据 - 从API获取所有包裹
    async initData() {
      this.loading = true
      try {
        const response = await getAllPackages()
        console.log('Fetched packages:', response)
        this.packages = response.list
        this.total = response.total
      } catch (error) {
        console.error('Failed to fetch packages:', error)
        Snackbar({ type: 'error', content: '获取包裹数据失败' })
      } finally {
        this.loading = false
      }
    },
    
    // 入库 - 调用API
    async scanIn(trackNo: string): Promise<Package | null> {
      // 重置之前的错误
      this.scanError = null
      this.loading = true
      
      try {
        const scannedPackage = await scanInPackage(trackNo)
        console.log('Scanned package:', scannedPackage)
        
        // 检查是否需要拦截（可以根据API返回结果判断）
        if (trackNo.includes('INTERCEPT')) {
          this.scanError = {
            pkg: scannedPackage,
            message: '该包裹因安全检查需要被拦截，请联系客服处理'
          }
          return null
        }
        
        this.packages.push(scannedPackage)
        this.total++
        Snackbar({ type: 'success', content: '包裹入库成功' })
        return scannedPackage
      } catch (error) {
        console.error('Failed to scan in package:', error)
        Snackbar({ type: 'error', content: '包裹入库失败' })
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 出库 - 调用API
    async scanOut(trackNo: string, batchNumber: string): Promise<boolean> {
      this.loading = true
      try {
        const updatedPackage = await scanOutPackage(trackNo, batchNumber)
        
        const packageIndex = this.packages.findIndex(pkg => pkg.trackNo === trackNo)
        if (packageIndex !== -1) {
          this.packages[packageIndex] = updatedPackage
        } else {
          // 如果本地没有该包裹，添加到列表
          this.packages.push(updatedPackage)
          this.total++
        }
        
        Snackbar({ type: 'success', content: '包裹出库成功' })
        return true
      } catch (error) {
        console.error('Failed to scan out package:', error)
        Snackbar({ type: 'error', content: '包裹出库失败' })
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 获取包裹信息
    getPackageByTrackNo(trackNo: string): Package | undefined {
      return this.packages.find(pkg => pkg.trackNo === trackNo)
    },
    
    // 根据状态获取包裹 - 调用API
    async fetchPackagesByStatus(status: PackageStatus): Promise<Package[]> {
      try {
        const response = await getPackagesByStatus(status)
        this.packages = response.list
        this.total = response.total
        return response.list
      } catch (error) {
        console.error(`Failed to fetch packages by status ${status}:`, error)
        Snackbar({ type: 'error', content: '获取包裹数据失败' })
        return []
      }
    },
    
    // 分页获取包裹数据
    async fetchPackages(page: number, pageSize: number, trackNo?: string, status?: PackageStatus) {
      this.loading = true
      try {
        const response = await getAllPackages(page, pageSize, trackNo, status)
        this.packages = response.list
        this.total = response.total
        this.page = page
        this.pageSize = pageSize
      } catch (error) {
        console.error('Failed to fetch packages:', error)
        Snackbar({ type: 'error', content: '获取包裹数据失败' })
      } finally {
        this.loading = false
      }
    }
  }
})