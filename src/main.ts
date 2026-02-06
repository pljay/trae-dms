import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './styles/style.css'
import { Themes, StyleProvider } from '@varlet/ui'
import 'default-passive-events'

// 设置应用标题
if (import.meta.env.VITE_APP_TITLE) {
  document.title = import.meta.env.VITE_APP_TITLE
}

// Set default theme first
StyleProvider(Themes.md3Light)

// Load theme from localStorage after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const theme = localStorage.getItem('theme');
    if (theme) {
      StyleProvider(theme === 'dark' ? Themes.md3Dark : Themes.md3Light)
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
  }
});

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Varlet)
app.use(i18n)

// Initialize application data after mounting
app.mount('#app')

// Import and call initialize function
export const initializeApp = async () => {
  const { initializeAppData } = await import('./utils/init')
  await initializeAppData()
}

