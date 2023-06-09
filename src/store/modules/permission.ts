/*
 * @Author: LiuTao
 * @Date: 2023-05-30 16:24:07
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-07 16:18:47
 * @Description: ...
 */
import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import router from '@/router'
import { treeFilter } from '@/utils/util'

type Permissions = string | { [key: string]: string | string[] }

interface Menu {
  name: string
  path: string
  icon: string
  children?: Menu[]
}

interface PermissionState {
  routes: RouteRecordRaw[]
  menu: Menu[]
  permissions: Permissions
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    menu: [],
    permissions: {}
  }),
  actions: {
    setPermissions(permissions: Permissions) {
      this.permissions = permissions
    },
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
      // 添加路由
      routes.forEach(route => {
        router.addRoute(route)
      })
      // 菜单 = 路由 filter() + map()
      this.menu = treeFilter(routes, function (route: RouteRecordRaw) {
        const meta = route.meta
        return meta && meta.hidden !== true
      })
    },

    // 获取第一子菜单
    getFirstSubmenu(): Menu {
      let submenu = this.menu[0]
      while (submenu && submenu.children?.length) {
        submenu = submenu.children[0]
      }
      return submenu
    }
  }
})
