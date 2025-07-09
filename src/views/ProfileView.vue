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
  <UserProfile
      :username="authStore.username"
      :authToken="authStore.authToken"
      :auto-fetch="true"
  />
  <div class="text-center">
    <button @click="logout" class="border rounded p-3 mt-3 bg-red-500 text-white">Logout</button>
  </div>
</template>
