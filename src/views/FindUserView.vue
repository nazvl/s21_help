<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import ExpandedProfileInfo from '@/components/ExpandedProfileInfo.vue'

const authStore = useAuthStore()

const searchText = ref<string>('')
const textSearched = ref<string>('')

function handleSearch() {
  textSearched.value = searchText.value.trim()
}

onMounted(() => {
  if (authStore.username) {
    searchText.value = ''
    textSearched.value = ''
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="flex items-center mb-8 space-x-2">
      <div class="relative flex-1">
        <input
          type="text"
          v-model="searchText"
          @input="searchText = searchText.toLowerCase()"
          placeholder="Username"
          class="w-full pl-10 pr-4 py-3 text-justwhite-500 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
        />
        <svg
          class="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <button
        @click="handleSearch"
        class="bg-greenforbuttons-500 hover:bg-green-800 text-lightgray-500 px-5 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        Search
      </button>
    </div>
    <div v-if="textSearched">
      <UserProfile
        :key="textSearched"
        :username="textSearched"
        :authToken="authStore.authToken"
        :auto-fetch="true"
      />
      <ExpandedProfileInfo
        :key="textSearched"
        :username="textSearched"
        :authToken="authStore.authToken"
      />
    </div>
  </div>
</template>
