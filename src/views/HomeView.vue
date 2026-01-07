<template>
  <div class="home-container">
    <h1 class="page-title">{{ $t('home.title') }}</h1>

    <!-- 功能模块 -->
    <div class="function-modules">
      <var-row :gutter="[10, 10]">
        <!-- 扫描入库 -->
        <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <var-card shadow="hover" class="module-card" @click="navigateTo('/scan-in')">
            <div class="module-content">
              <div class="module-icon camera-icon">
                <var-icon name="camera" :size="48" />
              </div>
              <h3 class="module-title">{{ $t('home.modules.scanIn') }}</h3>
              <p class="module-desc">{{ $t('home.modules.scanInDesc') }}</p>
            </div>
          </var-card>
        </var-col>

        <!-- 入库记录 -->
        <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <var-card shadow="hover" class="module-card" @click="navigateTo('/inbound-records')">
            <div class="module-content">
              <div class="module-icon in-icon">
                <var-icon name="format-list-checkbox" :size="48" />
              </div>
              <h3 class="module-title">{{ $t('home.modules.inboundRecords') }}</h3>
              <p class="module-desc">{{ $t('home.modules.inboundRecordsDesc') }}</p>
            </div>
          </var-card>
        </var-col>
        <!-- 入库批次 -->
        <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <var-card shadow="hover" class="module-card" @click="navigateTo('/inbound-batches')">
            <div class="module-content">
              <div class="module-icon batch-icon">
                <var-icon name="format-list-checkbox" :size="48" />
              </div>
              <h3 class="module-title">{{ $t('home.modules.inboundBatches') }}</h3>
              <p class="module-desc">{{ $t('home.modules.inboundBatchesDesc') }}</p>
            </div>
          </var-card>
        </var-col>


        <!-- 扫描出库 -->
        <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <var-card shadow="hover" class="module-card" @click="navigateTo('/scan-out')">
            <div class="module-content">
              <div class="module-icon upload-icon">
                <var-icon name="upload-outline" :size="48" />
              </div>
              <h3 class="module-title">{{ $t('home.modules.scanOut') }}</h3>
              <p class="module-desc">{{ $t('home.modules.scanOutDesc') }}</p>
            </div>
          </var-card>
        </var-col>

        <!-- 出库记录 -->
        <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <var-card shadow="hover" class="module-card" @click="navigateTo('/outbound-records')">
            <div class="module-content">
              <div class="module-icon list-icon">
                <var-icon name="format-list-checkbox" :size="48" />
              </div>
              <h3 class="module-title">{{ $t('home.modules.outboundRecords') }}</h3>
              <p class="module-desc">{{ $t('home.modules.outboundRecordsDesc') }}</p>
            </div>
          </var-card>
        </var-col>

      </var-row>
    </div>

    <!-- 数据统计 -->
    <div class="stats-section">
      <var-card shadow="hover">
        <h2 class="stats-title">{{ $t('home.stats.title') }}</h2>
        <var-row :gutter="[12, 12]">
          <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <div class="stat-card stat-total">
              <div class="stat-header">
                <var-icon name="package-variant-closed" :size="28" />
                <span class="stat-label">{{ $t('home.stats.totalPackages') }}</span>
              </div>
              <div class="stat-body">
                <div class="stat-number">{{ totalPackages }}</div>
                <div class="stat-progress">
                  <var-progress :value="100" :show-value="false" track-color="#e8e8e8" color="#667eea" />
                </div>
              </div>
            </div>
          </var-col>
          <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <div class="stat-card stat-instock">
              <div class="stat-header">
                <var-icon name="check-circle" :size="28" />
                <span class="stat-label">{{ $t('home.stats.inStock') }}</span>
              </div>
              <div class="stat-body">
                <div class="stat-number">{{ inStockPackages }}</div>
                <div class="stat-progress">
                  <var-progress :value="getInStockPercentage" :show-value="false" track-color="#e8e8e8"
                    color="#00b894" />
                </div>
              </div>
              <div class="stat-footer">
                <var-chip type="success" size="small">{{ getInStockPercentage.toFixed(1) }}%</var-chip>
              </div>
            </div>
          </var-col>
          <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <div class="stat-card stat-pending">
              <div class="stat-header">
                <var-icon name="clock-outline" :size="28" />
                <span class="stat-label">{{ $t('home.stats.pending') }}</span>
              </div>
              <div class="stat-body">
                <div class="stat-number">{{ pendingPackages }}</div>
                <div class="stat-progress">
                  <var-progress :value="getPendingPercentage" :show-value="false" track-color="#e8e8e8"
                    color="#fdcb6e" />
                </div>
              </div>
              <div class="stat-footer">
                <var-chip type="warning" size="small">{{ getPendingPercentage.toFixed(1) }}%</var-chip>
              </div>
            </div>
          </var-col>
          <var-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <div class="stat-card stat-batches">
              <div class="stat-header">
                <var-icon name="format-list-bulleted-type" :size="28" />
                <span class="stat-label">{{ $t('home.stats.totalBatches') }}</span>
              </div>
              <div class="stat-body">
                <div class="stat-number">{{ totalBatches }}</div>
                <div class="stat-progress">
                  <var-progress :value="100" :show-value="false" track-color="#e8e8e8" color="#6c5ce7" />
                </div>
              </div>
            </div>
          </var-col>
        </var-row>
      </var-card>
    </div>

    <!-- 入库批次进度 -->
    <div class="inbound-batches-section">
      <var-card shadow="hover">
        <h2 class="stats-title">{{ $t('inboundBatches.inboundProgress') }}</h2>
        <var-tabs v-model="activeInboundTab" class="inbound-tabs">
          <!-- 待入库批次 -->
          <var-tab :label="$t('inboundBatches.pendingBatches')">
            <div class="tab-content">
              <div v-if="pendingInboundBatches.length > 0" class="inbound-batch-list">
                <var-list>
                  <var-cell v-for="batch in pendingInboundBatches" :key="batch.id" class="inbound-batch-item"
                    @click="navigateTo(`/inbound-batches/${batch.id}`)">
                    <div class="cell-content">
                      <div class="batch-title">
                        <div class="batch-number">{{ batch.batchNumber }}</div>
                        <var-tag type="warning" class="status-tag">
                          {{ $t('status.notInbound') }}
                        </var-tag>
                      </div>
                      <div class="batch-info">
                        <div class="batch-progress">
                          <div class="progress-text">
                            {{ $t('inboundBatches.inboundProgressText', { current: batch.inboundQuantity, total: batch.expectedQuantity }) }}
                          </div>
                          <var-progress :percentage="getInboundProgress(batch)" :color="getProgressColor(batch)"
                            :height="8" class="progress-bar" />
                        </div>
                        <div class="progress-percentage">
                          {{ getInboundProgress(batch) }}%
                        </div>
                      </div>
                    </div>
                  </var-cell>
                </var-list>
              </div>
              <div v-else class="empty-state">
                <var-empty :description="$t('inboundBatches.noPendingBatches')" />
              </div>
            </div>
          </var-tab>

          <!-- 入库中批次 -->
          <var-tab :label="$t('inboundBatches.inProgressBatches')">
            <div class="tab-content">
              <div v-if="inProgressInboundBatches.length > 0" class="inbound-batch-list">
                <var-list>
                  <var-cell v-for="batch in inProgressInboundBatches" :key="batch.id" class="inbound-batch-item"
                    @click="navigateTo(`/inbound-batches/${batch.id}`)">
                    <div class="cell-content">
                      <div class="batch-title">
                        <div class="batch-number">{{ batch.batchNumber }}</div>
                        <var-tag type="primary" class="status-tag">
                          {{ $t('status.inProgress') }}
                        </var-tag>
                      </div>
                      <div class="batch-info">
                        <div class="batch-progress">
                          <div class="progress-text">
                            {{ $t('inboundBatches.inboundProgressText', { current: batch.inboundQuantity, total: batch.expectedQuantity }) }}
                          </div>
                          <var-progress :percentage="getInboundProgress(batch)" :color="getProgressColor(batch)"
                            :height="8" class="progress-bar" />
                        </div>
                        <div class="progress-percentage">
                          {{ getInboundProgress(batch) }}%
                        </div>
                      </div>
                    </div>
                  </var-cell>
                </var-list>
              </div>
              <div v-else class="empty-state">
                <var-empty :description="$t('inboundBatches.noInProgressBatches')" />
              </div>
            </div>
          </var-tab>
        </var-tabs>
      </var-card>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePackageStore } from '@/stores/package';
  import { useOutboundStore } from '@/stores/outbound';
  import { useInboundBatchStore } from '@/stores/inbound';
  import { PackageStatus } from '@/types';

  const router = useRouter();
  const packageStore = usePackageStore();
  const outboundStore = useOutboundStore();
  const inboundBatchStore = useInboundBatchStore();

  // 导航到指定页面
  const navigateTo = (path: string) => {
    router.push(path);
  };

  // 数据统计
  const totalPackages = computed(() => packageStore.getAllPackages.length);
  const inStockPackages = computed(() =>
    packageStore.getAllPackages.filter(pkg => pkg.status === PackageStatus.IN_STOCK).length
  );
  const pendingPackages = computed(() =>
    packageStore.getAllPackages.filter(pkg => pkg.status === PackageStatus.PENDING).length
  );
  const totalBatches = computed(() => outboundStore.getAllBatches.length);

  // 入库批次统计
  const inProgressInboundBatches = computed(() =>
    inboundBatchStore.inProgressBatches
  );
  const pendingInboundBatches = computed(() =>
    inboundBatchStore.pendingBatches
  );

  // 激活的入库批次标签页
  const activeInboundTab = ref(0);

  // 获取入库进度百分比
  const getInboundProgress = (batch: any) => {
    return inboundBatchStore.getInboundProgress(batch);
  };

  // 获取进度条颜色
  const getProgressColor = (batch: any) => {
    const progress = getInboundProgress(batch);
    if (progress === 100) return '#4CAF50';
    if (progress >= 50) return '#2196F3';
    if (progress >= 25) return '#FFC107';
    return '#FF5252';
  };

  const getInStockPercentage = computed(() => {
    if (totalPackages.value === 0) return 0;
    return (inStockPackages.value / totalPackages.value) * 100;
  });

  const getPendingPercentage = computed(() => {
    if (totalPackages.value === 0) return 0;
    return (pendingPackages.value / totalPackages.value) * 100;
  });

  // 页面加载时初始化数据
  onMounted(() => {
    inboundBatchStore.initData();
  });
</script>

<style scoped lang="css">
  .home-container {
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

  .function-modules {
    margin-bottom: 40px;
  }

  .module-card {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .module-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .module-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .module-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    transition: all 0.3s ease;
  }

  .camera-icon {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
  }

  .document-icon {
    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
    color: white;
  }

  .upload-icon {
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    color: white;
  }

  .list-icon {
    background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
    color: white;
  }

  .in-icon {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
    color: white;
  }

  .batch-icon {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
    color: white;
  }

  .module-icon:hover {
    transform: scale(1.1);
  }

  .module-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .module-desc {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
  }

  .stats-section {
    margin-bottom: 40px;
  }

  .stats-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
  }

  .stat-header .var-icon {
    color: #667eea;
    flex-shrink: 0;
  }

  .stat-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat-instock .stat-header .var-icon {
    color: #00b894;
  }

  .stat-pending .stat-header .var-icon {
    color: #fdcb6e;
  }

  .stat-batches .stat-header .var-icon {
    color: #6c5ce7;
  }

  .stat-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 80px;
  }

  .stat-number {
    font-size: 2.8rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 12px;
    line-height: 1;
  }

  .stat-instock .stat-number {
    color: #00b894;
  }

  .stat-pending .stat-number {
    color: #fdcb6e;
  }

  .stat-batches .stat-number {
    color: #6c5ce7;
  }

  .stat-progress {
    width: 100%;
  }

  .stat-footer {
    text-align: center;
    margin-top: 8px;
  }

  .stat-footer :deep(.var-chip) {
    font-size: 0.75rem;
    height: 20px;
    line-height: 20px;
  }

  .stat-total {
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  }

  .stat-total .stat-header .var-icon {
    color: #667eea;
  }

  .stat-total .stat-number {
    color: #667eea;
  }

  @media (max-width: 768px) {
    .home-container {
      padding: 12px;
    }

    .page-title {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }

    .function-modules {
      margin-bottom: 24px;
    }

    .stats-section {
      margin-bottom: 24px;
    }

    .stats-title {
      font-size: 1.3rem;
      margin-bottom: 16px;
    }

    .stat-card {
      padding: 16px;
      min-height: 140px;
    }

    .stat-header {
      margin-bottom: 10px;
    }

    .stat-header .var-icon {
      font-size: 24px !important;
    }

    .stat-label {
      font-size: 0.8rem;
    }

    .stat-number {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .stat-body {
      min-height: 70px;
    }

    .stat-footer :deep(.var-chip) {
      font-size: 0.7rem;
      height: 18px;
      line-height: 18px;
    }
  }

  /* 入库批次样式 */
  .inbound-batches-section {
    margin-bottom: 40px;
  }

  .inbound-tabs {
    margin-top: 20px;
  }

  .inbound-batch-list {
    margin-bottom: 20px;
  }

  .inbound-batch-item {
    margin-bottom: 12px;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .inbound-batch-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .cell-content {
    width: 100%;
  }

  .batch-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .batch-number {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }

  .status-tag {
    font-size: 12px;
  }

  .batch-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .batch-progress {
    width: 100%;
  }

  .progress-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }

  .progress-bar {
    width: 100%;
  }

  .progress-percentage {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    text-align: right;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    margin: 20px 0;
  }

  .tab-content {
    padding: 12px 0;
  }

  @media (max-width: 768px) {
    .inbound-batches-section {
      margin-bottom: 24px;
    }

    .inbound-tabs {
      margin-top: 16px;
    }

    .inbound-batch-item {
      margin-bottom: 8px;
    }

    .batch-number {
      font-size: 14px;
    }

    .status-tag {
      font-size: 10px;
    }

    .progress-text {
      font-size: 12px;
    }

    .progress-percentage {
      font-size: 12px;
    }

    .empty-state {
      min-height: 150px;
      margin: 16px 0;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 1.5rem;
    }

    .stats-title {
      font-size: 1.1rem;
    }

    .stat-card {
      padding: 12px;
      min-height: 120px;
    }

    .stat-header {
      gap: 6px;
      margin-bottom: 8px;
    }

    .stat-header .var-icon {
      font-size: 20px !important;
    }

    .stat-label {
      font-size: 0.75rem;
    }

    .stat-number {
      font-size: 1.6rem;
      margin-bottom: 8px;
    }

    .stat-body {
      min-height: 60px;
    }

    .stat-footer :deep(.var-chip) {
      font-size: 0.65rem;
      height: 16px;
      line-height: 16px;
    }

    .inbound-batch-item {
      margin-bottom: 6px;
    }

    .batch-number {
      font-size: 13px;
    }

    .progress-text {
      font-size: 11px;
    }

    .progress-percentage {
      font-size: 11px;
    }
  }
</style>
