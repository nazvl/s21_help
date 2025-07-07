<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { sendRequest } from '@/api/api.ts'
import LoaderComponent from '@/components/LoaderComponent.vue'

interface Props {
  username: string
  authToken: string
  autoFetch?: boolean
}

interface Skill {
  name: string
  points: number
}

interface Feedback {
  averageVerifierPunctuality: number
  averageVerifierInterest: number
  averageVerifierThoroughness: number
  averageVerifierFriendliness: number
}

interface Tribe {
  coalitionId: number
  name: string
  rank: number
}

const props = defineProps<Props>()
const skills = ref<Skill[] | null>(null)
const feedback = ref<Feedback | null>(null)
const today = ref(getFormattedDate())
const avgTime = ref<number>(0)
const tribe = ref<Tribe | null>(null)

function getFormattedDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  try {
    await Promise.all([fetchAvgTime(), fetchFeedback(), fetchSkills(), fetchTribe()])
  } catch (e) {
    console.error('Error fetching data:', e)
  }
})

async function fetchSkills() {
  const response = await sendRequest(
    `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/skills`,
    props.authToken,
  )
  skills.value = response.skills.sort((a: Skill, b: Skill) => b.points - a.points)
}

async function fetchAvgTime() {
  avgTime.value = await sendRequest(
    `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/logtime?date=${today.value}`,
    props.authToken,
  )
}

async function fetchFeedback() {
  feedback.value = await sendRequest(
    `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/feedback`,
    props.authToken,
  )
}

async function fetchTribe() {
  tribe.value = await sendRequest(
    `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${props.username}/coalition`,
    props.authToken,
  )
}
</script>

<template>
  <div class="text-lightgray-300 text-center">
    <p v-if="avgTime" class="text-lightgray-300 text-center border inline p-1 rounded">
      Weekly avg time: {{ avgTime }}
    </p>
    <h3 v-if="feedback" class="m-3">FeedBack:</h3>
    <div v-if="feedback" class="items-center flex flex-wrap mb-3 gap-3 justify-center">
      <div v-for="(value, key) in feedback" :key="key" class="border rounded p-1 w-40">
        <p class="">{{ key.toString().replace('averageVerifier', '') }}:</p>
        <p>{{ value }}</p>
      </div>
    </div>
    <div v-else>
      <LoaderComponent />
    </div>

    <div class="flex items-center justify-center">
      <!-- Блок с информацией о tribe -->
      <div v-if="tribe" class="my-3 p-3 border rounded w-82">
        <h3>Tribe Information:</h3>
        <div class="flex flex-col items-start">
          <p>Name: {{ tribe.name }}</p>
          <p>Rank: {{ tribe.rank }}</p>
        </div>
      </div>
      <div v-else>
        <LoaderComponent />
      </div>
    </div>
    <h3 v-if="skills" class="p-1 text-lightgray-300 text-center rounded">Skills:</h3>
    <div v-if="skills" class="flex flex-wrap gap-2 items-center justify-center">
      <div v-for="skill in skills" :key="skill.name" class="text-lightgray-500 flex">
        <div class="flex gap-1 p-1 rounded bg-greenforbuttons-500">
          <p>{{ skill.name }}:</p>
          <p>{{ skill.points }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <LoaderComponent />
    </div>
  </div>
</template>

<style scoped></style>
