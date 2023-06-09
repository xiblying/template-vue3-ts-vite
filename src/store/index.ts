import type { App } from 'vue'
import { createPinia } from 'pinia'

const store = createPinia()

// 配置全局状态
export function setupStore(app: App<Element>) {
  app.use(store)
}
