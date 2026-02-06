<template>
  <div class="view-content">
    <!-- 操作按钮 -->
    <div class="action-section">
      <var-button type="primary" @click="showBatchForm = true">{{ $t('outboundRecords.addBatch') }}</var-button>
    </div>

    <!-- 使用原生滚动事件实现滚动加载 -->
    <div ref="scrollContainer" style="height: 80vh; overflow-y: auto; border: 1px solid #eee; padding: 10px;">
      <div class="batch-grid">
        <var-card v-for="batch in batches" :key="batch.id" shadow="hover" class="mobile-batch-card">
          <div class="mobile-batch-item">
            <div class="mobile-batch-info">
              <div class="mobile-batch-title">
                <strong>{{ $t('outboundRecords.table.serialNumber') }}:</strong>
                {{ batch.batchNo || batch.serialNumber }}
              </div>
              <div class="mobile-batch-details">
                <div class="mobile-batch-field">
                  <strong>{{ $t('outboundRecords.table.channel') }}:</strong>
                  {{ batch.channelCode || batch.channel || batch.channelName }}
                </div>
                <div class="mobile-batch-field">
                  <strong>{{ $t('outboundRecords.table.actualQuantity') }}:</strong>
                  {{ batch.quantity || batch.actualQuantity || 0 }}
                </div>
              </div>
            </div>
            <div class="mobile-batch-actions">
              <var-button type="primary" size="small" @click="goToScanStep(batch.id)"
                style="width: 100%">
                {{ $t('outboundRecords.actions.scanOut') }}
              </var-button>
              <var-button type="success" size="small" @click="shipBatch(batch.id)"
                :disabled="(batch.quantity || batch.actualQuantity || 0) === 0" style="width: 100%">
                {{ $t('outboundRecords.actions.ship') }}
              </var-button>
            </div>
          </div>
        </var-card>
      </div>
      
      <!-- 加载更多指示器 -->
      <div v-if="loading" class="loading-more">
        <var-loading type="circle"></var-loading>
        <span>{{ $t('common.loading') }}</span>
      </div>
      
      <!-- 没有更多数据 -->
      <div v-else-if="!hasMore && batches.length > 0" class="no-more">
        <span>{{ $t('common.noMoreData') }}</span>
      </div>
    </div>


    <!-- 出库流程弹窗 -->
    <var-popup v-model:show="showBatchForm" :title="$t('outboundRecords.addBatch')" position="center" width="90%"
      @close="resetForm">
      <var-steps :active="activeStep" direction="horizontal">
        <var-step :title="$t('scanOut.step1.title')" />
        <var-step :title="$t('scanOut.step2.title')" />
      </var-steps>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1：输入出库批次号 -->
        <div v-if="activeStep === 0" class="step-item">
          <var-form ref="formRef" label-position="top">
            <var-input v-model="outboundForm.batchNo" :placeholder="$t('scanOut.step1.serialNumber')"
              @keyup.enter="nextStep" size="normal"
              :rules="[{ required: true, message: () => t('scanOut.step1.serialNumber'), trigger: 'blur' }]">
            </var-input>
            <div class="step-buttons">
              <var-button type="primary" @click="nextStep" :disabled="!outboundForm.batchNo">{{ $t('common.next')
              }}</var-button>
            </div>
          </var-form>
        </div>

        <!-- 步骤2：选择出货渠道 -->
        <div v-if="activeStep === 1" class="step-item">
          <var-form ref="formRef" label-position="top">
            <var-input v-model="outboundForm.batchNo"  size="normal"
              :label="$t('scanOut.step1.serialNumber')" />
            <var-select v-model="outboundForm.channelId" :placeholder="$t('scanOut.step2.selectChannel')" size="normal"
              :rules="[{ required: true, message: () => t('scanOut.step2.selectChannel'), trigger: 'change' }]">
              <var-option v-for="channel in channelStore.channels" :key="channel.id"
                :label="channel.code || channel.name" :value="channel.id" />
            </var-select>
            <div class="step-buttons">
              <var-button @click="prevStep">{{ $t('common.back') }}</var-button>
              <var-button type="primary" @click="nextStep" :disabled="!outboundForm.channelId">{{ $t('common.confirm')
              }}</var-button>
            </div>
          </var-form>

        </div>
      </div>
    </var-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted,onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Snackbar } from '@varlet/ui'
  import { useOutboundStore } from '@/stores/outbound'
  import { useChannelStore } from '@/stores/channel'
  import { useTitleStore } from '@/stores/title'

  const { t } = useI18n()

  const router = useRouter()
  const route = useRoute()
  const outboundStore = useOutboundStore()
  const channelStore = useChannelStore()
  const formRef = ref()
  const titleStore = useTitleStore()
  titleStore.setTitle('scanOut.title')

  // 出库表单
  const outboundForm = reactive({
    batchId: '',
    batchNo: '',
    channelId: '',
  })


  // 步骤控制
  const activeStep = ref(0)

  // 控制新增批次弹窗显示
  const showBatchForm = ref(false)

  // 获取出库中记录
  const batches = ref<any[]>([]);
  const loading = ref(false);
  // 分页加载相关
  const currentPage = ref(1);
  const pageSize = ref(20);
  const hasMore = ref(true);

  const scrollContainer = ref<HTMLElement | null>(null);


  // 滚动事件处理
  const handleScroll = () => {
    if (!scrollContainer.value) return;
    
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;
    const scrollBottom = scrollTop + clientHeight;
    const threshold = 100; // 距离底部100px时触发
    
    console.log('Scroll bottom:', scrollBottom, 'Scroll height:', scrollHeight, 'Threshold:', scrollHeight - threshold);
    
    if (scrollBottom >= scrollHeight - threshold && !loading.value && hasMore.value) {
      console.log('Triggering loadMore');
      loadMore();
    }
  }

  // 加载出库批次数据
  const loadBatches = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      currentPage.value = 1;
      hasMore.value = true;
      batches.value = [];
    }
    if (!hasMore.value && !isRefresh) return;
    
    loading.value = true;
    try {
      const response = await outboundStore.fetchBatches(currentPage.value, pageSize.value,{column:"createTime",order:"desc"});
      if (currentPage.value === 1) {
        // 第一页数据，直接替换
        batches.value = response.records;
      } else {
        // 加载更多数据，追加
        batches.value = [...batches.value, ...response.records];
      }
      hasMore.value = response.current < response.pages;
    } catch (error) {
      console.error('Failed to load outbound batches:', error);
      Snackbar({
        type: 'error',
        content: t('api.error.serverError'),
        duration: 2000
      });
      // 加载失败时回滚页码
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    } finally {
      loading.value = false;
    }
  };

  // 加载更多数据
  const loadMore = async () => {
    console.log('loadMore triggered, hasMore:', hasMore.value, 'loading:', loading.value);
    if (loading.value || !hasMore.value) return;
    currentPage.value++;
    await loadBatches();
  };

  // 检查路由参数
  const loadInitialData = (async () => {
    // 确保渠道数据已加载
    if (channelStore.channels.length === 0) {
      await channelStore.loadChannels();
    }
    // 加载出库批次数据
    await loadBatches(true);
    const batchNumber = route.query.batchNumber as string;
    if (batchNumber) {
      // 验证批次号是否存在
      // 注意：getBatchBySerialNumber需要传入batches数组
      // 实际应用中应该从API获取批次数据
      Snackbar({
        type: 'info',
        content: t('scanOut.batchAutoLoaded'),
        duration: 2000
      });
    }
  });

  // 下一步
  const nextStep = async () => {
    if (activeStep.value === 0) {
      if (!outboundForm.batchNo) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.step1.serialNumber'),
          duration: 2000
        })
        return
      }
      // 检查批次号是否已存�?    
      // 注意：getBatchBySerialNumber需要传入batches数组
      // 实际应用中应该从API获取批次数据
      // const existingBatch = false
      // if (existingBatch) {
      //   Snackbar({
      //     type: 'warning',
      //     content: t('scanOut.batchExists'),
      //     duration: 2000
      //   })
      //   return
      // }
      // 跳转到第二步
      activeStep.value++
    } else if (activeStep.value === 1) {
      if (!outboundForm.channelId) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.step2.selectChannel'),
          duration: 2000
        })
        return
      }
      // 直接创建新批次，因为第一步已经确保批次号不存�?    
      try {
       const response = await outboundStore.createBatch(outboundForm.batchNo, outboundForm.channelId)
        Snackbar({
          type: 'success',
          content: t('scanOut.batchCreated'),
          duration: 2000
        })
         // 路由跳转到扫描操作视�?    
        router.push({ path: '/scan-operation', query: { batchId: response?.id } })
      } catch (error) {
        console.error('创建批次失败:', error)
        Snackbar({
          type: 'error',
          content: t('scanOut.createFailed'),
          duration: 2000
        })
        return
      }
     
      // // 隐藏批次表单弹窗
      // showBatchForm.value = false
      // // 重新加载批次列表
      // await loadBatches(true)
      // Snackbar({
      //   type: 'info',
      //   content: t('scanOut.batchAutoLoaded'),
      //   duration: 2000
      // })
    }
  }

  // 上一步
  const prevStep = () => {
    if (activeStep.value > 0) {
      activeStep.value--
    }
  }

  // 重置表单
  const resetForm = () => {
    // 重置表单数据
    outboundForm.batchNo = ''
    outboundForm.channelId = ''
    // 重置步骤
    activeStep.value = 0
    // 重置表单验证
    if (formRef.value && typeof formRef.value.resetFields === 'function') {
      try {
        formRef.value.resetFields()
      } catch (error) {
        console.error('Failed to reset form:', error)
      }
    }
  }

  // 跳转到扫描操作页面
  const goToScanStep = (batchId: string) => {
    // 直接跳转到扫描操作页面
    // 实际应用中应该先验证批次号是否存在
    router.push({ path: '/scan-operation', query: { batchId: batchId } })
    Snackbar({
      type: 'info',
      content: t('scanOut.batchAutoLoaded'),
      duration: 2000
    })
  }

  // 发货功能
  const shipBatch = async (batchId: string) => {
    // 检查批次状态是否允许发货  
    // 实际应用中应该从API获取批次数据
    // 直接调用completeBatch
    const success = await outboundStore.completeBatch(batchId)
    if (!success) {
      Snackbar({
        type: 'error',
        content: t('common.error'),
        duration: 2000
      })
      return
    }

    // 重新加载批次列表
    await loadBatches(true)

    // 这里应该调用发货API，目前只做模�?  
    Snackbar({
      type: 'success',
      content: t('outboundRecords.shipSuccess'),
      duration: 2000
    })
  }

  // 组件挂载时设置
  onMounted(async () => {
    await loadInitialData()
    
    // 添加滚动事件监听
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
      console.log('Scroll event listener added');
    }
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', handleScroll);
      console.log('Scroll event listener removed');
    }
  })

</script>

<style scoped lang="css">

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 30px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .action-section {
    margin-bottom: 30px;
    text-align: center;
  }

  /* :deep(.var-button) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  padding: 12px 24px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
} */

  /* :deep(.var-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
} */

  .batch-list-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 20px;
    text-align: center;
  }

  .mobile-batch-list {
    overflow-y: auto;
    max-height: calc(90dvh - var(--app-bar-height) - var(--bottom-navigation-height));
    padding: 0 8px 16px;
  }

  .loading-more,
  .no-more {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 16px;
    color: var(--color-text-secondary);
    font-size: 14px;
    grid-column: 1 / -1;
  }

  .mobile-batch-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .mobile-batch-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .mobile-batch-item {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .mobile-batch-info {
    flex: 1;
  }

  .mobile-batch-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 10px;
  }

  .mobile-batch-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mobile-batch-field {
    font-size: 0.9rem;
    color: var(--color-text);
  }

  .mobile-batch-field strong {
    color: var(--color-text);
    font-weight: 500;
  }


  .mobile-batch-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  :deep(.var-popup) {
    border-radius: 16px;
    overflow: hidden;
  }

  :deep(.var-popup__title) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.2rem;
  }

  .step-content {
    padding: 20px;
  }

  .step-item {
    margin-bottom: 20px;
  }

  .step-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  :deep(.var-steps) {
    margin-bottom: 20px;
  }

  :deep(.var-step) {
    flex: 1;
  }

  :deep(.var-step__title) {
    font-size: 0.9rem;
    font-weight: 500;
  }

  :deep(.var-step--active) {
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .mobile-batch-list {
      grid-template-columns: 1fr;
    }

    .step-buttons {
      flex-direction: column;
      justify-content: center;
    }

    .step-buttons .var-button {
      width: 100%;
    }
  }
</style>
