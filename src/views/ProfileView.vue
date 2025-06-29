<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const information = ref('')
const authStore = useAuthStore()

async function fetchData() {
  information.value = await sendRequest(
    'https://edu-api.21-school.ru/services/21-school/api/v1/participants/shootspi',
    authStore.authToken,
  )
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  {{ information }}
  <h1>
    Ник: {{ information.login }} Волна: {{ information.className }} Уровень: {{ information.level }}
  </h1>
</template>

<style scoped></style>
