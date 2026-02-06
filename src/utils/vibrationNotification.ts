import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

/**
 * 震动反馈工具类
 * 使用Capacitor的Haptics插件或Web Vibration API进行震动反馈
 */
class VibrationNotification {
  // 震动设置缓存
  private vibrationSettings: {
    enabled: boolean;
    duration: number;
  };

  constructor() {
    // 初始化震动设置
    this.vibrationSettings = {
      enabled: localStorage.getItem('vibrationEnabled') !== 'false',
      duration: parseInt(localStorage.getItem('vibrationDuration') || '200')
    };
  }

  /**
   * 更新震动设置
   */
  private updateVibrationSettings(): void {
    this.vibrationSettings = {
      enabled: localStorage.getItem('vibrationEnabled') !== 'false',
      duration: parseInt(localStorage.getItem('vibrationDuration') || '200')
    };
  }

  /**
   * 触发震动反馈
   * @param duration 震动持续时间（毫秒）
   */
  public vibrate(duration: number = this.vibrationSettings.duration): void {
    // 更新震动设置
    this.updateVibrationSettings();

    // 检查是否启用了震动
    if (!this.vibrationSettings.enabled) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // 在原生平台使用Capacitor Haptics插件
        Haptics.impact({ style: ImpactStyle.Medium });
      } else if ('vibrate' in navigator) {
        // 在Web平台使用Web Vibration API
        navigator.vibrate(duration);
      }
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  }

  /**
   * 触发成功震动反馈
   */
  public vibrateSuccess(): void {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台使用成功反馈类型
      Haptics.notification({ type: NotificationType.Success });
    } else {
      // 在Web平台使用默认震动
      this.vibrate();
    }
  }

  /**
   * 触发错误震动反馈
   */
  public vibrateError(): void {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台使用错误反馈类型
      Haptics.notification({ type: NotificationType.Error });
    } else {
      // 在Web平台使用较短的震动
      this.vibrate(100);
    }
  }

  /**
   * 触发警告震动反馈
   */
  public vibrateWarning(): void {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台使用警告反馈类型
      Haptics.notification({ type: NotificationType.Warning });
    } else {
      // 在Web平台使用中等长度的震动
      this.vibrate(150);
    }
  }

  /**
   * 触发轻量级震动反馈
   */
  public vibrateLight(): void {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台使用轻量级震动
      Haptics.impact({ style: ImpactStyle.Light });
    } else {
      // 在Web平台使用较短的震动
      this.vibrate(100);
    }
  }

  /**
   * 触发重量级震动反馈
   */
  public vibrateHeavy(): void {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台使用重量级震动
      Haptics.impact({ style: ImpactStyle.Heavy });
    } else {
      // 在Web平台使用较长的震动
      this.vibrate(300);
    }
  }

  /**
   * 启用震动
   */
  public enable(): void {
    localStorage.setItem('vibrationEnabled', 'true');
    this.updateVibrationSettings();
  }

  /**
   * 禁用震动
   */
  public disable(): void {
    localStorage.setItem('vibrationEnabled', 'false');
    this.updateVibrationSettings();
  }

  /**
   * 检查震动是否启用
   */
  public isEnabled(): boolean {
    this.updateVibrationSettings();
    return this.vibrationSettings.enabled;
  }

  /**
   * 设置震动持续时间
   * @param duration 震动持续时间（毫秒）
   */
  public setDuration(duration: number): void {
    localStorage.setItem('vibrationDuration', duration.toString());
    this.updateVibrationSettings();
  }

  /**
   * 检查设备是否支持震动
   */
  public isSupported(): boolean {
    if (Capacitor.isNativePlatform()) {
      // 原生平台假定支持震动
      return true;
    } else {
      // Web平台检查是否支持Web Vibration API
      return 'vibrate' in navigator;
    }
  }
}

// 导出单例实例
export default new VibrationNotification();
