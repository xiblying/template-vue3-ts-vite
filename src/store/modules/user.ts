/*
 * @Author: LiuTao
 * @Date: 2023-05-29 12:53:37
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-06 10:41:51
 * @Description: ...
 */
import type { LoginParams, UserInfo } from '@/api/model/user'
import { defineStore } from 'pinia'
import { useToken } from '@/use/app/useToken'
import { usePermissionStore } from './permission'
import { asyncRoutes } from '@/router/routes'
import { treeForEach } from '@/utils/util'
import { login, getUserInfo, logout } from '@/api/user'

interface UserState {
  name: string
  token: string
  userInfo: Nullable<UserInfo>
}

// 用户状态
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    name: '',
    token: '',
    userInfo: null
  }),
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token
    },

    // 登录
    login(loginParams: LoginParams) {
      return login(loginParams).then(res => {
        useToken().setToken(res.data.token)
        return res
      })
    },
    // 获取用户信息
    getUserInfo() {
      return getUserInfo().then(res => {
        const userInfo = res.data
        this.name = userInfo.name
        this.userInfo = userInfo
        const permissionStore = usePermissionStore()
        // 添加路由
        permissionStore.setRoutes(asyncRoutes)
        // 注册权限
        const permissions = {}
        treeForEach(asyncRoutes, route => {
          if (!permissions[route.path]) {
            permissions[route.path] = []
          }
          permissions[route.path].push('query')
        })
        permissionStore.setPermissions(permissions)
      })
    },
    // 退出登录
    logout() {
      logout().then(() => {
        this.$reset()
      })
    }
  }
})
