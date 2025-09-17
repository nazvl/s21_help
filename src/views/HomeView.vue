<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiLink, sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import CampusInfo from '@/components/CampusInfo.vue'
import Loader from '@/components/LoaderComponent.vue'
import HeaderText from '@/components/HeaderText.vue'

const authStore = useAuthStore()
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

interface Campus {
  id: string
  shortName: string
  fullName: string
}

const campusId = ref<string>('') // хранит ID кампуса пользователя и при изменении
const campuses = ref<Campus[]>([])

onMounted(async () => {
  await fetchLocalCampus()
  await fetchCampuses()
})

async function fetchCampuses() {
  try {
    const res = await sendRequest(
      `${apiLink}/services/21-school/api/v1/campuses`,
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
  const res = await sendRequest(
    `${apiLink}/services/21-school/api/v1/participants/${authStore.username}`,
    authStore.authToken,
  )
  campusId.value = res.campus.id
}
</script>

<template>
  <HeaderText text="Campuses"></HeaderText>
  <div v-if="loading" class="">
    <Loader />
  </div>
  <div v-else class="flex gap-5 flex-wrap p-5">
    <div class="w-full">
      <h2 class="w-full h-auto font-bold text-justwhite-500 text-2xl pb-2">
        {{ campuses.find((c) => c.id == campusId)?.shortName }}
      </h2>
      <CampusInfo :campusId="campusId" />
    </div>
    <div class="w-full">
      <div
        v-for="campus in campuses"
        :key="campus.id"
        class="w-full font-serif 0 py-4 px-1 text-sm flex flex-row items-start justify-between text-lightgray-300"
      >
        <button
          @click="campusId = campus.id"
          :class="{ 'text-greenforbuttons-500': campus.id == campusId }"
        >
          {{ campus.shortName }}
        </button>
        <p class="font-bold text-lightgray-300"> > </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
