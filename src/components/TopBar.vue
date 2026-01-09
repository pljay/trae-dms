<template>
  <var-app-bar  :title="$t('home.title')" fixed :show-text="true" :safe-area-top="true" z-index="1000">
    <!-- 左侧：主页按钮 -->
    <template #left v-if="!isLoginPage">
      <var-button type="primary" @click="navigateToHome" round>
        <var-icon name="home" />
      </var-button>
    </template>

    <!-- 中间：标题（可选） -->
    <template #content v-if="!isLoginPage">
      <slot name="title"></slot>
    </template>

    <!-- 右侧：功能按钮 -->
    <template #right>
      <!-- 国际化切换 -->
      <var-menu-select :show="showLangPopup" @update:show="showLangPopup = $event" placement="bottom" trigger="click">
        <var-button type="primary">
          <var-icon name="translate" />
          <span>{{ getCurrentLocaleText() }}</span>
          <var-icon name="chevron-down" />
        </var-button>
        <template #options>
          <var-menu-option value="zh-CN" @click="selectLanguage('zh-CN')">
            {{ $t('common.chinese') }}
          </var-menu-option>
          <var-menu-option value="en-US" @click="selectLanguage('en-US')">
            {{ $t('common.english') }}
          </var-menu-option>
          <var-menu-option value="fr-FR" @click="selectLanguage('fr-FR')">
            {{ $t('common.french') }}
          </var-menu-option>
          <var-menu-option value="de-DE" @click="selectLanguage('de-DE')">
            {{ $t('common.german') }}
          </var-menu-option>
        </template>
      </var-menu-select>

      <!-- 主题切换 -->
      <var-button type="primary" @click="toggleTheme" round>
        <var-icon name="palette" />
        <var-icon :name="isDark ? 'sunny' : 'moon'" />
      </var-button>

      <!-- 登录信息 -->
      <var-menu-select v-if="!isLoginPage" :show="showUserPopup" @update:show="showUserPopup = $event" placement="bottom" trigger="click" width="200px">
        <var-button type="primary">
          <var-icon name="account-circle" />
          <span>{{ username }}</span>
          <var-icon name="chevron-down" />
        </var-button>
        <template #options>
          <!-- <var-menu-option @click="handleProfile">
            <var-icon name="account-circle" />
            {{ $t('common.userProfile') }}
          </var-menu-option>
          <var-menu-option @click="handleSettings">
            <var-icon name="settings" />
            {{ $t('common.settings') }}
          </var-menu-option>
          <var-menu-option @click="handleHelp">
            <var-icon name="help-circle" />
            {{ $t('common.help') }}
          </var-menu-option>
          <var-divider /> -->
          <var-menu-option @click="handleLogout">
            {{ $t('common.logout') }}
          </var-menu-option>
        </template>
      </var-menu-select>
    </template>
  </var-app-bar>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
  import { StyleProvider, Themes } from '@varlet/ui'
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useAuthStore } from '@/stores/auth';

  const router = useRouter();
  const { locale, t } = useI18n();
  const authStore = useAuthStore();
  // 响应式状态
  const currentLocale = ref(locale.value);
  const isDark = ref(false);
  const username = computed(() => authStore.user?.username || ''); // 这里应该从authStore获取实际用户信息
  // 监听窗口大小变化，用于响应式调整
  const isMobile = ref(false);
  // 控制弹窗显示
  const showLangPopup = ref(false);
  const showUserPopup = ref(false);
  const isLoginPage = ref(false);


  // 检查是否为移动设备
  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 769;
  };

  // 导航到主页
  const navigateToHome = () => {
    router.push('/home');
  };

  // 获取当前语言文本
  const getCurrentLocaleText = () => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return t('common.chinese');
      case 'en-US':
        return t('common.english');
      case 'fr-FR':
        return t('common.french');
      case 'de-DE':
        return t('common.german');
      default:
        return t('common.chinese');
    }
  };

  // 处理国际化切换
  const selectLanguage = (lang: string) => {
    currentLocale.value = lang;
    locale.value = lang;
    localStorage.setItem('locale', lang);
    showLangPopup.value = false;
  };

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    StyleProvider(isDark.value ? Themes.md3Dark : Themes.md3Light)
  };

  // 处理用户信息
  // const handleProfile = () => {
  //   console.log('用户信息');
  //   showUserPopup.value = false;
  //   // 这里可以添加导航到用户信息页面的逻辑
  //   // router.push('/profile');
  // };

  // // 处理设置
  // const handleSettings = () => {
  //   console.log('设置');
  //   showUserPopup.value = false;
  //   // 这里可以添加导航到设置页面的逻辑
  //   // router.push('/settings');
  // };

  // // 处理帮助
  // const handleHelp = () => {
  //   console.log('帮助');
  //   showUserPopup.value = false;
  //   // 这里可以添加导航到帮助页面的逻辑
  //   // router.push('/help');
  // };

  // 处理登出
  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };

  // 组件挂载时初始化
  onMounted(() => {
    // 监听路由变化，更新isLoginPage
    console.log("router.currentRoute.value.path", router.currentRoute.value.path)
    isLoginPage.value = router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/';
      

    // 检查本地存储中的主题和语言设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark.value);
    }

    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      currentLocale.value = savedLocale;
      locale.value = savedLocale;
    }

    // 检查是否为移动设备
    checkIsMobile();

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkIsMobile);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIsMobile);
    isLoginPage.value = false;
  });

</script>

