<template>
  <div class="view-content">
    <var-card shadow="hover">
      <!-- 音量配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.volume') }}: {{ volume.toFixed(1) }}</h3>
        <var-slider v-model="volume" :min="0" :max="1" :step="0.1" @change="handleVolumeChange"></var-slider>
      </div>

      <!-- 语调配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.pitch') }}: {{ pitch.toFixed(1) }}</h3>
        <var-slider v-model="pitch" :min="0.5" :max="2" :step="0.1" @change="handlePitchChange"></var-slider>
      </div>

      <!-- 语速配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.rate') }}: {{ rate.toFixed(1) }}</h3>
        <var-slider v-model="rate" :min="0.5" :max="20" :step="0.1" @change="handleRateChange"></var-slider>
      </div>

      <!-- 音色配置 -->
      <div class="setting-item">
        <h3>{{ $t('voiceSetting.voice') }}: {{ voice }}</h3>
        <var-select v-model="voice" @change="handleVoiceChange">
          <var-option v-for="voice in filteredVoices" :key="voice.voiceUri" :value="voice.name">
            {{ voice.name }}
          </var-option>
        </var-select>
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
  import { ref, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TextToSpeech } from '@capacitor-community/text-to-speech'
  import { Snackbar } from '@varlet/ui'
  import { useTitleStore } from '@/stores/title'
  
  const { t, locale } = useI18n()

  // 音量、语调、语速、音色
  const volume = ref(1.0)
  const pitch = ref(1.0)
  const rate = ref(2.0)
  const voice = ref<string>('')
  const voiceIndex = ref(0)
  const allVoices = ref<any[]>([])
  const filteredVoices = ref<any[]>([])
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

  // 处理音色变化
  const handleVoiceChange = (value: string) => {
    voice.value = value
    // 获取选中音色的索引
    voiceIndex.value = allVoices.value.findIndex(v => v.name === voice.value)
    localStorage.setItem('ttsVoice', voiceIndex.value.toString())
    localStorage.setItem('ttsVoiceName', value)
  }

  // 测试语音
  const testVoice = async () => {
    try {
      const speakOptions: any = {
        text: t('voiceSetting.testText'),
        lang: 'zh-CN',
        rate: rate.value,
        pitch: pitch.value,
        volume: volume.value
      }

      // 如果选中了音色，添加到选项中
      if (voice.value) {
        speakOptions.voice = voiceIndex.value
      }
      console.log('Speak options:', speakOptions)
      await TextToSpeech.speak(speakOptions)
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
  onMounted(async () => {
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

    const savedVoice = localStorage.getItem('ttsVoice')
    // 加载可用音色列表
    try {
      const voices = await TextToSpeech.getSupportedVoices()
      allVoices.value = voices['voices']
      console.log('All voices:', voices)
      // 初始化音色选择器
      if (savedVoice) {
        voiceIndex.value = parseInt(savedVoice)
        voice.value = allVoices.value[voiceIndex.value].name
      }
      // 根据当前语言筛选当前语言音色
      // 注意：这里假设当前语言是 'zh-CN'，你可以根据实际情况修改
      console.log('Current locale:', locale.value);
      filteredVoices.value = allVoices.value.filter(voice => voice['lang'].startsWith(locale.value));
      console.log('Supported current locale TTS voices:', filteredVoices.value);

    } catch (error) {
      console.error('Failed to get supported voices:', error)
    }
  })
  // 监听当前语言变化
  watch(() => locale.value, (newLocale) => {
    // 当当前语言变化时，更新筛选的音色列表
    filteredVoices.value = allVoices.value.filter(voice => voice['lang'].startsWith(newLocale))
  })

</script>

<style scoped>


  .setting-item {
    margin-bottom: 24px;
  }

  .setting-item h3 {
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .test-button {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
</style>