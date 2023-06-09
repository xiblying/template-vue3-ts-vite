<template>
  <div>菜单：{{ menu }}</div>
  <div>Hello Vue3 + Ts + Vite</div>
</template>

<script lang="ts" setup>
import { usePermissionStore } from '@/store/modules/permission'

const menu = usePermissionStore().menu
</script>

<style lang="less" scoped>
div {
  text-align: center;
  line-height: 5;
}
</style>
