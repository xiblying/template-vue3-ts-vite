import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { Exception403Route } from '@/router/routes'

export default {
  setup() {
    const { query } = useRoute()
    // 重定向优先级依次是：query参数的redirect路径、菜单第一子项、403
    const redirect =
      (query.redirect as string) || usePermissionStore().getFirstSubmenu()?.path || Exception403Route.path

    useRouter().replace({ path: redirect })
  },
  render() {}
}
