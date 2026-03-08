<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ $t('loginView.title') }}</h2>
        <p class="login-subtitle">{{ $t('loginView.subtitle') }}</p>
      </div>
      <var-form ref="loginFormRef" label-position="top">
        <var-input v-model="loginForm.username" :placeholder="$t('loginView.required', { field: $t('loginView.username') })"
          :rules="[{ required: true, message: () => t('loginView.required', { field: $t('loginView.username') }) }]"
          icon="account" />
        <var-input v-model="loginForm.password" type="password"
          :placeholder="$t('loginView.required', { field: $t('loginView.password') })"
          :rules="[{ required: true, message: () => t('loginView.required', { field: $t('loginView.password') }) }]"
          icon="lock" />
        <var-checkbox v-model="loginForm.remember">{{ $t('loginView.remember') }}</var-checkbox>
        <var-button type="primary" @click="handleLogin" :loading="loading" block size="large">
          {{ $t('loginView.submit') }}
        </var-button>

      </var-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { Snackbar } from '@varlet/ui'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useI18n } from 'vue-i18n'
  import { initializeAppData } from '@/utils/init'
  import { authApi } from '@/api'


  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useI18n()
  const loginFormRef = ref()
  const loading = ref(false)

  const loginForm = reactive({
    username: '',
    password: '',
    remember: false
  })

  // 组件挂载时加载保存的账号密码并检查登录状态
  onMounted(() => {
    // 检查用户是否已登录
    if (authStore.isAuthenticated) {
       // 已登录，跳转到首页
      router.push('/home')
      Snackbar({
        type: 'success',
        content: t('loginView.alreadyLoggedIn'),
        duration: 2000
      })
      return
    }
    
    // 未登录，加载保存的账号密码
    const savedCredentials = authStore.getSavedCredentials()
    if (savedCredentials.username) {
      loginForm.username = savedCredentials.username
      loginForm.password = savedCredentials.password
      loginForm.remember = savedCredentials.remember
    }
  })

  const handleLogin = async () => {
    if (!loginFormRef.value) return

    try {
      await loginFormRef.value.validate()
      loading.value = true

      // 调用登录API
      const loginResponse = await authApi.login({
        username: loginForm.username,
        password: loginForm.password
      })
      console.log('Login Data:', loginResponse)
      // 登录成功后更新store
      authStore.login({
        ...loginForm,
        id: loginResponse.userInfo.id,
        username: loginResponse.userInfo.username,
        name: loginResponse.userInfo.realname,
        orgCodeTxt: loginResponse.userInfo.orgCodeTxt,
      }, loginResponse.token)
      
      // 登录成功后初始化应用数据
      await initializeAppData(router)
      
      Snackbar({
        type: 'success',
        content: t('loginView.loginSuccess'),
        duration: 2000
      })
      router.push('/home')
    } catch (error: any) {
      Snackbar({
        type: 'error',
        content: error.message || t('loginView.loginFailed'),
        duration: 2000
      })
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="css">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-sizing: border-box;
    overflow: hidden;
  }

  .login-card {
    background: var(--color-body);
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-header h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    font-weight: 600;
  }

  .login-subtitle {
    margin: 0;
    font-size: 14px;
  }

  :deep(.var-form-item) {
    margin-bottom: 20px;
  }

  :deep(.var-form-item__label) {
    font-weight: 500;
    margin-bottom: 8px;
  }

  :deep(.var-input__content) {
    border-radius: 8px;
    border: 1px solid;
    transition: all 0.3s ease;
  }

  :deep(.var-input__content:focus-within) {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }


  :deep(.var-button--primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  :deep(.var-button--primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  :deep(.var-button--primary:active) {
    transform: translateY(0);
  }
</style>
