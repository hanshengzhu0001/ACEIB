<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card elevation="8" class="pa-8">
          <v-card-title class="text-center mb-6">
            <v-avatar size="64" class="mx-auto mb-4" color="primary">
              <v-icon size="32" color="white">mdi-school</v-icon>
            </v-avatar>
            <h2>Welcome Back</h2>
            <p class="text-body-2 text--secondary mt-2">Sign in to your ACEIB account</p>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                outlined
                dense
                class="mb-4"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock"
                outlined
                dense
                class="mb-2"
                required
              ></v-text-field>

              <v-row class="mb-4">
                <v-col>
                  <router-link to="/forgot-password" class="text-decoration-none text-caption">
                    Forgot password?
                  </router-link>
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                :loading="loading"
                :disabled="!valid"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <v-divider class="mb-4"></v-divider>

              <div class="text-center">
                <span class="text-body-2">Don't have an account? </span>
                <router-link to="/register" class="text-decoration-none primary--text font-weight-bold">
                  Sign up
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Development Info (only in development) -->
        <v-card v-if="import.meta.env.DEV" class="mt-6 pa-4" outlined>
          <v-card-title class="text-h6 mb-2">Development Mode</v-card-title>
          <v-card-text class="pa-0">
            <div class="text-caption text--secondary mb-2">
              Demo accounts are available for testing purposes only.
            </div>
            <div class="text-caption">
              Contact your administrator for login credentials.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const valid = ref(false)
const loading = computed(() => authStore.loading)

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
]

const handleLogin = async () => {
  if (!valid.value) return

  const result = await authStore.login(form.email, form.password)

  if (result.success) {
    router.push('/dashboard')
  } else {
    // Error is handled by the store
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
