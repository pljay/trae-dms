import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';
import { Locale } from '@varlet/ui';
import { watch } from 'vue';

// 扩展 Varlet 语言
Locale.add('zh-CN', {
  ...Locale.enUS,
  // 在这里添加中文语言扩展
});

Locale.add('en-US', {
  ...Locale.enUS,
  // 在这里添加英文语言扩展
});

// 语言消息对象
const messages = {
  'zh-CN': zh,
  'en-US': en
};

// 获取本地存储的语言设置
const storedLocale = localStorage.getItem('locale');
const defaultLocale = storedLocale || 'zh-CN';

// 创建I18n实例
const i18n = createI18n({
  locale: defaultLocale, // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言  
  messages,
  legacy: false, // 使用组合式API
  globalInjection: true // 全局注入
});

// 设置 Varlet 语言（与 Vue I18n 同步）
Locale.use(i18n.global.locale.value);

// 监听语言切换事件，同步 Varlet 语言
watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    Locale.use(newLocale);
    localStorage.setItem('locale', newLocale);
  }
);

export default i18n;
