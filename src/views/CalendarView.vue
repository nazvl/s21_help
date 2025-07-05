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
const loading = ref<boolean>(true)

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

const addDays:number = 30;
const msPerDay:number = 86400000;

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
    calendar.value = response.events
    loading.value = false
    console.log(calendar.value)
  } catch (err) {
    console.error('Ошибка загрузки событий:', err)
  }
}

onMounted(() => {
  handleCalendar()
})
</script>

<template>
  <h1 class="text-3xl text-justwhite-500 text-center mt-3">Event Calendar</h1>
  <div class="flex flex-col gap-3 p-3">
    <p v-if="loading" class="text-justwhite-500 text-center">Events loading...</p>
    <template v-else>
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
        <p v-if="event.description">
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
  </div>
</template>

<style scoped></style>
