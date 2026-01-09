import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trae.dms',
  appName: 'trae-dms',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // 启用调试模式，方便查看 JavaScript 错误
    cleartext: true
  },
  // 启用调试日志
  loggingBehavior: 'debug'
};

export default config;
