<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center justify-space-between pb-2">
      <div>
        <v-icon left>mdi-calendar-clock</v-icon>
        <span>{{ title }}</span>
      </div>
      <div class="d-flex align-center">
        <v-btn icon small @click="previousWeek">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-subtitle-1 mx-3">{{ currentWeekLabel }}</span>
        <v-btn icon small @click="nextWeek">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          v-if="allowScheduling"
          color="primary"
          size="small"
          class="ml-3"
          @click="showScheduleDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Schedule
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <div class="timetable-container">
        <!-- Time labels column -->
        <div class="time-column">
          <div class="header-cell"></div>
          <div
            v-for="hour in hours"
            :key="hour"
            class="time-cell"
          >
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Days columns -->
        <div
          v-for="day in currentWeekDays"
          :key="day.date.getTime()"
          class="day-column"
        >
          <!-- Day header -->
          <div class="day-header">
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.date.getDate() }}</div>
            <div
              v-if="day.isToday"
              class="today-indicator"
            >
              Today
            </div>
          </div>

          <!-- Time slots -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="time-slot"
            :class="{
              'available': isSlotAvailable(day.date, hour),
              'booked': isSlotBooked(day.date, hour),
              'current-hour': isCurrentHour(day.date, hour)
            }"
            @click="handleSlotClick(day.date, hour)"
          >
            <!-- Show session info if booked -->
            <div
              v-if="getSessionForSlot(day.date, hour)"
              class="session-info"
            >
              <div class="session-title">{{ getSessionForSlot(day.date, hour)?.title }}</div>
              <div class="session-type">{{ getSessionForSlot(day.date, hour)?.type }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <!-- Schedule New Session Dialog -->
    <v-dialog v-model="showScheduleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-calendar-plus</v-icon>
          Schedule New Session
        </v-card-title>

        <v-card-text>
          <v-form ref="scheduleForm" v-model="scheduleValid">
            <v-text-field
              v-model="newSession.title"
              label="Session Title"
              placeholder="e.g., Math Tutoring - Calculus"
              outlined
              dense
              class="mb-3"
              required
            ></v-text-field>

            <v-select
              v-model="newSession.type"
              :items="sessionTypes"
              label="Session Type"
              outlined
              dense
              class="mb-3"
              required
            ></v-select>

            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="newSession.date"
                  label="Date"
                  outlined
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="mb-3"
                  required
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="newSession.date"
                @input="dateMenu = false"
                :min="new Date().toISOString().split('T')[0]"
              ></v-date-picker>
            </v-menu>

            <v-menu
              v-model="timeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="newSession.time"
                  label="Time"
                  outlined
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="mb-3"
                  required
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="newSession.time"
                format="24hr"
                @input="timeMenu = false"
              ></v-time-picker>
            </v-menu>

            <v-text-field
              v-model.number="newSession.duration"
              label="Duration (minutes)"
              type="number"
              outlined
              dense
              class="mb-3"
              :rules="durationRules"
              required
            ></v-text-field>

            <v-textarea
              v-model="newSession.notes"
              label="Notes (optional)"
              outlined
              dense
              rows="2"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showScheduleDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="scheduleSession"
            :loading="scheduling"
            :disabled="!scheduleValid"
          >
            Schedule Session
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Session Details Dialog -->
    <v-dialog v-model="showSessionDialog" max-width="400px">
      <v-card v-if="selectedSession">
        <v-card-title class="d-flex align-center">
          <v-icon left :color="getSessionColor(selectedSession.type)">mdi-calendar</v-icon>
          {{ selectedSession.title }}
        </v-card-title>

        <v-card-text>
          <v-row dense class="mb-3">
            <v-col cols="6">
              <div class="caption text--secondary">Type</div>
              <v-chip small :color="getSessionColor(selectedSession.type)">
                {{ selectedSession.type }}
              </v-chip>
            </v-col>
            <v-col cols="6">
              <div class="caption text--secondary">Duration</div>
              <div>{{ selectedSession.duration }} min</div>
            </v-col>
          </v-row>

          <div class="mb-3">
            <div class="caption text--secondary">Date & Time</div>
            <div>{{ formatSessionDateTime(selectedSession) }}</div>
          </div>

          <div v-if="selectedSession.notes" class="mb-3">
            <div class="caption text--secondary">Notes</div>
            <div>{{ selectedSession.notes }}</div>
          </div>

          <div v-if="selectedSession.participants" class="mb-3">
            <div class="caption text--secondary">Participants</div>
            <div>{{ selectedSession.participants.join(', ') }}</div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showSessionDialog = false">Close</v-btn>
          <v-btn
            v-if="allowEditing"
            color="primary"
            @click="editSession(selectedSession)"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Session {
  id: string
  title: string
  type: 'mentoring' | 'study' | 'office-hours' | 'review'
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number // minutes
  notes?: string
  participants?: string[]
}

interface Props {
  title?: string
  sessions?: Session[]
  allowScheduling?: boolean
  allowEditing?: boolean
  workingHours?: { start: number; end: number } // 24-hour format
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Weekly Schedule',
  sessions: () => [],
  allowScheduling: true,
  allowEditing: true,
  workingHours: () => ({ start: 8, end: 18 }) // 8 AM to 6 PM
})

const emit = defineEmits<{
  scheduleSession: [session: Omit<Session, 'id'>]
  editSession: [session: Session]
  slotClick: [date: Date, hour: number]
}>()

// Reactive data
const currentWeekStart = ref(new Date())
const showScheduleDialog = ref(false)
const showSessionDialog = ref(false)
const selectedSession = ref<Session | null>(null)
const scheduling = ref(false)
const scheduleValid = ref(false)
const dateMenu = ref(false)
const timeMenu = ref(false)

// Form data for new session
const newSession = ref({
  title: '',
  type: 'mentoring' as Session['type'],
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  duration: 60,
  notes: ''
})

// Computed properties
const hours = computed(() => {
  const hours = []
  for (let h = props.workingHours.start; h <= props.workingHours.end; h++) {
    hours.push(h)
  }
  return hours
})

const currentWeekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentWeekStart.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    days.push({
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date,
      isToday: date.toDateString() === new Date().toDateString()
    })
  }

  return days
})

const currentWeekLabel = computed(() => {
  const start = currentWeekDays.value[0].date
  const end = currentWeekDays.value[6].date
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' })

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
  } else {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`
  }
})

const sessionTypes = [
  { text: 'Mentoring Session', value: 'mentoring' },
  { text: 'Study Session', value: 'study' },
  { text: 'Office Hours', value: 'office-hours' },
  { text: 'Review Session', value: 'review' }
]

const durationRules = [
  (v: number) => !!v || 'Duration is required',
  (v: number) => (v >= 15 && v <= 240) || 'Duration must be between 15-240 minutes'
]

// Methods
const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}

const previousWeek = () => {
  currentWeekStart.value.setDate(currentWeekStart.value.getDate() - 7)
  currentWeekStart.value = new Date(currentWeekStart.value)
}

const nextWeek = () => {
  currentWeekStart.value.setDate(currentWeekStart.value.getDate() + 7)
  currentWeekStart.value = new Date(currentWeekStart.value)
}

const isSlotAvailable = (date: Date, hour: number) => {
  // Check if this time slot is available (not booked and within working hours)
  return !isSlotBooked(date, hour) && hour >= props.workingHours.start && hour < props.workingHours.end
}

const isSlotBooked = (date: Date, hour: number) => {
  return props.sessions.some(session => {
    const sessionDate = new Date(session.date + 'T' + session.time)
    const sessionEnd = new Date(sessionDate.getTime() + session.duration * 60000)

    const slotStart = new Date(date)
    slotStart.setHours(hour, 0, 0, 0)
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000) // 1 hour slot

    return sessionDate < slotEnd && sessionEnd > slotStart
  })
}

const isCurrentHour = (date: Date, hour: number) => {
  const now = new Date()
  return date.toDateString() === now.toDateString() && hour === now.getHours()
}

const getSessionForSlot = (date: Date, hour: number) => {
  return props.sessions.find(session => {
    const sessionDate = new Date(session.date + 'T' + session.time)
    const sessionHour = sessionDate.getHours()
    const sessionDateStr = sessionDate.toDateString()

    return sessionDateStr === date.toDateString() && sessionHour === hour
  })
}

const handleSlotClick = (date: Date, hour: number) => {
  const session = getSessionForSlot(date, hour)
  if (session) {
    selectedSession.value = session
    showSessionDialog.value = true
  } else if (props.allowScheduling && isSlotAvailable(date, hour)) {
    emit('slotClick', date, hour)
  }
}

const scheduleSession = async () => {
  scheduling.value = true

  const sessionData = {
    title: newSession.value.title,
    type: newSession.value.type,
    date: newSession.value.date,
    time: newSession.value.time,
    duration: newSession.value.duration,
    notes: newSession.value.notes
  }

  emit('scheduleSession', sessionData)

  // Reset form
  newSession.value = {
    title: '',
    type: 'mentoring',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    notes: ''
  }

  showScheduleDialog.value = false
  scheduling.value = false
}

const editSession = (session: Session) => {
  emit('editSession', session)
  showSessionDialog.value = false
}

const getSessionColor = (type: string) => {
  const colors: Record<string, string> = {
    'mentoring': 'primary',
    'study': 'success',
    'office-hours': 'info',
    'review': 'warning'
  }
  return colors[type] || 'grey'
}

const formatSessionDateTime = (session: Session) => {
  const date = new Date(session.date + 'T' + session.time)
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Initialize to current week
onMounted(() => {
  // Set to current week
  const today = new Date()
  currentWeekStart.value = new Date(today)
})
</script>

<style scoped>
.timetable-container {
  display: flex;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.time-column {
  min-width: 80px;
  border-right: 1px solid #e0e0e0;
}

.day-column {
  min-width: 120px;
  border-right: 1px solid #e0e0e0;
}

.header-cell,
.day-header,
.time-cell,
.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
  padding: 4px;
}

.day-header {
  flex-direction: column;
  background-color: #f5f5f5;
  font-weight: 500;
}

.day-name {
  font-size: 12px;
  color: #666;
}

.day-date {
  font-size: 18px;
  font-weight: bold;
}

.today-indicator {
  background-color: #1976d2;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  margin-top: 2px;
}

.time-cell {
  background-color: #fafafa;
  font-size: 11px;
  color: #666;
  justify-content: flex-start;
  padding-left: 8px;
}

.time-slot {
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-slot:hover {
  background-color: #f0f8ff;
}

.time-slot.available:hover {
  background-color: #e8f5e8;
}

.time-slot.booked {
  background-color: #ffebee;
  cursor: not-allowed;
}

.time-slot.current-hour {
  border-left: 3px solid #1976d2;
}

.session-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  padding: 4px;
}

.session-title {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.session-type {
  font-size: 8px;
  color: #666;
  margin-top: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .day-column {
    min-width: 100px;
  }

  .time-column {
    min-width: 60px;
  }

  .day-date {
    font-size: 16px;
  }

  .time-cell {
    font-size: 10px;
  }
}
</style>
