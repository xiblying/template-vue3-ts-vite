<script setup lang="ts">
import { useTitle } from '@/use/web/useTitle'

useTitle()
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
