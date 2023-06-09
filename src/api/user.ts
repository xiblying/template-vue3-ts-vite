/*
 * @Author: LiuTao
 * @Date: 2023-05-31 17:11:11
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-01 10:04:19
 * @Description: ...
 */
import type { ApiResult } from './model/common'
import type { LoginParams, LoginResult, UserInfo } from './model/user'
import http from '@/utils/http'

// 登录
export function login(data: LoginParams) {
  return http.request<ApiResult<LoginResult>>({
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return http.request<ApiResult<UserInfo>>({
    url: '/getUserInfo'
  })
}

// 退出登录
export function logout() {
  return http.request<ApiResult>({
    url: '/logout',
    method: 'post'
  })
}
