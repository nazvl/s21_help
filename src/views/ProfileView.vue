<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import HeaderText from '@/components/HeaderText.vue'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout(true)
  router.push('/')
}

</script>

<template>
  <HeaderText text="Participiant" class="mb-4"></HeaderText>
  <div class="w-full p-3">
    <UserProfile
      :username="authStore.username"
      :authToken="authStore.authToken"
      :auto-fetch="true"
    />
    <div class="text-center">
      <button @click="logout" class="rounded-3xl h-12 mt-15 w-full bg-greenforbuttons-500 text-white">Exit</button>
    </div>
  </div>

</template>
