import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';
import fr from './fr';
import de from './de';
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

Locale.add('fr-FR', {
  ...Locale.enUS,
  // 在这里添加法语语言扩展
});

Locale.add('de-DE', {
  ...Locale.enUS,
  // 在这里添加德语语言扩展
});

// 语言消息对象
export const messages = {
  'zh-CN': zh,
  'en-US': en,
  'fr-FR': fr,
  'de-DE': de
};

// 创建I18n实例
const i18n = createI18n({
  locale: 'zh-CN', // 默认语言
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

// 在应用挂载后从localStorage加载语言设置
let localeLoaded = false;
const loadLocaleFromStorage = () => {
  if (localeLoaded) return;
  localeLoaded = true;
  
  try {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && ['zh-CN', 'en-US', 'fr-FR', 'de-DE'].includes(storedLocale)) {
      i18n.global.locale.value = storedLocale as 'zh-CN' | 'en-US' | 'fr-FR' | 'de-DE';
    }
  } catch (error) {
    console.error('Failed to load locale from localStorage:', error);
  }
};

// 确保在DOM加载完成后执行
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLocaleFromStorage);
  } else {
    loadLocaleFromStorage();
  }
};

export default i18n;
