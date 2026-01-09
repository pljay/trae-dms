import { usePackageStore } from '../stores/package'
import { useOutboundStore } from '../stores/outbound'

/**
 * Initialize application data
 * This function should be called during application startup
 */
export const initializeAppData = async (): Promise<void> => {
  const packageStore = usePackageStore()
  const outboundStore = useOutboundStore()
  
  try {
    // Initialize store data asynchronously
    await Promise.all([
      packageStore.initData(),
      outboundStore.initData()
    ])
  } catch (error) {
    console.error('Failed to initialize app data:', error)
    // Initialization failure should not crash the app
  }
}