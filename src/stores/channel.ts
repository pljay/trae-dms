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
      return state.channels.find(channel => channel.id === id)
    }
  },

  actions: {
    // 加载渠道列表
    async loadChannels() {
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
      // 先从缓存中查找
      if(this.allChannels.length === 0) {
        await this.loadChannels()
      }
      const cachedChannel = this.getChannelById(id)
      if (cachedChannel) {
         return cachedChannel
      }
    }
  }
})
