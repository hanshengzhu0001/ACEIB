<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title>
            <h1 class="headline">Admin Dashboard</h1>
            <p class="text--secondary mb-0">Platform administration and analytics</p>
          </v-card-title>
        </v-card>

        <v-row>
          <v-col cols="12" md="3">
            <v-card elevation="2" class="pa-4 text-center">
              <div class="display-1 font-weight-bold text--primary mb-2">{{ stats.totalUsers }}</div>
              <div class="caption text--secondary">Total Users</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card elevation="2" class="pa-4 text-center">
              <div class="display-1 font-weight-bold success--text mb-2">{{ stats.activeUsers }}</div>
              <div class="caption text--secondary">Active Users</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card elevation="2" class="pa-4 text-center">
              <div class="display-1 font-weight-bold info--text mb-2">{{ stats.totalPairings }}</div>
              <div class="caption text--secondary">Total Pairings</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card elevation="2" class="pa-4 text-center">
              <div class="display-1 font-weight-bold warning--text mb-2">{{ stats.pendingTickets }}</div>
              <div class="caption text--secondary">Pending Tickets</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalPairings: 0,
  pendingTickets: 0
})

const loadStats = async () => {
  try {
    const [usersResponse, pairingsResponse, ticketsResponse] = await Promise.all([
      axios.get('/users/stats/overview'),
      axios.get('/matching/pairings'),
      axios.get('/mediation/tickets')
    ])

    stats.value.totalUsers = usersResponse.data.data.totalUsers
    stats.value.activeUsers = usersResponse.data.data.activeUsers
    stats.value.totalPairings = pairingsResponse.data.data.pairings.length
    stats.value.pendingTickets = ticketsResponse.data.data.tickets.filter((t: any) => t.status === 'open').length
  } catch (error) {
    console.error('Failed to load admin stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>
