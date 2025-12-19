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
            <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
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
                @paste="handlePaste($event, 'email')"
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
                @paste="handlePaste($event, 'password')"
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
                class="mb-2"
              >
                Sign In
              </v-btn>

              <v-btn
                text
                block
                small
                @click="resetForm"
                class="mb-4"
              >
                Clear Form
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
        <v-card v-if="false" class="mt-6 pa-4" outlined>
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

// Form ref with proper typing
const formRef = ref<any>(null)

const emailRules = [
  (v: string) => {
    if (!v) return 'Email is required'
    if (!v.includes('@') || !v.includes('.')) return 'Please enter a valid email'
    return true
  }
]

const passwordRules = [
  (v: string) => {
    if (!v) return 'Password is required'
    if (v.length < 6) return 'Password must be at least 6 characters'
    return true
  }
]

const handlePaste = (event: ClipboardEvent, field: string) => {
  // Ensure pasted content updates the v-model
  const pastedText = event.clipboardData?.getData('text') || ''
  if (field === 'email') {
    form.email = pastedText
  } else if (field === 'password') {
    form.password = pastedText
  }
  // Force validation update
  setTimeout(() => {
    formRef.value?.validate()
  }, 0)
}

const resetForm = () => {
  form.email = ''
  form.password = ''
  valid.value = false
  formRef.value?.resetValidation()
}

const handleLogin = async () => {
  if (!valid.value) return

  console.log('Starting login process...')
  const result = await authStore.login(form.email, form.password)
  console.log('Login result:', result)

  if (result.success) {
    console.log('Login successful, user:', authStore.user)
    console.log('Is authenticated:', authStore.isAuthenticated)
    console.log('Redirecting to dashboard...')
    await router.push('/dashboard')
    console.log('Redirect completed')
  } else {
    console.log('Login failed:', result.error)
    // Error is handled by the store
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
