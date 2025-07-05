<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
// import { sendRequest } from './api/api.ts'

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.getDataFromDb()
  // console.log(await sendRequest(`https://edu-api.21-school.ru/services/21-school/api/v1/campuses`, authStore.authToken))
})
</script>

<template>
  <div class="pb-24">
    <RouterView />
  </div>
  <NavigationBar v-if="route.path !== '/login'" />
</template>

<style scoped></style>
