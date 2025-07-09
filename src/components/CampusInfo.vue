<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import Loader from '@/components/LoaderComponent.vue'

const authStore = useAuthStore()

const props = defineProps<{
  campusId: string
}>()

interface Cluster {
  id: number
  name: string
  capacity?: number // вместимость
  availableCapacity?: number
  floor?: number
}

interface ClusterMap {
  row: string
  number: number
  login: string
}

const clusters = ref<Cluster[] | null>(null)
const isLoading = ref(false)
const isMapOpen = ref(false)
const choosenCluster = ref<Cluster | null>(null)

watch(
  () => props.campusId,
  (newId) => {
    if (newId) fetchClusters()
  },
)

const clusterMap = ref<ClusterMap[] | null>(null)

onMounted(async () => {
  if (props.campusId) {
    await fetchClusters()
  }
})

async function fetchClusters(): Promise<void> {
  try {
    isLoading.value = true
    const res = await sendRequest(
      `https://edu-api.21-school.ru/services/21-school/api/v1/campuses/${props.campusId}/clusters`,
      authStore.authToken,
    )
    clusters.value = res.clusters
  } catch (error) {
    console.error('Error fetching clusters:', error)
    clusters.value = null
  } finally {
    isLoading.value = false
  }
}

async function fetchMap(choosenClusterId: number) {
  choosenCluster.value = clusters.value?.find((cluster) => cluster.id === choosenClusterId) || null
  try {
    const res = await sendRequest(
      `https://edu-api.21-school.ru/services/21-school/api/v1/clusters/${choosenClusterId}/map?limit=50&offset=0&occupied=true`,
      authStore.authToken,
    )
    clusterMap.value = res.clusterMap
    console.log(clusterMap.value)
  } catch (error) {
    console.error('Error fetching map:', error)
    clusterMap.value = null
  } finally {
    isMapOpen.value = true
  }
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center py-8">
    <Loader />
  </div>

  <div v-else class="w-full flex flex-wrap gap-2">
    <div
      v-for="cluster in clusters"
      :key="cluster.id"
      class="border border-b-lightgray-900 rounded-md p-6 bg-[#293830] grow min-w-[40%] gap-2"
      @click="fetchMap(cluster.id)"
    >
      <div class="font-bold text-xl text-justwhite-500">{{ cluster.name }}</div>
      <div class="text-xs font-semibold text-lightgray-300">
        {{ cluster.availableCapacity }} / {{ cluster.capacity }}
      </div>
    </div>
  </div>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-xl" v-if="isMapOpen">
    <div
      class="w-full p-3 mb-15 flex flex-col gap-1 text-white bg-lightgray-500 mx-3 rounded max-h-[80vh] overflow-y-auto"
    >
      <h2 class="text-xl text-justwhite-500 font-semibold">
        {{ choosenCluster?.name || 'Нет выбранного кластера' }}
      </h2>
      <h2 class="text-2xl font-semibold"></h2>
      <div v-for="user in clusterMap" :key="user.login" class="text-lightgray-300">
        {{ user.login }} [{{ user.row + user.number }}]
      </div>
      <button class="bg-greenforbuttons-500 h-12 rounded-2xl mt-8" @click="isMapOpen = false">
        Close
      </button>
    </div>
  </div>
</template>
