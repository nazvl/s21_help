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
