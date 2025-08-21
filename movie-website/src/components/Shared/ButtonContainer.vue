<template>
  <div class="flex justify-center">
    <div>
      <button
        class="px-3.5 py-3.5 bg-teal-500 border-0 rounded-xl min-w-32 text-white cursor-pointer"
      >
        {{ title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['title'])
</script>
