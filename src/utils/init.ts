import { usePackageStore } from '../stores/package'
import { useOutboundStore } from '../stores/outbound'

/**
 * Initialize application data
 * This function should be called during application startup
 */
export const initializeAppData = (): void => {
  const packageStore = usePackageStore()
  const outboundStore = useOutboundStore()
  
  // Initialize store data
  packageStore.initData()
  outboundStore.initData()
}