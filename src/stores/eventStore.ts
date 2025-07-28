import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore.ts'

export const useEventStore = defineStore('events', () => {
  interface Event {
    id: number // Уникальный идентификатор события
    type?: string // Тип события: "Клуб", "Мероприятие", "Турнир" и т.д.
    name?: string // Название события
    description?: string | null // Описание события (может быть null)
    location?: string // Место проведения
    startDateTime?: string // Дата и время начала в формате ISO (UTC)
    endDateTime?: string // Дата и время окончания в формате ISO (UTC)
    organizers?: string[] | null // Список организаторов (может быть null или пустым)
    capacity?: number // Максимальное количество участников
    registerCount?: number // Количество зарегистрированных участников
  }

  const todayISO = ref('')
  const tomorrowISO = ref('')

  const authStore = useAuthStore()
  const events = ref<Event[] | null>(null)

  const addDays: number = 30
  const msPerDay: number = 86400000
  const loading = ref<boolean>(true)

  // Обновляет todayISO и tomorrowISO с временем 00:00:00
  function updateDates() {
    todayISO.value = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
    tomorrowISO.value = new Date(new Date().setHours(0, 0, 0, 0) + addDays * msPerDay).toISOString() //
  }

  // Загружает события с API
  async function handleCalendar() {
    try {
      updateDates()
      const response = await sendRequest(
        `https://edu-api.21-school.ru/services/21-school/api/v1/events?from=${todayISO.value}&to=${tomorrowISO.value}&limit=50&offset=0`,
        authStore.authToken,
      )
      events.value = response.events
      loading.value = false
      console.log(events.value)
    } catch (err) {
      console.error('Ошибка загрузки событий:', err)
    }
  }

  return {
    events,
    loading,
    todayISO,
    tomorrowISO,
    updateDates,
    handleCalendar
  }
})
