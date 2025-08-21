<script setup lang="ts">
import TheHeader from './components/Shared/TheHeader.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="h-15"><TheHeader /></div>
    <div class="flex-1"><RouterView /></div>
  </div>
</template>

<style scoped></style>
