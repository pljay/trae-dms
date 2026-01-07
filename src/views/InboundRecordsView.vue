<template>
  <div class="package-records-container">
    <TopBar :title="t('packageRecords.title')" />
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <!-- 搜索框 -->
      <div class="search-box">
        <var-input v-model="searchKeyword" :placeholder="t('common.searchPlaceholder')" clearable prefix="search"
          @clear="handleSearch" @keyup.enter="handleSearch">
          <template #append-icon>
            <var-button type="primary" @click="handleSearch">
              {{ $t('common.search') }}
            </var-button>
          </template>
        </var-input>
      </div>
    </div>
    <!-- 状态筛选 -->
    <var-tabs color="var(--color-primary)" active-color="var(--color-on-primary)" inactive-color="var(--color-on-info)"
      v-model:active="activeTab" :safe-area="true">
      <var-tab name="all">{{ $t('packageRecords.filter.all') }}</var-tab>
      <var-tab name="in_stock">{{ $t('packageRecords.filter.inStock') }}</var-tab>
      <var-tab name="pending">{{ $t('packageRecords.filter.pending') }}</var-tab>
      <var-tab name="out_of_stock">{{ $t('packageRecords.filter.outOfStock') }}</var-tab>
    </var-tabs>
    <var-tabs-items v-model:active="activeTab" :can-swipe="false">
      <var-tab-item name="all">
        <!-- 所有状态的内容 -->
        <var-table>
          <thead style="position: sticky; top: 0">
            <tr>
              <td v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in getFilteredPackages('all')" :key="row.id">
              <td>{{ row.trackNo }}</td>
              <td><var-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</var-tag></td>
              <td>{{ row.channel }}</td>
              <td>{{ row.country }}</td>
              <!-- <td>{{ row.weight }} kg</td>
              <td>{{ row.length }}x{{ row.width }}x{{ row.height }} cm</td> -->
              <td>{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </var-table>

        <!-- 没有数据 -->
        <div v-if="getFilteredPackages('all').length === 0" class="no-data">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-tab-item>
      <var-tab-item name="in_stock">
        <!-- 已入库的内容 -->
        <var-table>
          <thead style="position: sticky; top: 0">
            <tr>
              <td v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in getFilteredPackages('in_stock')" :key="row.id">
              <td>{{ row.trackNo }}</td>
              <td><var-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</var-tag></td>
              <td>{{ row.channel }}</td>
              <td>{{ row.country }}</td>
              <!-- <td>{{ row.weight }} kg</td>
              <td>{{ row.length }}x{{ row.width }}x{{ row.height }} cm</td> -->
              <td>{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </var-table>

        <!-- 没有数据 -->
        <div v-if="getFilteredPackages('in_stock').length === 0" class="no-data">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-tab-item>
      <var-tab-item name="pending">
        <!-- 待出库的内容 -->
        <var-table>
          <thead style="position: sticky; top: 0">
            <tr>
              <td v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in getFilteredPackages('pending')" :key="row.id">
              <td>{{ row.trackNo }}</td>
              <td><var-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</var-tag></td>
              <td>{{ row.channel }}</td>
              <td>{{ row.country }}</td>
              <!-- <td>{{ row.weight }} kg</td>
              <td>{{ row.length }}x{{ row.width }}x{{ row.height }} cm</td> -->
              <td>{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </var-table>

        <!-- 没有数据 -->
        <div v-if="getFilteredPackages('pending').length === 0" class="no-data">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-tab-item>
      <var-tab-item name="out_of_stock">
        <!-- 已出库的内容 -->
        <var-table>
          <thead style="position: sticky; top: 0">
            <tr>
              <td v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in getFilteredPackages('out_of_stock')" :key="row.id">
              <td>{{ row.trackNo }}</td>
              <td><var-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</var-tag></td>
              <td>{{ row.channel }}</td>
              <td>{{ row.country }}</td>
              <!-- <td>{{ row.weight }} kg</td>
              <td>{{ row.length }}x{{ row.width }}x{{ row.height }} cm</td> -->
              <td>{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </var-table>

        <!-- 没有数据 -->
        <div v-if="getFilteredPackages('out_of_stock').length === 0" class="no-data">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-tab-item>
    </var-tabs-items>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { usePackageStore } from '@/stores/package'
  import { Package, PackageStatus } from '@/types'
  import TopBar from '@/components/TopBar.vue'

  const { t } = useI18n()

  const packageStore = usePackageStore()

  // 搜索和筛选相关
  const searchKeyword = ref('')
  const activeTab = ref('all')

  // 表格列配置
  const columns = [
    { title: t('packageRecords.table.trackNo'), key: 'trackNo', width: 200 },
    { title: t('packageRecords.table.status'), key: 'status', width: 300 },
    { title: t('packageRecords.table.channel'), key: 'channel', width: 150 },
    { title: t('packageRecords.table.country'), key: 'country', width: 120 },
    // { title: t('packageRecords.table.weight'), key: 'weight', width: 100 },
    // { title: t('packageRecords.table.dimensions'), key: 'dimensions', width: 150 },
    { title: t('packageRecords.table.createdAt'), key: 'createdAt', width: 180 },
  ]

  // 根据状态获取筛选后的包裹
  const getFilteredPackages = (status: string) => {
    let packages = packageStore.getAllPackages

    // 状态筛选
    if (status !== 'all') {
      packages = packages.filter(pkg => pkg.status === status)
    }

    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      packages = packages.filter(pkg =>
        pkg.trackNo.toLowerCase().includes(keyword) ||
        (pkg.channel && pkg.channel.toLowerCase().includes(keyword)) ||
        (pkg.country && pkg.country.toLowerCase().includes(keyword))
      )
    }

    return packages
  }

  // 滚动加载相关
  const tableContainer = ref<HTMLElement | null>(null)
  const loading = ref(false)
  const hasMore = ref(true)
  const displayedPackages = ref<Package[]>([])
  const batchSize = ref(100)

  // 处理搜索
  const handleSearch = () => {
    displayedPackages.value = []
    loadInitialData()
  }

  // 加载初始数据
  const loadInitialData = () => {
    const filteredPackages = getFilteredPackages(activeTab.value)
    displayedPackages.value = filteredPackages.slice(0, batchSize.value)
    hasMore.value = displayedPackages.value.length < filteredPackages.length
  }

  // 加载更多数据
  const loadMore = () => {
    if (loading.value || !hasMore.value) return

    loading.value = true

    // 模拟异步加载
    setTimeout(() => {
      const filteredPackages = getFilteredPackages(activeTab.value)
      const nextBatch = filteredPackages.slice(
        displayedPackages.value.length,
        displayedPackages.value.length + batchSize.value
      )

      displayedPackages.value = [...displayedPackages.value, ...nextBatch]
      hasMore.value = displayedPackages.value.length < filteredPackages.length
      loading.value = false
    }, 500)
  }

  // 滚动事件处理
  const handleScroll = () => {
    if (!tableContainer.value) return

    const { scrollTop, clientHeight, scrollHeight } = tableContainer.value
    const scrollThreshold = scrollHeight - clientHeight - 100

    if (scrollTop >= scrollThreshold) {
      loadMore()
    }
  }

  // 监听activeTab变化，重置加载状态
  watch(activeTab, () => {
    displayedPackages.value = []
    loadInitialData()
  })

  // 监听搜索关键词变化，延迟搜索
  watch(searchKeyword, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      const timer = setTimeout(() => {
        handleSearch()
      }, 300)
      return () => clearTimeout(timer)
    }
  })

  // 获取状态标签类
  const getStatusTagType = (status: string) => {
    switch (status) {
      case PackageStatus.IN_STOCK:
        return 'success'
      case PackageStatus.PENDING:
        return 'warning'
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
        return t('status.inStock')
      case PackageStatus.PENDING:
        return t('status.pending')
      case PackageStatus.OUT_OF_STOCK:
        return t('status.outOfStock')
      default:
        return t('common.error')
    }
  }

  // 格式化日期
  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 组件挂载时设置
  onMounted(async () => {
    await packageStore.initData()
    loadInitialData()

    if (tableContainer.value) {
      tableContainer.value.addEventListener('scroll', handleScroll)
    }
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    if (tableContainer.value) {
      tableContainer.value.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<style scoped lang="css">
  .package-records-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }




</style>
