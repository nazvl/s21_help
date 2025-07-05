import { defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { getToken } from '@/api/getToken.ts'
import { getItem, removeItem, setItem } from '@/stores/idb.ts'

interface User {
  access_token?: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null

export const useAuthStore = defineStore('user', () => {
  const user = ref<User>({})
  const username = ref<string>('')
  const isLoggedIn = ref<boolean>(false)
  const authToken = computed(() => user.value.access_token || '')

  async function logout(clearSavedCreds?: boolean) {
    user.value = {}
    isLoggedIn.value = false
    username.value = ''
    await removeItem('user')
    await removeItem('username')
    if (clearSavedCreds) {
      await removeItem('savedLogin')
      await removeItem('savedPassword')
    }
    if (logoutTimer) {
      clearTimeout(logoutTimer)
      logoutTimer = null
    }
  }

  async function getDataFromDb() {
    try {
      const storedUser = await getItem<User>('user')
      const storedUsername = await getItem<string>('username')

      if (storedUser && storedUser.access_token) {
        user.value = storedUser
        isLoggedIn.value = true
      }
      if (storedUsername) {
        username.value = storedUsername
      }
    } catch (error) {
      console.error('Error loading data from IndexedDB:', error)
    }
  }

  async function login(login: string, password: string) {
    try {
      user.value = await getToken(login, password)
      username.value = login || ''
      isLoggedIn.value = true
      await setItem('user', toRaw(user.value))
      await setItem('username', username.value)
      scheduleAutoLogout()
      console.log(user.value)
      console.log(username.value)
      return user.value
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function saveData(login: string, password: string) {
    await setItem('savedLogin', login)
    await setItem('savedPassword', password)
    console.log('Data saved for:', login)
  }

  async function scheduleAutoLogout() {
    if (user.value.expires_in) {
      if (logoutTimer) clearTimeout(logoutTimer)

      logoutTimer = setTimeout(async () => {
        console.warn('Token expired — logging out automatically')

        // Пробуем авто-логин, если сохранены логин/пароль
        const savedLogin = await getItem<string>('savedLogin')
        const savedPassword = await getItem<string>('savedPassword')

        if (savedLogin && savedPassword) {
          console.log('Re-logging in with saved credentials...')
          await login(savedLogin, savedPassword)
        } else {
          await logout()
        }
      }, user.value.expires_in * 1000)
    }
  }

  return {
    user,
    username,
    isLoggedIn,
    login,
    logout,
    authToken,
    saveData,
    getDataFromDb,
  }
})
