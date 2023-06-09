import type { NavigationGuard, NavigationHookAfter, RouteLocationNormalized, RouteLocationPathRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import { useToken } from '@/use/app/useToken'
import { useUserStore } from '@/store/modules/user'
import permConfig from '@/config/permission.config'
import { whiteListRoutes, LoginRoute, Exception403Route } from '../routes'
import { usePermission } from '@/use/app/usePermission'

NProgress.configure({ showSpinner: false })

// 是否开启路由守卫
const { enableRouterGuard } = permConfig
// -1直接不通过，0正常继续，1直接通过
let pass = 0

/**
 * 路由守卫设置
 * @param to
 * @param form
 */
// 开始
const progressStart = () => {
  if (!NProgress.isStarted()) {
    NProgress.start()
  }
  // 开启路由守卫正常执行，否则直接通过
  pass = enableRouterGuard ? 0 : 1
}

// 结束
const progressDone = () => {
  pass = 0
  NProgress.done()
}

// 重定向
const redirect = (to: RouteLocationPathRaw, from: RouteLocationNormalized) => {
  if (to.path === from.path) {
    return true
  }
  return to
}

// 是否白名单路由
function isWhiteRoute(route: RouteLocationNormalized) {
  return whiteListRoutes.some(whiteRoute => whiteRoute.path === route.path)
}
// 白名单
const whiteListGuard = (to: RouteLocationNormalized) => {
  if (isWhiteRoute(to)) {
    pass = 1
  }
}

// token
const loginGuard = (_to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const token = useToken().getToken()
  if (!token) {
    console.warn('登录已失效，请重新登录')
    return redirect({ path: LoginRoute.path }, from)
  }
}

// 账号信息
const userInfoGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  if (!userInfo) {
    try {
      await userStore.getUserInfo()
      return redirect({ path: to.fullPath, query: to.query, replace: true }, from)
    } catch (error) {
      console.warn('用户信息获取失败，请重新登录')
      return redirect({ path: LoginRoute.path }, from)
    }
  }
}

// 权限
const permissionGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (!usePermission().hasRoutePermission(to)) {
    console.warn(`抱歉，您无权访问页面: ${to.fullPath}，请联系管理员`)
    return redirect({ path: Exception403Route.path }, from)
  }
}

// 切面
const aop = (cb: Function) => {
  return function (to: RouteLocationNormalized, from: RouteLocationNormalized) {
    switch (pass) {
      // 直接不通过
      case -1:
        return false
      // 直接通过
      case 1:
        return true
      // 正常继续
      default:
        return cb(to, from)
    }
  }
}

// 守卫配置
const guards = {
  beforeEach: [progressStart, whiteListGuard, loginGuard, userInfoGuard, permissionGuard].map(aop),
  afterEach: [progressDone]
}

// 加载路由守卫
function loadGuards(guards) {
  const { beforeEach, afterEach } = guards
  beforeEach.forEach((guard: NavigationGuard) => {
    router.beforeEach(guard)
  })
  afterEach.forEach((guard: NavigationHookAfter) => {
    router.afterEach(guard)
  })
}

// 配置路由守卫
export function setupGuards() {
  loadGuards(guards)
}
