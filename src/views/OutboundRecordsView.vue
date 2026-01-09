<template>
  <div class="outbound-records-container">
    <TopBar :title="t('outboundRecords.title')" />
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
          inactive-color="var(--color-on-info)" v-model:active="activeTab" :safe-area="true" >
          <var-tab name="all">{{ $t('outboundRecords.filter.all') }}</var-tab>
          <var-tab name="inProgress">{{ $t('outboundRecords.filter.inProgress') }}</var-tab>
          <var-tab name="completed">{{ $t('outboundRecords.filter.completed') }}</var-tab>
        </var-tabs>
        <var-tabs-items v-model:active="activeTab" :can-swipe="false">
          <var-tab-item name="all">
            <div class="table-section">
              <var-card shadow="hover">
                <var-table>
                  <thead style="position: sticky; top: 0">
                    <tr>
                      <th v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in getFilteredBatches('all')" :key="row.id">
                      <td>{{ row.serialNumber }}</td>
                      <td><var-chip :type="getStatusTagType(row.status)" style="white-space: nowrap;">{{ getStatusText(row.status) }}</var-chip></td>
                      <td>{{ row.channel }}</td>
                      <td>{{ row.quantity }}</td>
                      <td>{{ formatDate(row.createdAt) }}</td>
                      <td>{{ formatDate(row.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </var-table>

                <!-- 没有数据 -->
                <div v-if="getFilteredBatches('all').length === 0" class="no-data">
                  <span>{{ $t('common.noData') }}</span>
                </div>
              </var-card>
            </div>
          </var-tab-item>
          <var-tab-item name="inProgress">
            <div class="table-section">
              <var-card shadow="hover">
                <var-table>
                  <thead style="position: sticky; top: 0">
                    <tr>
                      <th v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in getFilteredBatches('in_progress')" :key="row.id">
                      <td>{{ row.serialNumber }}</td>
                      <td><var-chip :type="getStatusTagType(row.status)" style="white-space: nowrap;">{{ getStatusText(row.status) }}</var-chip></td>
                      <td>{{ row.channel }}</td>
                      <td>{{ row.quantity }}</td>
                      <td>{{ formatDate(row.createdAt) }}</td>
                      <td>{{ formatDate(row.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </var-table>

                <!-- 没有数据 -->
                <div v-if="getFilteredBatches('in_progress').length === 0" class="no-data">
                  <span>{{ $t('common.noData') }}</span>
                </div>
              </var-card>
            </div>
          </var-tab-item>
          <var-tab-item name="completed">
            <div class="table-section">
              <var-card shadow="hover">
                <var-table>
                  <thead style="position: sticky; top: 0">
                    <tr>
                      <th v-for="column in columns" :key="column.key" :width="column.width">{{ column.title }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in getFilteredBatches('completed')" :key="row.id">
                      <td>{{ row.serialNumber }}</td>
                      <td ><var-chip :type="getStatusTagType(row.status)" style="white-space: nowrap;">{{ getStatusText(row.status) }}</var-chip></td>
                      <td>{{ row.channel }}</td>
                      <td>{{ row.quantity }}</td>
                      <td>{{ formatDate(row.createdAt) }}</td>
                      <td>{{ formatDate(row.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </var-table>

                <!-- 没有数据 -->
                <div v-if="getFilteredBatches('completed').length === 0" class="no-data">
                  <span>{{ $t('common.noData') }}</span>
                </div>
              </var-card>
            </div>
          </var-tab-item>
        </var-tabs-items>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useOutboundStore } from '@/stores/outbound';
  import { OutboundStatus } from '@/types';
  import TopBar from '@/components/TopBar.vue'

  const { t } = useI18n();
  const outboundStore = useOutboundStore();

  // 搜索和筛选相�?
  const searchKeyword = ref('');
  const activeTab = ref('all');

  // 表格列配�?
  const columns = [
    { title: t('outboundRecords.table.serialNumber'), key: 'serialNumber', width: 200 },
    { title: t('outboundRecords.table.status'), key: 'status', width: 200 },
    { title: t('outboundRecords.table.channel'), key: 'channel', width: 150 },
    { title: t('outboundRecords.table.quantity'), key: 'quantity', width: 100 },
    { title: t('outboundRecords.table.createdAt'), key: 'createdAt', width: 180 },
    { title: t('outboundRecords.table.updatedAt'), key: 'updatedAt', width: 180 },
  ];

  // 根据状态和搜索关键词筛选出库批次
  const getFilteredBatches = (status: string) => {
    console.log(status);
    let batches = outboundStore.getAllBatches;

    // 状态筛选
    if (status !== 'all') {
      batches = batches.filter(batch => batch.status === status);
    }

    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      batches = batches.filter(batch =>
        batch.serialNumber.toLowerCase().includes(keyword) ||
        (batch.channel && batch.channel.toLowerCase().includes(keyword))
      );
    }

    return batches;
  };

  // 处理搜索
  const handleSearch = () => {
    // 搜索时重置显示数�?
  };

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

  // 获取状态文�?
  const getStatusText = (status: string) => {
    switch (status) {
      case OutboundStatus.IN_PROGRESS:
        return t('status.inProgress');
      case OutboundStatus.COMPLETED:
        return t('status.completed');
      default:
        return t('common.error');
    }
  };

  // 格式化日�?
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

  // 生命周期钩子
  onMounted(async () => {
    // 初始化outboundStore数据
    await outboundStore.initData();
  });

  // // 监听标签切换
  // const handleTabChange = async () => {
  //   // 标签切换时自动刷新数�? 
  //   await outboundStore.initData();
  // };
</script>

<style scoped lang="css">
  .outbound-records-container {
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

  .filter-section {
    margin-bottom: 30px;
  }

</style>
