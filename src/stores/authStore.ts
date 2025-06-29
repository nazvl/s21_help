import { defineStore } from 'pinia'
import { ref, toRaw, computed } from 'vue'
import { getToken } from '@/api/getToken.ts'
import { setItem } from '@/stores/idb.ts'

export const useAuthStore = defineStore('user', () => {
  const user = ref({})
  const username = ref<string>('')
  const isLoggedIn = ref<boolean>(false)
  const authToken = computed(() => user.value.access_token as string)

  function logout() {
    user.value = {}
    isLoggedIn.value = false // добавить таймер деавторизации
    username.value = ''
  }

  async function login(login: string, password: string) {
    try {
      user.value = await getToken(login, password)
      username.value = login || ''
      isLoggedIn.value = true
      await setItem('user', toRaw(user.value))
      await setItem('username', username.value)
      console.log(user.value)
      console.log(username.value)
      return user.value
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // async function validatePassword(password: string) {
  //   // Логика валидации пароля
  // }

  return {
    user,
    username,
    isLoggedIn,
    login,
    logout,
    authToken,
    // validatePassword,
  }
})
