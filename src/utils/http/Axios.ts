/*
 * @Author: LiuTao
 * @Date: 2023-05-29 12:53:37
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-08 17:01:38
 * @Description: ...
 */
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { isBlob } from '../is'
import { useToken } from '@/hooks/app/useToken'

const { getToken } = useToken()

// 自定义Axios
class Axios {
  // axios实例
  private instance: AxiosInstance

  // 构造器
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.init()
  }

  // 初始化
  private init() {
    // 添加请求拦截器
    this.instance.interceptors.request.use(this.onRequest, this.onError)
    // 添加响应拦截器
    this.instance.interceptors.response.use(this.onResponse, this.onError)
  }

  // 请求拦截
  private onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    config.headers['TOKEN'] = getToken()
    return config
  }

  // 响应拦截
  private onResponse(response: AxiosResponse): Promise<any> {
    let data = response.data
    // Blob类型数据
    if (isBlob(data)) {
      data = {
        success: true,
        data,
        // 解析文件名
        name: decodeURIComponent(response.headers['content-disposition']?.split('filename=')[1] || '未命名')
      }
    }
    data.message = data.message || data.msg || (data.success ? '请求成功' : '请求失败')
    return data.success ? Promise.resolve(data) : this.onError(new Error(data.message))
  }

  // 错误拦截
  private onError(error: AxiosError | Error): Promise<Error> {
    const { message } = error
    let errMessage = message
    if (axios.isCancel(error)) {
      errMessage = '请求取消'
    } else {
      if (message.includes('Network Error')) {
        errMessage = '网络连接错误'
      } else if (message.includes('timeout')) {
        errMessage = '请求超时'
      }
    }
    return Promise.reject(new Error(errMessage))
  }

  // 请求
  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }
}

export default Axios
