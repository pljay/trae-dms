import i18n from '@/i18n';
import { watch } from 'vue';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

/**
 * 语音提示工具类
 * 使用Capacitor的文本转语音插件进行语音播报
 */
class VoiceNotification {
  // 预翻译的常用消息缓存
  private preTranslatedMessages: Record<string, string> = {};

  // TTS设置缓存
  private ttsSettings: {
    volume: number;
    pitch: number;
    rate: number;
    voice: number;
  };

  // 语音播放队列
  private speakQueue: Array<() => Promise<void>> = [];

  // 标记是否正在播放语音
  private isSpeaking: boolean = false;

  // 标记TTS引擎是否已初始化
  private isInitialized: boolean = false;

  constructor() {
    // 初始化TTS设置
    this.ttsSettings = {
      volume: parseFloat(localStorage.getItem('ttsVolume') || '1.0'),
      pitch: parseFloat(localStorage.getItem('ttsPitch') || '1.0'),
      rate: parseFloat(localStorage.getItem('ttsRate') || '2.0'),
      voice: parseInt(localStorage.getItem('ttsVoice') || '0')
    };

    // 预翻译常用消息
    this.preTranslateMessages();

    // 监听语言变化事件，更新预翻译消息
    this.watchLanguageChange();

    // 预初始化TTS引擎
    this.preInitialize();
  }

  /**
   * 预翻译常用消息
   */
  private preTranslateMessages(): void {
    // 常用的语音提示消息键
    const commonKeys = [
      'common.success',
      'common.error',
      'scan.message.scanSuccess',
      'scan.message.scanFailed'
    ];

    // 预翻译并缓存这些消息
    commonKeys.forEach(key => {
      this.preTranslatedMessages[key] = i18n.global.t(key);
    });
  }

  /**
   * 监听语言变化事件
   */
  private watchLanguageChange(): void {
    // 监听i18n语言变化
    watch(
      () => i18n.global.locale.value,
      () => {
        // 重新预翻译消息
        this.preTranslateMessages();
      }
    );
  }

  /**
   * 预初始化TTS引擎
   */
  private async preInitialize(): Promise<void> {
    try {
      // 预初始化TTS引擎，减少首次调用延迟
      const languages = await TextToSpeech.getSupportedLanguages();
      console.log('Supported TTS languages:', languages);
      const voices = await TextToSpeech.getSupportedVoices();
      console.log('Supported TTS voices:', voices);
      this.isInitialized = true;
      console.log('TTS engine initialized successfully');
    } catch (error) {
      console.error('Failed to pre-initialize TTS:', error);
      if (error instanceof Error) {
        console.error('TTS Error Message:', error.message);
        console.error('TTS Error Stack:', error.stack);
      }
    }
  }

  /**
   * 更新TTS设置缓存
   */
  private updateTtsSettings(): void {
    this.ttsSettings = {
      volume: parseFloat(localStorage.getItem('ttsVolume') || '1.0'),
      pitch: parseFloat(localStorage.getItem('ttsPitch') || '1.0'),
      rate: parseFloat(localStorage.getItem('ttsRate') || '2.0'),
      voice: parseInt(localStorage.getItem('ttsVoice') || '0')
    };
  }

  /**
   * 播放语音提示
   * @param message 要播放的消息内容或国际化键
   * @param isKey 是否为国际化键，默认为true
   * @param _lang 语言代码，默认为当前语言（暂未使用）
   */
  public speak(message: string, isKey: boolean = true, _lang?: string): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        // 快速获取要播放的文本
        let textToSpeak: string;
        if (isKey) {
          // 优先使用预翻译的消息
          textToSpeak = this.preTranslatedMessages[message] || i18n.global.t(message);
        } else {
          textToSpeak = message;
        }

        // 更新TTS设置
        this.updateTtsSettings();

        // 创建播放任务
        const speakTask = async () => {
          try {
            console.log('Starting speak task with text:', textToSpeak);
            console.log('TTS settings:', this.ttsSettings);

            // 确保TTS引擎已初始化
            if (!this.isInitialized) {
              console.log('TTS engine not initialized, initializing...');
              await this.preInitialize();
            }

            // 检查设备是否支持TTS
            const isSupported = await this.isSupported();
            console.log('TTS supported:', isSupported);

            if (!isSupported) {
              console.error('TTS is not supported on this device');
              return;
            }

            // 使用Capacitor文本转语音插件播放语音
            console.log('Calling TextToSpeech.speak with parameters:', {
              text: textToSpeak,
              rate: this.ttsSettings.rate,
              pitch: this.ttsSettings.pitch,
              volume: this.ttsSettings.volume,
              voice: this.ttsSettings.voice,
              lang: 'zh-CN'
            });

            await TextToSpeech.speak({
              text: textToSpeak,
              rate: this.ttsSettings.rate,
              pitch: this.ttsSettings.pitch,
              volume: this.ttsSettings.volume,
              voice: this.ttsSettings.voice,
              lang: 'zh-CN'
            });

            console.log('TextToSpeech.speak completed successfully');
          } catch (error) {
            console.error('Failed to speak:', error);
            if (error instanceof Error) {
              console.error('TTS Error Message:', error.message);
              console.error('TTS Error Stack:', error.stack);
            } else {
              console.error('TTS Error Details:', error);
            }
          } finally {
            this.isSpeaking = false;
            this.processQueue();
            resolve();
          }
        };

        // 将任务添加到队列
        this.speakQueue.push(speakTask);

        // 如果当前没有正在播放的语音，处理队列
        if (!this.isSpeaking) {
          this.processQueue();
        }
      } catch (error) {
        console.error('Failed to add speak task to queue:', error);
        resolve();
      }
    });
  }

  /**
   * 处理语音播放队列
   */
  private async processQueue(): Promise<void> {
    if (this.isSpeaking || this.speakQueue.length === 0) {
      return;
    }

    this.isSpeaking = true;
    const task = this.speakQueue.shift();
    if (task) {
      await task();
    }
  }

  /**
   * 直接播放指定文本，无需国际化
   * @param text 要播放的文本内容
   */
  public async speakText(text: string): Promise<void> {
    return this.speak(text, false);
  }

  /**
   * 播放成功提示
   */
  public speakSuccess(): Promise<void> {
    return this.speak('common.success');
  }

  /**
   * 播放警告提示
   */
  public speakWarning(): Promise<void> {
    return this.speak('common.warning');
  }

  /**
   * 播放错误提示
   */
  public speakError(): Promise<void> {
    return this.speak('common.error');
  }

  /**
   * 播放扫描成功提示
   */
  public speakScanSuccess(): Promise<void> {
    return this.speak('scan.message.scanSuccess');
  }

  /**
   * 播放扫描失败提示
   */
  public speakScanFailed(): Promise<void> {
    return this.speak('scan.message.scanFailed');
  }

  /**
   * 播放拦截提示
   */
  public speakIntercepted(): Promise<void> {
    return this.speak('scan.message.intercepted');
  }

  /**
   * 取消当前语音播放和队列
   */
  public async cancel(): Promise<void> {
    try {
      // 清空队列
      this.speakQueue = [];

      // 停止当前播放
      await TextToSpeech.stop();

      // 更新状态
      this.isSpeaking = false;
    } catch (error) {
      console.error('Failed to cancel speech:', error);
    }
  }

  /**
   * 检查语音合成是否支持
   */
  public async isSupported(): Promise<boolean> {
    try {
      await TextToSpeech.getSupportedLanguages();
      return true;
    } catch (error) {
      console.error('TTS not supported:', error);
      return false;
    }
  }

  /**
   * 清除语音播放队列
   */
  public clearQueue(): void {
    this.speakQueue = [];
  }
}

// 导出单例实例
export default new VoiceNotification();
