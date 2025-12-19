<template>
  <v-menu
    v-model="notificationsStore.showDropdown"
    :close-on-content-click="false"
    offset-y
    max-width="400"
    min-width="350"
    :nudge-bottom="8"
  >
    <v-card class="notification-dropdown">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-bell</v-icon>
          <span class="text-h6">Notifications</span>
          <v-chip
            v-if="notificationsStore.unreadCount > 0"
            size="small"
            color="primary"
            class="ml-2"
          >
            {{ notificationsStore.unreadCount }}
          </v-chip>
        </div>
        <div>
          <v-btn
            v-if="notificationsStore.unreadCount > 0"
            text
            small
            @click="markAllAsRead"
          >
            Mark all read
          </v-btn>
          <v-btn
            text
            small
            to="/notifications"
            @click="closeDropdown"
          >
            View all
          </v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Notifications List -->
      <v-card-text class="pa-0">
        <div v-if="notificationsStore.loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2 text-body-2">Loading notifications...</p>
        </div>

        <div v-else-if="notificationsStore.recentNotifications.length === 0" class="text-center py-8">
          <v-icon size="48" color="grey lighten-1">mdi-bell-off</v-icon>
          <p class="mt-2 text-body-2">No notifications yet</p>
        </div>

        <v-list v-else dense class="py-0">
          <v-list-item
            v-for="notification in notificationsStore.recentNotifications"
            :key="notification._id"
            :class="{ 'notification-unread': !notification.isRead }"
            @click="handleNotificationClick(notification)"
            class="notification-item"
          >
            <v-list-item-avatar size="40" class="mr-3">
              <v-icon
                :color="notificationsStore.getNotificationColor(notification.type)"
                size="20"
              >
                {{ notificationsStore.getNotificationIcon(notification.type) }}
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content class="py-2">
              <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                {{ notification.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2 text--secondary mb-1">
                {{ notification.message }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-caption text--secondary">
                {{ formatTime(notification.createdAt) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action class="ml-2">
              <div class="d-flex flex-column align-center">
                <v-btn
                  v-if="!notification.isRead"
                  icon
                  x-small
                  @click.stop="markAsRead(notification._id)"
                  class="mb-1"
                >
                  <v-icon size="16">mdi-circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  x-small
                  @click.stop="deleteNotification(notification._id)"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions v-if="notificationsStore.recentNotifications.length > 0" class="pa-3 pt-2">
        <v-spacer></v-spacer>
        <v-btn text small to="/notifications" @click="closeDropdown">
          View all notifications
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

const handleNotificationClick = (notification: any) => {
  // Mark as read
  if (!notification.isRead) {
    notificationsStore.markAsRead(notification._id)
  }

  // Handle navigation based on notification type
  handleNotificationAction(notification)

  // Close dropdown
  closeDropdown()
}

const handleNotificationAction = (notification: any) => {
  switch (notification.type) {
    case 'pairing_request':
    case 'pairing_accepted':
    case 'pairing_terminated':
      // Navigate to pairings page
      window.location.href = '/pairings'
      break
    case 'session_scheduled':
    case 'session_completed':
      // Navigate to pairings or dashboard
      window.location.href = '/dashboard'
      break
    case 'message_received':
      // Navigate to chat
      if (notification.data?.chatId) {
        window.location.href = `/chat/${notification.data.chatId}`
      } else {
        window.location.href = '/chat'
      }
      break
    default:
      // Stay on current page
      break
  }
}

const markAsRead = (notificationId: string) => {
  notificationsStore.markAsRead(notificationId)
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const deleteNotification = (notificationId: string) => {
  notificationsStore.deleteNotification(notificationId)
}

const closeDropdown = () => {
  notificationsStore.closeDropdown()
}

// Fetch notifications when dropdown opens
watch(() => notificationsStore.showDropdown, (isOpen) => {
  if (isOpen) {
    notificationsStore.fetchNotifications()
  }
})
</script>

<style scoped>
.notification-dropdown {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.notification-item {
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.notification-unread {
  border-left-color: var(--v-primary-base);
  background-color: rgba(var(--v-primary-base), 0.05);
}

.notification-unread .text-body-2 {
  font-weight: 500;
}
</style>
