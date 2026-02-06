import { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({
  path: '.env.development'
});

const config: CapacitorConfig = {
  appId: 'com.trae.dms',
  appName: 'trae-dms',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // 启用调试模式，方便查看 JavaScript 错误
    cleartext: true,
    // 本地开发服务器地址，用于调试时调用本地环境
    url: process.env.VITE_URL || '192.168.0.112:5173',
    // 在开发模式下启用
    allowNavigation: [process.env.VITE_URL || '192.168.0.112:5173']
  },
  // 启用调试日志
  loggingBehavior: 'debug'
};

export default config;
