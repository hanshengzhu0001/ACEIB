<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" class="pa-6" color="primary" dark>
          <v-row align="center">
            <v-col cols="12" md="8">
              <h1 class="display-1 font-weight-bold mb-2">
                Welcome back, {{ user?.firstName }}!
              </h1>
              <p class="subtitle-1 mb-0">
                {{ dashboardMessage }}
              </p>
            </v-col>
            <v-col cols="12" md="4" class="text-center text-md-end">
              <v-chip
                color="secondary"
                text-color="primary"
                large
                class="mb-2"
              >
                <v-icon left>mdi-fire</v-icon>
                {{ user?.engagement?.currentStreak || 0 }} Day Streak
              </v-chip>
              <div class="caption">Keep it up!</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="headline mb-4">Quick Actions</h2>
        <v-row>
          <v-col cols="12" sm="6" md="3" v-if="isStudent">
            <v-card
              elevation="2"
              class="pa-4 text-center cursor-pointer"
              @click="$router.push('/matching')"
            >
              <v-avatar size="60" color="primary" class="mb-3 mx-auto">
                <v-icon size="30" color="white">mdi-account-search</v-icon>
              </v-avatar>
              <h3 class="subtitle-1 mb-1">Find Mentor</h3>
              <p class="caption text--secondary">Get matched with the perfect tutor</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              elevation="2"
              class="pa-4 text-center cursor-pointer"
              @click="$router.push('/pairings')"
            >
              <v-avatar size="60" color="success" class="mb-3 mx-auto">
                <v-icon size="30" color="white">mdi-account-group</v-icon>
              </v-avatar>
              <h3 class="subtitle-1 mb-1">My Pairings</h3>
              <p class="caption text--secondary">View your active mentorships</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              elevation="2"
              class="pa-4 text-center cursor-pointer"
              @click="$router.push('/chat')"
            >
              <v-avatar size="60" color="info" class="mb-3 mx-auto">
                <v-icon size="30" color="white">mdi-chat</v-icon>
              </v-avatar>
              <h3 class="subtitle-1 mb-1">Messages</h3>
              <p class="caption text--secondary">{{ unreadCount }} unread</p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              elevation="2"
              class="pa-4 text-center cursor-pointer"
              @click="$router.push('/profile')"
            >
              <v-avatar size="60" color="warning" class="mb-3 mx-auto">
                <v-icon size="30" color="white">mdi-account-cog</v-icon>
              </v-avatar>
              <h3 class="subtitle-1 mb-1">Profile</h3>
              <p class="caption text--secondary">Update your information</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Stats Overview -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="pa-4">
          <v-row align="center">
            <v-col cols="8">
              <div class="caption text--secondary">Active Pairings</div>
              <div class="display-1 font-weight-bold">{{ stats.activePairings }}</div>
            </v-col>
            <v-col cols="4" class="text-end">
              <v-avatar color="primary">
                <v-icon color="white">mdi-account-group</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="pa-4">
          <v-row align="center">
            <v-col cols="8">
              <div class="caption text--secondary">Total Sessions</div>
              <div class="display-1 font-weight-bold">{{ stats.totalSessions }}</div>
            </v-col>
            <v-col cols="4" class="text-end">
              <v-avatar color="success">
                <v-icon color="white">mdi-school</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="pa-4">
          <v-row align="center">
            <v-col cols="8">
              <div class="caption text--secondary">Avg Rating</div>
              <div class="display-1 font-weight-bold">{{ stats.averageRating }}/5</div>
            </v-col>
            <v-col cols="4" class="text-end">
              <v-avatar color="warning">
                <v-icon color="white">mdi-star</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="pa-4">
          <v-row align="center">
            <v-col cols="8">
              <div class="caption text--secondary">Hours This Month</div>
              <div class="display-1 font-weight-bold">{{ stats.hoursThisMonth }}</div>
            </v-col>
            <v-col cols="4" class="text-end">
              <v-avatar color="info">
                <v-icon color="white">mdi-clock</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity & Upcoming Sessions -->
    <v-row>
      <!-- Recent Activity -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card elevation="2">
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            Recent Activity
          </v-card-title>
          <v-card-text>
            <v-timeline dense>
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                small
                :color="activity.color"
              >
                <template v-slot:icon>
                  <v-icon>{{ activity.icon }}</v-icon>
                </template>
                <div class="caption text--secondary mb-1">{{ activity.time }}</div>
                <div>{{ activity.description }}</div>
              </v-timeline-item>
            </v-timeline>

            <div v-if="recentActivities.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey lighten-1">mdi-calendar-blank</v-icon>
              <p class="text--secondary mt-2">No recent activity</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Weekly Schedule -->
      <v-col cols="12" class="mb-6">
        <TimeTable
          title="My Weekly Schedule"
          :sessions="weeklySessions"
          :allow-scheduling="isStudent || isMentor"
          :allow-editing="true"
          @schedule-session="handleScheduleSession"
          @edit-session="handleEditSession"
          @slot-click="handleSlotClick"
        />
      </v-col>
    </v-row>

    <!-- Goals Progress (for students) -->
    <v-row v-if="isStudent && currentGoals.length > 0" class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon left>mdi-target</v-icon>
            Current Goals
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="goal in currentGoals"
                :key="goal.id"
                cols="12"
                md="6"
                class="mb-4"
              >
                <v-card outlined class="pa-4">
                  <h4 class="mb-2">{{ goal.title }}</h4>
                  <v-progress-linear
                    :value="goal.progress"
                    color="primary"
                    height="8"
                    class="mb-2"
                  ></v-progress-linear>
                  <div class="d-flex justify-space-between text-caption">
                    <span>{{ goal.progress }}% complete</span>
                    <span>{{ goal.deadline }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import TimeTable from '@/components/scheduling/TimeTable.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isStudent = computed(() => authStore.isStudent)

const dashboardMessage = computed(() => {
  if (authStore.isStudent) {
    return "Ready to continue your learning journey?"
  } else if (authStore.isMentor) {
    return "Your students are waiting to learn from you."
  } else {
    return "Manage the platform and support our community."
  }
})

// Reactive data
const stats = ref({
  activePairings: 0,
  totalSessions: 0,
  averageRating: 0,
  hoursThisMonth: 0
})

const unreadCount = ref(0)
const recentActivities = ref<any[]>([])
const weeklySessions = ref<any[]>([])
const currentGoals = ref<any[]>([])

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // Fetch pairings stats
    const pairingsResponse = await axios.get('/matching/pairings')
    const pairings = pairingsResponse.data.data.pairings

    stats.value.activePairings = pairings.filter((p: any) => p.status === 'active').length
    stats.value.totalSessions = pairings.reduce((sum: number, p: any) => sum + (p.sessionCount || 0), 0)

    // Calculate average rating
    const ratings = pairings.flatMap((p: any) => p.ratings || [])
    if (ratings.length > 0) {
      stats.value.averageRating = Math.round(
        (ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length) * 10
      ) / 10
    }

    // Mock hours this month (would come from API)
    stats.value.hoursThisMonth = pairings.reduce((sum: number, p: any) => sum + (p.totalHours || 0), 0)

    // Fetch chat data for unread count
    const chatsResponse = await axios.get('/chat/rooms')
    unreadCount.value = chatsResponse.data.data.chats.reduce(
      (sum: number, chat: any) => sum + (chat.unreadCount || 0), 0
    )

    // Mock recent activities (would come from API)
    recentActivities.value = [
      {
        id: 1,
        description: 'Completed session with Alex Thompson',
        time: '2 hours ago',
        icon: 'mdi-school',
        color: 'success'
      },
      {
        id: 2,
        description: 'Updated profile information',
        time: '1 day ago',
        icon: 'mdi-account-edit',
        color: 'info'
      },
      {
        id: 3,
        description: 'Received 5-star rating',
        time: '2 days ago',
        icon: 'mdi-star',
        color: 'warning'
      }
    ]

    // Mock weekly sessions (would come from API)
    weeklySessions.value = [
      {
        id: '1',
        title: 'Math Tutoring - Calculus',
        type: 'mentoring',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: '15:00',
        duration: 60,
        participants: ['Sarah Johnson']
      },
      {
        id: '2',
        title: 'Chemistry Study Session',
        type: 'study',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Friday
        time: '14:00',
        duration: 90,
        participants: ['Dr. Garcia']
      }
    ]

    // Mock goals for students (would come from API)
    if (isStudent.value) {
      currentGoals.value = [
        {
          id: 1,
          title: 'Improve Calculus Grade',
          progress: 75,
          deadline: 'Due in 2 weeks'
        },
        {
          id: 2,
          title: 'Master Integration Techniques',
          progress: 60,
          deadline: 'Due in 1 month'
        }
      ]
    }

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

// Handler methods for TimeTable component
const handleScheduleSession = (sessionData: any) => {
  console.log('Scheduling new session:', sessionData)
  // In a real app, this would make an API call to schedule the session
  alert('Session scheduled successfully! (This would integrate with your backend)')
}

const handleEditSession = (session: any) => {
  console.log('Editing session:', session)
  // In a real app, this would open an edit dialog or navigate to edit page
  alert('Edit session functionality would be implemented here')
}

const handleSlotClick = (date: Date, hour: number) => {
  console.log('Slot clicked:', date, hour)
  // In a real app, this could open a quick scheduling dialog
  alert(`Clicked on ${date.toLocaleDateString()} at ${hour}:00. Quick scheduling could be implemented here.`)
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
}
</style>
