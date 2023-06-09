/*
 * @Author: LiuTao
 * @Date: 2023-05-15 16:21:47
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-05-30 17:09:18
 * @Description: 获取应用数据
 */

// 应用信息
const appInfo = __APP_INFO__
// 环境变量
const env = { ...import.meta.env }

// use
export function useApp() {
  return {
    ...appInfo,
    env
  }
}
