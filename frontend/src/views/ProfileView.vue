<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-avatar size="60" class="mr-4">
              <img
                v-if="user?.profile?.avatar"
                :src="user.profile.avatar"
                :alt="user.firstName"
              >
              <v-icon v-else size="30">mdi-account</v-icon>
            </v-avatar>
            <div>
              <h1 class="headline">{{ user?.firstName }} {{ user?.lastName }}</h1>
              <p class="text--secondary mb-0">{{ user?.role }} • Member since {{ joinDate }}</p>
            </div>
          </v-card-title>

          <v-card-text>
            <v-tabs v-model="tab" color="primary">
              <v-tab>General</v-tab>
              <v-tab v-if="isStudent">Student Profile</v-tab>
              <v-tab v-if="isMentor">Mentor Profile</v-tab>
              <v-tab>Account</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <!-- General Profile Tab -->
              <v-tab-item>
                <v-form ref="generalForm" v-model="generalValid" class="mt-6">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.firstName"
                        label="First Name"
                        :rules="nameRules"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.lastName"
                        label="Last Name"
                        :rules="nameRules"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="profileData.email"
                    label="Email"
                    type="email"
                    :rules="emailRules"
                    outlined
                    dense
                    readonly
                    class="mb-4"
                  ></v-text-field>

                  <v-textarea
                    v-model="profileData.profile.bio"
                    label="Bio"
                    placeholder="Tell others about yourself..."
                    outlined
                    dense
                    rows="4"
                    class="mb-4"
                  ></v-textarea>

                  <v-combobox
                    v-model="profileData.profile.languages"
                    :items="languageOptions"
                    label="Languages"
                    multiple
                    chips
                    outlined
                    dense
                    class="mb-4"
                  ></v-combobox>

                  <v-text-field
                    v-model="profileData.profile.location"
                    label="Location"
                    placeholder="City, State/Country"
                    outlined
                    dense
                    class="mb-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="profileData.profile.timezone"
                    label="Timezone"
                    placeholder="America/New_York"
                    outlined
                    dense
                    class="mb-4"
                  ></v-text-field>

                  <v-btn
                    color="primary"
                    @click="updateGeneralProfile"
                    :loading="loading"
                    :disabled="!generalValid"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save Changes
                  </v-btn>
                </v-form>
              </v-tab-item>

              <!-- Student Profile Tab -->
              <v-tab-item v-if="isStudent">
                <v-form ref="studentForm" v-model="studentValid" class="mt-6">
                  <v-select
                    v-model="profileData.studentProfile.gradeLevel"
                    :items="gradeLevels"
                    label="Grade Level"
                    outlined
                    dense
                    class="mb-4"
                  ></v-select>

                  <v-combobox
                    v-model="profileData.studentProfile.subjects"
                    :items="subjectOptions"
                    label="Subjects of Interest"
                    multiple
                    chips
                    outlined
                    dense
                    class="mb-4"
                  ></v-combobox>

                  <v-select
                    v-model="profileData.studentProfile.learningStyle"
                    :items="learningStyles"
                    label="Learning Style"
                    outlined
                    dense
                    class="mb-4"
                  ></v-select>

                  <v-select
                    v-model="profileData.studentProfile.preferredMentorExperience"
                    :items="mentorExperienceLevels"
                    label="Preferred Mentor Experience"
                    outlined
                    dense
                    class="mb-4"
                  ></v-select>

                  <v-textarea
                    v-model="profileData.studentProfile.goals"
                    label="Learning Goals"
                    placeholder="What do you hope to achieve?"
                    outlined
                    dense
                    rows="4"
                    class="mb-4"
                  ></v-textarea>

                  <v-btn
                    color="primary"
                    @click="updateStudentProfile"
                    :loading="loading"
                    :disabled="!studentValid"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save Student Profile
                  </v-btn>
                </v-form>
              </v-tab-item>

              <!-- Mentor Profile Tab -->
              <v-tab-item v-if="isMentor">
                <v-form ref="mentorForm" v-model="mentorValid" class="mt-6">
                  <v-combobox
                    v-model="profileData.mentorProfile.expertise"
                    :items="subjectOptions"
                    label="Areas of Expertise"
                    multiple
                    chips
                    outlined
                    dense
                    class="mb-4"
                  ></v-combobox>

                  <v-select
                    v-model="profileData.mentorProfile.teachingStyle"
                    :items="teachingStyles"
                    label="Teaching Style"
                    outlined
                    dense
                    class="mb-4"
                  ></v-select>

                  <v-text-field
                    v-model.number="profileData.mentorProfile.experienceYears"
                    label="Years of Experience"
                    type="number"
                    outlined
                    dense
                    class="mb-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="profileData.mentorProfile.hourlyRate"
                    label="Hourly Rate (USD)"
                    type="number"
                    outlined
                    dense
                    prefix="$"
                    class="mb-4"
                  ></v-text-field>

                  <v-combobox
                    v-model="profileData.mentorProfile.certifications"
                    label="Certifications"
                    multiple
                    chips
                    outlined
                    dense
                    class="mb-4"
                  ></v-combobox>

                  <v-text-field
                    v-model.number="profileData.mentorProfile.maxStudents"
                    label="Maximum Students"
                    type="number"
                    outlined
                    dense
                    class="mb-4"
                  ></v-text-field>

                  <v-btn
                    color="primary"
                    @click="updateMentorProfile"
                    :loading="loading"
                    :disabled="!mentorValid"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save Mentor Profile
                  </v-btn>
                </v-form>
              </v-tab-item>

              <!-- Account Tab -->
              <v-tab-item>
                <div class="mt-6">
                  <h3 class="mb-4">Account Settings</h3>

                  <v-card outlined class="mb-6">
                    <v-card-title>Change Password</v-card-title>
                    <v-card-text>
                      <v-form ref="passwordForm" v-model="passwordValid">
                        <v-text-field
                          v-model="passwordData.currentPassword"
                          label="Current Password"
                          type="password"
                          outlined
                          dense
                          class="mb-4"
                        ></v-text-field>

                        <v-text-field
                          v-model="passwordData.newPassword"
                          label="New Password"
                          type="password"
                          :rules="newPasswordRules"
                          outlined
                          dense
                          class="mb-4"
                        ></v-text-field>

                        <v-text-field
                          v-model="passwordData.confirmPassword"
                          label="Confirm New Password"
                          type="password"
                          :rules="confirmPasswordRules"
                          outlined
                          dense
                          class="mb-4"
                        ></v-text-field>

                        <v-btn
                          color="primary"
                          @click="changePassword"
                          :loading="loading"
                          :disabled="!passwordValid"
                        >
                          <v-icon left>mdi-lock-reset</v-icon>
                          Change Password
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>

                  <v-card outlined class="mb-6">
                    <v-card-title>Account Statistics</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="6" md="3">
                          <div class="text-h6">{{ user?.engagement?.currentStreak || 0 }}</div>
                          <div class="caption text--secondary">Current Streak</div>
                        </v-col>
                        <v-col cols="6" md="3">
                          <div class="text-h6">{{ user?.engagement?.longestStreak || 0 }}</div>
                          <div class="caption text--secondary">Longest Streak</div>
                        </v-col>
                        <v-col cols="6" md="3">
                          <div class="text-h6">{{ user?.engagement?.totalSessions || 0 }}</div>
                          <div class="caption text--secondary">Total Sessions</div>
                        </v-col>
                        <v-col cols="6" md="3">
                          <div class="text-h6">{{ user?.engagement?.averageRating || 0 }}/5</div>
                          <div class="caption text--secondary">Avg Rating</div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isStudent = computed(() => authStore.isStudent)
const isMentor = computed(() => authStore.isMentor)

const tab = ref(0)
const loading = ref(false)
const generalValid = ref(false)
const studentValid = ref(true)
const mentorValid = ref(true)
const passwordValid = ref(false)

const joinDate = computed(() => {
  if (user.value?.createdAt) {
    return new Date(user.value.createdAt).toLocaleDateString()
  }
  return 'Unknown'
})

// Profile data
const profileData = ref({
  firstName: '',
  lastName: '',
  email: '',
  profile: {
    bio: '',
    languages: [] as string[],
    location: '',
    timezone: ''
  },
  studentProfile: {
    gradeLevel: '',
    subjects: [] as string[],
    learningStyle: '',
    goals: '',
    preferredMentorExperience: ''
  },
  mentorProfile: {
    expertise: [] as string[],
    teachingStyle: '',
    experienceYears: 0,
    hourlyRate: 0,
    certifications: [] as string[],
    maxStudents: 5
  }
})

// Password change data
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Options
const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic'
]

const gradeLevels = [
  'elementary', 'middle-school', 'high-school', 'college', 'adult-learner'
]

const subjectOptions = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English Literature', 'History', 'Geography', 'Art', 'Music'
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

const mentorExperienceLevels = [
  { text: 'Beginner (0-2 years)', value: 'beginner' },
  { text: 'Intermediate (1-5 years)', value: 'intermediate' },
  { text: 'Advanced (3+ years)', value: 'advanced' }
]

// Validation rules
const nameRules = [
  (v: string) => !!v || 'This field is required',
  (v: string) => v.length >= 2 || 'Must be at least 2 characters'
]

const emailRules = [
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const newPasswordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
  (v: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) || 'Password must contain uppercase, lowercase, and number'
]

const confirmPasswordRules = [
  (v: string) => v === passwordData.value.newPassword || 'Passwords do not match'
]

// Load user data
const loadUserData = () => {
  if (user.value) {
    profileData.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      profile: {
        bio: user.value.profile?.bio || '',
        languages: user.value.profile?.languages || [],
        location: user.value.profile?.location || '',
        timezone: user.value.profile?.timezone || ''
      },
      studentProfile: {
        gradeLevel: user.value.studentProfile?.gradeLevel || '',
        subjects: user.value.studentProfile?.subjects || [],
        learningStyle: user.value.studentProfile?.learningStyle || '',
        goals: Array.isArray(user.value.studentProfile?.goals)
          ? user.value.studentProfile.goals.join(', ')
          : user.value.studentProfile?.goals || '',
        preferredMentorExperience: user.value.studentProfile?.preferredMentorExperience || ''
      },
      mentorProfile: {
        expertise: user.value.mentorProfile?.expertise || [],
        teachingStyle: user.value.mentorProfile?.teachingStyle || '',
        experienceYears: user.value.mentorProfile?.experienceYears || 0,
        hourlyRate: user.value.mentorProfile?.hourlyRate || 0,
        certifications: user.value.mentorProfile?.certifications || [],
        maxStudents: user.value.mentorProfile?.maxStudents || 5
      }
    }
  }
}

// Update functions
const updateGeneralProfile = async () => {
  loading.value = true
  try {
    const updateData = {
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      profile: profileData.value.profile
    }

    const result = await authStore.updateProfile(updateData)
    if (result.success) {
      // Success message would be shown via snackbar
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

const updateStudentProfile = async () => {
  loading.value = true
  try {
    const updateData = {
      studentProfile: {
        ...profileData.value.studentProfile,
        goals: profileData.value.studentProfile.goals.split(',').map(g => g.trim())
      }
    }

    const result = await authStore.updateProfile(updateData)
    if (result.success) {
      // Success message would be shown via snackbar
    }
  } catch (error) {
    console.error('Failed to update student profile:', error)
  } finally {
    loading.value = false
  }
}

const updateMentorProfile = async () => {
  loading.value = true
  try {
    const updateData = {
      mentorProfile: profileData.value.mentorProfile
    }

    const result = await authStore.updateProfile(updateData)
    if (result.success) {
      // Success message would be shown via snackbar
    }
  } catch (error) {
    console.error('Failed to update mentor profile:', error)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  loading.value = true
  try {
    // This would typically call a separate API endpoint for password change
    // For now, just reset the form
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>
