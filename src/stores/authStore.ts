import { defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { getToken } from '@/api/getToken.ts'
import { getItem, removeItem, setItem } from '@/stores/idb.ts'
import { useRouter } from 'vue-router'

interface User {
  access_token?: string
  refresh_token?: string
  token_type?: string
  expires_in?: number // в секундах
  expiresAt?: number // timestamp в миллисекундах
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null

export const useAuthStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref<User>({})
  const username = ref<string>('')
  const isLoggedIn = ref<boolean>(false)
  const authToken = computed(() => user.value.access_token || '')

  async function logout(clearSavedCreds?: boolean) {
    user.value = {}
    isLoggedIn.value = false
    username.value = ''
    if (logoutTimer) {
      clearTimeout(logoutTimer)
      logoutTimer = null
    }
    await removeItem('user')
    await removeItem('username')
    await removeItem('expiresAt')
    if (clearSavedCreds) {
      await removeItem('savedLogin')
      await removeItem('savedPassword')
    }
  }

  async function getDataFromDb() {
    try {
      const storedUser = await getItem<User>('user')
      const storedUsername = await getItem<string>('username')
      const storedExpiresAt = await getItem<number>('expiresAt')

      if (storedUser && storedUser.access_token && storedExpiresAt) {
        user.value = storedUser
        user.value.expiresAt = storedExpiresAt
        isLoggedIn.value = true

        const timeLeftMs = storedExpiresAt - Date.now()
        if (timeLeftMs > 0) {
          scheduleAutoLogout(timeLeftMs)
        } else {
          await logout(true)
        }
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
      const tokenData = await getToken(login, password)
      user.value = tokenData
      username.value = login || ''
      isLoggedIn.value = true
      if (tokenData.expires_in) {
        // Здесь один раз переводим expires_in из секунд в миллисекунды
        const expiresInMs = tokenData.expires_in * 1000
        user.value.expiresAt = Date.now() + expiresInMs
        await setItem('expiresAt', user.value.expiresAt)

        // Запускаем таймер один раз с готовым значением в миллисекундах
        scheduleAutoLogout(expiresInMs)
      } else {
        // Если expires_in нет — таймер не ставим
        scheduleAutoLogout(0)
      }

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

  async function saveData(login: string, password: string) {
    await setItem('savedLogin', login)
    await setItem('savedPassword', password)
    console.log('Data saved for:', login)
  }

  function scheduleAutoLogout(timeoutMs: number) {
    if (logoutTimer) clearTimeout(logoutTimer)

    if (timeoutMs > 0) {
      logoutTimer = setTimeout(async () => {
        console.warn('Token expired — logging out automatically')

        try {
          const savedLogin = await getItem<string>('savedLogin')
          const savedPassword = await getItem<string>('savedPassword')

          if (savedLogin && savedPassword) {
            console.log('Re-logging in with saved credentials...')
            await login(savedLogin, savedPassword)
          } else {
            await logout()
            router.push('/login') // теперь router определён
          }
        } catch (e) {
          console.error('Auto-login error:', e)
          await logout()
          router.push('/login')
        }
      }, timeoutMs)
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
