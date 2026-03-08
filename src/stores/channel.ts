import { defineStore } from 'pinia'
import { getChannels } from '../api/channel'
import { Channel } from '../types'
import { Snackbar } from '@varlet/ui'
import i18n from '@/i18n'


export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    loading: false
  }),

  getters: {
    allChannels: (state) => state.channels,
    getChannelById: (state) => (id: string | number) => {
      // 存在逗号分隔多个渠道ID，返回所有渠道
      if (typeof id === 'string' && id.includes(',')) {
        const channels = state.channels.filter(channel => id.split(',').includes(channel.id.toString()))
        const channelCodes = channels.map(channel => channel.code || '')
        const channelIds = channels.map(channel => channel.id || '')
        const channelNames = channels.map(channel => channel.name || '')
        return {
          id: channelIds.join(','),
          code: channelCodes.join(','),
          name: channelNames.join(',')
        } 
      }
      return state.channels.find(channel => channel.id === id)
    }
  },

  actions: {
    // 加载渠道列表
    async loadChannels() {
      if (this.loading) return this.channels
      this.loading = true
      try {
        const channels = await getChannels()
        this.channels = channels
        return channels
      } catch (error) {
        console.error('Failed to load channels:', error)
        Snackbar({ type: 'error', content: i18n.global.t('api.error.serverError') })
        return []
      } finally {
        this.loading = false
      }
    },

    // 根据渠道ID获取渠道详情
    async fetchChannelById(id: string | number) {
      // 确保渠道数据已加载
      if (this.channels.length === 0) {
        await this.loadChannels()
      }
      return this.getChannelById(id)
    }
  }
})
