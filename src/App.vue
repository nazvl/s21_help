<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.getDataFromDb()
})
</script>

<template>
  <div class="pb-24">
    <RouterView />
  </div>
  <NavigationBar v-if="route.path !== '/login'" />
</template>

<style scoped></style>
