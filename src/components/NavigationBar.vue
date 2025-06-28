<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeIcon, UserIcon, CalendarIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
const router = useRouter();

interface Link {
  name: string
  to: string
  icon: Component
}

const links: Link[] = [
  {
    name: 'Home',
    to: '/home',
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
  console.log(to);
  router.push(to);
}
</script>

<template>
  <div class="fixed bottom-0 w-full h-16 bg-lightgray-900 border-t border-t-lightgray-300">
    <ul class="flex items-center h-full text-justwhite-500 justify-around">
      <li v-for="link in links" :key="link.name">
        <button class="flex items-center gap-[5px] justify-center flex-col" @click="onNavigateTo(link.to)">
          <component :is="link.icon" class="w-6 h-6" />
          <p class="text-xs text-lightgray-300">{{ link.name }}</p>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
