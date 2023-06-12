/*
 * @Author: LiuTao
 * @Date: 2023-05-30 16:49:50
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-02 09:05:55
 * @Description: Token
 */
import { useSessionStorage } from '@vueuse/core'
import { useUserStore } from '@/store/modules/user'

const sessionStorage = useSessionStorage('PRIVATE_TOKEN_KEY', '')

// 设置token
function setToken(token) {
  useUserStore().setToken(token)
  sessionStorage.value = token
}

// 获取token
function getToken(): string {
  return useUserStore().token || sessionStorage.value
}

// use
export function useToken() {
  return {
    setToken,
    getToken
  }
}
