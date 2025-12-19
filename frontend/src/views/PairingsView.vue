<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title>
            <h1 class="headline">My Pairings</h1>
            <p class="text--secondary mb-0">Manage your mentorship relationships</p>
          </v-card-title>
        </v-card>

        <!-- Active Pairings -->
        <div v-if="activePairings.length > 0" class="mb-8">
          <h2 class="headline mb-4">Active Pairings</h2>
          <v-row>
            <v-col
              v-for="pairing in activePairings"
              :key="pairing._id"
              cols="12"
              md="6"
              class="mb-6"
            >
              <v-card elevation="3" class="h-100">
                <v-card-title class="d-flex align-center pb-2">
                  <v-avatar size="50" class="mr-4">
                    <img
                      :src="getOtherUser(pairing).profile.avatar"
                      :alt="getOtherUser(pairing).firstName"
                    >
                  </v-avatar>
                  <div class="flex-grow-1">
                    <h3 class="headline mb-1">
                      {{ getOtherUser(pairing).firstName }} {{ getOtherUser(pairing).lastName }}
                    </h3>
                    <div class="d-flex align-center">
                      <v-chip small :color="getRoleColor(getOtherUser(pairing).role)" class="mr-2">
                        {{ getOtherUser(pairing).role }}
                      </v-chip>
                      <v-chip small color="success">
                        {{ Math.round(pairing.compatibilityScore) }}% Match
                      </v-chip>
                    </div>
                  </div>
                  <v-menu offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn icon v-bind="props">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="startChat(pairing)">
                        <v-list-item-icon><v-icon>mdi-chat</v-icon></v-list-item-icon>
                        <v-list-item-content><v-list-item-title>Send Message</v-list-item-title></v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="viewProfile(getOtherUser(pairing))">
                        <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                        <v-list-item-content><v-list-item-title>View Profile</v-list-item-title></v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item @click="reportIssue(pairing)">
                        <v-list-item-icon><v-icon color="warning">mdi-alert</v-icon></v-list-item-icon>
                        <v-list-item-content><v-list-item-title>Report Issue</v-list-item-title></v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-title>

                <v-card-text>
                  <v-row dense class="mb-4">
                    <v-col cols="6">
                      <div class="caption text--secondary">Started</div>
                      <div class="font-weight-medium">{{ formatDate(pairing.startDate) }}</div>
                    </v-col>
                    <v-col cols="6">
                      <div class="caption text--secondary">Sessions</div>
                      <div class="font-weight-medium">{{ pairing.sessionCount }}</div>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="6">
                      <div class="caption text--secondary">Hours</div>
                      <div class="font-weight-medium">{{ pairing.totalHours }}</div>
                    </v-col>
                    <v-col cols="6">
                      <div class="caption text--secondary">Rating</div>
                      <div class="font-weight-medium">
                        <v-rating
                          :value="pairing.averageRating || 0"
                          color="amber"
                          dense
                          half-increments
                          readonly
                          size="16"
                        ></v-rating>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Goals Progress -->
                  <div v-if="pairing.goals && pairing.goals.length > 0" class="mb-4">
                    <h4 class="subtitle-2 mb-3">Goals Progress</h4>
                    <div
                      v-for="goal in pairing.goals.slice(0, 2)"
                      :key="goal._id"
                      class="mb-3"
                    >
                      <div class="d-flex justify-space-between mb-1">
                        <span class="caption">{{ goal.description }}</span>
                        <span class="caption font-weight-bold">{{ goal.progress }}%</span>
                      </div>
                      <v-progress-linear
                        :value="goal.progress"
                        :color="goal.status === 'completed' ? 'success' : 'primary'"
                        height="6"
                      ></v-progress-linear>
                    </div>
                  </div>

                  <v-row dense class="mt-2">
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        outlined
                        block
                        small
                        @click="scheduleSession(pairing)"
                      >
                        <v-icon left size="16">mdi-calendar-plus</v-icon>
                        Schedule
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="success"
                        block
                        small
                        @click="markSessionComplete(pairing)"
                      >
                        <v-icon left size="16">mdi-check-circle</v-icon>
                        Complete
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- No active pairings -->
        <div v-else-if="!loading" class="text-center py-12 mb-8">
          <v-icon size="80" color="grey lighten-1" class="mb-4">mdi-account-group</v-icon>
          <h3 class="headline mb-2">No active pairings</h3>
          <p class="text-body-1 text--secondary mb-6">
            You're not currently paired with any mentors or students.
          </p>
          <v-btn
            v-if="isStudent"
            color="primary"
            to="/matching"
          >
            <v-icon left>mdi-account-search</v-icon>
            Find a Mentor
          </v-btn>
        </div>

        <!-- Pairing History -->
        <div v-if="completedPairings.length > 0">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-icon left>mdi-history</v-icon>
                <span class="font-weight-medium">Pairing History ({{ completedPairings.length }})</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="historyHeaders"
                  :items="completedPairings"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template v-slot:item.otherUser="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="mr-2">
                        <img :src="getOtherUser(item).profile.avatar" :alt="getOtherUser(item).firstName">
                      </v-avatar>
                      {{ getOtherUser(item).firstName }} {{ getOtherUser(item).lastName }}
                    </div>
                  </template>

                  <template v-slot:item.status="{ item }">
                    <v-chip
                      small
                      :color="item.status === 'completed' ? 'success' : 'error'"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>

                  <template v-slot:item.averageRating="{ item }">
                    <v-rating
                      :value="item.averageRating || 0"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="16"
                    ></v-rating>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <v-btn icon small @click="viewCompletedPairing(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const isStudent = computed(() => authStore.isStudent)
const loading = ref(true)
const pairings = ref<any[]>([])

const activePairings = computed(() =>
  pairings.value.filter(p => p.status === 'active')
)

const completedPairings = computed(() =>
  pairings.value.filter(p => p.status === 'completed' || p.status === 'terminated')
)

const historyHeaders = [
  { text: 'Partner', value: 'otherUser', sortable: false },
  { text: 'Started', value: 'startDate' },
  { text: 'Sessions', value: 'sessionCount' },
  { text: 'Rating', value: 'averageRating', sortable: false },
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false }
]

// Get the other user in the pairing
const getOtherUser = (pairing: any) => {
  const currentUserId = authStore.user?.id
  return pairing.mentor._id === currentUserId ? pairing.student : pairing.mentor
}

// Get role color for chips
const getRoleColor = (role: string) => {
  return role === 'mentor' ? 'info' : 'success'
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Load pairings
const loadPairings = async () => {
  loading.value = true
  try {
    const response = await axios.get('/matching/pairings')
    pairings.value = response.data.data.pairings
  } catch (error) {
    console.error('Failed to load pairings:', error)
  } finally {
    loading.value = false
  }
}

// Actions
const startChat = (pairing: any) => {
  router.push(`/chat/${pairing._id}`)
}

const viewProfile = (user: any) => {
  alert(`Viewing profile for ${user.firstName} ${user.lastName}`)
}

const reportIssue = (pairing: any) => {
  router.push('/mediation')
}

const scheduleSession = (pairing: any) => {
  alert('Session scheduling would open a calendar dialog')
}

const markSessionComplete = async (pairing: any) => {
  try {
    // Update engagement
    await authStore.updateEngagement('session_complete')

    // In a real app, this would call an API to mark session complete
    alert('Session marked as complete!')

    // Reload pairings
    loadPairings()
  } catch (error) {
    console.error('Failed to mark session complete:', error)
  }
}

const viewCompletedPairing = (pairing: any) => {
  alert(`Viewing completed pairing details for ${getOtherUser(pairing).firstName}`)
}

onMounted(() => {
  loadPairings()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
