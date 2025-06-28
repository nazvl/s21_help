<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import { useRoute } from 'vue-router'
const route = useRoute();

</script>

<template>
  <RouterView />
  <NavigationBar v-if="route.path !== '/login'"/>
</template>

<style scoped>

</style>
