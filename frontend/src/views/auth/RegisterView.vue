<template>
  <v-container fluid class="fill-height py-8">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card elevation="8" class="pa-8">
          <v-card-title class="text-center mb-6">
            <v-avatar size="64" class="mx-auto mb-4" color="primary">
              <v-icon size="32" color="white">mdi-account-plus</v-icon>
            </v-avatar>
            <h2>Join ACEIB</h2>
            <p class="text-body-2 text--secondary mt-2">Create your account to start your learning journey</p>
          </v-card-title>

          <v-card-text>
            <v-stepper v-model="step" alt-labels class="mb-6">
              <v-stepper-header>
                <v-stepper-step step="1" :complete="step > 1">Account</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="step > 2">Profile</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Complete</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-- Step 1: Account Information -->
                <v-stepper-content step="1">
                  <v-form ref="accountForm" v-model="accountValid">
                    <v-text-field
                      v-model="form.firstName"
                      label="First Name"
                      :rules="nameRules"
                      prepend-inner-icon="mdi-account"
                      outlined
                      dense
                      class="mb-4"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="form.lastName"
                      label="Last Name"
                      :rules="nameRules"
                      prepend-inner-icon="mdi-account"
                      outlined
                      dense
                      class="mb-4"
                      required
                    ></v-text-field>

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

                    <v-select
                      v-model="form.role"
                      :items="roleOptions"
                      label="I am a..."
                      :rules="roleRules"
                      prepend-inner-icon="mdi-school"
                      outlined
                      dense
                      class="mb-4"
                      required
                    ></v-select>

                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      type="password"
                      :rules="passwordRules"
                      prepend-inner-icon="mdi-lock"
                      outlined
                      dense
                      class="mb-4"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="form.confirmPassword"
                      label="Confirm Password"
                      type="password"
                      :rules="confirmPasswordRules"
                      prepend-inner-icon="mdi-lock-check"
                      outlined
                      dense
                      class="mb-4"
                      required
                    ></v-text-field>
                  </v-form>

                  <div class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      @click="nextStep(1)"
                      :disabled="!accountValid"
                    >
                      Continue
                    </v-btn>
                  </div>
                </v-stepper-content>

                <!-- Step 2: Profile Information -->
                <v-stepper-content step="2">
                  <v-form ref="profileForm" v-model="profileValid">
                    <!-- Student Profile -->
                    <template v-if="form.role === 'student'">
                      <h4 class="mb-4">Student Profile</h4>

                      <v-select
                        v-model="form.studentProfile.gradeLevel"
                        :items="gradeLevels"
                        label="Grade Level"
                        prepend-inner-icon="mdi-school"
                        outlined
                        dense
                        class="mb-4"
                      ></v-select>

                      <v-combobox
                        v-model="form.studentProfile.subjects"
                        :items="subjectOptions"
                        label="Subjects of Interest"
                        multiple
                        chips
                        prepend-inner-icon="mdi-book-open-variant"
                        outlined
                        dense
                        class="mb-4"
                      ></v-combobox>

                      <v-select
                        v-model="form.studentProfile.learningStyle"
                        :items="learningStyles"
                        label="Learning Style"
                        prepend-inner-icon="mdi-brain"
                        outlined
                        dense
                        class="mb-4"
                      ></v-select>

                      <v-textarea
                        v-model="form.studentProfile.goals"
                        label="Learning Goals"
                        placeholder="What do you hope to achieve?"
                        prepend-inner-icon="mdi-target"
                        outlined
                        dense
                        class="mb-4"
                        rows="3"
                      ></v-textarea>
                    </template>

                    <!-- Mentor Profile -->
                    <template v-else-if="form.role === 'mentor'">
                      <h4 class="mb-4">Mentor Profile</h4>

                      <v-combobox
                        v-model="form.mentorProfile.expertise"
                        :items="subjectOptions"
                        label="Areas of Expertise"
                        multiple
                        chips
                        prepend-inner-icon="mdi-certificate"
                        outlined
                        dense
                        class="mb-4"
                      ></v-combobox>

                      <v-select
                        v-model="form.mentorProfile.teachingStyle"
                        :items="teachingStyles"
                        label="Teaching Style"
                        prepend-inner-icon="mdi-teach"
                        outlined
                        dense
                        class="mb-4"
                      ></v-select>

                      <v-text-field
                        v-model.number="form.mentorProfile.experienceYears"
                        label="Years of Experience"
                        type="number"
                        prepend-inner-icon="mdi-clock"
                        outlined
                        dense
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        v-model="form.mentorProfile.hourlyRate"
                        label="Hourly Rate (USD)"
                        type="number"
                        prepend-inner-icon="mdi-cash"
                        outlined
                        dense
                        class="mb-4"
                        prefix="$"
                      ></v-text-field>
                    </template>

                    <v-textarea
                      v-model="form.profile.bio"
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      prepend-inner-icon="mdi-card-text"
                      outlined
                      dense
                      class="mb-4"
                      rows="3"
                    ></v-textarea>
                  </v-form>

                  <div class="d-flex justify-space-between">
                    <v-btn @click="prevStep(2)">Back</v-btn>
                    <v-btn
                      color="primary"
                      @click="nextStep(2)"
                      :disabled="!profileValid"
                    >
                      Continue
                    </v-btn>
                  </div>
                </v-stepper-content>

                <!-- Step 3: Confirmation -->
                <v-stepper-content step="3">
                  <div class="text-center mb-6">
                    <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                    <h3 class="mb-2">Ready to Join!</h3>
                    <p class="text-body-1 text--secondary">
                      Review your information and create your account
                    </p>
                  </div>

                  <v-card outlined class="mb-6">
                    <v-card-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2">mdi-account</v-icon>
                        <strong>{{ form.firstName }} {{ form.lastName }}</strong>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon class="mr-2">mdi-email</v-icon>
                        {{ form.email }}
                      </div>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-school</v-icon>
                        {{ form.role === 'student' ? 'Student' : 'Mentor' }}
                      </div>
                    </v-card-text>
                  </v-card>

                  <div class="d-flex justify-space-between">
                    <v-btn @click="prevStep(3)">Back</v-btn>
                    <v-btn
                      color="primary"
                      large
                      @click="handleRegister"
                      :loading="loading"
                    >
                      Create Account
                    </v-btn>
                  </div>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
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

const step = ref(1)
const accountValid = ref(false)
const profileValid = ref(true) // Profile is optional initially
const loading = computed(() => authStore.loading)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
  profile: {
    bio: ''
  },
  studentProfile: {
    gradeLevel: '',
    subjects: [] as string[],
    learningStyle: '',
    goals: ''
  },
  mentorProfile: {
    expertise: [] as string[],
    teachingStyle: '',
    experienceYears: 0,
    hourlyRate: 0
  }
})

const roleOptions = [
  { text: 'Student', value: 'student' },
  { text: 'Mentor', value: 'mentor' }
]

const gradeLevels = [
  'elementary',
  'middle-school',
  'high-school',
  'college',
  'adult-learner'
]

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English Literature',
  'History',
  'Geography',
  'Art',
  'Music'
]

const learningStyles = [
  { text: 'Visual (diagrams, charts)', value: 'visual' },
  { text: 'Auditory (listening, discussion)', value: 'auditory' },
  { text: 'Kinesthetic (hands-on, movement)', value: 'kinesthetic' },
  { text: 'Reading/Writing (text-based)', value: 'reading' }
]

const teachingStyles = [
  { text: 'Structured (organized, planned)', value: 'structured' },
  { text: 'Flexible (adaptable, spontaneous)', value: 'flexible' },
  { text: 'Interactive (discussion-based)', value: 'interactive' },
  { text: 'Project-based (hands-on activities)', value: 'project-based' }
]

const nameRules = [
  (v: string) => !!v || 'This field is required',
  (v: string) => v.length >= 2 || 'Must be at least 2 characters'
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const roleRules = [
  (v: string) => !!v || 'Please select a role'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
  (v: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) || 'Password must contain uppercase, lowercase, and number'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === form.password || 'Passwords do not match'
]

const nextStep = (currentStep: number) => {
  if (currentStep === 1 && accountValid.value) {
    step.value = 2
  } else if (currentStep === 2 && profileValid.value) {
    step.value = 3
  }
}

const prevStep = (currentStep: number) => {
  step.value = currentStep - 1
}

const handleRegister = async () => {
  // Prepare the data for API
  const registerData = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
    role: form.role,
    profile: {
      bio: form.profile.bio,
      languages: ['English'] // Default
    }
  }

  // Add role-specific profile data
  if (form.role === 'student') {
    (registerData as any).studentProfile = {
      gradeLevel: form.studentProfile.gradeLevel,
      subjects: form.studentProfile.subjects,
      learningStyle: form.studentProfile.learningStyle,
      goals: [form.studentProfile.goals]
    }
  } else if (form.role === 'mentor') {
    (registerData as any).mentorProfile = {
      expertise: form.mentorProfile.expertise,
      teachingStyle: form.mentorProfile.teachingStyle,
      experienceYears: form.mentorProfile.experienceYears,
      hourlyRate: form.mentorProfile.hourlyRate
    }
  }

  const result = await authStore.register(registerData)

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

.v-stepper {
  box-shadow: none;
}
</style>
