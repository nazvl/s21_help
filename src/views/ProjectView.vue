<script setup lang="ts">
import { sendRequest } from '@/api/api.ts'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import Loader from '@/components/LoaderComponent.vue'
import HeaderText from '@/components/HeaderText.vue'
import { CheckCircleIcon, ClockIcon, XCircleIcon, EyeIcon } from '@heroicons/vue/16/solid'

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

function statusIcon(status: string) {
  if (status === 'ACCEPTED') {
    return CheckCircleIcon
  } else if (status === 'FAILED') {
    return XCircleIcon
  } else if (status === 'IN_PROGRESS') {
    return ClockIcon
  } else if (status === 'IN_REVIEWS') {
    return EyeIcon
  }
  return null
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <HeaderText text="Projects"></HeaderText>

  <div v-if="loading">
    <Loader />
  </div>

  <div v-else>
    <div
      v-for="project in projects"
      :key="project.id"
      class="text-lightgray-300 p-4 flex flex-row justify-between items-center w-full"
    >
      <div class="flex flex-col gap-1 text-[14px]">
        <p class="text-base font-medium text-justwhite-500">{{ project.title }}</p>
        <p class="text-sm font-normal">
          {{ project.status }}
          <span v-if="project.finalPercentage > 10">({{ project.finalPercentage }}%)</span>
        </p>
      </div>
      <div>
        <p class="w-6 h-6">
          <component
            :is="statusIcon(project.status)"
            class="w-6 h-6"
            :class="{
              'text-green-300': project.status === 'ACCEPTED',
              'text-yellow-200': project.status === 'IN_REVIEW' || project.status === 'IN_PROGRESS',
              'text-red-300': project.status === 'FAILED'
            }"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
