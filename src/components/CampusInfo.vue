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

  <div v-else class="rounded shadow w-full mx-auto flex flex-col gap-1">
    <div
      v-for="cluster in clusters"
      :key="cluster.id"
      class="flex justify-between items-center p-3 border border-gray-200 rounded"
    >
      <div class="font-medium text-justwhite-500">{{ cluster.name }}</div>
      <div class="text-sm text-lightgray-300">
        {{ cluster.availableCapacity }} / {{ cluster.capacity }}
      </div>
    </div>
  </div>

</template>
