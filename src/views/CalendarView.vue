<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import HeaderText from '@/components/HeaderText.vue'
import { useEventStore } from '@/stores/eventStore.ts'

const eventStore = useEventStore()
const currentEvent = ref<number | null>(null)
const isMenuOpen = ref(true)
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
function formatDateTime(isoStart: string, isoEnd?: string): string {
  const start = new Date(isoStart)
  if (!isoEnd)
    return start.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

  const end = new Date(isoEnd)
  const sameDay = start.toDateString() === end.toDateString()

  return sameDay
    ? `${start.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} - ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    : `${start.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} - ${end.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`
}

const currentEventData = computed(
  () => eventStore.events?.find((e:Event) => e.id === currentEvent.value) ?? null,
)

function closeModal() {
  isMenuOpen.value = false
  currentEvent.value = null
}

function handleEventInfo(id: number) {
  currentEvent.value = id
  isMenuOpen.value = true
}

onMounted(() => {
  eventStore.handleCalendar()
})
</script>

<template>
  <HeaderText text="Calendar of Events"></HeaderText>
  <div v-if="eventStore.loading">
    <LoaderComponent />
  </div>
  <div v-else class="p-3">
    <div>
      <div v-for="event in eventStore.events" :key="event.id" class="p-4" @click="handleEventInfo(event.id)">
        <p class="text-sm text-lightgray-300">{{ event.location }}</p>
        <p class="text-base text-justwhite-500 font-bold">{{ event.name }} [{{ event.type }}]</p>
        <p class="text-sm text-lightgray-300">
          {{ formatDateTime(event.startDateTime || '', event.endDateTime) }}
        </p>
      </div>
    </div>
    <div v-if="isMenuOpen && currentEvent !== null">
      <!-- Фон затемнения -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <!-- Модальное окно -->
        <div class="bg-lightgray-500 rounded-lg shadow-lg p-4 max-w-md w-[90%] text-justwhite-500">
          <h2 class="text-xl font-semibold mb-2">
            {{ currentEventData?.name }} [{{ currentEventData?.type }}]
          </h2>
          <p class="text-sm mb-1"><strong>Место:</strong> {{ currentEventData?.location }}</p>
          <p class="text-sm mb-1">
            <strong>Время:</strong>
            {{
              formatDateTime(currentEventData?.startDateTime || '', currentEventData?.endDateTime)
            }}
          </p>
          <p class="text-sm mb-1" v-if="currentEventData?.description">
            <strong>Описание:</strong> {{ currentEventData.description }}
          </p>
          <p class="text-sm mb-1" v-if="currentEventData?.organizers?.length">
            <strong>Организаторы:</strong> {{ currentEventData.organizers.join(', ') }}
          </p>
          <p class="text-sm mb-4">
            <strong>Мест:</strong> {{ currentEventData?.registerCount }}/{{
              currentEventData?.capacity
            }}
          </p>
          <button
            @click="closeModal"
            class="mt-2 px-4 py-2 bg-greenforbuttons-500 text-white rounded"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
