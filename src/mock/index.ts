// mock服务配置
// vite-plugin-mock会自动加载mock目录下的所有.ts和.js文件
// 无需额外配置入口文件

// 只在开发环境中导入和使用mock服务
// 避免在生产环境中出现"Mock.XHR.prototype.__send = Mock.XHR.prototype.send"错误

export function setupProdMockServer() {
  // 只在开发环境初始化mock服务器
    try {
      // 动态导入，避免生产环境加载错误
      import('vite-plugin-mock/client').then(({ createProdMockServer }) => {
        // 动态导入mock模块
        Promise.all([
          import('@/mock/inbound'),
          import('@/mock/package'),
          import('@/mock/outbound')
        ]).then(([inboundModule, packageModule, outboundModule]) => {
          createProdMockServer([
            ...inboundModule.default,
            ...packageModule.default,
            ...outboundModule.default
          ]).then(() => {
            console.log('Mock server setup completed')
          })
        })
      })
    } catch (error) {
      console.error('Failed to setup mock server:', error)
      // 忽略mock服务初始化错误，避免影响应用正常运行
    }
}