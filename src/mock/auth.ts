import { MockMethod } from 'vite-plugin-mock'

// 登录认证相关的mock数据
export default [
  {
    url: '/oll-boot/api/v1/auth',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body
      
      // 简单的登录验证
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          result: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: '1',
              username: 'admin',
              realname: '管理员',
              role: 'admin',
              pinCode: '',
              avatar: '',
              birthday: '',
              sex: 1,
              email: 'admin@example.com',
              phone: '13800138000',
              orgCode: '001',
              status: 1,
              delFlag: 0,
              workNo: 'admin001',
              post: '管理员',
              telephone: null,
              createBy: null,
              createTime: new Date().toISOString(),
              updateBy: 'admin',
              updateTime: new Date().toISOString(),
              activitiSync: 0,
              userIdentity: 1,
              departIds: '001',
              thirdType: '',
              relTenantIds: '',
              orgCodeTxt: '总公司'
            }
          }
        }
      } else {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null
        }
      }
    }
  },
  {
    url: '/oll-boot/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null
      }
    }
  },
  {
    url: '/oll-boot/api/auth/me',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取用户信息成功',
        data: {
          id: '1',
          username: 'admin',
          realname: '管理员',
          role: 'admin',
          pinCode: '',
          avatar: '',
          birthday: '',
          sex: 1,
          email: 'admin@example.com',
          phone: '13800138000',
          orgCode: '001',
          status: 1,
          delFlag: 0,
          workNo: 'admin001',
          post: '管理员',
          telephone: null,
          createBy: null,
          createTime: new Date().toISOString(),
          updateBy: 'admin',
          updateTime: new Date().toISOString(),
          activitiSync: 0,
          userIdentity: 1,
          departIds: '001',
          thirdType: '',
          relTenantIds: '',
          orgCodeTxt: '总公司'
        }
      }
    }
  },
  {
    url: '/oll-boot/api/auth/refresh',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '刷新token成功',
        data: {
          token: 'mock-token-' + Date.now()
        }
      }
    }
  }
] as MockMethod[]
