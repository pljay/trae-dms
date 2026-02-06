<template>
  <div class="view-content">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <var-input v-model="searchKeyword" :placeholder="t('common.searchPlaceholder')" :delay="300"
        @search="handleSearch">
        <template #append-icon>
          <var-button type="primary" @click="handleSearch" :disabled="!searchKeyword.trim()">
            {{ $t('common.search') }}
          </var-button>
        </template>
      </var-input>
    </div>
    <!-- 状态筛选 -->
    <div class="filter-section">
      <var-tabs elevation color="var(--color-primary)" active-color="var(--color-on-primary)"
        inactive-color="var(--color-on-info)" v-model:active="activeTab" :safe-area="true">
        <var-tab name="in_stock">
          {{ $t('packageRecords.filter.inStock') }} <span class="tab-count">({{ tabCounts.in_stock }})</span>
        </var-tab>
        <var-tab name="pending">
          {{ $t('packageRecords.filter.pending') }} <span class="tab-count">({{ tabCounts.pending }})</span>
        </var-tab>
        <var-tab name="pending_intercept">
          {{ $t('packageRecords.filter.pendingIntercept') }} <span class="tab-count">({{ tabCounts.pending_intercept
          }})</span>
        </var-tab>
        <var-tab name="intercepted">
          {{ $t('packageRecords.filter.intercepted') }} <span class="tab-count">({{ tabCounts.intercepted }})</span>
        </var-tab>
        <var-tab name="hold">
          {{ $t('packageRecords.filter.hold') }} <span class="tab-count">({{ tabCounts.hold }})</span>
        </var-tab>
      </var-tabs>
    </div>

    <!-- 包裹列表 -->
    <var-table ref="tableRef" :scroller-height="tableScrollerHeight">
      <thead style="position: sticky; top: 0">
        <tr>
          <th v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in displayedPackages" :key="row.id">
          <td>{{ row.trackNo || row.no }}</td>
          <td><var-chip :type="getStatusTagType(row.status)" style="white-space: nowrap;">{{ getStatusText(row.status)
              }}</var-chip></td>
          <td>{{ row.channelCode }}</td>
          <td>{{ row.country }}</td>
          <td>{{ row.createTime }}</td>
        </tr>
      </tbody>
    </var-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { usePackageStore } from '@/stores/package'
  import { PackageStatus, Package } from '@/types'
  import { useTitleStore } from '@/stores/title'
  import { calculateRemainHeight } from '@/utils/calculateHeight'
  import { Snackbar } from '@varlet/ui'

  const { t } = useI18n()

  const packageStore = usePackageStore()
  const titleStore = useTitleStore()
  titleStore.setTitle('packageRecords.title')

  // 搜索和筛选相关
  const searchKeyword = ref('')
  const activeTab = ref<'in_stock' | 'pending' | 'pending_intercept' | 'intercepted' | 'hold'>('in_stock')

  // 组件内部状态管理数据
  const packages = ref<Package[]>([])
  // 存储每个状态的包裹数量
  const tabCounts = ref({
    in_stock: 0,
    pending: 0,
    pending_intercept: 0,
    intercepted: 0,
    hold: 0
  })

  // 分页加载相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(false)
  const noMore = ref(false)
  const tableRef = ref<HTMLElement | null>(null)
  // 表格滚动高度
  const tableScrollerHeight = ref('75dvh')

  // 表格列配置
  const columns = [
    { title: t('packageRecords.table.trackNo'), key: 'trackNo', width: 200 },
    { title: t('packageRecords.table.status'), key: 'status', width: 300 },
    { title: t('packageRecords.table.channel'), key: 'channel', width: 150 },
    { title: t('packageRecords.table.country'), key: 'country', width: 120 },
    { title: t('packageRecords.table.createdAt'), key: 'createdAt', width: 180 },
  ]

  // 显示的包裹列表
  const displayedPackages = computed(() => {
    let result = packages.value
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(pkg =>
        pkg.trackNo.toLowerCase().includes(keyword) ||
        (pkg?.channelCode && pkg.channelCode.toLowerCase().includes(keyword))
      )
    }
    return result
  })

  // 根据tab获取对应的状态
  const getStatusFromTab = (tab: string): PackageStatus | undefined => {
    switch (tab) {
      case 'in_stock':
        return PackageStatus.IN_STOCK
      case 'pending':
        return PackageStatus.PENDING
      case 'pending_intercept':
        return PackageStatus.PENDING_INTERCEPT
      case 'intercepted':
        return PackageStatus.INTERCEPTED
      case 'hold':
        return PackageStatus.HOLD
      default:
        return undefined
    }
  }

  // 加载初始数据
  const loadInitialData = async () => {
    // 重置数据和分页状态
    packages.value = []
    currentPage.value = 1
    hasMore.value = true
    noMore.value = false
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  // 加载数据
  const loadData = async (currentPage: number) => {
    Snackbar["loading"]({
      position: 'bottom',
      content: t('common.loading'),
      duration: 2000,
      forbidClick: true,
    })
    const status = getStatusFromTab(activeTab.value)
    let response
    if (status === PackageStatus.PENDING_INTERCEPT) {
      response = await packageStore.fetchInterceptePackages(currentPage, pageSize.value, { status: '1', column: 'createTime', order: 'desc' })
    } else if (status === PackageStatus.INTERCEPTED) {
      response = await packageStore.fetchInterceptePackages(currentPage, pageSize.value, { status: '2', column: 'createTime', order: 'desc' })
    } else if (status === PackageStatus.HOLD) {
      response = await packageStore.fetchHoldPackages(currentPage, pageSize.value, { column: 'createTime', order: 'desc' })
    } else if (status === PackageStatus.IN_STOCK) {
      response = await packageStore.fetchInboundPackages(currentPage, pageSize.value, { status: '3', column: 'createTime', order: 'desc' })
    } else {
      response = await packageStore.fetchInboundPackages(currentPage, pageSize.value, { status: '1', column: 'createTime', order: 'desc' })
    }
    response.records.forEach(pkg => {
      pkg.status = status as PackageStatus
    })
    Snackbar.clear()

    if (currentPage === 1) {
      // 第一页数据，直接替换
      packages.value = response.records
    } else {
      // 加载更多数据，追加
      packages.value = [...packages.value, ...response.records]
    }

    hasMore.value = response.current < response.pages
    noMore.value = !hasMore.value
    // 保存当前状态的包裹总数
    if (currentPage === 1) {
      tabCounts.value[activeTab.value] = response.total
    }
    if (noMore.value) {
      Snackbar["warning"]({
        position: 'bottom',
        content: t('common.noMoreData'),
        duration: 1000,
        forbidClick: true,
      })
    }
  }


  // 加载更多数据
  const loadMore = async () => {
    if (packageStore.loading || noMore.value) return
    currentPage.value++
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load more data:', error)
      currentPage.value--
    }
  }

  // 滚动事件处理
  const handleScroll = (event: Event) => {
    // 先检查加载状态和是否有更多数据
    if (packageStore.loading || noMore.value) {
      return
    }

    const target = event.target as HTMLElement
    if (!target) return

    const { scrollTop, clientHeight, scrollHeight } = target

    // 计算滚动百分比
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

    // 当滚动到80%时触发加载
    if (scrollPercentage >= 90) {
      loadMore()
    }
  }

  // 处理搜索
  const handleSearch = async () => {
    if (searchKeyword.value) {
      packages.value = []
      currentPage.value = 1
      hasMore.value = true
      noMore.value = false
      try {
        await loadData(currentPage.value)
      } catch (error) {
        console.error('Failed to search:', error)
      }
    } else {
      await loadInitialData()
    }
  }


  // 计算表格自适应高度
  const calculateTableHeight = () => {
    const height = calculateRemainHeight(['.search-section', '.filter-section'])
    tableScrollerHeight.value = height + 'px'
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateTableHeight()
  }

  // 获取状态标签类
  const getStatusTagType = (status: string) => {
    switch (status) {
      case PackageStatus.IN_STOCK:
        return 'success'
      case PackageStatus.PENDING:
        return 'warning'
      case PackageStatus.PENDING_INTERCEPT:
        return 'warning'
      case PackageStatus.INTERCEPTED:
        return 'danger'
      case PackageStatus.OUT_OF_STOCK:
        return 'info'
      default:
        return 'default'
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case PackageStatus.IN_STOCK:
        return t('status.package.inStock')
      case PackageStatus.PENDING:
        return t('status.package.pending')
      case PackageStatus.PENDING_INTERCEPT:
        return t('status.package.pendingIntercept')
      case PackageStatus.INTERCEPTED:
        return t('status.package.intercepted')
      case PackageStatus.OUT_OF_STOCK:
        return t('status.package.outOfStock')
      default:
        return t('status.package.unknown')
    }
  }


  // 组件挂载时设置
  onMounted(async () => {
    await loadInitialData()

    // 计算表格初始高度
    nextTick(() => {
      calculateTableHeight()

      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize)

      // 组件挂载后添加滚动事件监听
      if (tableRef.value) {
        // 获取var-table的DOM元素
        const tableElement = (tableRef.value as any).$el || tableRef.value
        // 查找var-table内部的滚动容器
        const scrollContainer = tableElement.querySelector('.var-table__main') as HTMLElement || tableElement
        scrollContainer.addEventListener('scroll', handleScroll)
      }
    })
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    console.log('Unmounted')
    if (tableRef.value) {
      // 获取var-table的DOM元素
      const tableElement = (tableRef.value as any).$el || tableRef.value
      // 查找var-table内部的滚动容器
      const scrollContainer = tableElement.querySelector('.var-table__main') as HTMLElement || tableElement
      scrollContainer.removeEventListener('scroll', handleScroll)
    }

    // 移除窗口大小变化监听
    window.removeEventListener('resize', handleResize)

  })

  // 监听activeTab变化，重新加载数据
  watch(activeTab, () => {
    loadInitialData()
  })

</script>

<style scoped lang="css">

  .search-section {
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 30px;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .search-filter-section {
    background: var(--surface-color);
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }


  .filter-section {
    background: var(--surface-color);
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .loading-more,
  .no-more,
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #999;
    gap: 8px;
  }

  .no-more {
    color: #666;
  }

  .no-data {
    color: #999;
  }

  .tab-count {
    font-size: 12px;
    color: var(--text-secondary);
    margin-left: 4px;
  }


  :deep(.var-table) {
    background: var(--surface-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :deep(.var-table thead) {
    background: var(--background-color);
  }

  :deep(.var-table th) {
    font-weight: 600;
    color: var(--text-primary);
    padding: 12px 16px;
  }

  :deep(.var-table td) {
    padding: 12px 16px;
  }

  :deep(.var-table tbody tr:hover) {
    background: var(--background-color);
  }

  /* 透明化snackbar样式 */
  :deep(.transparent-snackbar) {
    background-color: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 12px 16px;
  }
</style>
