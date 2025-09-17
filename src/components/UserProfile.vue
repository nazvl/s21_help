<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import avatarImage from '@/assets/noavatar.png'
import { sendRequest } from '@/api/api.ts'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { apiLink } from '@/api/api.ts'

interface Props {
  username: string
  authToken: string
  autoFetch?: boolean
}

interface ParticipantInfo {
  login: string
  className: string
  level: number
  expValue: number
  expToNextLevel: number
  campus: {
    shortName: string
  }
}

interface PointsInfo {
  peerReviewPoints: number
  codeReviewPoints: number
  coins: number
}

interface Place {
  clusterId?: number
  clusterName?: string
  row?: string
  number?: number
}

const props = defineProps<Props>()

const information = ref<ParticipantInfo | null>(null)
const points = ref<PointsInfo | null>(null)
const place = ref<Place | null>(null)
const loading = ref(true)
const error = ref<string>('')

async function fetchData() {
  try {
    loading.value = true
    error.value = ''

    if (!props.username || !props.authToken) {
      throw new Error('Имя пользователя или токен не заданы')
    }

    const [info, pts, plc] = await Promise.all([
      sendRequest(
        `${apiLink}/services/21-school/api/v1/participants/${props.username}`,
        props.authToken,
      ),
      sendRequest(
        `${apiLink}/services/21-school/api/v1/participants/${props.username}/points`,
        props.authToken,
      ),
      sendRequest(
        `${apiLink}/services/21-school/api/v1/participants/${props.username}/workstation`,
        props.authToken,
      ),
    ])

    information.value = info
    points.value = pts
    place.value = plc || null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
    console.error('Ошибка загрузки данных участника:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.autoFetch) {
    fetchData()
  }
})

const expPercentage = computed(() => {
  if (!information.value) return '0%' // проверка, что information существует

  const current = information.value.expValue
  const toNext = information.value.expToNextLevel
  const total = current + toNext

  if (total > 0) {
    const percent = (current / total) * 100
    return `${percent.toFixed(2)}%`
  }

  return '0%'
})

defineExpose({ fetchData }) // Позволяет вызвать fetchData из родительского компонента
</script>

<template>
  <div class="flex flex-col gap-4 py-5 px-2 items-center w-full mx-auto">
    <img :src="avatarImage" class="rounded-full w-30 h-30" alt="avatar" />

    <div v-if="loading" class="text-lightgray-300 text-center">
      <LoaderComponent />
    </div>

    <div v-else-if="error" class="text-red-400 text-center">
      <p>Error: {{ error }}</p>
      <button
        @click="fetchData"
        class="mt-2 px-4 py-2 bg-greenforbuttons-500 rounded text-justwhite-500"
      >
        Повторить
      </button>
    </div>

    <div v-else-if="information" class="text-lightgray-300 text-center w-full flex flex-col gap-3 p-3">
      <div class="flex flex-col gap-10 w-full">
        <div>
          <p class="text-xl text-justwhite-500 font-bold text-center">{{ information.login }}</p>
          <p class="text-sm">{{ information.className }}</p>
        </div>
        <div>
          <p>PRP: {{ points?.peerReviewPoints }}</p>
          <p>Coins: {{ points?.coins }}</p>
          <p v-if="place">
            {{ place.clusterName }}, Row: {{ place.row }}, Place: {{ place.number }}
          </p>
        </div>
        <div class="w-full flex flex-col gap-6" >
          <h2 class="font-bold text-xl text-justwhite-500">Level: {{ information.level }}</h2>
          <div class="flex justify-between w-full">
            <p>Experience:</p>
            <p>
              {{ information.expValue }} / {{ information.expValue + information.expToNextLevel }}
            </p>
          </div>
          <!-- Прогресс-бар по опыту -->
          <div class="w-full h-2 bg-gray-700 rounded mt-1">
            <div
              class="h-full bg-justwhite-500 rounded transition-all duration-300"
              :style="{ width: expPercentage }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
