import { createApp } from 'vue'

import { setupRouter } from './router'
import { setupGuards } from './router/guards'
import { setupStore } from './store'

import App from './App.vue'

// 启动加载
function bootloader() {
  const app = createApp(App)

  // 配置 router
  setupRouter(app)
  // 配置路由守卫
  setupGuards()
  // 配置 store
  setupStore(app)

  app.mount('#app')
}
bootloader()

// 输出应用信息
console.info(`App info: %c${JSON.stringify(__APP_INFO__, null, 2)}`, 'color: #67C23A')
