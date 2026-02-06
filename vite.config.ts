import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const enableMock = env.VITE_ENABLE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'src/mock', // mock文件存放目录
        enable: enableMock, // 根据环境变量启用mock
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
      // 配置跨域代理
      proxy: {
        // 将/oll-boot/api路径的请求代理到后端服务器
        '/oll-boot/api': {
          target: env.VITE_HOST, // 后端服务器地址，可根据实际情况修改
          changeOrigin: true, // 启用跨域
          rewrite: (path) => path, // 路径重写规则
        },
      },
    },
  }
})
