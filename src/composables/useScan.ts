import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { usePackageStore } from '@/stores/package'
import { useOutboundStore } from '@/stores/outbound'
import voiceNotification from '@/utils/voiceNotification'

export function useScan() {
  const { t } = useI18n()
  const packageStore = usePackageStore()
  const outboundStore = useOutboundStore()
  const scanCount = ref(0)

  // 处理扫描结果的通用方法
  const handleScan = async (code: string, batchNumber: string): Promise<boolean> => {
    console.log('扫描到条码:', code)
    
    // 调用出库方法
    const success = await packageStore.scanOut(code, batchNumber)
    if (success) {
      // 更新批次数量
      await outboundStore.updateBatchQuantity(batchNumber)
      scanCount.value++
      Snackbar({
        type: 'success',
        content: t('scanIn.scanSuccess'), 
        duration: 2000
      })
      // 播放扫描成功语音
      voiceNotification.speakScanSuccess()
      return true
    } else {
      Snackbar({
        type: 'error',
        content: t('common.error'),
        duration: 2000
      })
      // 播放扫描失败语音
      voiceNotification.speakScanFailed()
      return false
    }
  }

  // 处理扫描错误的通用方法
  const handleError = (message: string): void => {
    Snackbar({
      type: 'error',
      content: message,
      duration: 2000
    })
    // 播放错误语音
    voiceNotification.speakError()
  }

  // 重置扫描计数
  const resetScanCount = (): void => {
    scanCount.value = 0
  }

  // 完成出库/入库操作的通用方法
  const completeOperation = async (batchNumber: string): Promise<boolean> => {
    if (scanCount.value === 0) {
      Snackbar({
        type: 'warning',
        content: t('scanOut.step3.noScanned'),
        duration: 2000
      })
      return false
    }
    
    // 完成批次
    const success = await outboundStore.completeBatch(batchNumber)
    if (success) {
      Snackbar({
        type: 'success',
        content: t('common.success'),
        duration: 2000
      })
      // 播放成功语音
      voiceNotification.speakSuccess()
    } else {
      Snackbar({
        type: 'error',
        content: t('common.error'),
        duration: 2000
      })
      // 播放错误语音
      voiceNotification.speakError()
    }
    return success
  }

  return {
    scanCount,
    handleScan,
    handleError,
    resetScanCount,
    completeOperation
  }
}
