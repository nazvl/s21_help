<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <h1 class="text-3xl text-justwhite-500 text-center my-4">{{ props.text }}</h1>
</template>

<style scoped></style>
