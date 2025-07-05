<script setup lang="ts">
//TODO: ИСПРАВИТЬ В ЭТОМ ЭЛЕМЕНТЕ АНИМАЦИЮ И МЕРЦАНИЕ
import { ref, onMounted, watch } from 'vue'
import { sendRequest } from '@/api/api.ts'
import { useAuthStore } from '@/stores/authStore.ts'

const authStore = useAuthStore()

// Получаем props и сохраняем в переменную
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
watch(() => props.campusId, (newId) => {
  if (newId) fetchClusters()
})

onMounted(async () => {
  if(props.campusId){
    await fetchClusters()
  }

})

async function fetchClusters(): Promise<void> {
  const res = await sendRequest(
    `https://edu-api.21-school.ru/services/21-school/api/v1/campuses/${props.campusId}/clusters`,
    authStore.authToken,
  )
  clusters.value = res.clusters
}
</script>

<template>
  <div class="rounded shadow w-full mx-auto">
    <transition-group name="fade" tag="div" class="space-y-3" move-class="move">
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
    </transition-group>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Анимация перемещения */
.move {
  transition: transform 0.5s ease;
}
</style>
