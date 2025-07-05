<script setup lang="ts">
import { onMounted, ref} from 'vue'
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import CampusInfo from '@/components/CampusInfo.vue'

const authStore = useAuthStore()
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

interface Campus {
  id: string
  shortName: string
  fullName: string
}

const campusId = ref<string>('') // хранит ID кампуса пользователя
const choosenCampus: ref<string> = ref(campusId)
const campuses = ref<Campus[]>([])

onMounted(async () => {
  await fetchLocalCampus()
  await fetchCampuses()
})

async function fetchCampuses() {
  try {
    const res = await sendRequest(
      `https://edu-api.21-school.ru/services/21-school/api/v1/campuses`,
      authStore.authToken,
    )
    campuses.value = res.campuses.filter(
      (c: Campus) =>
        !c.shortName.includes('QA') &&
        !c.shortName.includes('Test') &&
        !c.shortName.includes('online'),
    )
  } catch (err) {
    error.value = String(err)
    console.error('Ошибка при получении кампусов:', err)
  } finally {
    loading.value = false
  }
}

async function fetchLocalCampus() {
    const res = await sendRequest(`https://edu-api.21-school.ru/services/21-school/api/v1/participants/${authStore.username}`, authStore.authToken);
    campusId.value = res.campus.id;
}
</script>

<template>
  <h1 class="text-white text-4xl text-center my-5">Welcome</h1>
  <div v-if="loading" class="text-center text-lightgray-300">Loading data...</div>
  <div v-else class="flex gap-5 flex-wrap p-5">
    <div class="w-full">  <CampusInfo :campusId="choosenCampus" /></div>
    <div
      v-for="campus in campuses"
      :key="campus.id"
      class="p-5 border text-center border-greenforbuttons-500 rounded"
      :class="{'border-red-500': campus.id == campusId}"
    >
      <button class="text-lightgray-300" @click="choosenCampus = campus.id">
        {{ campus.shortName }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
