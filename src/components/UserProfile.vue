<script setup lang="ts">
import { onMounted, ref} from 'vue'
import avatarImage from '@/assets/noavatar.png'
import { sendRequest } from '@/api/api.ts'
import LoaderComponent from '@/components/LoaderComponent.vue'

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
        `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}`,
        props.authToken,
      ),
      sendRequest(
        `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/points`,
        props.authToken,
      ),
      sendRequest(
        `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/workstation`,
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

defineExpose({ fetchData }) // Позволяет вызвать fetchData из родительского компонента
</script>

<template>
  <div class="flex flex-col gap-12 py-5 px-2 items-center">
    <h1 class="text-3xl text-justwhite-500 text-center">Participant</h1>
    <img :src="avatarImage" class="rounded-full w-30 h-30" alt="avatar" />

    <div v-if="loading" class="text-lightgray-300 text-center">
      <LoaderComponent/>
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

    <div v-else-if="information" class="text-lightgray-300 text-center flex flex-col gap-3">
      <p class="border inline w-auto p-1 border-greenforbuttons-500 rounded-full">
        {{ information.login }}
      </p>
      <div class="flex w-full gap-2 items-center justify-center">
        <p class="bg-green-500 inline text-black rounded py-0.5 px-1">
          PRP: {{ points?.codeReviewPoints }}
        </p>
        <p class="bg-yellow-500 inline text-black rounded py-0.5 px-1">
          Coins: {{ points?.coins }}
        </p>
      </div>
      <p>{{ information.className }}</p>
      <p>
        Level: {{ information.level }} [Опыт: {{ information.expValue }} /
        {{ information.expValue + information.expToNextLevel }}]
      </p>
      <p v-if="place">
        Место: {{ place.clusterName }} - {{ place.row }}{{ place.number }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
