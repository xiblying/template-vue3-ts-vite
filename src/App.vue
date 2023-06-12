<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@/hooks/web/useTitle'

useTitle()
</script>
