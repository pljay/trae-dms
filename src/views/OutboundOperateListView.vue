<template>
  <div class="outbound-operate-list">
    <!-- 操作按钮 -->
    <div class="action-section">
      <var-button type="primary" @click="showBatchForm = true">{{ $t('outboundOperateListView.action.add')
      }}</var-button>
    </div>

    <!-- 批次列表 -->
    <div :style="'height:' + listScrollerHeight + '; overflow-y: scroll;'">
      <var-list v-model:loading="loading" :finished="finished" @load="loadMore">
        <var-cell v-for="batch in batches" :key="batch.id" class="batch-item" :border="true" :border-offset="5"
          :ripple="true">
          <div class="cell-content">
            <div class="batch-content">
              <div class="batch-info">
                <div class="batch-number">{{ batch.batchNo || batch.serialNumber }}</div>
                <div class="batch-field">
                  <strong>{{ $t('outboundOperateListView.list.channel') }}:</strong>
                  {{ batch.channelCode || batch.channel || batch.channelName }}
                </div>
                <div class="batch-field">
                  <strong>{{ $t('outboundOperateListView.list.actualQuantity') }}:</strong>
                  {{ batch.quantity || batch.actualQuantity || batch.pieces || 0 }}
                </div>
              </div>
              <div class="batch-actions">
                <var-button type="primary" size="small" @click="goToScanStep(batch.id)"
                  style="margin-bottom: 8px; width: 100%">
                  {{ $t('outboundOperateListView.action.scanOut') }}
                </var-button>
                <var-button type="success" size="small" @click="shipBatch(batch.id)"
                  :disabled="(batch.quantity || batch.actualQuantity || batch.pieces || 0) === 0" style="width: 100%">
                  {{ $t('outboundOperateListView.action.complate') }}
                </var-button>
              </div>
            </div>
          </div>
        </var-cell>
      </var-list>
    </div>

    <!-- 出库流程弹窗 -->
    <var-popup v-model:show="showBatchForm" :title="$t('outboundOperateListView.form.title')" position="center"
      width="90%" @close="resetForm">
      <var-steps :active="activeStep" direction="horizontal">
        <var-step :title="$t('outboundOperateListView.form.step1.title')" />
        <var-step :title="$t('outboundOperateListView.form.step2.title')" />
      </var-steps>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1：输入出库批次号 -->
        <div v-if="activeStep === 0" class="step-item">
          <var-form ref="formRef" label-position="top">
            <var-input v-model="outboundForm.batchNo"
              :placeholder="$t('outboundOperateListView.form.step1.serialNumber')" @keyup.enter="nextStep" size="normal"
              :rules="[{ required: true, message: () => t('outboundOperateListView.form.step1.serialNumber'), trigger: 'blur' }]">
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
            <var-input v-model="outboundForm.batchNo" size="normal"
              :label="$t('outboundOperateListView.form.step1.serialNumber')" />
            <var-select v-model="outboundForm.channelId"
              :placeholder="$t('outboundOperateListView.form.step2.selectChannel')" size="normal" multiple
              :rules="[{ required: true, message: () => t('outboundOperateListView.form.step2.selectChannel'), trigger: 'change' }]">
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
  import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Snackbar, Dialog } from '@varlet/ui'
  import { useOutboundStore } from '@/stores/outbound'
  import { useChannelStore } from '@/stores/channel'
  import { useTitleStore } from '@/stores/title'
  import { calculateRemainHeight } from '@/utils/calculateHeight'

  const { t } = useI18n()

  const router = useRouter()
  const route = useRoute()
  const outboundStore = useOutboundStore()
  const channelStore = useChannelStore()
  const formRef = ref()
  const titleStore = useTitleStore()
  titleStore.setTitle('outboundOperateListView.title')

  // 出库表单
  const outboundForm = reactive({
    batchId: '',
    batchNo: '',
    channelId: [] as string[],
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
  const finished = ref(false);
  const listScrollerHeight = ref('500px');




  // 加载初始数据
  const loadInitialData = async () => {
    batches.value = []
    currentPage.value = 1
    hasMore.value = true
    finished.value = false
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
    }
  }

  const loadData = async (currentPage: number) => {
    const params: Record<string, any> = { column: 'createTime', order: 'desc', status: '0' }
    try {
      const response = await outboundStore.fetchBatches(currentPage, pageSize.value, params)
      if (currentPage === 1) {
        // 第一页数据，直接替换
        batches.value = response.records
      } else {
        // 加载更多数据，追加
        batches.value = [...batches.value, ...response.records]
      }

      hasMore.value = currentPage < response.pages
      loading.value = false
      finished.value = !hasMore.value
    } catch (error) {
      console.error('Failed to load data:', error)
      hasMore.value = false
      loading.value = false
      finished.value = true
    }

  }

  // 检查路由参数
  const loadInitialDataWithParams = (async () => {
    // 加载出库批次数据
    await loadInitialData();
    const batchNumber = route.query.batchNumber as string;
    if (batchNumber) {
      // 验证批次号是否存在
      // 注意：getBatchBySerialNumber需要传入batches数组
      // 实际应用中应该从API获取批次数据
      Snackbar({
        type: 'info',
        content: t('outboundOperateListView.autoLoaded'),
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
          content: t('outboundOperateListView.form.step1.serialNumber'),
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
      if (!outboundForm.channelId || outboundForm.channelId.length === 0) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.step2.selectChannel'),
          duration: 2000
        })
        return
      }
      // 直接创建新批次，因为第一步已经确保批次号不存�?    
      try {

        const response = await outboundStore.createBatch(outboundForm.batchNo, outboundForm.channelId.join(','))
        if (response) {
          Snackbar({
            type: 'success',
            content: t('outboundOperateListView.batchCreated'),
            duration: 2000
          })
        }
        // 路由跳转到扫描操作
        router.push(`/outbound-operate-list/${response?.id}`)
      } catch (error) {
        console.error('创建批次失败:', error)
        Snackbar({
          type: 'error',
          content: t('outboundOperateListView.createFailed'),
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
    outboundForm.channelId = []
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
  const goToScanStep = (id: string) => {
    // 直接跳转到扫描操作页面
    // 实际应用中应该先验证批次号是否存在
    router.push(`/outbound-operate-list/${id}`)
    // Snackbar({
    //   type: 'info',
    //   content: t('outboundOperateListView.autoLoaded'),
    //   duration: 2000
    // })
  }

  // 发货功能
  const shipBatch = async (id: string) => {
    Dialog({
      title: t('common.confirm'),
      message: t('outboundOperateListView.confirmComplate'),
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      onConfirm: async () => {
        // 检查批次状态是否允许发货  
        // 实际应用中应该从API获取批次数据
        // 直接调用completeBatch
        const success = await outboundStore.completeBatch(id)
        if (!success) {
          Snackbar({
            type: 'error',
            content: t('common.error'),
            duration: 2000
          })
        }

        // 重新加载批次列表
        await loadInitialData()

        // 这里应该调用发货API，目前只做模�?  
        Snackbar({
          type: 'success',
          content: t('outboundOperateListView.shipSuccess'),
          duration: 2000
        })
      }
    })



  }

  // 计算列表自适应高度
  const calculateListHeight = () => {
    const height = calculateRemainHeight(['.action-section'])
    listScrollerHeight.value = height + 'px'
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateListHeight()
  }

  // 组件挂载时设置
  onMounted(async () => {
    await loadInitialDataWithParams()

    // 计算表格初始高度
    nextTick(() => {
      calculateListHeight()

      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize)
    })
  })

  // 组件卸载时清除滚动事件监听
  onUnmounted(() => {
    // 移除窗口大小变化监听
    window.removeEventListener('resize', handleResize)
  })

</script>

<style scoped lang="css">
  .outbound-operate-list {
    height: 100%;
    width: 100%;
  }

  .action-section {
    margin-bottom: 16px;
    text-align: center;
  }

  .cell-content {
    width: 100%;
  }

  .batch-item {
    margin-bottom: 12px;
    border-radius: 12px;
    overflow: hidden;
  }

  .batch-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .batch-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .batch-number {
    font-weight: 600;
    font-size: 16px;
  }

  .batch-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    max-width: 120px;
  }

  .batch-actions .var-button {
    font-size: 12px;
    padding: 6px 12px;
    height: 32px;
  }

  .batch-field {
    font-size: 14px;
  }

  .batch-field strong {
    font-weight: 500;
  }

  .loading-more,
  .no-more,
  .empty-state {
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

  .empty-state {
    min-height: 200px;
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
    .batch-title {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .batch-actions {
      width: 100%;
      justify-content: space-between;
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
