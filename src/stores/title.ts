import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import i18n from '@/i18n';

export const useTitleStore = defineStore('title', () => {
  // 存储标题的键，而不是翻译后的固定字符串
  const titleKey = ref('home.title');
  
  // 监听标题键变化，当标题键或语言变化时更新文档标题
  watch(
    [() => titleKey.value, () => i18n.global.locale.value],
    () => {
      // 使用 i18n.global.t 获取最新翻译
      document.title = i18n.global.t(titleKey.value);
    },
    { immediate: true } // 立即执行一次，确保初始标题正确
  );
  
  return {
    /**
     * 获取标题键，组件中使用 $t(titleStore.getTitle()) 获取实时翻译
     */
    getTitle: () => titleKey.value,
    
    /**
     * 设置标题键，并更新文档标题
     * @param key 标题的国际化键
     */
    setTitle: (key: string) => {
      titleKey.value = key;
      // 文档标题会通过 watch 自动更新，不需要手动设置
    }
  };
});