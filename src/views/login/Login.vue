<template>
  <div>
    <form @submit.prevent="login">
      <div>
        <label>账号</label>
        <input type="text" v-model="formData.username" />
      </div>
      <div>
        <label>密码</label>
        <input type="password" v-model="formData.password" />
      </div>
      <div>
        <button type="submit">登录</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { RootRoute } from '@/router/routes'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const formData = ref({
  username: '',
  password: ''
})

const login = () => {
  const value = formData.value
  userStore
    .login({
      username: value.username,
      password: value.password
    })
    .then(() => {
      router.push({ name: RootRoute.name, query: route.query })
    })
}
</script>

<style lang="less" scoped>
div {
  text-align: center;
  line-height: 5;
}
</style>
