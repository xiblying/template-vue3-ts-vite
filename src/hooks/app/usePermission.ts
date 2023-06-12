/*
 * @Author: LiuTao
 * @Date: 2023-05-30 16:55:59
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-01 16:30:47
 * @Description: Permission
 */
import type { RouteLocationNormalized } from 'vue-router'
import permConfig from '@/config/permission.config'
import { usePermissionStore } from '@/store/modules/permission'

const { enablePermission } = permConfig

/**
 * 判断是否有指定权限
 * @param route 权限路由
 * @param code 权限码
 * @returns {boolean}
 */
function hasPermission(route: RouteLocationNormalized, code: string): boolean {
  // 不需要权限控制时，直接返回true
  if (!enablePermission) return true
  const permissions = usePermissionStore().permissions
  // 没有权限数据时，直接返回false
  if (!permissions) return false
  // 如果拥有'*'级权限，直接返回true
  if (permissions === '*') return true
  // 判断对应路由下的权限
  const auths = permissions[route.fullPath]
  return !!auths && auths.includes(code)
}

/**
 * 判断路由是否有权限
 * @param route 权限路由
 * @returns {boolean}
 */
function hasRoutePermission(route: RouteLocationNormalized): boolean {
  // 路由权限为 * 时，直接返回true
  if (route.meta.authority === '*') return true
  return hasPermission(route, 'query')
}

// use
export function usePermission() {
  return {
    hasPermission,
    hasRoutePermission
  }
}
