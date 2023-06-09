/*
 * @Author: LiuTao
 * @Date: 2023-05-26 09:36:49
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-05-30 08:41:06
 * @Description: Mocker
 */
import type { MockMethod } from 'vite-plugin-mock'
import { isFunction } from 'lodash-es'

// 统一处理Mock的中间层
class Mocker {
  // 基础路径
  BASE_URL = '/api'
  // 成功默认返回
  SUCCESS_RESPONSE = {
    code: 0,
    success: true,
    data: null,
    message: 'ok'
  }
  // 失败默认返回
  FAILURE_RESPONSE = {
    code: 1,
    success: false,
    message: 'error'
  }

  // 成功
  success(data: any) {
    return {
      ...this.SUCCESS_RESPONSE,
      data
    }
  }

  // 失败
  failure(message: any) {
    return {
      ...this.FAILURE_RESPONSE,
      message
    }
  }

  // 处理mocks
  use(mocks: MockMethod[]) {
    mocks.forEach(mock => {
      // 统一添加前缀
      mock.url = this.BASE_URL + mock.url
      // 统一处理返回结果
      const _response = mock.response
      mock.response = (...args) => {
        try {
          const data = isFunction(_response) ? _response(...args) : _response
          return this.success(data)
        } catch (error) {
          return this.failure((error as Error).message)
        }
      }
    })
    return mocks
  }
}

export default new Mocker()
