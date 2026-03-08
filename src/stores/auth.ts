import { defineStore } from 'pinia'
import { User } from '../types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  actions: {
    login(user: User, token?: string) {
      // 使用API返回的token或生成一个模拟token
      this.token = token || 'mock-token-' + Date.now()
      this.user = user
      this.isAuthenticated = true
      
      // 保存到localStorage
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.remember) {
        localStorage.setItem('username', user.username)
      } else {
        localStorage.removeItem('username')
      }
    },
    logout() {
      this.token = ''
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    getSavedCredentials() {
      return {
        username: localStorage.getItem('username') || '',
        password: '', // 不再从localStorage获取密码
        remember: !!localStorage.getItem('username')
      }
    }
  }
})