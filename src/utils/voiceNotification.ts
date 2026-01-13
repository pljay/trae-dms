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

  constructor() {
    // 预翻译常用消息
    this.preTranslateMessages();
    
    // 监听语言变化事件，更新预翻译消息
    this.watchLanguageChange();
  }

  /**
   * 预翻译常用消息
   */
  private preTranslateMessages(): void {
    // 常用的语音提示消息键
    const commonKeys = [
      'common.success',
      'common.error',
      'scanIn.scanSuccess',
      'scanIn.scanFailed',
      'scanIn.intercepted',
      'scanOut.scanSuccess'
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
   * 播放语音提示
   * @param message 要播放的消息内容或国际化键
   * @param isKey 是否为国际化键，默认为true
   * @param _lang 语言代码，默认为当前语言（暂未使用）
   */
  public async speak(message: string, isKey: boolean = true, _lang?: string): Promise<void> {
    try {
      // 快速获取要播放的文本
      let textToSpeak: string;
      if (isKey) {
        // 优先使用预翻译的消息
        textToSpeak = this.preTranslatedMessages[message] || i18n.global.t(message);
      } else {
        textToSpeak = message;
      }
      
      // 从本地存储获取用户设置
      const savedVolume = parseFloat(localStorage.getItem('ttsVolume') || '1.0');
      const savedPitch = parseFloat(localStorage.getItem('ttsPitch') || '1.0');
      const savedRate = parseFloat(localStorage.getItem('ttsRate') || '2.0');
      
      // 使用Capacitor文本转语音插件播放语音
      await TextToSpeech.speak({
        text: textToSpeak,
        rate: savedRate, // 使用用户保存的语速
        pitch: savedPitch, // 使用用户保存的语调
        volume: savedVolume, // 使用用户保存的音量
        lang: 'zh-CN' // 添加明确的语言代码
      });
    } catch (error) {
      console.error('Failed to speak:', error);
      // 添加更详细的错误信息
      if (error instanceof Error) {
        console.error('TTS Error Message:', error.message);
        console.error('TTS Error Stack:', error.stack);
      }
    }
  }

  /**
   * 播放成功提示
   */
  public speakSuccess(): Promise<void> {
    return this.speak('common.success');
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
    return this.speak('scanIn.scanSuccess');
  }

  /**
   * 播放扫描失败提示
   */
  public speakScanFailed(): Promise<void> {
    return this.speak('scanIn.scanFailed');
  }

  /**
   * 播放拦截提示
   */
  public speakIntercepted(): Promise<void> {
    return this.speak('scanIn.intercepted');
  }

  /**
   * 取消当前语音播放
   */
  public async cancel(): Promise<void> {
    try {
      await TextToSpeech.stop();
    } catch (error) {
      console.error('Failed to cancel speech:', error);
    }
  }

  /**
   * 检查语音合成是否支持
   */
  public isSupported(): boolean {
    return true; // Capacitor TTS plugin should work on most devices
  }
}

// 导出单例实例
export default new VoiceNotification();
