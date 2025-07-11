import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CalendarView from '@/views/CalendarView.vue'
import ProjectView from '@/views/ProjectView.vue'
import { useAuthStore } from '@/stores/authStore'
import FindUserView from '@/views/FindUserView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectView,
    },
    {
      path: '/find',
      name: 'find',
      component: FindUserView,
    }
  ],
})

// Флаг для отслеживания инициализации
let isInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Инициализируем данные из IndexedDB только один раз
  if (!isInitialized) {
    await authStore.getDataFromDb()
    isInitialized = true
  }

  // Если пользователь не авторизован и пытается зайти не на логин - редиректим на логин
  if (!authStore.isLoggedIn && to.name !== 'login') {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    // Если пользователь авторизован и пытается зайти на логин, редиректим на главную
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
