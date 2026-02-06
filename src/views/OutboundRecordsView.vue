<template>
  <div class="view-content">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <!-- 搜索框-->
      <div class="search-box">
        <var-input v-model="searchKeyword" :placeholder="t('common.searchPlaceholder')" clearable prepend-icon="search"
          @clear="handleSearch" @keyup.enter="handleSearch">
          <template #append-icon>
            <var-button type="primary" @click="handleSearch">
              {{ $t('common.search') }}
            </var-button>
          </template>
        </var-input>
      </div>

      <!-- 状态筛选器 -->
      <div class="filter-section">
        <var-tabs elevation color="var(--color-primary)" active-color="var(--color-on-primary)"
          inactive-color="var(--color-on-info)" v-model:active="activeTab" :safe-area="true">
          <var-tab name="inProgress">{{ $t('outboundRecords.filter.inProgress') }}</var-tab>
          <var-tab name="completed">{{ $t('outboundRecords.filter.completed') }}</var-tab>
        </var-tabs>
      </div>
      <var-table :scroller-height="tableScrollerHeight" ref="tableRef">
        <thead style="position: sticky; top: 0">
          <tr>
            <th v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayedBatches" :key="row.id">
            <td>{{ row.serialNumber }}</td>
            <td><var-chip :type="getStatusTagType(row.status)" style="white-space: nowrap;">{{
              getStatusText(row.status)
                }}</var-chip></td>
            <td>{{ row.channelCode }}</td>
            <td>{{ row.quantity }}</td>
            <td>{{ formatDate(row.createdAt) }}</td>
            <td>{{ formatDate(row.updatedAt) }}</td>
          </tr>
        </tbody>
      </var-table>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useOutboundStore } from '@/stores/outbound';
  import { OutboundStatus, OutboundBatch } from '@/types';
  import { useTitleStore } from '@/stores/title'
  import { calculateRemainHeight } from '@/utils/calculateHeight'
  import { Snackbar } from '@varlet/ui'

  const { t } = useI18n();
  const outboundStore = useOutboundStore();
  const titleStore = useTitleStore()
  titleStore.setTitle('outboundRecords.title')

  // 搜索和筛选相关
  const searchKeyword = ref('');
  const activeTab = ref('inProgress');
  const tableScrollerHeight = ref('')

  // 组件内部状态管理数据
  const batches = ref<OutboundBatch[]>([])

  // 分页加载相关
  const currentPage = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
  const noMore = ref(false)
  const tableRef = ref<HTMLElement | null>(null)

  // 表格列配置
  const columns = [
    { title: t('outboundRecords.table.serialNumber'), key: 'serialNumber', width: 200 },
    { title: t('outboundRecords.table.status'), key: 'status', width: 200 },
    { title: t('outboundRecords.table.channel'), key: 'channel', width: 150 },
    { title: t('outboundRecords.table.quantity'), key: 'quantity', width: 100 },
    { title: t('outboundRecords.table.createdAt'), key: 'createdAt', width: 180 },
    { title: t('outboundRecords.table.updatedAt'), key: 'updatedAt', width: 180 },
  ];

  // 显示的批次列表
  const displayedBatches = computed(() => {
    let result = batches.value;
    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      result = result.filter(batch =>
        batch.serialNumber.toLowerCase().includes(keyword) ||
        (batch.channelCode && (batch.channelCode as string).toLowerCase().includes(keyword))
      );
    }

    return result;
  });

  // 根据tab获取对应的状态
  const getStatusFromTab = (tab: string): OutboundStatus | undefined => {
    switch (tab) {
      case 'inProgress':
        return OutboundStatus.IN_PROGRESS
      case 'completed':
        return OutboundStatus.COMPLETED
      default:
        return undefined
    }
  }

  // 加载数据
  const loadData = async (currentPage: number, params?: Record<string, any>) => {
    Snackbar["loading"]({
      position: 'bottom',
      content: t('common.loading'),
      duration: 2000,
      forbidClick: true,
    })
    const status = getStatusFromTab(activeTab.value)
    let response: any
    if (status === OutboundStatus.IN_PROGRESS) {
      response = await outboundStore.fetchBatches(currentPage, pageSize.value, { status: '0', ...params })
    } else if (status === OutboundStatus.COMPLETED) {
      response = await outboundStore.fetchBatches(currentPage, pageSize.value, { status: '1', ...params })
    }
    response.records.forEach((item: OutboundBatch) => {
      item.status = status as OutboundStatus
    })
    Snackbar.clear()
    if (currentPage === 1) {
      // 第一页数据，直接替换
      batches.value = response.records || []
    } else {
      // 加载更多数据，追加
      batches.value = [...batches.value, ...response.records || []]
    }
    hasMore.value = response.current < response.pages
    noMore.value = !hasMore.value
    if (noMore.value) {
      Snackbar["warning"]({
        position: 'bottom',
        content: t('common.noMoreData'),
        duration: 1000,
        forbidClick: true,
      })
    }
  }

  // 加载初始数据
  const loadInitialData = async () => {
    batches.value = []
    currentPage.value = 1
    hasMore.value = true
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  // 加载更多数据
  const loadMore = async () => {
    if (outboundStore.loading || !hasMore.value) return
    currentPage.value++
    try {
      await loadData(currentPage.value)
    } catch (error) {
      console.error('Failed to load more data:', error)
      currentPage.value--
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

  // 滚动事件处理
  const handleScroll = (event: Event) => {
    // 先检查加载状态和是否有更多数据
    if (outboundStore.loading || noMore.value) {
      return
    }

    const target = event.target as HTMLElement
    if (!target) return

    const { scrollTop, clientHeight, scrollHeight } = target

    // 计算滚动百分比
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

    // 当滚动到80%时触发加载
    if (scrollPercentage >= 80) {
      loadMore()
    }
  }


  // 处理搜索
  const handleSearch = async () => {
    if (searchKeyword.value) {
      batches.value = []
      currentPage.value = 1
      hasMore.value = true
      try {
        await loadData(currentPage.value, { serialNumber: searchKeyword.value })
      } catch (error) {
        console.error('Failed to search:', error)
      }
    } else {
      await loadInitialData()
    }
  }

  // 监听activeTab变化，重新加载数据
  watch(activeTab, () => {
    loadInitialData()
  })

  // 监听搜索关键词变化，延迟搜索
  watch(searchKeyword, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timer);
    }
  });

  // 获取状态标签类
  const getStatusTagType = (status: string) => {
    switch (status) {
      case OutboundStatus.IN_PROGRESS:
        return 'warning';
      case OutboundStatus.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case OutboundStatus.IN_PROGRESS:
        return t('status.outboundBatch.inProgress');
      case OutboundStatus.COMPLETED:
        return t('status.outboundBatch.completed');
      default:
        return t('status.outboundBatch.unknown');
    }
  };

  // 格式化日期
  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    // 将字符串转换为Date对象
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 组件挂载时设置
  onMounted(async () => {
    await loadInitialData()
    calculateTableHeight()

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize)
    // 组件挂载后添加滚动事件监听
    nextTick(() => {
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
</script>

<style scoped lang="css">
  .outbound-records-container {
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

  .filter-section {
    margin-bottom: 30px;
  }
  .scanner-section {
    margin-bottom: 30px;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .scan-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .scan-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    gap: 20px;
  }

  .scan-button-container :deep(.var-button) {
    min-height: 56px;
    min-width: 200px;
    font-size: 16px;
    font-weight: 500;
  }

  .manual-input-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .manual-input-section :deep(.var-input) {
    margin-bottom: 10px;
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
