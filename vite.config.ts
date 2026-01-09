import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'src/mock', // mock文件存放目录
      enable: true, // 在开发和生产环境都启用mock
      watchFiles: true, // 监听mock文件变化
      logger: true // 开启日志输出
    })
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@types': resolve(__dirname, 'src/types'),
      '@api': resolve(__dirname, 'src/api'),
      '@services': resolve(__dirname, 'src/services'),
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    sourcemap: true, // 生成sourcemap以支持调试
  },
  server: {
    // sourcemap: true, // 开发服务器启用sourcemap
  },
})
