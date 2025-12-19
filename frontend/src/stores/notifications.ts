import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Notification {
  _id: string
  type: 'pairing_request' | 'pairing_accepted' | 'pairing_terminated' | 'session_scheduled' | 'session_completed' | 'message_received' | 'system'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
  readAt?: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const showDropdown = ref(false)

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.isRead)
  )

  const recentNotifications = computed(() =>
    notifications.value.slice(0, 5)
  )

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      'pairing_request': 'mdi-account-plus',
      'pairing_accepted': 'mdi-handshake',
      'pairing_terminated': 'mdi-close-circle',
      'session_scheduled': 'mdi-calendar-plus',
      'session_completed': 'mdi-check-circle',
      'message_received': 'mdi-message',
      'system': 'mdi-information'
    }
    return icons[type] || 'mdi-bell'
  }

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      'pairing_request': 'info',
      'pairing_accepted': 'success',
      'pairing_terminated': 'error',
      'session_scheduled': 'primary',
      'session_completed': 'success',
      'message_received': 'secondary',
      'system': 'warning'
    }
    return colors[type] || 'grey'
  }

  const fetchNotifications = async () => {
    try {
      loading.value = true
      const response = await axios.get('/notifications')
      notifications.value = response.data.data.notifications
      unreadCount.value = response.data.data.unreadCount
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/notifications/unread-count')
      unreadCount.value = response.data.data.unreadCount
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`)
      const notification = notifications.value.find(n => n._id === notificationId)
      if (notification) {
        notification.isRead = true
        notification.readAt = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all')
      notifications.value.forEach(n => {
        if (!n.isRead) {
          n.isRead = true
          n.readAt = new Date().toISOString()
        }
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`/notifications/${notificationId}`)
      const index = notifications.value.findIndex(n => n._id === notificationId)
      if (index > -1) {
        const wasUnread = !notifications.value[index].isRead
        notifications.value.splice(index, 1)
        if (wasUnread) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const addNotification = (notification: Notification) => {
    notifications.value.unshift(notification)
    if (!notification.isRead) {
      unreadCount.value += 1
    }
  }

  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }

  const closeDropdown = () => {
    showDropdown.value = false
  }

  // Initialize by fetching unread count
  fetchUnreadCount()

  return {
    notifications,
    unreadCount,
    loading,
    showDropdown,
    unreadNotifications,
    recentNotifications,
    getNotificationIcon,
    getNotificationColor,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    toggleDropdown,
    closeDropdown
  }
})
