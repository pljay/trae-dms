import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios'

// API 响应接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取基础 URL
  timeout: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 15000, // 可通过环境变量配置超时时间
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // 允许携带跨域凭证
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加认证信息，如 token
    const token = localStorage.getItem('token')
    if (token) {
      // 确保headers是AxiosRequestHeaders类型
      config.headers = config.headers || {}
      // 使用类型断言确保TypeScript识别为正确类型
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      } as AxiosRequestHeaders
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 统一处理响应数据
    const { code, message, data } = response.data
    if (code === 200) {
      // 开发环境打印成功响应日志
      if (import.meta.env.DEV) {
        console.log('API Success:', response.config.url, data)
      }
      return data
    } else {
      // 处理错误响应
      console.error('API Error:', response.config.url, message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 网络错误处理
    let errorMessage = 'Unknown Error'
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      errorMessage = data?.message || `HTTP Error ${status}`
      console.error('Network Error Response:', error.response.config.url, status, data)
    } else if (error.request) {
      // 请求发送但未收到响应
      errorMessage = 'No response received from server'
      console.error('Network Error Request:', error.config?.url)
    } else {
      // 请求配置错误
      errorMessage = error.message
      console.error('Network Error Config:', errorMessage)
    }
    return Promise.reject(new Error(errorMessage))
  }
)

export default apiClient
export type { ApiResponse }