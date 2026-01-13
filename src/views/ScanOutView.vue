<template>
  <div>
    <!-- 操作按钮 -->
    <div class="action-section">
      <var-button type="primary" @click="showBatchForm = true">{{ $t('outboundRecords.addBatch') }}</var-button>
    </div>

    <!-- 出库中记录列�?-->
    <div class="batch-list-section" v-if="inProgressBatches.length > 0">
      <var-card shadow="hover">
        <!-- 移动端卡片布局 -->
        <div class="mobile-batch-list">
          <var-card v-for="batch in inProgressBatches" :key="batch.serialNumber" shadow="hover"
            class="mobile-batch-card">
            <div class="mobile-batch-item">
              <div class="mobile-batch-info">
                <div class="mobile-batch-title">
                  <strong>{{ $t('outboundRecords.table.serialNumber') }}:</strong>
                  {{ batch.serialNumber }}
                </div>
                <div class="mobile-batch-details">
                  <div class="mobile-batch-field">
                    <strong>{{ $t('outboundRecords.table.channel') }}:</strong>
                    {{ batch.channel }}
                  </div>
                  <div class="mobile-batch-field">
                    <strong>{{ $t('outboundRecords.table.actualQuantity') }}:</strong>
                    {{ batch.quantity }}
                  </div>
                </div>
              </div>
              <div class="mobile-batch-actions">
                <var-button type="primary" size="small" @click="goToScanStep(batch.serialNumber)" style="width: 100%">
                  {{ $t('outboundRecords.actions.scanOut') }}
                </var-button>
                <var-button type="success" size="small" @click="shipBatch(batch.serialNumber)"
                  :disabled="batch.quantity === 0" style="width: 100%">
                  {{ $t('outboundRecords.actions.ship') }}
                </var-button>
              </div>
            </div>
          </var-card>
        </div>
      </var-card>
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
            <var-input v-model="outboundForm.batchNumber" :placeholder="$t('scanOut.step1.serialNumber')"
              @keyup.enter="nextStep" size="normal"
              :rules="[{ required: true, message: () => t('scanOut.step1.serialNumber'), trigger: 'blur' }]">
            </var-input>
            <div class="step-buttons">
              <var-button type="primary" @click="nextStep" :disabled="!outboundForm.batchNumber">{{ $t('common.next')
                }}</var-button>
            </div>
          </var-form>
        </div>

        <!-- 步骤2：选择出货渠道 -->
        <div v-if="activeStep === 1" class="step-item">
          <var-form ref="formRef" label-position="top">
            <var-input v-model="outboundForm.batchNumber" disabled size="normal"
              :label="$t('scanOut.step1.serialNumber')" />
            <var-select v-model="outboundForm.channel" :placeholder="$t('scanOut.step2.selectChannel')" size="normal"
              :rules="[{ required: true, message: () => t('scanOut.step2.selectChannel'), trigger: 'change' }]">
              <var-option label="DHL" value="DHL" />
              <var-option label="UPS" value="UPS" />
              <var-option label="FedEx" value="FedEx" />
              <var-option label="EMS" value="EMS" />
            </var-select>
            <div class="step-buttons">
              <var-button @click="prevStep">{{ $t('common.back') }}</var-button>
              <var-button type="primary" @click="nextStep" :disabled="!outboundForm.channel">{{ $t('common.confirm')
                }}</var-button>
            </div>
          </var-form>

        </div>
      </div>
    </var-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Snackbar } from '@varlet/ui'
  import { useOutboundStore } from '@/stores/outbound'
  import { useTitleStore } from '@/stores/title'

  const { t } = useI18n()

  const router = useRouter()
  const route = useRoute()
  const outboundStore = useOutboundStore()
  const formRef = ref()
  const titleStore = useTitleStore()
  titleStore.setTitle('scanOut.title')

  // 出库表单
  const outboundForm = reactive({
    batchNumber: '',
    channel: '',
  })


  // 步骤控制
  const activeStep = ref(0)

  // 控制新增批次弹窗显示
  const showBatchForm = ref(false)

  // 响应式设计变量
  // const isMobile = ref(false);

  // 初始化响应式状态
  // const checkIsMobile = () => {
  //   isMobile.value = window.innerWidth < 768;
  // };

  // 获取出库中记录
  const inProgressBatches = computed(() => outboundStore.inProgressBatches);

  // 检查路由参数
  onMounted(async () => {
    // 初始化outboundStore数据
    await outboundStore.initData();

    const batchNumber = route.query.batchNumber as string;
    if (batchNumber) {
      // 验证批次号是否存在
      const batch = outboundStore.getBatchBySerialNumber(batchNumber);
      if (batch) {
        outboundForm.batchNumber = batchNumber;
        outboundForm.channel = batch.channel;
        activeStep.value = 2; // 直接跳转到扫描步骤
        Snackbar({
          type: 'info',
          content: t('scanOut.batchAutoLoaded'),
          duration: 2000
        });
      } else {
        Snackbar({
          type: 'error',
          content: t('scanOut.batchNotFound'),
          duration: 2000
        });
      }
    }
  })

  // 下一步
  const nextStep = async () => {
    if (activeStep.value === 0) {
      if (!outboundForm.batchNumber) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.step1.serialNumber'),
          duration: 2000
        })
        return
      }
      // 检查批次号是否已存�?    
      const existingBatch = outboundStore.getBatchBySerialNumber(outboundForm.batchNumber)
      if (existingBatch) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.batchExists'),
          duration: 2000
        })
        return
      }
      // 跳转到第二步
      activeStep.value++
    } else if (activeStep.value === 1) {
      if (!outboundForm.channel) {
        Snackbar({
          type: 'warning',
          content: t('scanOut.step2.selectChannel'),
          duration: 2000
        })
        return
      }
      // 直接创建新批次，因为第一步已经确保批次号不存�?    
      try {
        await outboundStore.createBatch(outboundForm.channel, outboundForm.batchNumber)
        Snackbar({
          type: 'success',
          content: t('scanOut.batchCreated'),
          duration: 2000
        })
      } catch (error) {
        console.error('创建批次失败:', error)
        Snackbar({
          type: 'error',
          content: t('scanOut.createFailed'),
          duration: 2000
        })
        return
      }
      // 路由跳转到扫描操作视�?    
      router.push({ path: '/scan-operation', query: { batchNumber: outboundForm.batchNumber } })
      // 隐藏批次表单弹窗
      showBatchForm.value = false
      Snackbar({
        type: 'info',
        content: t('scanOut.batchAutoLoaded'),
        duration: 2000
      })
    }
  }

  // 上一步
  const prevStep = () => {
    if (activeStep.value > 0) {
      activeStep.value--
    }
  }

  // 创建新批�?
  // const createNewBatch = () => {
  //   // 生成默认批次�?  
  //   const defaultBatchNumber = 'OB' + new Date().getTime().toString()
  //   // 更新表单中的批次�?  
  //   outboundForm.batchNumber = defaultBatchNumber
  //   // 重置表单和步�?  
  //   outboundForm.channel = ''
  //   activeStep.value = 0
  //   // 显示创建批次弹窗
  //   showBatchForm.value = true
  //   Snackbar({
  //     type: 'info',
  //     content: t('scanOut.selectChannelPrompt'),
  //     duration: 2000
  //   })
  // }

  // 重置表单
  const resetForm = () => {
    // 重置表单数据
    outboundForm.batchNumber = ''
    outboundForm.channel = ''
    // 重置步骤
    activeStep.value = 0
    // 重置表单验证
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // 跳转到扫描步�?
  const goToScanStep = (serialNumber: string) => {
    // 验证批次号是否存�?  
    const batch = outboundStore.getBatchBySerialNumber(serialNumber)
    if (batch) {
      // 路由跳转到扫描操作视�?  
      router.push({ path: '/scan-operation', query: { batchNumber: serialNumber } })
      Snackbar({
        type: 'info',
        content: t('scanOut.batchAutoLoaded'),
        duration: 2000
      })
    } else {
      Snackbar({
        type: 'error',
        content: t('scanOut.batchNotFound'),
        duration: 2000
      })
    }
  }

  // 发货功能
  const shipBatch = async (serialNumber: string) => {
    // 检查批次状�?  
    const batch = outboundStore.getBatchBySerialNumber(serialNumber)
    if (!batch) {
      Snackbar({
        type: 'error',
        content: t('scanOut.batchNotFound'),
        duration: 2000
      })
      return
    }

    // 如果批次未完成，先完成批�? 
    if (batch.status !== 'completed') {
      const success = await outboundStore.completeBatch(serialNumber)
      if (!success) {
        Snackbar({
          type: 'error',
          content: t('common.error'),
          duration: 2000
        })
        return
      }
    }

    // 这里应该调用发货API，目前只做模�?  
    Snackbar({
      type: 'success',
      content: t('outboundRecords.shipSuccess'),
      duration: 2000
    })
  }

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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
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

    .scan-out-container {
      padding: 15px;
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
