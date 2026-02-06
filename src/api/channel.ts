import apiClient from './axios'
import type { Channel } from '../types'

// 获取渠道列表
export const getChannels = async (): Promise<Channel[]> => {
  return await apiClient.get('/dms/channel/list')
}
