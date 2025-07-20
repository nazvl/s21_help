<script setup lang="ts">
import { useRouter } from 'vue-router'


const router = useRouter()

function goBack() {
  router.back() // аналог window.history.back()
}
</script>

<template>
  <button @click="goBack" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
    ⬅ Назад
  </button>

</template>

