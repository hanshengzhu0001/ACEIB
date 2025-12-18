<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <h1 class="headline">Support Center</h1>
              <p class="text--secondary mb-0">Get help with issues and resolve conflicts</p>
            </div>
            <v-btn
              color="primary"
              @click="showCreateDialog = true"
            >
              <v-icon left>mdi-plus</v-icon>
              New Ticket
            </v-btn>
          </v-card-title>
        </v-card>

        <!-- Tickets List -->
        <v-card elevation="2">
          <v-card-title>
            <v-tabs v-model="activeTab" color="primary">
              <v-tab>My Tickets</v-tab>
              <v-tab v-if="isAdmin">All Tickets</v-tab>
              <v-tab>Statistics</v-tab>
            </v-tabs>
          </v-card-title>

          <v-card-text>
            <!-- My Tickets Tab -->
            <div v-if="activeTab === 0">
              <v-data-table
                :headers="ticketHeaders"
                :items="myTickets"
                :loading="loading"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.ticketNumber="{ item }">
                  <span class="font-weight-medium">{{ item.ticketNumber }}</span>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    small
                  >
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </template>

                <template v-slot:item.priority="{ item }">
                  <v-chip
                    :color="getPriorityColor(item.priority)"
                    small
                    outlined
                  >
                    {{ item.priority }}
                  </v-chip>
                </template>

                <template v-slot:item.createdAt="{ item }">
                  {{ formatDate(item.createdAt) }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon
                    small
                    @click="viewTicket(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>

            <!-- All Tickets Tab (Admin) -->
            <div v-else-if="activeTab === 1 && isAdmin">
              <v-data-table
                :headers="adminTicketHeaders"
                :items="allTickets"
                :loading="loading"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.ticketNumber="{ item }">
                  <span class="font-weight-medium">{{ item.ticketNumber }}</span>
                </template>

                <template v-slot:item.reporter="{ item }">
                  {{ item.reporter.firstName }} {{ item.reporter.lastName }}
                </template>

                <template v-slot:item.reported="{ item }">
                  {{ item.reported.firstName }} {{ item.reported.lastName }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    small
                  >
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </template>

                <template v-slot:item.priority="{ item }">
                  <v-chip
                    :color="getPriorityColor(item.priority)"
                    small
                    outlined
                  >
                    {{ item.priority }}
                  </v-chip>
                </template>

                <template v-slot:item.createdAt="{ item }">
                  {{ formatDate(item.createdAt) }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon
                    small
                    @click="viewTicket(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="item.status !== 'resolved'"
                    icon
                    small
                    @click="takeAction(item)"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>

            <!-- Statistics Tab -->
            <div v-else-if="activeTab === 2">
              <v-row>
                <v-col cols="12" md="3">
                  <v-card outlined class="pa-4 text-center">
                    <div class="display-1 font-weight-bold text--primary mb-2">{{ stats.totalTickets }}</div>
                    <div class="caption text--secondary">Total Tickets</div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card outlined class="pa-4 text-center">
                    <div class="display-1 font-weight-bold warning--text mb-2">{{ stats.openTickets }}</div>
                    <div class="caption text--secondary">Open Tickets</div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card outlined class="pa-4 text-center">
                    <div class="display-1 font-weight-bold success--text mb-2">{{ stats.resolvedTickets }}</div>
                    <div class="caption text--secondary">Resolved</div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card outlined class="pa-4 text-center">
                    <div class="display-1 font-weight-bold info--text mb-2">{{ stats.averageResolutionTime }} days</div>
                    <div class="caption text--secondary">Avg Resolution Time</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-6">
                <v-col cols="12">
                  <h3 class="headline mb-4">Issues by Type</h3>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Issue Type</th>
                          <th class="text-left">Count</th>
                          <th class="text-left">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="issue in stats.issueTypeBreakdown" :key="issue._id">
                          <td>{{ issue._id }}</td>
                          <td>{{ issue.count }}</td>
                          <td>{{ ((issue.count / stats.totalTickets) * 100).toFixed(1) }}%</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Ticket Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Support Ticket</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="ticketForm" v-model="ticketValid">
            <v-select
              v-model="newTicket.issueType"
              :items="issueTypes"
              label="Issue Type"
              outlined
              dense
              class="mb-4"
              required
            ></v-select>

            <v-text-field
              v-model="newTicket.title"
              label="Title"
              placeholder="Brief description of the issue"
              outlined
              dense
              class="mb-4"
              required
            ></v-text-field>

            <v-textarea
              v-model="newTicket.description"
              label="Description"
              placeholder="Provide detailed information about the issue"
              outlined
              dense
              rows="4"
              class="mb-4"
              required
            ></v-textarea>

            <v-select
              v-model="newTicket.reported"
              :items="pairingOptions"
              label="Related to (optional)"
              item-text="text"
              item-value="value"
              outlined
              dense
              class="mb-4"
              clearable
            ></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="createTicket"
            :loading="creating"
            :disabled="!ticketValid"
          >
            Create Ticket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Ticket Dialog -->
    <v-dialog v-model="showViewDialog" max-width="800px">
      <v-card v-if="selectedTicket">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="headline">{{ selectedTicket.ticketNumber }}</span>
          <v-chip
            :color="getStatusColor(selectedTicket.status)"
          >
            {{ getStatusText(selectedTicket.status) }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <h3 class="mb-2">{{ selectedTicket.title }}</h3>
              <p class="text-body-1 mb-4">{{ selectedTicket.description }}</p>

              <v-chip
                :color="getPriorityColor(selectedTicket.priority)"
                class="mb-4"
              >
                {{ selectedTicket.priority }} priority
              </v-chip>

              <div class="mb-4">
                <strong>Issue Type:</strong> {{ selectedTicket.issueType }}
              </div>

              <div class="mb-4">
                <strong>Created:</strong> {{ formatDate(selectedTicket.createdAt) }}
              </div>

              <!-- Resolution (if resolved) -->
              <div v-if="selectedTicket.resolution" class="mb-4">
                <v-divider class="mb-3"></v-divider>
                <h4 class="mb-2">Resolution</h4>
                <p class="text-body-2">{{ selectedTicket.resolution.resolution }}</p>
                <div class="d-flex align-center mt-2">
                  <v-rating
                    :value="selectedTicket.resolution.satisfactionRating"
                    color="amber"
                    dense
                    readonly
                    class="mr-2"
                  ></v-rating>
                  <span class="caption">Satisfaction Rating</span>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <v-card outlined class="pa-4">
                <h4 class="mb-3">Participants</h4>
                <div class="mb-3">
                  <div class="caption text--secondary">Reporter</div>
                  <div>{{ selectedTicket.reporter.firstName }} {{ selectedTicket.reporter.lastName }}</div>
                </div>
                <div class="mb-3">
                  <div class="caption text--secondary">Reported</div>
                  <div>{{ selectedTicket.reported.firstName }} {{ selectedTicket.reported.lastName }}</div>
                </div>
                <div v-if="selectedTicket.assignedTo">
                  <div class="caption text--secondary">Assigned To</div>
                  <div>{{ selectedTicket.assignedTo.firstName }} {{ selectedTicket.assignedTo.lastName }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showViewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const activeTab = ref(0)
const loading = ref(false)
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const creating = ref(false)
const ticketValid = ref(false)

const myTickets = ref<any[]>([])
const allTickets = ref<any[]>([])
const selectedTicket = ref<any>(null)
const stats = ref({
  totalTickets: 0,
  openTickets: 0,
  resolvedTickets: 0,
  averageResolutionTime: 0,
  issueTypeBreakdown: []
})

const newTicket = ref({
  issueType: '',
  title: '',
  description: '',
  reported: null as any
})

const issueTypes = [
  'academic',
  'communication',
  'schedule',
  'behavior',
  'technical',
  'other'
]

const ticketHeaders = [
  { text: 'Ticket #', value: 'ticketNumber' },
  { text: 'Title', value: 'title' },
  { text: 'Status', value: 'status' },
  { text: 'Priority', value: 'priority' },
  { text: 'Created', value: 'createdAt' },
  { text: 'Actions', value: 'actions', sortable: false }
]

const adminTicketHeaders = [
  { text: 'Ticket #', value: 'ticketNumber' },
  { text: 'Reporter', value: 'reporter' },
  { text: 'Reported', value: 'reported' },
  { text: 'Title', value: 'title' },
  { text: 'Status', value: 'status' },
  { text: 'Priority', value: 'priority' },
  { text: 'Created', value: 'createdAt' },
  { text: 'Actions', value: 'actions', sortable: false }
]

// Computed properties
const pairingOptions = computed(() => {
  // In a real app, this would fetch user's pairings
  return [
    { text: 'Current pairing with Sarah Johnson', value: 'pairing1' },
    { text: 'Previous pairing with Michael Chen', value: 'pairing2' }
  ]
})

// Load tickets
const loadTickets = async () => {
  loading.value = true
  try {
    const [myTicketsResponse, statsResponse] = await Promise.all([
      axios.get('/mediation/tickets'),
      axios.get('/mediation/stats')
    ])

    myTickets.value = myTicketsResponse.data.data.tickets
    stats.value = statsResponse.data.data

    if (isAdmin.value) {
      // Load all tickets for admin
      const allTicketsResponse = await axios.get('/mediation/tickets')
      allTickets.value = allTicketsResponse.data.data.tickets
    }
  } catch (error) {
    console.error('Failed to load tickets:', error)
  } finally {
    loading.value = false
  }
}

// Create ticket
const createTicket = async () => {
  creating.value = true
  try {
    const ticketData = {
      issueType: newTicket.value.issueType,
      title: newTicket.value.title,
      description: newTicket.value.description,
      reported: newTicket.value.reported // This would need to be the actual user ID
    }

    await axios.post('/mediation/tickets', ticketData)

    showCreateDialog.value = false
    newTicket.value = {
      issueType: '',
      title: '',
      description: '',
      reported: null
    }

    loadTickets() // Reload tickets
  } catch (error) {
    console.error('Failed to create ticket:', error)
  } finally {
    creating.value = false
  }
}

// View ticket
const viewTicket = (ticket: any) => {
  selectedTicket.value = ticket
  showViewDialog.value = true
}

// Take action on ticket (admin)
const takeAction = (ticket: any) => {
  alert(`Taking action on ticket ${ticket.ticketNumber}`)
}

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'open': 'warning',
    'in-review': 'info',
    'resolved': 'success',
    'closed': 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'open': 'Open',
    'in-review': 'In Review',
    'resolved': 'Resolved',
    'closed': 'Closed'
  }
  return texts[status] || status
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'success',
    'medium': 'warning',
    'high': 'orange',
    'urgent': 'error'
  }
  return colors[priority] || 'grey'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadTickets()
})
</script>
