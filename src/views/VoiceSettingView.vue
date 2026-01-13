<template>
  <div class="voice-setting-view">
    <var-card shadow="hover">
      <!-- 音量配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.volume') }}: {{ volume.toFixed(1) }}</h3>
        <var-slider
          v-model="volume"
          :min="0"
          :max="1"
          :step="0.1"
          @change="handleVolumeChange"
        ></var-slider>
      </div>

      <!-- 语调配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.pitch') }}: {{ pitch.toFixed(1) }}</h3>
        <var-slider
          v-model="pitch"
          :min="0.5"
          :max="2"
          :step="0.1"
          @change="handlePitchChange"
        ></var-slider>
      </div>

      <!-- 语速配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.rate') }}: {{ rate.toFixed(1) }}</h3>
        <var-slider
          v-model="rate"
          :min="0.5"
          :max="100"
          :step="0.1"
          @change="handleRateChange"
        ></var-slider>
      </div>

      <!-- 测试按钮 -->
      <div class="setting-item test-button">
        <var-button type="primary" @click="testVoice">
          {{ $t('voiceSetting.test') }}
        </var-button>
      </div>
    </var-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { Snackbar } from '@varlet/ui'
import { useTitleStore } from '@/stores/title'
const { t } = useI18n()

// 音量、语调、语速
const volume = ref(1.0)
const pitch = ref(1.0)
const rate = ref(20)
const titleStore = useTitleStore()
titleStore.setTitle('voiceSetting.title')
// 处理音量变化
const handleVolumeChange = (value: number | number[]) => {
  const numValue = Array.isArray(value) ? value[0] : value
  localStorage.setItem('ttsVolume', numValue.toString())
}

// 处理语调变化
const handlePitchChange = (value: number | number[]) => {
  const numValue = Array.isArray(value) ? value[0] : value
  localStorage.setItem('ttsPitch', numValue.toString())
}

// 处理语速变化
const handleRateChange = (value: number | number[]) => {
  const numValue = Array.isArray(value) ? value[0] : value
  localStorage.setItem('ttsRate', numValue.toString())
}

// 测试语音
const testVoice = async () => {
  try {
    await TextToSpeech.speak({
      text: t('voiceSetting.testText'),
      lang: 'zh-CN',
      rate: rate.value,
      pitch: pitch.value,
      volume: volume.value
    })
  } catch (error) {
    console.error('Failed to test voice:', error)
    Snackbar({
      type: 'error',
      content: t('voiceSetting.testFailed'),
      duration: 2000
    })
  }
}

// 初始化
onMounted(() => {
  // 从本地存储加载设置
  const savedVolume = localStorage.getItem('ttsVolume')
  if (savedVolume) {
    volume.value = parseFloat(savedVolume)
  }
  
  const savedPitch = localStorage.getItem('ttsPitch')
  if (savedPitch) {
    pitch.value = parseFloat(savedPitch)
  }
  
  const savedRate = localStorage.getItem('ttsRate')
  if (savedRate) {
    rate.value = parseFloat(savedRate)
  }
})
</script>

<style scoped>
.voice-setting-view {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 16px;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-item h3 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.test-button {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>