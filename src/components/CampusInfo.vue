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
  capacity: number
  availableCapacity: number
  floor: number
}

const clusters = ref<Cluster[] | null>(null)
const isLoading = ref(false)

watch(() => props.campusId, (newId) => {
  if (newId) fetchClusters()
})

onMounted(async () => {
  if(props.campusId) {
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
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center py-8">
    <Loader/>
  </div>

  <div v-else class="w-full flex flex-wrap gap-2">
    <div
        v-for="cluster in clusters"
        :key="cluster.id"
        class="border border-b-lightgray-900 rounded-md p-6 bg-[#293830] grow min-w-[40%] gap-2"
    >
      <div class="font-bold text-xl text-justwhite-500">{{ cluster.name }}</div>
      <div class="text-xs font-semibold text-lightgray-300">
        {{ cluster.availableCapacity }} / {{ cluster.capacity }}
      </div>
    </div>
  </div>

</template>
