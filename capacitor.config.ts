import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trae.dms',
  appName: 'trae-dms',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
