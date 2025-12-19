<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <h1 class="headline">Find Your Perfect Mentor</h1>
              <p class="text--secondary mb-0">Our intelligent algorithm matches you with mentors based on your learning style and goals</p>
            </div>
            <v-btn
              color="primary"
              size="large"
              @click="runMatching"
              :loading="loading"
              :disabled="hasActivePairing"
            >
              <v-icon left>mdi-magnify</v-icon>
              Find Matches
            </v-btn>
          </v-card-title>

          <v-card-text v-if="hasActivePairing" class="warning lighten-5">
            <v-alert type="warning" outlined class="mb-0">
              <v-icon left>mdi-alert-circle</v-icon>
              You already have an active pairing. Complete or terminate it before finding new matches.
              <v-btn text color="primary" to="/pairings" class="ml-2">View Pairings</v-btn>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Matching Results -->
        <div v-if="matches.length > 0">
          <h2 class="headline mb-4">Your Top Matches</h2>

          <v-row>
            <v-col
              v-for="(match, index) in matches"
              :key="match.mentor.id"
              cols="12"
              md="6"
              lg="4"
              class="mb-6"
            >
              <v-card
                elevation="3"
                :class="{ 'border-primary': index === 0 }"
                class="h-100"
              >
                <!-- Match Badge -->
                <v-chip
                  v-if="index === 0"
                  color="primary"
                  class="position-absolute top-2 right-2 z-index-1"
                  small
                >
                  Best Match
                </v-chip>

                <v-card-title class="d-flex align-start pb-2">
                  <v-avatar size="60" class="mr-4">
                    <img
                      :src="match.mentor.profile.avatar"
                      :alt="match.mentor.firstName"
                    >
                  </v-avatar>
                  <div class="flex-grow-1">
                    <h3 class="headline mb-1">
                      {{ match.mentor.firstName }} {{ match.mentor.lastName }}
                    </h3>
                    <div class="d-flex align-center mb-2">
                      <v-rating
                        :value="match.mentor.engagement.averageRating"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="16"
                        class="mr-2"
                      ></v-rating>
                      <span class="caption text--secondary">
                        {{ match.mentor.engagement.averageRating }}/5
                        ({{ match.mentor.engagement.totalSessions }} sessions)
                      </span>
                    </div>
                    <v-chip
                      small
                      color="success"
                      class="mb-2"
                    >
                      {{ Math.round(match.compatibilityScore) }}% Match
                    </v-chip>
                  </div>
                </v-card-title>

                <v-card-text class="pt-0">
                  <p class="text-body-2 mb-3">{{ match.mentor.profile.bio }}</p>

                  <div class="mb-3">
                    <h4 class="subtitle-2 mb-2">Expertise</h4>
                    <div>
                      <v-chip
                        v-for="subject in match.mentor.mentorProfile.expertise.slice(0, 3)"
                        :key="subject"
                        small
                        outlined
                        class="mr-1 mb-1"
                      >
                        {{ subject }}
                      </v-chip>
                      <v-chip
                        v-if="match.mentor.mentorProfile.expertise.length > 3"
                        small
                        outlined
                        class="mr-1 mb-1"
                      >
                        +{{ match.mentor.mentorProfile.expertise.length - 3 }} more
                      </v-chip>
                    </div>
                  </div>

                  <v-divider class="mb-3"></v-divider>

                  <v-row dense class="mb-3">
                    <v-col cols="6">
                      <div class="caption text--secondary">Experience</div>
                      <div class="font-weight-medium">{{ match.mentor.mentorProfile.experienceYears }} years</div>
                    </v-col>
                    <v-col cols="6">
                      <div class="caption text--secondary">Hourly Rate</div>
                      <div class="font-weight-medium">${{ match.mentor.mentorProfile.hourlyRate }}/hr</div>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="6">
                      <div class="caption text--secondary">Teaching Style</div>
                      <div class="font-weight-medium">{{ formatTeachingStyle(match.mentor.mentorProfile.teachingStyle) }}</div>
                    </v-col>
                    <v-col cols="6">
                      <div class="caption text--secondary">Max Students</div>
                      <div class="font-weight-medium">{{ match.mentor.mentorProfile.maxStudents }}</div>
                    </v-col>
                  </v-row>

                  <!-- Compatibility Breakdown -->
                  <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                      <v-expansion-panel-header class="pa-0">
                        <span class="text-body-2 font-weight-medium">View Compatibility Details</span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pa-0 pt-3">
                        <div class="compatibility-details">
                          <div class="d-flex justify-space-between mb-2">
                            <span class="caption">Subject Match</span>
                            <span class="caption font-weight-bold">{{ match.matchingCriteria.subjectMatch }}%</span>
                          </div>
                          <v-progress-linear
                            :value="match.matchingCriteria.subjectMatch"
                            color="primary"
                            height="4"
                            class="mb-3"
                          ></v-progress-linear>

                          <div class="d-flex justify-space-between mb-2">
                            <span class="caption">Teaching Style Match</span>
                            <span class="caption font-weight-bold">{{ match.matchingCriteria.teachingStyleMatch }}%</span>
                          </div>
                          <v-progress-linear
                            :value="match.matchingCriteria.teachingStyleMatch"
                            color="success"
                            height="4"
                            class="mb-3"
                          ></v-progress-linear>

                          <div class="d-flex justify-space-between mb-2">
                            <span class="caption">Availability Match</span>
                            <span class="caption font-weight-bold">{{ match.matchingCriteria.availabilityMatch }}%</span>
                          </div>
                          <v-progress-linear
                            :value="match.matchingCriteria.availabilityMatch"
                            color="info"
                            height="4"
                            class="mb-3"
                          ></v-progress-linear>

                          <div class="d-flex justify-space-between mb-2">
                            <span class="caption">Experience Level Match</span>
                            <span class="caption font-weight-bold">{{ match.matchingCriteria.experienceLevelMatch }}%</span>
                          </div>
                          <v-progress-linear
                            :value="match.matchingCriteria.experienceLevelMatch"
                            color="warning"
                            height="4"
                          ></v-progress-linear>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <div class="d-flex gap-2">
                    <v-btn
                      color="primary"
                      outlined
                      block
                      @click="viewMentorProfile(match.mentor)"
                    >
                      <v-icon left>mdi-account</v-icon>
                      View Profile
                    </v-btn>
                    <v-btn
                      color="primary"
                      block
                      @click="requestPairing(match)"
                      :loading="requestingPairing === match.mentor.id"
                    >
                      <v-icon left>mdi-handshake</v-icon>
                      Request Pairing
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- No matches yet -->
        <div v-else-if="!loading && matches.length === 0 && hasSearched" class="text-center py-12">
          <v-icon size="80" color="grey lighten-1" class="mb-4">mdi-account-search</v-icon>
          <h3 class="headline mb-2">No matches found</h3>
          <p class="text-body-1 text--secondary mb-6">
            We couldn't find any suitable mentors at this time. Try updating your profile or check back later.
          </p>
          <v-btn color="primary" to="/profile">
            <v-icon left>mdi-account-edit</v-icon>
            Update Profile
          </v-btn>
        </div>

        <!-- Initial state -->
        <div v-else-if="!hasSearched" class="text-center py-12">
          <v-icon size="80" color="primary" class="mb-4">mdi-brain</v-icon>
          <h3 class="headline mb-2">Ready to find your perfect mentor?</h3>
          <p class="text-body-1 text--secondary mb-6">
            Our AI-powered matching algorithm analyzes your learning preferences, subjects, and goals
            to connect you with the most compatible mentors.
          </p>
          <v-alert type="info" outlined class="mb-6 mx-auto" style="max-width: 600px;">
            <strong>How it works:</strong><br>
            1. We analyze your profile and preferences<br>
            2. Our algorithm finds mentors with complementary teaching styles<br>
            3. You review matches and request pairings<br>
            4. Start learning with your perfect mentor match!
          </v-alert>
        </div>
      </v-col>
    </v-row>

    <!-- Matching Loader Overlay -->
    <MatchingLoader
      :visible="showMatchingLoader"
      :duration="4000"
      @complete="showMatchingLoader = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MatchingLoader from '@/components/matching/MatchingLoader.vue'

const router = useRouter()

interface Match {
  mentor: any
  compatibilityScore: number
  matchingCriteria: any
}

const loading = ref(false)
const hasSearched = ref(false)
const requestingPairing = ref<string | null>(null)
const matches = ref<Match[]>([])
const hasActivePairing = ref(false)
const showMatchingLoader = ref(false)

// Check if user has active pairing
const checkActivePairing = async () => {
  try {
    const response = await axios.get('/matching/pairings')
    const pairings = response.data.data.pairings
    hasActivePairing.value = pairings.some((p: any) => p.status === 'active')
  } catch (error) {
    console.error('Failed to check pairings:', error)
  }
}

// Run matching algorithm
const runMatching = async () => {
  loading.value = true
  showMatchingLoader.value = true

  try {
    const response = await axios.post('/matching/generate')
    matches.value = response.data.data.matches
    hasSearched.value = true
  } catch (error: any) {
    console.error('Failed to run matching:', error)
    // Handle error (show snackbar, etc.)
  } finally {
    loading.value = false
    // Keep loader visible for a moment to show completion
    setTimeout(() => {
      showMatchingLoader.value = false
    }, 1000)
  }
}

// View mentor profile (would open a dialog or navigate to profile)
const viewMentorProfile = (mentor: any) => {
  // For now, just show an alert. In a real app, this would open a profile dialog
  alert(`Viewing profile for ${mentor.firstName} ${mentor.lastName}`)
}

// Request pairing
const requestPairing = async (match: Match) => {
  requestingPairing.value = match.mentor.id
  try {
    // Create pairing request
    const pairingData = {
      mentorId: match.mentor.id,
      studentId: null, // Will be set by backend from auth
      compatibilityScore: match.compatibilityScore,
      matchingCriteria: match.matchingCriteria
    }

    const response = await axios.post('/matching/pair', pairingData)

    if (response.data.success) {
      // Success - navigate to pairings or show success message
      router.push('/pairings')
    }
  } catch (error: any) {
    console.error('Failed to request pairing:', error)
    // Handle error
  } finally {
    requestingPairing.value = null
  }
}

// Format teaching style for display
const formatTeachingStyle = (style: string) => {
  const styles: Record<string, string> = {
    'structured': 'Structured',
    'flexible': 'Flexible',
    'interactive': 'Interactive',
    'project-based': 'Project-Based'
  }
  return styles[style] || style
}

// Initialize
checkActivePairing()
</script>

<style scoped>
.compatibility-details {
  margin-top: 8px;
}

.border-primary {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}

.z-index-1 {
  z-index: 1;
}

.gap-2 {
  gap: 8px;
}
</style>
