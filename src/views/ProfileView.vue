<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import avatarImage from '@/assets/noavatar.png'

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
  clusterId?: number,
  clusterName?: string,
  row?: string,
  number?: number,
}

const information = ref<ParticipantInfo | null>(null)
const points = ref<PointsInfo | null>(null)
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const username = ref<string>(authStore.username)
const place = ref<null | Place>(null)


async function fetchData() {
  try {
    loading.value = true;
    error.value = '';

    if (!username.value) {
      throw new Error('Имя пользователя не задано');
    }

    if (authStore.authToken) {
      const [info, pts, plc] = await Promise.all([
        sendRequest(`https://edu-api.21-school.ru/services/21-school/api/v1/participants/${username.value}`, authStore.authToken),
        sendRequest(`https://edu-api.21-school.ru/services/21-school/api/v1/participants/${username.value}/points`, authStore.authToken),
        sendRequest(`https://edu-api.21-school.ru/services/21-school/api/v1/participants/${username.value}/workstation`, authStore.authToken)

      ]);
      information.value = info;
      points.value = pts;
      if (!plc) {
        place.value = null;
      } else {
        place.value = plc;
      }
    } else {
      throw new Error('Токен авторизации отсутствует');
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch data';
    console.error('Error fetching participant data:', err);

    if (err instanceof Error && err.message.includes('авторизации')) {
      await authStore.logout();
      await router.push('/login');
    }
  } finally {
    loading.value = false;
  }
}


onMounted(async () => {
  await fetchData()
})

async function logout() {
  const button:boolean = true;

  await authStore.logout(button);
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col gap-12 py-5 px-2 items-center">
    <h1 class="text-3xl text-justwhite-500 text-center">Participant</h1>
    <img :src="avatarImage" class="rounded-full w-30 h-30" alt="avatar" />
    <div v-if="loading" class="text-lightgray-300 text-center">
      <p>Loading...</p>
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
        {{ place }}
      </p>
    </div>
    <button @click="logout" class="border rounded p-3 mt-3 bg-red-500 text-white">Logout</button>
  </div>
</template>

<style scoped></style>
