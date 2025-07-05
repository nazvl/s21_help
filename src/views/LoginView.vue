<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const login = ref('')
const password = ref('')
const error = ref('')

const isSaveData = ref<boolean>(false)

async function handleLogin() {
  try {
    const res = await authStore.login(login.value.toLowerCase(), password.value)
    if (res) {
      // Проверяем есть ли redirect параметр
      const redirect = router.currentRoute.value.query.redirect as string
      if (isSaveData.value) {
        await authStore.saveData(login.value, password.value)
      }
      await router.push(redirect || '/')
    } else {
      error.value = 'Токен не получен'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    console.log(err)
  }
}
</script>

<template>
  <div class="flex flex-col gap-40 items-center w-full">
    <h1 class="mt-4 text-justwhite-500 text-xl">School21</h1>
    <div class="flex items-center flex-col gap-6 text-2xl w-full">
      <input
        class="border rounded bg-lightgray-500 h-12 text-lg text-lightgray-300 p-2 w-80"
        type="text"
        placeholder="Username"
        v-model="login"
      />
      <input
        class="border rounded bg-lightgray-500 h-12 text-lg text-lightgray-300 p-2 w-80"
        type="password"
        name="password"
        id="password-input"
        placeholder="Password"
        v-model="password"
      />
      <label for="isNeedSave" class="text-xs flex gap-2 text-lightgray-300">
        <input type="checkbox" id="isNeedSave" v-model="isSaveData" />
        Save Password <span class="text-red-400">(Unsafe)</span>
      </label>

      <button
        class="bg-greenforbuttons-500 w-80 text-justwhite-500 font-bold text-lg rounded-xl h-11 transition active:bg-darkgreen-800"
        @click="handleLogin"
      >
        Login
      </button>

      <p v-if="error != ''" class="bg-red-400 rounded px-3">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped></style>
