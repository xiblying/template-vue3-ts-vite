/*
 * @Author: LiuTao
 * @Date: 2023-05-25 17:05:33
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-05-25 17:05:38
 * @Description: ...
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
