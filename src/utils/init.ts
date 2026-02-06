import { useChannelStore } from '../stores/channel'
import { usePackageStore } from '../stores/package'


/**
 * Initialize application data
 * This function should be called during application startup
 */
export const initializeAppData = async (): Promise<void> => {
  //由于 usepackage 使用了channel 所以需要先初始化channel 等待初始化完成后再初始化package
  const channelStore = useChannelStore()
  const packageStore = usePackageStore()


  try {
    // Initialize store data asynchronously
    await Promise.all([
      channelStore.loadChannels(),
      packageStore.loadPackageStats()

    ])
  } catch (error) {
    console.error('Failed to initialize app data:', error)
    // Initialization failure should not crash the app
  }
}