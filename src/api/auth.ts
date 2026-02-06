import apiClient from './axios'

// 登录请求接口
interface LoginRequest {
  username: string
  password: string
}

// 登录响应接口
interface LoginResponse {
  token: string
  userInfo: {
    "id": string,
    "username": string,
    "realname": string,
    "pinCode": string,
    "avatar": string,
    "birthday": string,
    "sex": number,
    "email": string,
    "phone": string,
    "orgCode": string,
    "status": number,
    "delFlag": number,
    "workNo": string,
    "post": string,
    "telephone": null,
    "createBy": null,
    "createTime": String,
    "updateBy": string,
    "updateTime": string,
    "activitiSync": number,
    "userIdentity": number,
    "departIds": string,
    "thirdType": string,
    "relTenantIds": string,
    "orgCodeTxt": string
  }
}

// 认证相关 API
export const authApi = {
  /**
   * 登录
   * @param data 登录信息
   * @returns 登录结果，包含token和用户信息
   */
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/v1/auth', data)
  },

  /**
   * 登出
   * @returns 登出结果
   */
  logout: (): Promise<void> => {
    return apiClient.post('/auth/logout')
  },

  /**
   * 获取当前用户信息
   * @returns 当前用户信息
   */
  getCurrentUser: (): Promise<LoginResponse['userInfo']> => {
    return apiClient.get('/auth/me')
  },

  /**
   * 刷新token
   * @returns 新的token
   */
  refreshToken: (): Promise<{ token: string }> => {
    return apiClient.post('/auth/refresh')
  }
}

export type { LoginRequest, LoginResponse }
