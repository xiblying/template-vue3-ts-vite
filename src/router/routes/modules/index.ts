const routes = {
  path: '/index',
  name: 'index',
  component: () => import('@/views/Hello.vue'),
  meta: {
    title: '首页'
  },
  children: []
}

export default routes
