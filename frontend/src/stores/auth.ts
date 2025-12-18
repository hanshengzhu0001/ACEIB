import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'mentor' | 'admin'
  profile?: any
  studentProfile?: any
  mentorProfile?: any
  engagement?: any
  isActive: boolean
  isVerified: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isStudent = computed(() => user.value?.role === 'student')
  const isMentor = computed(() => user.value?.role === 'mentor')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Set axios default header
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await axios.post('/auth/login', { email, password })
      const { user: userData, token: authToken } = response.data.data

      user.value = userData
      token.value = authToken

      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    profile?: any
  }) => {
    loading.value = true
    try {
      const response = await axios.post('/auth/register', userData)
      const { user: newUser, token: authToken } = response.data.data

      user.value = newUser
      token.value = authToken

      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push({ name: 'login' })
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await axios.get('/auth/me')
      user.value = response.data.data.user
    } catch (error) {
      // Token might be invalid, logout
      logout()
    }
  }

  const updateProfile = async (profileData: any) => {
    loading.value = true
    try {
      const response = await axios.put(`/users/${user.value?.id}`, profileData)
      user.value = response.data.data.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      }
    } finally {
      loading.value = false
    }
  }

  const updateEngagement = async (action: string) => {
    if (!user.value) return

    try {
      const response = await axios.put(`/users/${user.value.id}/engagement`, { action })
      if (user.value.engagement) {
        user.value.engagement = response.data.data.engagement
      }
    } catch (error) {
      console.error('Failed to update engagement:', error)
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isStudent,
    isMentor,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    updateEngagement,
  }
})
