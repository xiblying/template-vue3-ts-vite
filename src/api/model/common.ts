/*
 * @Author: LiuTao
 * @Date: 2023-06-01 09:58:44
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-01 10:39:06
 * @Description: ...
 */

// 接口返回格式
export interface ApiResult<T = any> {
  code: number
  success: boolean
  data: T
  message: string
}
