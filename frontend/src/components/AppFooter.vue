<template>
  <v-footer
    app
    color="grey darken-4"
    dark
    height="80"
    class="mt-8"
  >
    <v-container fluid class="py-2">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="6">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-school</v-icon>
            <span class="text-body-2">© {{ currentYear }} ACEIB Educational Platform</span>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="text-md-end">
          <div class="d-flex align-center justify-md-end flex-wrap">
            <router-link to="/dashboard" class="text-decoration-none text-caption mx-2">Dashboard</router-link>
            <router-link to="/matching" class="text-decoration-none text-caption mx-2">Find Mentor</router-link>
            <router-link to="/pairings" class="text-decoration-none text-caption mx-2">My Pairings</router-link>
            <router-link to="/chat" class="text-decoration-none text-caption mx-2">Messages</router-link>
            <router-link to="/mediation" class="text-decoration-none text-caption mx-2">Support</router-link>
            <a href="mailto:support@aceib-platform.demo" class="text-decoration-none text-caption mx-2">Contact</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
