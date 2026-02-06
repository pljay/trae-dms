<template>
  <div class="view-content scan-view">
    <!-- 返回按钮 -->
    <div class="back-section">
      <var-button @click="handleBack" type="primary">{{ $t('common.back') }}</var-button>
    </div>
    
    <!-- 扫描区域（微信风格） -->
    <div class="scan-area">
      <!-- Web平台摄像头预览 -->
      <div v-if="!isNativePlatform" class="web-camera-preview">
        <video ref="videoRef" class="scanner-video" autoplay playsinline></video>
        <!-- 扫描线 -->
        <div class="scan-line"></div>
      </div>
      
      <!-- 原生平台扫描框 -->
      <div v-else class="scan-frame">
        <!-- 扫描线 -->
        <div class="scan-line"></div>
        <!-- 四角边框 -->
        <div class="scan-corner top-left"></div>
        <div class="scan-corner top-right"></div>
        <div class="scan-corner bottom-left"></div>
        <div class="scan-corner bottom-right"></div>
      </div>
      
      <!-- 扫描提示文字 -->
      <div class="scan-hint">{{ $t('scan.pointCamera') }}</div>
      
      <!-- 辅助功能提示 -->
      <div class="scan-help">{{ $t('scan.help') }}</div>
      
      <!-- 手电筒控制 -->
      <div class="torch-control" @click="toggleTorch" v-if="isNativePlatform">
        <div class="torch-icon">{{ isTorchEnabled ? 'flash_on' : 'flash_off' }}</div>
        <div class="torch-text">{{ isTorchEnabled ? $t('scan.lightOff') : $t('scan.lightOn') }}</div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <!-- <div class="scan-footer">
      <div class="footer-item" @click="handleAlbum">
        <div class="footer-icon">image</div>
        <div class="footer-text">{{ $t('scan.album') }}</div>
      </div>
      <div class="footer-item" @click="handleManualInput">
        <div class="footer-icon">edit</div>
        <div class="footer-text">{{ $t('scan.manualInput') }}</div>
      </div>
    </div> -->
    
    <!-- 手动输入弹窗 -->
    <!-- <var-dialog v-model:show="showManualInput" :title="$t('scan.manualInput')" width="80%">
      <var-input
        v-model="manualInput"
        :placeholder="$t('scan.enterCode')"
        @keyup.enter="handleManualInputSubmit"
        autofocus
      ></var-input>
      <template #actions>
        <var-button text @click="showManualInput = false">{{ $t('common.cancel') }}</var-button>
        <var-button type="primary" @click="handleManualInputSubmit">{{ $t('common.confirm') }}</var-button>
      </template>
    </var-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useTitleStore } from '@/stores/title'
import { Capacitor } from '@capacitor/core'
import { useScan } from '@/composables/useScan'

const titleStore = useTitleStore()
titleStore.setTitle('scan.title')

// 暴露Capacitor到模板
defineExpose({
  Capacitor
})

// 使用扫描组合式函数
const {
  // 状态
  isTorchEnabled,
  isNativePlatform,
  videoRef,
  
  // 方法
  startScan,
  stopScan,
  toggleTorch,
  handleBack
} = useScan()

// 组件挂载时启动扫描
onMounted(async () => {
  document.body.classList.add('barcode-scanner-active')
  await startScan()
})

// 组件卸载前停止扫描
onBeforeUnmount(async () => {
  await stopScan()
  document.body.classList.remove('barcode-scanner-active')
})
</script>

<style scoped lang="css">
.scan-view {
  width: 100%;
  /* background-color: black; */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  min-height: calc(100vh - var(--app-bar-height) - var(--bottom-navigation-height));
  position: relative;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.back-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.back-icon {
  font-size: 24px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 扫描区域 */
.scan-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 18vh
}

/* Web平台摄像头预览 */
.web-camera-preview {
  position: relative;
  width: min(80vw, 80vh, 320px);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1) contrast(1.1);
}

/* 扫描框 - 微信风格 */
.scan-frame {
  position: relative;
  width: min(80vw, 80vh, 320px);
  aspect-ratio: 1;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* 扫描线 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #07c160, transparent);
  animation: scanLine 1s infinite linear;
  box-shadow: 0 0 10px 2px #07c160;
  z-index: 2;
  border-radius: 1.5px;
}

@keyframes scanLine {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

/* 四角边框 - 微信风格 */
.scan-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid #07c160;
  z-index: 3;
  box-shadow: 0 0 8px rgba(7, 193, 96, 0.8);
}

.scan-corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.scan-corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.scan-corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.scan-corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

/* 扫描提示文字 */
.scan-hint {
  color: white;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

/* 辅助功能提示 */
.scan-help {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* 底部操作栏 */
.scan-footer {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  z-index: 10;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  min-width: 80px;
}

.footer-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.footer-item:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.footer-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.footer-item:hover .footer-icon {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.footer-text {
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 4px;
}

/* 适配不同屏幕尺寸 */
@media (max-width: 480px) {
  .scan-frame {
    width: min(85vw, 85vh, 100%);
  }
  
  .footer-item {
    min-width: 70px;
    padding: 12px 8px;
  }
  
  .footer-icon {
    font-size: 28px;
    width: 40px;
    height: 40px;
  }
  
  .footer-text {
    font-size: 13px;
  }
}

/* 横屏模式适配 */
@media (orientation: landscape) {
  .scan-area {
    flex-direction: row;
    gap: 20px;
  }
  
  .scan-frame {
    width: min(70vw, 70vh, 300px);
  }
  
  .scan-footer {
    padding: 15px 0;
    padding-bottom: env(safe-area-inset-bottom, 15px);
  }
  
  .footer-item {
    min-width: 75px;
    padding: 12px;
  }
  
  .footer-icon {
    font-size: 26px;
    width: 40px;
    height: 40px;
  }
  
  .footer-text {
    font-size: 12px;
  }
}

/* 大屏幕适配 */
@media (min-width: 768px) {
  .scan-frame {
    width: min(60vw, 60vh, 400px);
  }
  
  .scan-hint {
    font-size: 18px;
  }
  
  .scan-help {
    font-size: 16px;
  }
  
  .footer-item {
    min-width: 100px;
    padding: 18px;
  }
  
  .footer-icon {
    font-size: 36px;
    width: 56px;
    height: 56px;
  }
  
  .footer-text {
    font-size: 16px;
  }
}


</style>