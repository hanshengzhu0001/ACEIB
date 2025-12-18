<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter v-if="!$route.meta.hideFooter" />
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
