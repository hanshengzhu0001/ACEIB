<template>
  <v-footer
    app
    color="grey darken-4"
    dark
    class="mt-8"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h3 class="mb-3">ACEIB Platform</h3>
          <p class="text-body-2">
            Connecting students with expert mentors through intelligent matching
            and fostering educational excellence.
          </p>
        </v-col>

        <v-col cols="12" md="2">
          <h4 class="mb-3">Platform</h4>
          <div class="d-flex flex-column">
            <router-link to="/dashboard" class="text-decoration-none mb-2">Dashboard</router-link>
            <router-link to="/matching" class="text-decoration-none mb-2">Find Mentor</router-link>
            <router-link to="/pairings" class="text-decoration-none mb-2">My Pairings</router-link>
            <router-link to="/chat" class="text-decoration-none mb-2">Messages</router-link>
          </div>
        </v-col>

        <v-col cols="12" md="2">
          <h4 class="mb-3">Support</h4>
          <div class="d-flex flex-column">
            <router-link to="/mediation" class="text-decoration-none mb-2">Help Center</router-link>
            <a href="mailto:support@aceib.com" class="text-decoration-none mb-2">Contact Us</a>
            <router-link to="/profile" class="text-decoration-none mb-2">Profile</router-link>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <h4 class="mb-3">Stay Connected</h4>
          <p class="text-body-2 mb-3">
            Join our community of learners and educators.
          </p>
          <div class="d-flex">
            <v-btn icon small class="mr-2">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon small class="mr-2">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon small class="mr-2">
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
            <v-btn icon small>
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col cols="12" class="text-center">
          <p class="text-body-2 mb-0">
            © {{ currentYear }} ACEIB Educational Platform. All rights reserved.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
