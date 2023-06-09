<template>
  <div>{{ title }}</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: '404'
  }
})
const title = computed(() => props.status)
</script>

<style lang="less" scoped>
div {
  text-align: center;
  line-height: 5;
}
</style>
