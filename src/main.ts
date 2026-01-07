import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './styles/style.css'
import { initializeAppData } from './utils/init'
import { Themes, StyleProvider } from '@varlet/ui'

const theme = localStorage.getItem('theme');
StyleProvider(theme === 'dark' ? Themes.md3Dark : Themes.md3Light)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Varlet)
app.use(i18n)

// Initialize application data after mounting
app.mount('#app')
initializeAppData()
