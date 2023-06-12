/*
 * @Author: LiuTao
 * @Date: 2023-05-29 12:53:37
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-05-30 10:44:41
 * @Description: ...
 */
import { isObject, isArray } from 'lodash-es'
import Axios from './Axios'
import { useApp } from '@/hooks/app/useApp'

export default new Axios({
  // API地址默认前缀
  baseURL: useApp().env.VITE_API_BASE_URL,
  // 自定义请求头
  headers: { 'Content-Type': 'application/json' },
  // 自定义路径参数序列化方式
  paramsSerializer: params => {
    return Object.keys(params)
      .map(key => {
        const param = params[key]
        if (param === null || param === undefined) return
        if (isObject(param) || isArray(param)) {
          return `${key}=${encodeURIComponent(JSON.stringify(param))}`
        } else {
          return `${key}=${param}`
        }
      })
      .filter(str => str)
      .join('&')
  },
  // 超时时间
  timeout: 100 * 1000
})
