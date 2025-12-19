<template>
  <v-card elevation="2">
    <v-card-title>
      <v-icon left>mdi-account-group</v-icon>
      User Management
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            small
          >
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'error'"
            small
          >
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon small @click="viewUser(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="item.isActive"
            icon
            small
            color="error"
            @click="deactivateUser(item)"
          >
            <v-icon>mdi-account-off</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

const users = ref<User[]>([])
const loading = ref(false)

const headers = [
  { text: 'Name', value: 'firstName' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Status', value: 'isActive' },
  { text: 'Actions', value: 'actions', sortable: false }
]

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/users')
    users.value = response.data.data.users
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    'student': 'success',
    'mentor': 'info',
    'admin': 'warning'
  }
  return colors[role] || 'grey'
}

const viewUser = (user: User) => {
  alert(`Viewing user: ${user.firstName} ${user.lastName}`)
}

const deactivateUser = async (user: User) => {
  if (confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`)) {
    try {
      await axios.delete(`/users/${user._id}`)
      loadUsers() // Reload the list
    } catch (error) {
      console.error('Failed to deactivate user:', error)
    }
  }
}

onMounted(() => {
  loadUsers()
})
</script>
