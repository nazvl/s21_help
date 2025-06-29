<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { HomeIcon, UserIcon, CalendarIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const currentLink = ref<string | null>('')

interface Link {
  name: string
  to: string
  icon: Component
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath == '') {
      newPath = '/'
    }
    currentLink.value = newPath // запись текущего маршрута в переменную при изменении
  },
  { immediate: true }
)

const links: Link[] = [
  {
    name: 'Home',
    to: '/',
    icon: HomeIcon,
  },
  {
    name: 'Profile',
    to: '/profile',
    icon: UserIcon,
  },
  {
    name: 'Calendar',
    to: '/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Projects',
    to: '/projects',
    icon: AcademicCapIcon,
  },
]

function onNavigateTo(to: string) {
  console.log(to)
  router.push(to)
}
</script>

<template>
  <div class="fixed bottom-[env(safe-area-inset-bottom)] w-full h-16 bg-lightgray-900 border-t border-t-lightgray-300">
    <ul class="flex items-center h-full text-justwhite-500 justify-around">
      <li v-for="link in links" :key="link.name">
        <button
          class="flex items-center gap-[5px] justify-center flex-col w-full h-full p-2 border-b transition-colors duration-300"
          @click="onNavigateTo(link.to)"
          :class="{ 'border-b-transparent': currentLink !== link.to, 'border-b-blue-600': currentLink === link.to }"
        >

          <component :is="link.icon" class="w-6 h-6" />
          <p class="text-xs text-lightgray-300">{{ link.name }}</p>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
