import { watch } from 'vue'
import { useTitle as usePageTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useApp } from '../app/useApp'

/**
 * 监听路径变化更新页面title
 */
export function useTitle() {
  const { name } = useApp()
  const route = useRoute()
  const pageTitle = usePageTitle()

  watch(
    () => route.path,
    () => {
      const title = route.meta.title
      pageTitle.value = title ? `${title} - ${name}` : `${name}`
    },
    { immediate: true }
  )
}
