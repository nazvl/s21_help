<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'

export interface Event {
  id: number // Уникальный идентификатор события
  type: string // Тип события: "Клуб", "Мероприятие", "Турнир" и т.д.
  name: string // Название события
  description: string | null // Описание события (может быть null)
  location: string // Место проведения
  startDateTime: string // Дата и время начала в формате ISO (UTC)
  endDateTime: string // Дата и время окончания в формате ISO (UTC)
  organizers: string[] | null // Список организаторов (может быть null или пустым)
  capacity: number // Максимальное количество участников
  registerCount: number // Количество зарегистрированных участников
}

const todayISO = ref('')
const tomorrowISO = ref('')

const authStore = useAuthStore()
const calendar = ref<Event[] | null>(null)

// Форматирует ISO дату в удобочитаемую строку на русском
function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Обновляет todayISO и tomorrowISO с временем 00:00:00
function updateDates() {
  todayISO.value = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  tomorrowISO.value = new Date(new Date().setHours(0, 0, 0, 0) + 86400000).toISOString()
}

// Загружает события с API
async function handleCalendar() {
  try {
    updateDates()
    const response = await sendRequest(
      `https://edu-api.21-school.ru/services/21-school/api/v1/events?from=${todayISO.value}&to=${tomorrowISO.value}&limit=50&offset=0`,
      authStore.authToken,
    )
    calendar.value = response.events
  } catch (err) {
    console.error('Ошибка загрузки событий:', err)
  }
}

onMounted(() => {
  handleCalendar()
})
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <template v-if="calendar && calendar.length > 0">
      <div
        v-for="event in calendar"
        :key="event.id"
        class="bg-lightgray-500 p-1 rounded text-lightgray-300 flex flex-col gap-1"
      >
        <h3>{{ event.name }}</h3>
        <p>
          <span class="border border-gray-400 px-1 rounded">Тип</span>
          {{ event.type }}
        </p>
        <p>
          <span class="border border-blue-400 px-1 rounded">Описание</span>
          {{ event.description }}
        </p>
        <p>
          <span class="border border-rose-400 px-1 rounded">Место</span>
          {{ event.location }}
        </p>
        <p>
          <span class="border border-green-400 px-1 rounded">Дата начала</span>
          {{ formatDateTime(event.startDateTime) }}
        </p>
        <p>
          <span class="border border-red-400 px-1 rounded">Дата окончания</span>
          {{ formatDateTime(event.endDateTime) }}
        </p>
      </div>
    </template>
    <p v-else class="text-justwhite-500 text-center">Мероприятий не обнаружено :(</p>
  </div>
</template>


<style scoped></style>
