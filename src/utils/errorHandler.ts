/**
 * API错误处理工具函数
 */
import { AxiosError } from 'axios'
import { Snackbar } from '@varlet/ui'
import { useI18n } from 'vue-i18n'

/**
 * 处理API请求错误
 * @param error 错误对象
 * @param customMessage 自定义错误消息
 * @returns 格式化后的错误对象
 */
export const handleApiError = (error: any, customMessage?: string): any => {
  const { t } = useI18n()
  
  if (error instanceof AxiosError) {
    // 处理Axios错误
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status
      const data = error.response.data
      
      // 根据状态码显示不同的错误消息
      switch (status) {
        case 400:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.badRequest') })
          break
        case 401:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.unauthorized') })
          break
        case 403:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.forbidden') })
          break
        case 404:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.notFound') })
          break
        case 500:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.serverError') })
          break
        default:
          Snackbar({ type: 'error', content: customMessage || data.message || t('api.error.unknownError') })
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      Snackbar({ type: 'error', content: customMessage || t('api.error.networkError') })
    } else {
      // 请求配置出错
      Snackbar({ type: 'error', content: customMessage || t('api.error.requestError') })
    }
  } else {
    // 处理其他类型的错误
    Snackbar({ type: 'error', content: customMessage || error.message || t('api.error.unknownError') })
  }
  
  return error
}

/**
 * 格式化API错误消息
 * @param error 错误对象
 * @returns 格式化后的错误消息字符串
 */
export const formatApiError = (error: any): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data
      if (data && data.message) {
        return data.message
      }
      return `HTTP ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      return 'No response received from server'
    } else {
      return error.message || 'Unknown API error'
    }
  }
  return error.message || 'Unknown error'
}

/**
 * 检查错误是否为网络错误
 * @param error 错误对象
 * @returns 是否为网络错误
 */
export const isNetworkError = (error: any): boolean => {
  return error instanceof AxiosError && !error.response
}

/**
 * 检查错误是否为授权错误（401）
 * @param error 错误对象
 * @returns 是否为授权错误
 */
export const isAuthorizationError = (error: any): boolean => {
  return error instanceof AxiosError && error.response?.status === 401
}
