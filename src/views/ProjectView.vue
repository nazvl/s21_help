<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import Loader from '@/components/LoaderComponent.vue'
const authStore = useAuthStore()
const username = ref<string>(authStore.username)
const projects = ref<Array<Project>>([])

const loading = ref<boolean>(true)

const allowedStatuses = ['REGISTERED', 'IN_PROGRESS', 'IN_REVIEWS', 'ACCEPTED', 'FAILED']

interface Project {
  id: string
  title: string
  type: string
  status: string
  finalPercentage: number
  completedDateTime: Date
  teamMembers: [
    {
      login: string
      isTeamLead: boolean
    },
  ]
  courseId: number
}

async function fetchData() {
  try {
    const response = await sendRequest(
      `https://edu-api.21-school.ru/services/21-school/api/v1/participants/${username.value}/projects?limit=999&offset=0`,
      authStore.authToken,
    )
    projects.value = response.projects.filter((project: Project) =>
      allowedStatuses.includes(project.status),
    ) // проверка, что статус входит в разрешенные
    projects.value.sort((a, b) => {
      if (a.status > b.status) return 1
      if (a.status < b.status) return -1
      return 0
    })
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1 class="text-3xl text-justwhite-500 text-center mt-3">Projects</h1>

  <div v-if="loading">
    <Loader/>
  </div>
  <div class="flex flex-col gap-3 items-center p-5" v-else>
    <div
      v-for="project in projects"
      :key="project.title"
      class="text-justwhite-500 flex flex-col border gap-0.5 p-3 w-full min-w-65 rounded justify-center"
    >
      <p class="w-64">Name: {{ project.title }}</p>
      <p
        :class="{
          'bg-green-500': project.status === 'ACCEPTED',
          'bg-red-500': project.status === 'FAILED',
          'bg-blue-500': project.status === 'IN_PROGRESS',
          'bg-yellow-500': project.status === 'IN_REVIEWS',
        }"
        class="w-60 px-1 rounded"
      >
        Status: {{ project.status }}
        <span v-if="project.finalPercentage > 30">( {{ project.finalPercentage }} % )</span>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
