/*
 * @Author: LiuTao
 * @Date: 2023-06-01 09:35:58
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-01 14:38:54
 * @Description: ...
 */

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录结果
export interface LoginResult {
  token: string
}

// 用户信息
export interface UserInfo {
  id: string
  name: string
  gender: string
  age: number
  emai: string
  address: string
  [key: string]: any
}
