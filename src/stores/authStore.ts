import { defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { getToken } from '@/api/getToken.ts'
import { getItem, removeItem, setItem } from '@/stores/idb.ts'

interface User {
  access_token?: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  expiresAt?: number  // метка времени окончания действия токена (timestamp в мс)
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

        // Рассчитываем оставшееся время действия токена
        const timeLeft = storedExpiresAt - Date.now()
        if (timeLeft > 0) {
          scheduleAutoLogout(timeLeft)
        } else {
          // Токен истёк — делаем logout
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

      // Устанавливаем expiresAt — время текущего момента + expires_in (в миллисекундах)
      if (tokenData.expires_in) {
        user.value.expiresAt = Date.now() + tokenData.expires_in * 1000
        await setItem('expiresAt', user.value.expiresAt)
      }

      await setItem('user', toRaw(user.value))
      await setItem('username', username.value)

      // Запускаем таймер на expires_in
      scheduleAutoLogout(tokenData.expires_in ? tokenData.expires_in * 1000 : 0)

      console.log(user.value)
      console.log(username.value)
      return user.value
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function saveData(login: string, password: string) {
    // ⚠️ хранение пароля в открытом виде — рискованно
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
          }
        } catch (e) {
          console.error('Auto-login error:', e)
          await logout()
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
