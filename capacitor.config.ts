import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.trae.dms',
  appName: 'OLL-DMS',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    // 启用调试模式，方便查看 JavaScript 错误
    cleartext: true,
    // 本地开发服务器地址，用于调试时调用本地环境
    // url: 'http://192.168.0.108:5173',
    // 在开发模式下启用
    // allowNavigation: ['http://192.168.0.108:5173']
  },
  // 启用调试日志
  loggingBehavior: 'debug'
};

export default config;
