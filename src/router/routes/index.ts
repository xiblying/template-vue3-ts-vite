import type { RouteRecordRaw } from 'vue-router'

// 异步路由
export const asyncRoutes = (() => {
  const routeModuleList: RouteRecordRaw[] = []
  // 直接引入modules下所有的模块
  const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
  // 加入到路由集合中
  Object.keys(modules).forEach(key => {
    const mod = (modules[key] as { [key: string]: RouteRecordRaw | RouteRecordRaw[] }).default
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routeModuleList.push(...modList)
  })
  return routeModuleList
})()

// 根路由
export const RootRoute = {
  path: '/',
  name: 'Root',
  component: () => import('@/views/redirect/Redirect.tsx'),
  meta: {
    title: 'Root',
    authority: '*'
  }
}

// 登录
export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/Login.vue'),
  meta: {
    title: '登录'
  }
}

// 异常页面
const ExceptionComponent = () => import('@/views/exception/Exception.vue')

// 403
export const Exception403Route = {
  path: '/403',
  name: '403',
  component: ExceptionComponent,
  props: {
    status: '403'
  },
  meta: {
    title: '403'
  }
}

// 404
export const Exception404Route = {
  path: '/:path(.*)*',
  name: '404',
  component: ExceptionComponent,
  meta: {
    title: '404',
    authority: '*'
  }
}

// 500
export const Exception500Route = {
  path: '/500',
  name: '500',
  component: ExceptionComponent,
  props: {
    status: '500'
  },
  meta: {
    title: '500'
  }
}

// 基础路由
export const basicRoutes = [RootRoute, LoginRoute, Exception403Route, Exception500Route, Exception404Route]

// 白名单
export const whiteListRoutes = [LoginRoute, Exception403Route, Exception500Route]
