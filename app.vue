<template>
  <div>
    <NuxtLoadingIndicator color="#3b82f6" :height="3" />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'id'
  }
})
</script>
