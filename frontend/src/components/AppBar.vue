<template>
  <v-app-bar
    app
    color="primary"
    dark
    elevation="2"
    height="64"
  >
    <v-app-bar-nav-icon
      v-if="isAuthenticated"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>
      <router-link to="/" class="text-decoration-none white--text">
        <v-icon class="mr-2">mdi-school</v-icon>
        ACEIB Platform
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Authenticated user menu -->
    <template v-if="isAuthenticated">
      <v-btn
        icon
        @click="toggleTheme"
        class="mr-2"
      >
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar size="32">
              <img
                v-if="user?.profile?.avatar"
                :src="user.profile.avatar"
                :alt="user.firstName"
              >
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="$router.push('/profile')">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="$router.push('/dashboard')">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <!-- Unauthenticated user buttons -->
    <template v-else>
      <v-btn
        text
        to="/login"
        class="mr-2"
      >
        Login
      </v-btn>
      <v-btn
        color="secondary"
        to="/register"
      >
        Sign Up
      </v-btn>
    </template>
  </v-app-bar>

  <!-- Navigation drawer -->
  <v-navigation-drawer
    v-if="isAuthenticated"
    v-model="drawer"
    app
    temporary
    width="280"
  >
    <v-list dense>
      <v-list-item>
        <v-list-item-avatar>
          <img
            v-if="user?.profile?.avatar"
            :src="user.profile.avatar"
            :alt="user.firstName"
          >
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user?.firstName }} {{ user?.lastName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user?.role }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        to="/dashboard"
        exact
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-if="isStudent"
        to="/matching"
      >
        <v-list-item-icon>
          <v-icon>mdi-account-search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Find Mentor</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/pairings">
        <v-list-item-icon>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>My Pairings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/chat">
        <v-list-item-icon>
          <v-icon>mdi-chat</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Messages</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/profile">
        <v-list-item-icon>
          <v-icon>mdi-account-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Profile Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-if="isAdmin"
        to="/admin"
      >
        <v-list-item-icon>
          <v-icon>mdi-shield-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Admin Panel</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/mediation">
        <v-list-item-icon>
          <v-icon>mdi-gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Support</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from 'vuetify'

const authStore = useAuthStore()
const theme = useTheme()

const drawer = ref(false)
const isDark = computed(() => theme.global.current.value.dark)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isStudent = computed(() => authStore.isStudent)
const isAdmin = computed(() => authStore.isAdmin)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
.v-toolbar-title a {
  display: flex;
  align-items: center;
  text-decoration: none;
}
</style>
