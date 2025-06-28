<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getToken } from '@/api/getToken.ts'

const router = useRouter()

const login = ref<string>('')
const password = ref<string>('')

async function handleLogin() {
  try {
    const res = await getToken(login.value, password.value)
    console.log(res)
    await router.push('/');
  } catch (err) {
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
      <button
        class="bg-greenforbuttons-500 w-80 text-justwhite-500 font-bold text-lg rounded-xl h-11"
        @click="handleLogin"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped></style>
