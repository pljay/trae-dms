<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ $t('login.title') }}</h2>
        <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
      </div>
      
      <var-form ref="loginFormRef" label-position="top">
        <var-form-item :label="$t('login.username')">
          <var-input 
            v-model="loginForm.username" 
            :placeholder="$t('login.required', { field: $t('login.username') })" 
            :rules="[{ required: true, message: () => t('login.required', { field: $t('login.username') }) }]"
            icon="account"
          />
        </var-form-item>
        
        <var-form-item :label="$t('login.password')">
          <var-input 
            v-model="loginForm.password" 
            type="password" 
            :placeholder="$t('login.required', { field: $t('login.password') })" 
            :rules="[{ required: true, message: () => t('login.required', { field: $t('login.password') }) }]"
            icon="lock"
          />
        </var-form-item>
        
        <var-form-item>
          <var-checkbox v-model="loginForm.remember">{{ $t('login.remember') }}</var-checkbox>
        </var-form-item>
        
        <var-form-item>
          <var-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading" 
            block
            size="large"
          >
            {{ $t('login.submit') }}
          </var-button>
        </var-form-item>
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

// 组件挂载时加载保存的账号密码
onMounted(() => {
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
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    authStore.login(loginForm)
    Snackbar({
      type: 'success',
      content: t('login.loginSuccess'),
      duration: 2000
    })
    router.push('/home')
  } catch (error) {
    Snackbar({
      type: 'error',
      content: t('login.loginFailed'),
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
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.login-card {
  background: white;
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
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

:deep(.var-form-item) {
  margin-bottom: 20px;
}

:deep(.var-form-item__label) {
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
}

:deep(.var-input__content) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

:deep(.var-input__content:focus-within) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.var-checkbox) {
  color: #666;
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
