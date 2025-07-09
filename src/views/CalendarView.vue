<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import HeaderText from '@/components/HeaderText.vue'

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
const events = ref<Event[] | null>(null)
const loading = ref<boolean>(true)

// Форматирует ISO дату в удобочитаемую строку
function formatDateTime(isoStart: string, isoEnd?: string): string {
  const start = new Date(isoStart);
  if (!isoEnd) return start.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

  const end = new Date(isoEnd);
  const sameDay = start.toDateString() === end.toDateString();

  return sameDay
    ? `${start.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    : `${start.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}`;
}


const addDays: number = 30
const msPerDay: number = 86400000

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

onMounted(() => {
  handleCalendar()
})
</script>

<template>
  <HeaderText text="Calendar of Events"></HeaderText>
  <div v-if="loading">
    <LoaderComponent />
  </div>
  <div v-else class="p-3">
    <div>
      <div v-for="event in events" :key="event.id" class="p-4">
        <p class="text-sm text-lightgray-300">{{event.location}}</p>
        <p class="text-base text-justwhite-500 font-bold">{{event.name}} [{{event.type}}]</p>
        <p class="text-sm text-lightgray-300">{{formatDateTime(event.startDateTime, event.endDateTime)}}</p>
      </div>
    </div>
  </div>
</template>
